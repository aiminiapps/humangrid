/**
 * SYNTHOS - Expanded Task Library
 * Categories: AI Labeling, Sentiment, Risk, Social, Research, Creative, Validation
 */

export const TASK_CATEGORIES = {
    sentiment: {
        id: 'sentiment',
        label: 'Sentiment Analysis',
        icon: '🧠',
        color: '#C6FF1A',
        description: 'Analyze market sentiment and community mood'
    },
    risk: {
        id: 'risk',
        label: 'Risk Assessment',
        icon: '⚠️',
        color: '#FF6B35',
        description: 'Evaluate risk levels for DeFi protocols and investments'
    },
    tagging: {
        id: 'tagging',
        label: 'Data Tagging',
        icon: '🏷️',
        color: '#A78BFA',
        description: 'Classify and tag blockchain data patterns'
    },
    prediction: {
        id: 'prediction',
        label: 'Prediction Validation',
        icon: '🔮',
        color: '#38BDF8',
        description: 'Validate AI price and market predictions'
    },
    social: {
        id: 'social',
        label: 'Social Tasks',
        icon: '📣',
        color: '#FB7185',
        description: 'Community engagement and growth tasks'
    },
    research: {
        id: 'research',
        label: 'Research & Analysis',
        icon: '🔍',
        color: '#34D399',
        description: 'Deep-dive research on protocols and projects'
    },
    creative: {
        id: 'creative',
        label: 'Creative Tasks',
        icon: '✨',
        color: '#FBBF24',
        description: 'Content creation and creative contributions'
    },
    validation: {
        id: 'validation',
        label: 'AI Validation',
        icon: '✅',
        color: '#60A5FA',
        description: 'Validate and improve AI model outputs'
    }
}

export const mockTasks = [
    // ═══════════════════════════════════════════════════════
    // SENTIMENT ANALYSIS
    // ═══════════════════════════════════════════════════════
    {
        id: 'sent-1',
        task_type: 'sentiment',
        category: 'sentiment',
        title: 'Crypto News Sentiment Analysis',
        description: 'Analyze the sentiment of this crypto news headline: "Bitcoin surges 15% after major institutional adoption announcement from BlackRock"',
        options: ['Very Bullish', 'Bullish', 'Neutral', 'Bearish', 'Very Bearish'],
        difficulty: 'easy',
        base_reward: 10,
        min_level: 1,
        estimated_time: '1 min',
        ai_powered: true
    },
    {
        id: 'sent-2',
        task_type: 'sentiment',
        category: 'sentiment',
        title: 'Token Launch Sentiment',
        description: 'Analyze community sentiment: "New AI token launching with locked liquidity, doxxed team, and real product demo — 10,000 holders in 24h"',
        options: ['Very Positive', 'Positive', 'Mixed', 'Negative', 'Very Negative'],
        difficulty: 'easy',
        base_reward: 10,
        min_level: 1,
        estimated_time: '1 min',
        ai_powered: true
    },
    {
        id: 'sent-3',
        task_type: 'sentiment',
        category: 'sentiment',
        title: 'Exchange Listing Reaction',
        description: 'Token gets listed on Binance with $50M trading volume in first hour, price up 300%. What is the market sentiment?',
        options: ['Extremely Bullish', 'Bullish', 'Cautiously Optimistic', 'Neutral', 'Bearish'],
        difficulty: 'easy',
        base_reward: 10,
        min_level: 1,
        estimated_time: '1 min',
        ai_powered: true
    },
    {
        id: 'sent-4',
        task_type: 'sentiment',
        category: 'sentiment',
        title: 'Regulatory News Impact',
        description: 'SEC approves spot Ethereum ETF with $2B in inflows expected. Analyze the broader crypto market sentiment.',
        options: ['Extremely Bullish', 'Bullish', 'Neutral', 'Bearish', 'Extremely Bearish'],
        difficulty: 'medium',
        base_reward: 30,
        min_level: 1,
        estimated_time: '2 min',
        ai_powered: true
    },
    {
        id: 'sent-5',
        task_type: 'sentiment',
        category: 'sentiment',
        title: 'Whale Movement Analysis',
        description: 'A known whale wallet moves 50,000 ETH to Coinbase exchange. Community is split — analyze the dominant sentiment.',
        options: ['Very Bullish', 'Bullish', 'Neutral/Uncertain', 'Bearish', 'Very Bearish'],
        difficulty: 'medium',
        base_reward: 30,
        min_level: 2,
        estimated_time: '2 min',
        ai_powered: true
    },

    // ═══════════════════════════════════════════════════════
    // RISK ASSESSMENT
    // ═══════════════════════════════════════════════════════
    {
        id: 'risk-1',
        task_type: 'risk',
        category: 'risk',
        title: 'DeFi Protocol Risk Assessment',
        description: 'Rate the risk level of investing in a new DeFi yield farming protocol with 500% APY, 2-day-old liquidity, and anonymous team.',
        options: ['Very Low Risk', 'Low Risk', 'Medium Risk', 'High Risk', 'Very High Risk'],
        difficulty: 'medium',
        base_reward: 30,
        min_level: 1,
        estimated_time: '3 min',
        ai_powered: true
    },
    {
        id: 'risk-2',
        task_type: 'risk',
        category: 'risk',
        title: 'Smart Contract Audit Review',
        description: 'A smart contract audit shows: 2 medium issues, 5 low issues, unverified proxy contracts, and admin key with upgrade ability. Risk level?',
        options: ['Safe to Use', 'Low Risk', 'Medium Risk', 'High Risk', 'Critical Risk'],
        difficulty: 'hard',
        base_reward: 50,
        min_level: 2,
        estimated_time: '5 min',
        ai_powered: true
    },
    {
        id: 'risk-3',
        task_type: 'risk',
        category: 'risk',
        title: 'Liquidity Pool Assessment',
        description: 'Pool analysis: $100K TVL, 90% owned by 3 wallets, created 5 days ago, no audit, 0.3% fee. Risk assessment?',
        options: ['Very Low', 'Low', 'Moderate', 'High', 'Extreme'],
        difficulty: 'medium',
        base_reward: 30,
        min_level: 1,
        estimated_time: '3 min',
        ai_powered: true
    },
    {
        id: 'risk-4',
        task_type: 'risk',
        category: 'risk',
        title: 'Bridge Protocol Security',
        description: 'Cross-chain bridge: $500M TVL, 5/9 multisig, 2 previous exploits patched, no formal audit in 6 months. Risk level?',
        options: ['Very Safe', 'Acceptable Risk', 'Moderate Risk', 'High Risk', 'Avoid'],
        difficulty: 'hard',
        base_reward: 50,
        min_level: 3,
        estimated_time: '5 min',
        ai_powered: true
    },
    {
        id: 'risk-5',
        task_type: 'risk',
        category: 'risk',
        title: 'Stablecoin Depeg Risk',
        description: 'Algorithmic stablecoin: $1B market cap, 150% collateral ratio, reserve includes 40% in its own governance token. Depeg risk?',
        options: ['Very Low', 'Low', 'Medium', 'High', 'Critical'],
        difficulty: 'hard',
        base_reward: 50,
        min_level: 2,
        estimated_time: '4 min',
        ai_powered: true
    },

    // ═══════════════════════════════════════════════════════
    // DATA TAGGING
    // ═══════════════════════════════════════════════════════
    {
        id: 'tag-1',
        task_type: 'tagging',
        category: 'tagging',
        title: 'Wallet Behavior Classification',
        description: 'A wallet shows: 1000+ daily transactions, consistent $100-$500 trades, active during US market hours, uses MEV bots. Classify:',
        options: ['Bot Trading', 'Day Trader', 'Long-term Holder', 'Arbitrage Bot', 'Market Maker'],
        difficulty: 'hard',
        base_reward: 50,
        min_level: 2,
        estimated_time: '4 min',
        ai_powered: true
    },
    {
        id: 'tag-2',
        task_type: 'tagging',
        category: 'tagging',
        title: 'NFT Collection Classification',
        description: 'Classify this NFT project: 10k PFP collection, celebrity partnerships, gaming utility, staking rewards, DAO governance, P2E mechanics.',
        options: ['Utility NFT', 'Art Collection', 'Gaming Asset', 'Membership Pass', 'Hybrid Project'],
        difficulty: 'medium',
        base_reward: 30,
        min_level: 1,
        estimated_time: '2 min',
        ai_powered: true
    },
    {
        id: 'tag-3',
        task_type: 'tagging',
        category: 'tagging',
        title: 'Transaction Pattern Recognition',
        description: 'Wallet shows: Regular small inflows from 100+ addresses, immediate outflow to exchange, repeating daily, consistent amounts. Pattern?',
        options: ['Payment Aggregator', 'Scam Collector', 'Mixer Service', 'Business Wallet', 'Exchange Hot Wallet'],
        difficulty: 'hard',
        base_reward: 50,
        min_level: 3,
        estimated_time: '5 min',
        ai_powered: true
    },
    {
        id: 'tag-4',
        task_type: 'tagging',
        category: 'tagging',
        title: 'Token Category Classification',
        description: 'Token features: Deflationary supply, 2% burn on transfer, staking rewards, governance voting, treasury management. Category?',
        options: ['DeFi Governance', 'Utility Token', 'Meme Token', 'Security Token', 'Hybrid DeFi'],
        difficulty: 'medium',
        base_reward: 30,
        min_level: 1,
        estimated_time: '2 min',
        ai_powered: true
    },

    // ═══════════════════════════════════════════════════════
    // PREDICTION VALIDATION
    // ═══════════════════════════════════════════════════════
    {
        id: 'pred-1',
        task_type: 'prediction',
        category: 'prediction',
        title: 'Price Movement Validation',
        description: 'AI predicts BTC will rise 5% in 24h based on: bullish order book, positive social sentiment score 78/100, whale accumulation detected.',
        options: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree'],
        difficulty: 'medium',
        base_reward: 30,
        min_level: 1,
        estimated_time: '3 min',
        ai_powered: true
    },
    {
        id: 'pred-2',
        task_type: 'prediction',
        category: 'prediction',
        title: 'Market Trend Prediction',
        description: 'Indicators: BTC dominance rising to 58%, altcoin volume dropping 40%, fear & greed index at 25 (Fear). What happens next 7 days?',
        options: ['Major Rally', 'Moderate Up', 'Sideways', 'Moderate Down', 'Major Dump'],
        difficulty: 'hard',
        base_reward: 50,
        min_level: 2,
        estimated_time: '5 min',
        ai_powered: true
    },
    {
        id: 'pred-3',
        task_type: 'prediction',
        category: 'prediction',
        title: 'Gas Fee Prediction',
        description: 'ETH network: 150k pending txs, major NFT mint in 2h, average gas 50 gwei, Blob fees spiking. What will gas fees do?',
        options: ['Spike >200 gwei', 'Rise to 100-200', 'Stay 50-100', 'Drop to 20-50', 'Drop <20'],
        difficulty: 'medium',
        base_reward: 30,
        min_level: 1,
        estimated_time: '2 min',
        ai_powered: true
    },
    {
        id: 'pred-4',
        task_type: 'prediction',
        category: 'prediction',
        title: 'DeFi TVL Prediction',
        description: 'DeFi protocol launches new 15% APY stablecoin vault with $50M cap. Predict TVL after 48 hours.',
        options: ['Full cap ($50M)', '$30-50M', '$10-30M', '$1-10M', 'Under $1M'],
        difficulty: 'hard',
        base_reward: 50,
        min_level: 2,
        estimated_time: '4 min',
        ai_powered: true
    },

    // ═══════════════════════════════════════════════════════
    // RESEARCH & ANALYSIS
    // ═══════════════════════════════════════════════════════
    {
        id: 'res-1',
        task_type: 'research',
        category: 'research',
        title: 'Protocol Tokenomics Review',
        description: 'Review these tokenomics: 1B total supply, 40% team (4yr vest), 20% ecosystem, 15% public sale, 25% treasury. Fair distribution?',
        options: ['Very Fair', 'Mostly Fair', 'Neutral', 'Slightly Unfair', 'Very Unfair'],
        difficulty: 'medium',
        base_reward: 30,
        min_level: 1,
        estimated_time: '3 min',
        ai_powered: true
    },
    {
        id: 'res-2',
        task_type: 'research',
        category: 'research',
        title: 'Whitepaper Quality Assessment',
        description: 'Whitepaper analysis: 45 pages, technical depth, working testnet, GitHub activity, no roadmap dates, vague revenue model. Quality?',
        options: ['Excellent', 'Good', 'Average', 'Below Average', 'Poor'],
        difficulty: 'hard',
        base_reward: 50,
        min_level: 2,
        estimated_time: '6 min',
        ai_powered: true
    },
    {
        id: 'res-3',
        task_type: 'research',
        category: 'research',
        title: 'Team Credibility Score',
        description: 'Team: 3 doxxed founders, ex-Google/Coinbase backgrounds, LinkedIn verified, 2 previous failed projects, active GitHub. Credibility?',
        options: ['Very High', 'High', 'Medium', 'Low', 'Very Low'],
        difficulty: 'medium',
        base_reward: 30,
        min_level: 1,
        estimated_time: '3 min',
        ai_powered: true
    },
    {
        id: 'res-4',
        task_type: 'research',
        category: 'research',
        title: 'Market Opportunity Analysis',
        description: 'New L2 chain: EVM compatible, 10k TPS, $0.001 avg fee, targeting gaming sector. TAM estimated at $200B. Market opportunity?',
        options: ['Massive Opportunity', 'Large Opportunity', 'Moderate', 'Limited', 'Oversaturated'],
        difficulty: 'hard',
        base_reward: 100,
        min_level: 3,
        estimated_time: '8 min',
        ai_powered: true
    },

    // ═══════════════════════════════════════════════════════
    // AI VALIDATION
    // ═══════════════════════════════════════════════════════
    {
        id: 'val-1',
        task_type: 'validation',
        category: 'validation',
        title: 'AI Trading Signal Validation',
        description: 'AI generated signal: "BUY ETH at $2,800 — RSI oversold at 28, MACD bullish crossover, volume spike 3x average." Validate this signal:',
        options: ['Strong Buy Signal', 'Valid Signal', 'Uncertain', 'Weak Signal', 'Invalid Signal'],
        difficulty: 'hard',
        base_reward: 50,
        min_level: 2,
        estimated_time: '5 min',
        ai_powered: true
    },
    {
        id: 'val-2',
        task_type: 'validation',
        category: 'validation',
        title: 'AI Summary Accuracy Check',
        description: 'AI summarized: "Uniswap V4 introduces hooks, singleton architecture, and flash accounting — reducing gas by 99%." Is this accurate?',
        options: ['Fully Accurate', 'Mostly Accurate', 'Partially Accurate', 'Mostly Inaccurate', 'Completely Wrong'],
        difficulty: 'medium',
        base_reward: 30,
        min_level: 1,
        estimated_time: '3 min',
        ai_powered: true
    },
    {
        id: 'val-3',
        task_type: 'validation',
        category: 'validation',
        title: 'Smart Contract Code Review',
        description: 'AI flagged this code pattern as safe: "onlyOwner modifier with timelock on all admin functions." Is the AI assessment correct?',
        options: ['Definitely Safe', 'Likely Safe', 'Needs More Context', 'Potentially Unsafe', 'Definitely Unsafe'],
        difficulty: 'hard',
        base_reward: 50,
        min_level: 3,
        estimated_time: '6 min',
        ai_powered: true
    },

    // ═══════════════════════════════════════════════════════
    // CREATIVE TASKS
    // ═══════════════════════════════════════════════════════
    {
        id: 'cre-1',
        task_type: 'creative',
        category: 'creative',
        title: 'Rate AI-Generated Tweet',
        description: 'Rate this AI-generated tweet for SYNTHOS: "🚀 Just earned 50 SYNTR training AI models on @SynthosAI — the future of work is here! Join 10k+ contributors earning crypto while improving AI. #Web3 #AI"',
        options: ['Excellent (Post it!)', 'Good', 'Average', 'Needs Work', 'Poor (Rewrite)'],
        difficulty: 'easy',
        base_reward: 10,
        min_level: 1,
        estimated_time: '1 min',
        ai_powered: false
    },
    {
        id: 'cre-2',
        task_type: 'creative',
        category: 'creative',
        title: 'Content Quality Rating',
        description: 'Rate this educational thread about DeFi risks: "Thread covers impermanent loss, smart contract risk, oracle manipulation, and rug pulls with real examples." Quality?',
        options: ['Excellent', 'Good', 'Average', 'Below Average', 'Poor'],
        difficulty: 'easy',
        base_reward: 10,
        min_level: 1,
        estimated_time: '2 min',
        ai_powered: false
    },

    // ═══════════════════════════════════════════════════════
    // SOCIAL TASKS (One-time)
    // ═══════════════════════════════════════════════════════
    {
        id: 'social-1',
        task_type: 'social',
        category: 'social',
        title: 'Follow SYNTHOS on X',
        description: 'Follow @SynthosAI on X (Twitter) to stay updated with platform news, new task drops, and earn bonus rewards!',
        options: ['Followed @SynthosAI ✓', 'Already Following'],
        difficulty: 'easy',
        base_reward: 100,
        min_level: 1,
        estimated_time: '30 sec',
        category_label: 'One-Time Bonus',
        action_url: 'https://twitter.com/SynthosAI',
        is_one_time: true,
        ai_powered: false
    },
    {
        id: 'social-2',
        task_type: 'social',
        category: 'social',
        title: 'Like Our Launch Post',
        description: 'Like our official SYNTHOS platform launch announcement post on X and help us reach more contributors!',
        options: ['Liked the Post ✓', 'Already Liked'],
        difficulty: 'easy',
        base_reward: 50,
        min_level: 1,
        estimated_time: '30 sec',
        category_label: 'One-Time Bonus',
        action_url: 'https://twitter.com/SynthosAI',
        is_one_time: true,
        ai_powered: false
    },
    {
        id: 'social-3',
        task_type: 'social',
        category: 'social',
        title: 'Repost & Share SYNTHOS',
        description: 'Repost our introduction tweet to help spread the word about AI-powered crypto training and earn a big bonus!',
        options: ['Reposted Successfully ✓', 'Already Reposted'],
        difficulty: 'easy',
        base_reward: 100,
        min_level: 1,
        estimated_time: '30 sec',
        category_label: 'One-Time Bonus',
        action_url: 'https://twitter.com/intent/retweet?tweet_id=123456',
        is_one_time: true,
        ai_powered: false
    },
    {
        id: 'social-4',
        task_type: 'social',
        category: 'social',
        title: 'Share Your Experience',
        description: 'Write a post about your SYNTHOS experience and tag @SynthosAI for a massive bonus reward!',
        options: ['Posted & Tagged ✓', 'Will Post Later'],
        difficulty: 'medium',
        base_reward: 100,
        min_level: 1,
        estimated_time: '5 min',
        category_label: 'One-Time Bonus',
        action_url: 'https://twitter.com/intent/tweet?text=Just%20started%20training%20AI%20and%20earning%20SYNTR%20on%20@SynthosAI%20%F0%9F%9A%80',
        is_one_time: true,
        ai_powered: false
    },
    {
        id: 'social-5',
        task_type: 'social',
        category: 'social',
        title: 'Join SYNTHOS Telegram',
        description: 'Join our official Telegram community to connect with other contributors, get early task alerts, and exclusive rewards!',
        options: ['Joined Community ✓', 'Already a Member'],
        difficulty: 'easy',
        base_reward: 75,
        min_level: 1,
        estimated_time: '30 sec',
        category_label: 'One-Time Bonus',
        action_url: 'https://t.me/SynthosAI',
        is_one_time: true,
        ai_powered: false
    },
]

export function getTasksByCategory(category) {
    if (!category || category === 'all') return mockTasks
    return mockTasks.filter(task => task.category === category)
}

export function getTaskById(id) {
    return mockTasks.find(task => task.id === id)
}

export function getRandomTasks(count = 5) {
    const shuffled = [...mockTasks].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
}

export function getTaskStats() {
    const stats = {}
    Object.keys(TASK_CATEGORIES).forEach(cat => {
        stats[cat] = mockTasks.filter(t => t.category === cat).length
    })
    return stats
}
