# 🚀 Quick Start Guide - Get WalletConnect Working

## The Issue
The "Connect Wallet" button doesn't show the WalletConnect modal because you need a **real WalletConnect Project ID**.

## ⚡ 2-Minute Fix

### Step 1: Get Your WalletConnect Project ID

1. Go to **https://cloud.walletconnect.com**
2. Click **"Sign Up"** (or Sign In if you have an account)
3. Click **"Create New Project"**
4. Give it a name: **"SYNTHOS"**
5. Click **"Create"**
6. Copy your **Project ID** (looks like: `a1b2c3d4e5f6g7h8i9j0...`)

### Step 2: Update Your Environment File

1. Open `.env.local` in your project
2. Find this line:
   ```
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=placeholder-walletconnect-project-id
   ```
3. Replace it with your actual Project ID:
   ```
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=a1b2c3d4e5f6g7h8i9j0...
   ```

### Step 3: Restart the Server

1. Stop the dev server (Ctrl+C in terminal)
2. Start it again:
   ```bash
   npm run dev
   ```

### Step 4: Test It!

1. Open http://localhost:3000
2. Click **"Connect Wallet"**
3. The WalletConnect modal should now appear! 🎉

---

## Optional: Test with Supabase

To test the full app with database integration:

### Step 1: Create Supabase Project

1. Go to **https://supabase.com**
2. Sign up and click **"New Project"**
3. Choose a name and password
4. Wait for it to initialize

### Step 2: Run the Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Copy everything from `supabase/schema.sql`
4. Paste and click **"Run"**

### Step 3: Get Your Credentials

1. Go to **Settings > API** in Supabase
2. Copy:
   - **Project URL**
   - **anon/public key**
   - **service_role key** (keep secret!)

### Step 4: Update .env.local

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### Step 5: Restart & Test

```bash
npm run dev
```

Now you can:
- ✅ Connect your wallet
- ✅ See real tasks from database
- ✅ Complete tasks and earn rewards
- ✅ See leaderboard with real data

---

## Troubleshooting

### Modal still not showing?
- Check browser console for errors (F12)
- Make sure Project ID is correct (no spaces/quotes)
- Verify you restarted the server after updating .env.local
- Try clearing browser cache

### "Invalid Supabase URL" error?
- Make sure URL starts with `https://`
- Make sure URL ends with `.supabase.co`
- Check for typos

### Tasks not loading?
- Verify Supabase schema was run successfully
- Check Supabase Table Editor to see if `tasks` table exists
- Make sure you have the 8 sample tasks in the database

---

**Need more help?** Check `SETUP.md` for detailed instructions!
