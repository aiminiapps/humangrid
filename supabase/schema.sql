-- SYNTHOS Database Schema for Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_address TEXT UNIQUE NOT NULL,
  reputation_score INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  total_contributions INTEGER DEFAULT 0,
  total_rewards NUMERIC(20, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on wallet_address for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_wallet ON users(wallet_address);
CREATE INDEX IF NOT EXISTS idx_users_reputation ON users(reputation_score DESC);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  options JSONB,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  base_reward NUMERIC(20, 2) NOT NULL,
  min_level INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  answer JSONB NOT NULL,
  reward_amount NUMERIC(20, 2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'validated', 'rewarded')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_submissions_user ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_task ON submissions(task_id);
CREATE INDEX IF NOT EXISTS idx_submissions_created ON submissions(created_at DESC);

-- Rewards table
CREATE TABLE IF NOT EXISTS rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  submission_id UUID REFERENCES submissions(id) ON DELETE SET NULL,
  amount NUMERIC(20, 2) NOT NULL,
  tx_hash TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'confirmed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  confirmed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_rewards_user ON rewards(user_id);
CREATE INDEX IF NOT EXISTS idx_rewards_status ON rewards(status);
CREATE INDEX IF NOT EXISTS idx_rewards_created ON rewards(created_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample tasks
INSERT INTO tasks (task_type, title, description, options, difficulty, base_reward, min_level) VALUES
  (
    'sentiment',
    'Crypto News Sentiment Analysis',
    'Classify the sentiment of this news headline: "Bitcoin reaches new all-time high as institutional adoption surges"',
    '["Very Positive", "Positive", "Neutral", "Negative", "Very Negative"]'::jsonb,
    'easy',
    5,
    1
  ),
  (
    'risk',
    'DeFi Strategy Risk Assessment',
    'Rate the risk level of this yield farming strategy: Providing liquidity to a new DEX with 200% APY',
    '["Very Low Risk", "Low Risk", "Medium Risk", "High Risk", "Very High Risk"]'::jsonb,
    'medium',
    15,
    1
  ),
  (
    'tagging',
    'Wallet Behavior Classification',
    'Tag this wallet behavior: Multiple small transactions to different addresses within minutes',
    '["Normal Trading", "Arbitrage Bot", "Potential Scam", "Airdrop Farming", "Liquidity Provider"]'::jsonb,
    'medium',
    15,
    2
  ),
  (
    'prediction',
    'AI Prediction Verification',
    'The AI predicts: "ETH will likely trend upward in the next 24h based on current market data." How confident are you in this prediction?',
    '["Very Confident", "Confident", "Neutral", "Not Confident", "Very Uncertain"]'::jsonb,
    'hard',
    30,
    3
  ),
  (
    'strategy',
    'Best Yield Strategy Selection',
    'Which strategy offers the best risk-adjusted returns for $10,000 USDC?',
    '["Aave Lending (5% APY, Very Low Risk)", "Curve LP (12% APY, Low Risk)", "New DeFi Protocol (50% APY, High Risk)", "Stablecoin Farming (8% APY, Medium Risk)"]'::jsonb,
    'hard',
    30,
    2
  ),
  (
    'outlook',
    'Market Outlook Vote',
    'What is your outlook for the crypto market in the next 30 days?',
    '["Very Bullish", "Bullish", "Neutral", "Bearish", "Very Bearish"]'::jsonb,
    'easy',
    5,
    1
  ),
  (
    'sentiment',
    'Protocol Update Sentiment',
    'Classify sentiment: "Major DEX announces governance token migration with improved tokenomics"',
    '["Very Positive", "Positive", "Neutral", "Negative", "Very Negative"]'::jsonb,
    'easy',
    5,
    1
  ),
  (
    'validation',
    'Smart Contract Validation',
    'An AI flagged this contract as potentially malicious. Do you agree based on the code pattern analysis?',
    '["Definitely Malicious", "Likely Malicious", "Uncertain", "Likely Safe", "Definitely Safe"]'::jsonb,
    'hard',
    30,
    3
  );

-- Grant necessary permissions (adjust based on your Supabase setup)
-- These are for development; in production, use RLS policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;

-- Create policies (permissive for MVP, tighten in production)
CREATE POLICY "Allow all operations on users" ON users FOR ALL USING (true);
CREATE POLICY "Allow all operations on tasks" ON tasks FOR ALL USING (true);
CREATE POLICY "Allow all operations on submissions" ON submissions FOR ALL USING (true);
CREATE POLICY "Allow all operations on rewards" ON rewards FOR ALL USING (true);
