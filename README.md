# ws-vesting Anchor Program

A Solana vesting program written in Rust using the Anchor framework. This program enables companies to create vesting accounts and manage employee token vesting schedules.

## Overview

The `ws-vesting` program provides functionality for:
- Creating company vesting accounts with associated treasury token accounts
- Managing employee vesting schedules with customizable start times, end times, and cliff periods

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

Creates a new employee vesting account (implementation in progress).

**Accounts:**
- `owner` - The vesting account owner (mutable, signer)
- `beneficiary` - The employee who will receive vested tokens
- `vesting_account` - The parent vesting account (must match owner)
- `employee_account` - The employee vesting account PDA (initialized)
- `system_program` - System program

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
- `cliff_time: i64` - Unix timestamp for the cliff period
- `vesting_account: Pubkey` - Reference to the parent vesting account
- `total_amount: u64` - Total amount of tokens to be vested
- `total_withdrawn: u64` - Amount of tokens already withdrawn

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
- `anchor-lang` - Anchor framework core library
- `anchor-spl` - Anchor SPL token interface helpers

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

## Security Considerations

- The vesting account owner must match the signer for employee account creation
- Company names are used as seeds for PDAs, so they must be unique per company
- Treasury token accounts are owned by the program (via PDA) to secure vested tokens

## License

[Add your license information here]
