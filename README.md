# ws-vesting Anchor Program

A Solana vesting program written in Rust using the Anchor framework. This program enables companies to create vesting accounts and manage employee token vesting schedules.

## Overview

The `ws-vesting` program provides functionality for:
- Creating company vesting accounts with associated treasury token accounts
- Creating employee vesting accounts with customizable start times, end times, and cliff periods
- Claiming vested tokens based on linear vesting schedules

## Program Structure

### Instructions

#### `create_vesting_account`

Creates a new vesting account for a company. This instruction:
- Creates a PDA for the vesting account using the company name as a seed
- Creates a treasury token account (also a PDA) to hold tokens for vesting
- Stores company information including owner, mint, and treasury token account

**Accounts:**
- `signer` - The account creating the vesting account (mutable, signer)
- `vesting_account` - The vesting account PDA (initialized)
- `mint` - The token mint to be used for vesting
- `treasury_token_account` - The treasury token account PDA (initialized)
- `system_program` - System program
- `token_program` - Token program

**Parameters:**
- `company_name: String` - Name of the company (max 50 characters, used as seed for PDAs)

#### `create_employee_account`

Creates a new employee vesting account with a custom vesting schedule.

**Accounts:**
- `owner` - The vesting account owner (mutable, signer)
- `beneficiary` - The employee who will receive vested tokens (system account)
- `vesting_account` - The parent vesting account (must match owner)
- `employee_account` - The employee vesting account PDA (initialized)
- `system_program` - System program

**Parameters:**
- `start_time: i64` - Unix timestamp when vesting starts
- `end_time: i64` - Unix timestamp when vesting ends
- `cliff_time: i64` - Unix timestamp for the cliff period (no tokens can be claimed before this)
- `total_amount: u64` - Total amount of tokens to be vested to this employee

#### `claim_tokens`

Allows an employee (beneficiary) to claim their vested tokens. Implements linear vesting:
- Tokens vest linearly from `start_time` to `end_time`
- No tokens can be claimed before `cliff_time`
- Calculates the vested amount based on elapsed time
- Transfers claimable tokens from the treasury to the employee's token account
- Updates the `total_withdrawn` amount

**Accounts:**
- `beneficiary` - The employee claiming tokens (mutable, signer)
- `employee_account` - The employee's vesting account (mutable)
- `vesting_account` - The parent vesting account (mutable)
- `treasury_token_account` - The treasury token account holding vested tokens (mutable)
- `mint` - The token mint
- `employee_token_account` - The employee's token account (initialized if needed)
- `system_program` - System program
- `token_program` - Token program
- `associated_token_program` - Associated token program

**Parameters:**
- `company_name: String` - Name of the company (used for PDA derivation)

**Vesting Formula:**
```
vested_amount = (total_amount × time_since_start) / total_vesting_time
claimable_amount = vested_amount - total_withdrawn
```

Where:
- `time_since_start` = current_time - start_time
- `total_vesting_time` = end_time - start_time

### Accounts

#### `VestingAccount`

Stores information about a company's vesting setup.

**Fields:**
- `owner: Pubkey` - The owner of the vesting account
- `mint: Pubkey` - The token mint address
- `treasury_token_account: Pubkey` - The treasury token account PDA address
- `company_name: String` - The company name (max 50 characters)
- `treasury_bump: u8` - The bump seed for the treasury token account PDA
- `bump: u8` - The bump seed for the vesting account PDA

#### `EmployeeAccount`

Stores information about an employee's vesting schedule.

**Fields:**
- `beneficiary: Pubkey` - The employee receiving the vested tokens
- `start_time: i64` - Unix timestamp when vesting starts
- `end_time: i64` - Unix timestamp when vesting ends
- `cliff_time: i64` - Unix timestamp for the cliff period (no claims allowed before this)
- `vesting_account: Pubkey` - Reference to the parent vesting account
- `total_amount: u64` - Total amount of tokens to be vested
- `total_withdrawn: u64` - Amount of tokens already withdrawn
- `bump: u8` - The bump seed for the employee account PDA

## Program ID

```
Count3AcZucFDPSFBAeHkQ6AvttieKUkyJ8HiQGhQwe
```

## Building

Build the program:

```bash
anchor build
```

This will:
- Compile the Rust program
- Generate the IDL (Interface Definition Language) file
- Generate TypeScript types and client code

## Testing

Run the test suite:

```bash
anchor test
```

Or using npm from the root directory:

```bash
npm run anchor-test
```

## Local Development

Start a local validator with the program deployed:

```bash
anchor localnet
```

Or using npm from the root directory:

```bash
npm run anchor-localnet
```

## Deployment

### Deploy to Devnet

```bash
anchor deploy --provider.cluster devnet
```

Or using npm from the root directory:

```bash
npm run anchor deploy -- --provider.cluster devnet
```

### Deploy to Mainnet

```bash
anchor deploy --provider.cluster mainnet
```

## Project Structure

```
anchor/
├── programs/
│   └── ws-vesting/
│       ├── Cargo.toml
│       └── src/
│           └── lib.rs          # Main program logic
├── tests/
│   └── ws-vesting.test.ts      # Test suite
├── src/
│   ├── client/                 # Generated client code
│   ├── helpers/                # Helper functions
│   └── ws-vesting-exports.ts   # Program exports
├── Anchor.toml                 # Anchor configuration
└── Cargo.toml                  # Rust workspace configuration
```

## Dependencies

The program uses:
- `anchor-lang` - Anchor framework core library (with `init-if-needed` feature)
- `anchor-spl` - Anchor SPL token interface helpers, including:
  - Token interface for cross-program invocations
  - Associated token account functionality
  - Transfer checked operations

## PDAs (Program Derived Addresses)

### Vesting Account PDA

**Seeds:**
- `[company_name.as_bytes()]`

**Derives:** The vesting account address

### Treasury Token Account PDA

**Seeds:**
- `[b"vesting_treasury", company_name.as_bytes()]`

**Derives:** The treasury token account address

### Employee Account PDA

**Seeds:**
- `[b"employee_vesting", beneficiary.key().as_ref(), vesting_account.key().as_ref()]`

**Derives:** The employee vesting account address

## Error Codes

The program defines the following error codes:

- `ClaimNotAvailable` - Attempted to claim tokens before the cliff time
- `InvalidVestingTime` - Invalid vesting schedule (e.g., zero vesting duration, overflow in calculations)
- `NoAmountToClaim` - No tokens available to claim (already withdrawn all vested tokens)

## Security Considerations

- The vesting account owner must match the signer for employee account creation
- Company names are used as seeds for PDAs, so they must be unique per company
- Treasury token accounts are owned by the program (via PDA) to secure vested tokens
- Only the beneficiary can sign and claim their own vested tokens
- The program uses `transfer_checked` to ensure proper token amount and decimals handling
- Linear vesting calculations use checked arithmetic to prevent overflow
- Claims are validated against cliff time before processing

## Vesting Logic

The program implements **linear vesting**:

1. **Cliff Period**: No tokens can be claimed before the `cliff_time`
2. **Vesting Period**: Tokens vest linearly from `start_time` to `end_time`
3. **Calculation**: The vested amount is calculated as:
   ```
   vested = (total_amount × elapsed_time) / total_vesting_period
   ```
4. **Claimable**: Only the difference between vested amount and already withdrawn tokens can be claimed
5. **Full Vesting**: After `end_time`, all tokens are considered vested

## Example Flow

1. **Create Vesting Account**: Company owner creates a vesting account with a treasury
2. **Create Employee Account**: Owner creates an employee vesting account with schedule parameters
3. **Deposit Tokens**: Company deposits tokens into the treasury token account (done outside this program)
4. **Claim Tokens**: Employee calls `claim_tokens` to withdraw their vested tokens to their token account

## License

[Add your license information here]
