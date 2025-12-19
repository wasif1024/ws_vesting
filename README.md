# ws_vesting

A full-stack Solana application for token vesting with a Next.js frontend and Anchor program backend. This project enables companies to create vesting accounts and manage employee token vesting schedules with linear vesting, cliff periods, and secure token transfers.

## 🚀 Features

### Smart Contract (Anchor Program)
- **Create Vesting Account**: Companies can create vesting accounts with treasury token accounts
- **Create Employee Account**: Set up individual employee vesting schedules with customizable parameters
- **Claim Tokens**: Employees can claim their vested tokens based on linear vesting schedules
- **Linear Vesting**: Tokens vest proportionally over time from start to end date
- **Cliff Period**: Enforce a minimum time before any tokens can be claimed
- **Secure Transfers**: Uses SPL Token with checked transfers for security

### Frontend (Next.js)
- Modern React application with TypeScript
- Tailwind CSS and Shadcn UI components
- [Gill](https://gill.site/) Solana SDK integration
- Shadcn [Wallet UI](https://registry.wallet-ui.dev) components
- [Codama](https://github.com/codama-idl/codama) for JS SDK generation
- Interactive UI for managing vesting accounts

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **Rust** (latest stable version)
- **Solana CLI** (v1.18+)
- **Anchor** (v0.30.0)
- **Git**

### Installing Prerequisites

#### Install Solana CLI
```bash
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
```

#### Install Anchor
```bash
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest
```

## 🛠️ Installation

### Clone the Repository

```bash
git clone <your-repo-url>
cd ws_vesting
```

### Install Dependencies

```bash
npm install
```

### Setup Program ID

This command will:
- Create a new program keypair
- Save it to Anchor config
- Update the program ID in the Rust code
- Generate the TypeScript SDK

```bash
npm run setup
```

## 🏗️ Project Structure

```
ws_vesting/
├── anchor/                      # Anchor program
│   ├── programs/
│   │   └── ws-vesting/
│   │       └── src/
│   │           └── lib.rs      # Main program logic
│   ├── tests/
│   │   ├── ws-vesting.test.ts  # Integration tests
│   │   └── bankrun.spec.ts     # Bankrun tests
│   ├── src/                     # Client SDK
│   │   ├── client/             # Generated client code
│   │   └── ws-vesting-exports.ts
│   └── Anchor.toml             # Anchor configuration
├── src/                         # Next.js frontend
│   ├── app/                    # Next.js app directory
│   ├── components/             # React components
│   └── features/
│       └── ws-vesting/         # Vesting feature components
└── package.json
```

## 📝 Program Instructions

### 1. `create_vesting_account`

Creates a vesting account for a company with a treasury token account.

**Parameters:**
- `company_name: String` - Unique company identifier (max 50 characters, used as seed for PDAs)

**Accounts:**
- `signer` - Company owner (payer, mutable, signer)
- `vesting_account` - PDA derived from company name (initialized)
- `mint` - Token mint address
- `treasury_token_account` - PDA treasury token account (initialized)
- `system_program` - System program
- `token_program` - Token program

**What it does:**
- Creates a PDA for the vesting account using the company name as a seed
- Creates a treasury token account (also a PDA) to hold tokens for vesting
- Stores company information including owner, mint, and treasury token account

### 2. `create_employee_account`

Creates an employee vesting schedule with customizable parameters.

**Parameters:**
- `start_time: i64` - Unix timestamp when vesting starts
- `end_time: i64` - Unix timestamp when vesting ends
- `cliff_time: i64` - Unix timestamp for cliff period (no tokens can be claimed before this)
- `total_amount: u64` - Total tokens to vest

**Accounts:**
- `owner` - Vesting account owner (mutable, signer)
- `beneficiary` - Employee wallet address (system account)
- `vesting_account` - Parent vesting account (must match owner)
- `employee_account` - PDA employee account (initialized)
- `system_program` - System program

**What it does:**
- Creates a PDA for the employee vesting account
- Links the employee to the company's vesting account
- Sets up the vesting schedule parameters

### 3. `claim_tokens`

Allows employees to claim their vested tokens. Implements linear vesting with cliff period enforcement.

**Vesting Formula:**
```
vested_amount = (total_amount × time_elapsed) / total_vesting_period
claimable = vested_amount - total_withdrawn
```

Where:
- `time_elapsed` = current_time - start_time
- `total_vesting_period` = end_time - start_time

**Parameters:**
- `company_name: String` - Company identifier (used for PDA derivation)

**Accounts:**
- `beneficiary` - Employee claiming (mutable, signer)
- `employee_account` - Employee vesting account (mutable)
- `vesting_account` - Company vesting account (mutable)
- `treasury_token_account` - Treasury holding tokens (mutable)
- `mint` - Token mint
- `employee_token_account` - Employee's token account (initialized if needed)
- `system_program` - System program
- `token_program` - Token program
- `associated_token_program` - Associated token program

**What it does:**
- Validates that cliff time has passed
- Calculates vested amount based on linear vesting
- Transfers claimable tokens from treasury to employee's token account
- Updates the total_withdrawn amount
- Uses `transfer_checked` for secure token transfers

## 📦 Account Structures

### `VestingAccount`

Stores information about a company's vesting setup.

**Fields:**
- `owner: Pubkey` - The owner of the vesting account
- `mint: Pubkey` - The token mint address
- `treasury_token_account: Pubkey` - The treasury token account PDA address
- `company_name: String` - The company name (max 50 characters)
- `treasury_bump: u8` - The bump seed for the treasury token account PDA
- `bump: u8` - The bump seed for the vesting account PDA

### `EmployeeAccount`

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

## 🔐 PDAs (Program Derived Addresses)

### Vesting Account PDA

**Seeds:**
- `[company_name.as_bytes()]`

**Derives:** The vesting account address

### Treasury Token Account PDA

**Seeds:**
- `[b"vesting_treasury", company_name.as_bytes()]`

**Derives:** The treasury token account address (owned by the program)

### Employee Account PDA

**Seeds:**
- `[b"employee_vesting", beneficiary.key().as_ref(), vesting_account.key().as_ref()]`

**Derives:** The employee vesting account address

## ⚠️ Error Codes

The program defines the following error codes:

- `ClaimNotAvailable` - Attempted to claim tokens before the cliff time
- `InvalidVestingTime` - Invalid vesting schedule (e.g., zero vesting duration, overflow in calculations)
- `NoAmountToClaim` - No tokens available to claim (already withdrawn all vested tokens or none vested yet)

## 🔒 Security Considerations

- **Ownership Validation**: The vesting account owner must match the signer for employee account creation
- **Unique Company Names**: Company names are used as seeds for PDAs, so they must be unique per company
- **Program-Owned Treasury**: Treasury token accounts are owned by the program (via PDA) to secure vested tokens
- **Beneficiary Authorization**: Only the beneficiary can sign and claim their own vested tokens
- **Checked Transfers**: The program uses `transfer_checked` to ensure proper token amount and decimals handling
- **Overflow Protection**: Linear vesting calculations use checked arithmetic (`checked_mul`, `checked_div`) to prevent overflow
- **Cliff Enforcement**: Claims are validated against cliff time before processing
- **Time Validation**: Vesting schedules are validated to ensure logical time ordering (cliff_time, start_time, end_time)

## 🧪 Testing

### Run Anchor Tests

```bash
npm run anchor-test
```

This runs the standard Anchor test suite using the Solana test validator.

### Run Bankrun Tests

For faster, more isolated tests using bankrun:

```bash
anchor test
```

This runs the bankrun test suite configured in `anchor/tests/bankrun.spec.ts`. Bankrun tests provide:
- **Faster test execution** - In-process validator, no separate process needed
- **Better isolation** - Each test gets a fresh validator instance
- **No port conflicts** - Runs entirely in-process
- **More realistic testing environment** - Uses the same validator as production

**Note:** You don't need to run `solana-test-validator` separately for bankrun tests - it creates an in-process validator automatically using `startAnchor` from `solana-bankrun`.

#### Current Test Coverage

The test suite includes:
- ✅ **Create Vesting Account** - Tests creating a company vesting account with treasury token account
- ⏳ Creating employee accounts (to be added)
- ⏳ Claiming tokens (to be added)

#### Test Configuration

Bankrun tests are configured to:
- Use `target/deploy` directory for compiled programs (empty string in `startAnchor` uses default location)
- Automatically set up in-process validator with program loaded
- Create test mints and accounts as needed
- Use Jest as the test runner

## 🏃 Development

### Build the Program

```bash
npm run anchor-build
```

### Start Local Validator

Start a local Solana validator with the program deployed:

```bash
npm run anchor-localnet
```

This will:
- Start a local Solana validator
- Deploy your program
- Keep it running for testing

### Start Frontend Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Generate TypeScript SDK

After building the program, generate the TypeScript SDK:

```bash
npm run codama:js
```

## 🚢 Deployment

### Deploy to Devnet

1. **Set Solana CLI to Devnet:**
```bash
solana config set --url devnet
```

2. **Airdrop SOL (if needed):**
```bash
solana airdrop 2
```

3. **Deploy the Program:**
```bash
npm run anchor deploy -- --provider.cluster devnet
```

Or from the anchor directory:
```bash
cd anchor
anchor deploy --provider.cluster devnet
```

### Deploy to Mainnet

⚠️ **Warning**: Deploying to mainnet costs real SOL. Ensure thorough testing first.

1. **Set Solana CLI to Mainnet:**
```bash
solana config set --url mainnet-beta
```

2. **Ensure you have enough SOL:**
   - ~2-3 SOL for deployment
   - Additional SOL for rent and transactions

3. **Deploy the Program:**
```bash
npm run anchor deploy -- --provider.cluster mainnet-beta
```

### Verify Deployment

After deployment, verify your program:

```bash
solana program show <PROGRAM_ID>
```

## 📊 Program ID

**Current Program ID:**
```
Count3AcZucFDPSFBAeHkQ6AvttieKUkyJ8HiQGhQwe
```

> **Note**: If you ran `npm run setup`, this will be different. Check `anchor/target/deploy/ws-vesting-keypair.json` for your program keypair.

## 🔐 Environment Variables

For the frontend, you may want to configure:

```env
NEXT_PUBLIC_SOLANA_NETWORK=devnet  # or mainnet-beta
NEXT_PUBLIC_PROGRAM_ID=<your-program-id>
```

## 🎯 Usage Workflow

### 1. Company Setup
```
1. Deploy/create token mint (if needed)
2. Call create_vesting_account with company name
3. Deposit tokens into treasury_token_account (done outside program via SPL Token)
```

### 2. Employee Setup
```
1. Owner calls create_employee_account with:
   - Employee's wallet address (beneficiary)
   - Vesting schedule (start_time, end_time, cliff_time)
   - Total amount of tokens to vest
2. Employee account PDA is created and linked to vesting account
```

### 3. Employee Claims
```
1. Employee calls claim_tokens with company_name
2. Program validates cliff time has passed
3. Program calculates vested amount using linear vesting formula
4. Program calculates claimable amount (vested - withdrawn)
5. Tokens are transferred from treasury to employee's token account
6. total_withdrawn is updated
```

## 💡 Vesting Logic

The program implements **linear vesting**:

1. **Cliff Period**: No tokens can be claimed before the `cliff_time` - this enforces a minimum lockup period
2. **Vesting Period**: Tokens vest linearly from `start_time` to `end_time` - proportional to time elapsed
3. **Calculation**: The vested amount is calculated as:
   ```
   vested = (total_amount × elapsed_time) / total_vesting_period
   ```
4. **Claimable**: Only the difference between vested amount and already withdrawn tokens can be claimed
5. **Full Vesting**: After `end_time`, all tokens are considered fully vested

### Example:
- Total tokens: 1000
- Start time: 1000 (Unix timestamp)
- End time: 2000 (Unix timestamp)
- Vesting period: 1000 seconds
- Current time: 1500
- Time elapsed: 500 seconds
- Vested: (1000 × 500) / 1000 = 500 tokens (50% vested)

## 🔧 Dependencies

### Anchor Program Dependencies

The program uses:
- `anchor-lang` (v0.30.0) - Anchor framework core library (with `init-if-needed` feature)
- `anchor-spl` (v0.30.0) - Anchor SPL token interface helpers, including:
  - Token interface for cross-program invocations
  - Associated token account functionality
  - Transfer checked operations

### Frontend Dependencies

Key dependencies include:
- `next` - Next.js framework
- `react` - React library
- `@coral-xyz/anchor` - Anchor TypeScript client
- `@solana/web3.js` - Solana Web3.js library
- `gill` - Gill Solana SDK
- `@wallet-ui/react` - Wallet UI components
- `codama` - IDL to TypeScript SDK generator

## 🐛 Troubleshooting

### Build Errors

**Error: Program ID mismatch**
```bash
# Regenerate program ID
npm run setup
```

**Error: Anchor version mismatch**
```bash
# Update Anchor
avm install latest
avm use latest
```

### Deployment Errors

**Insufficient SOL:**
```bash
# Check balance
solana balance

# Airdrop (devnet only)
solana airdrop 2
```

**Program already deployed:**
```bash
# Close existing program first
solana program close <PROGRAM_ID>
```

## 📚 Additional Resources

- [Anchor Documentation](https://www.anchor-lang.com/)
- [Anchor Book](https://www.anchor-lang.com/book/)
- [Solana Documentation](https://docs.solana.com/)
- [SPL Token Documentation](https://spl.solana.com/token)
- [Gill SDK](https://gill.site/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Solana Explorer](https://explorer.solana.com/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

[Add your license here]

## 🔗 Links

- Program ID: `Count3AcZucFDPSFBAeHkQ6AvttieKUkyJ8HiQGhQwe`
- [Solana Explorer](https://explorer.solana.com/?cluster=devnet)
- [Anchor Book](https://www.anchor-lang.com/book/)

---

**Built with ❤️ using Anchor, Solana, and Next.js**
