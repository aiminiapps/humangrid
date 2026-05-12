# SYNTHOS

> Web3 AI Training & Reward Platform

SYNTHOS is a decentralized platform where users train AI systems by completing micro-tasks and earn crypto rewards. Built with Next.js, WalletConnect, and Supabase.

## 🌟 Features

### Core Functionality
- **🔗 Web3 Wallet Integration** - Connect via WalletConnect (MetaMask, Rainbow, etc.)
- **🎯 AI Training Tasks** - Complete data labeling, sentiment analysis, and validation tasks
- **💰 Token Rewards** - Earn SYNTH tokens for every contribution
- **📊 Reputation System** - Level up from Beginner to Master Contributor
- **🏆 Leaderboard** - Compete with other contributors globally
- **📈 Progress Tracking** - Monitor your contributions, rewards, and level

### Gamification
- 5-tier reputation system with reward multipliers
- Beginner → Verified Trainer → AI Guardian → Data Architect → Master Contributor
- Point-based progression (10-50 points per task based on difficulty)
- Multipliers from 1.0x to 2.0x rewards

### Task Types (MVP)
- Crypto News Sentiment Analysis
- DeFi Risk Assessment
- Wallet Behavior Classification
- AI Prediction Verification
- Yield Strategy Selection
- Market Outlook Voting

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase account
- WalletConnect Cloud account

### Installation

```bash
# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page.

## ⚙️ Configuration

See [SETUP.md](./SETUP.md) for detailed setup instructions including:
- Supabase project creation and schema setup
- WalletConnect configuration
- Environment variable setup
- Troubleshooting guide

### Required Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-project-id
```

## 🏗️ Project Structure

```
synthos/
├── app/
│   ├── api/              # Backend API routes
│   ├── ai/              # AI dashboard page
│   └── page.js          # Landing page
├── components/          # React components
├── lib/                 # Utilities & configs
├── supabase/           # Database schema
└── tailwind.config.js  # Custom theme
```

## 🎨 Design System

### Color Palette

- **Neon Green Brand**: `#C6FF1A` (primary), `#D8FF4D` (bright), `#A6E80F` (soft)
- **Industrial Backgrounds**: `#0B0F0C` to `#1C2320` (dark variations)
- **Functional**: Success `#3DFF7A`, Warning `#FFE66D`, Error `#FF5A5A`

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Web3**: WalletConnect, wagmi, viem
- **Backend**: Supabase (PostgreSQL)
- **Language**: JavaScript

## 📝 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/profile?address={wallet}` | GET | Get or create user profile |
| `/api/tasks` | GET | Fetch available tasks |
| `/api/submit` | POST | Submit task answer |
| `/api/rewards?address={wallet}` | GET | Get reward history |
| `/api/leaderboard` | GET | Get top contributors |

## 🔐 Security Notes

**For MVP/Testing:**
- Reward transactions are currently simulated
- Token transfers are mocked for development

**For Production:**
- Implement proper RLS policies in Supabase
- Set up dedicated reward wallet
- Integrate real ERC-20 token transfers
- Add rate limiting and abuse prevention

## 🚧 Roadmap

### Phase 1: MVP ✅
- Landing page with wallet connection
- AI dashboard with task feed
- Reputation system & leaderboard
- Simulated rewards

### Phase 2: Production
- Real token contract deployment
- On-chain reward distribution
- Task creation admin dashboard

### Phase 3: Enhancement
- Daily missions & streaks
- User badges & achievements
- Staking & DAO governance

## 📄 License

MIT License

---

Built with 💚 by the SYNTHOS team
# Synthos
