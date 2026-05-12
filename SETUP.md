# SYNTHOS - Setup Instructions

## Prerequisites
1. Node.js 18+ installed
2. A Supabase account (https://supabase.com)
3. A WalletConnect Cloud account (https://cloud.walletconnect.com)

## Step 1: Supabase Setup

### Create a New Project
1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Choose a name (e.g., "synthos-mvp")
4. Set a strong database password
5. Choose your region
6. Wait for the project to be created

### Run the Database Schema
1. In your Supabase dashboard, go to the SQL Editor
2. Click "New Query"
3. Copy the contents of `supabase/schema.sql`
4. Paste into the query editor
5. Click "Run" to execute
6. Verify tables were created in the "Table Editor" section

### Get Your Credentials
1. Go to Settings > API
2. Copy your:
   - Project URL
   - `anon` `public` key
   - `service_role` key (keep this secret!)

## Step 2: WalletConnect Setup

1. Go to https://cloud.walletconnect.com
2. Sign in or create an account
3. Create a new project
4. Name it "SYNTHOS"
5. Copy your Project ID

## Step 3: Environment Configuration

1. Open `.env.local` in the project root
2. Fill in your credentials:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-walletconnect-project-id

# Blockchain (Using Polygon Mumbai Testnet)
NEXT_PUBLIC_RPC_URL=https://rpc-mumbai.maticvigil.com
NEXT_PUBLIC_CHAIN_ID=80001
NEXT_PUBLIC_CHAIN_NAME=Polygon Mumbai Testnet

# Token Contract (Optional for now - using simulated rewards)
NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000

# Reward Wallet (Optional for now - using simulated transactions)
REWARD_WALLET_PRIVATE_KEY=

# Token Settings
NEXT_PUBLIC_TOKEN_SYMBOL=SYNTH
NEXT_PUBLIC_TOKEN_DECIMALS=18
```

## Step 4: Install & Run

```bash
# Install dependencies (if not already done)
npm install

# Run development server
npm run dev
```

## Step 5: Test the Application

1. Open http://localhost:3000
2. You should see the SYNTHOS landing page
3. Click "Enter Dashboard" or "Connect Wallet"
4. Connect your Web3 wallet (MetaMask, etc.)
5. Navigate to the AI dashboard (/ai)
6. Try completing a task!

## Troubleshooting

### "Supabase client error"
- Verify your Supabase URL and keys in `.env.local`
- Make sure the schema was run successfully
- Check the browser console for specific errors

### "WalletConnect error"
- Verify your Project ID is correct
- Try clearing browser cache
- Make sure you're using a supported wallet

### "No tasks showing"
- Verify the sample tasks were inserted via schema.sql
- Check Supabase Table Editor > tasks table
- Check browser console for API errors

### Database Connection Issues
- Ensure your Supabase project is active
- Check if you're hitting any rate limits
- Verify Row Level Security policies are set correctly

## Next Steps

### For Production Use:
1. Deploy an ERC-20 token contract
2. Set up a dedicated reward wallet
3. Implement real token transfers in `/app/api/rewards/route.js`
4. Configure production Supabase RLS policies
5. Set up proper authentication
6. Deploy to Vercel or similar platform

### Optional Enhancements:
- Add more task types
- Implement daily missions
- Create user badges system
- Add staking functionality
- Build admin dashboard for task management
