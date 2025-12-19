# WS_Vesting - Token Vesting Smart Contract on Solana

A Solana smart contract built with Anchor framework that implements a token vesting system for companies to manage employee token allocations with flexible vesting schedules, including cliff periods.

## Features

- **Create Vesting Accounts**: Companies can create vesting accounts for managing employee token distributions
- **Employee Vesting**: Set up individual vesting schedules for employees with customizable:
  - Start time
  - End time (vesting period)
  - Total vesting amount
  - Cliff period (time before any tokens can be claimed)
- **Token Claiming**: Employees can claim their vested tokens after the cliff period
- **Linear Vesting**: Tokens vest linearly over time from start to end
- **Program Derived Addresses (PDAs)**: Secure account management using PDAs

## Prerequisites

Before you begin, ensure you have the following installed:

- **Rust** (latest stable version)
- **Solana CLI** (v2.0.0 or later)
- **Anchor Framework** (v0.30.0 or later)
- **Node.js** (v16 or later) and **npm** or **yarn**
- **Git**

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ws_vesting1
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Build the program:
```bash
anchor build
```

This will:
- Compile the Rust program
- Generate the IDL (Interface Definition Language) file
- Create the program binary in `target/deploy/`

## Testing

This project uses **Bankrun** for fast, in-memory testing. Bankrun allows you to run Solana program tests without deploying to a network, making testing much faster and more efficient.

### Running Tests

To run all tests using Bankrun:

```bash
npm run test:bankrun
# or
yarn test:bankrun
```

This will execute all tests in `tests/bankrun.spec.ts` using the Bankrun testing framework.

### Test Coverage

The test suite includes:

1. **Create Vesting Account**: Tests the creation of a company vesting account
2. **Fund Treasury**: Tests funding the treasury token account
3. **Create Employee Vesting**: Tests setting up an employee's vesting schedule
4. **Claim Tokens**: Tests the token claiming functionality after the cliff period

### Why Bankrun?

Bankrun is an in-memory Solana runtime that:
- Runs tests in milliseconds instead of seconds
- Doesn't require a local validator
- Provides deterministic testing environment
- Supports all Solana runtime features needed for program testing

## Project Structure

```
ws_vesting1/
├── programs/
│   └── ws_vesting1/
│       ├── src/
│       │   └── lib.rs          # Main program logic
│       └── Cargo.toml          # Rust dependencies
├── tests/
│   └── bankrun.spec.ts         # Bankrun test suite
├── target/
│   ├── deploy/                 # Compiled program binary
│   ├── idl/                    # Generated IDL files
│   └── types/                  # TypeScript type definitions
├── Anchor.toml                 # Anchor configuration
├── Cargo.toml                  # Rust workspace configuration
├── package.json                # Node.js dependencies
└── tsconfig.json               # TypeScript configuration
```

## Program Instructions

### 1. `create_vesting_account`

Creates a new vesting account for a company.

**Parameters:**
- `company_name`: String identifier for the company

**Accounts:**
- `signer`: The account creating the vesting account (company owner)
- `vesting_account`: PDA for the vesting account (seeds: `[company_name]`)
- `mint`: Token mint address
- `treasury_token_account`: PDA for the treasury (seeds: `["vesting_treasury", company_name]`)

### 2. `create_employee_vesting`

Creates a vesting schedule for an employee.

**Parameters:**
- `start_time`: Unix timestamp when vesting starts
- `end_time`: Unix timestamp when vesting ends
- `total_amount`: Total tokens to be vested
- `cliff_time`: Unix timestamp when claiming becomes available

**Accounts:**
- `owner`: Company owner (must match vesting account owner)
- `beneficiary`: Employee's wallet address
- `vesting_account`: The company's vesting account
- `employee_account`: PDA for employee vesting (seeds: `["employee_vesting", beneficiary, vesting_account]`)

### 3. `claim_tokens`

Allows an employee to claim their vested tokens.

**Parameters:**
- `company_name`: Company name identifier

**Logic:**
- Checks if current time is past the cliff period
- Calculates vested amount based on linear vesting schedule
- Transfers claimable tokens to employee's token account
- Updates the total withdrawn amount

**Accounts:**
- `beneficiary`: Employee signing the transaction
- `employee_account`: Employee's vesting account
- `vesting_account`: Company's vesting account
- `treasury_token_account`: Treasury holding the tokens
- `employee_token_account`: Employee's token account (created if needed)
- `mint`: Token mint address

## Account Structures

### VestingAccount

Stores company vesting information:

```rust
pub struct VestingAccount {
    pub owner: Pubkey,
    pub mint: Pubkey,
    pub treasury_token_account: Pubkey,
    pub company_name: String,
    pub treasury_bump: u8,
    pub bump: u8,
}
```

### EmployeeAccount

Stores individual employee vesting schedule:

```rust
pub struct EmployeeAccount {
    pub beneficiary: Pubkey,
    pub start_time: i64,
    pub end_time: i64,
    pub total_amount: i64,
    pub total_withdrawn: i64,
    pub cliff_time: i64,
    pub vesting_account: Pubkey,
    pub bump: u8,
}
```

## Error Codes

- `ClaimNotAvailableYet`: Attempted to claim tokens before the cliff period
- `NothingToClaim`: No tokens available to claim (already claimed or not vested yet)

## Building and Deploying

### Build

```bash
anchor build
```

### Deploy to Localnet

1. Start a local validator:
```bash
solana-test-validator
```

2. Deploy the program:
```bash
anchor deploy
```

### Deploy to Devnet/Mainnet

1. Configure Solana CLI for the desired network:
```bash
solana config set --url devnet  # or mainnet-beta
```

2. Ensure your wallet has SOL for deployment fees

3. Deploy:
```bash
anchor deploy
```

## Usage Example

```typescript
// Create a vesting account for a company
await program.methods
  .createVestingAccount("Company")
  .accounts({
    signer: companyOwner.publicKey,
    mint: tokenMint,
    tokenProgram: TOKEN_PROGRAM_ID,
  })
  .rpc();

// Create employee vesting schedule
await program.methods
  .createEmployeeVesting(
    new BN(startTime),
    new BN(endTime),
    new BN(totalAmount),
    new BN(cliffTime)
  )
  .accounts({
    beneficiary: employee.publicKey,
    vestingAccount: vestingAccountKey,
  })
  .rpc();

// Employee claims vested tokens
await program.methods
  .claimTokens("Company")
  .accounts({
    tokenProgram: TOKEN_PROGRAM_ID,
  })
  .rpc();
```

## Development

### Running Tests

All tests use Bankrun for fast execution:

```bash
# Run all tests
npm run test:bankrun

# Run specific test file
npm run test
```

### Code Style

The project uses:
- **Rust**: Standard Rust formatting (`cargo fmt`)
- **TypeScript**: Prettier for code formatting

Format code:
```bash
npm run lint:fix
```

## Technologies Used

- **Anchor Framework**: Solana program development framework
- **Rust**: Programming language for the Solana program
- **TypeScript**: Test suite language
- **Bankrun**: Fast in-memory Solana runtime for testing
- **Solana Program Library (SPL)**: Token program integration

## Program ID

```
FW1JafDHPQvpnGntR25eUMob9eSQWShTtFVDsomYxogF
```

## License

[Add your license here]

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- Built with [Anchor Framework](https://www.anchor-lang.com/)
- Testing powered by [Bankrun](https://github.com/anza-xyz/solana-bankrun)
- Solana blockchain platform

## Support

For issues, questions, or contributions, please open an issue on the repository.