import { NextResponse } from 'next/server'
import OpenAI from 'openai'

// ─── OpenRouter client (OpenAI-compatible) ────────────────────────────────────
const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
    defaultHeaders: {
        'HTTP-Referer': 'https://synthos.ai',
        'X-Title': 'SYNTHOS AI Training Platform',
    },
})

// ─── Category context for richer prompts ─────────────────────────────────────
const CATEGORY_PROMPTS = {
    sentiment: 'crypto market sentiment analysis — news headlines, whale movements, exchange listings, regulatory news, social media posts about DeFi/NFT/blockchain. Use real events like ETF approvals, exchange hacks, celebrity endorsements.',
    risk: 'DeFi protocol risk assessment — smart contract security, liquidity pool analysis, bridge security, stablecoin stability, rug pull indicators. Include specific TVL numbers, audit status, team details.',
    tagging: 'blockchain data classification — wallet behavior patterns, transaction recognition, token categorization, on-chain data labeling. Use MEV bots, wash trading, mixer services, whale wallets.',
    prediction: 'crypto price prediction validation — market trend forecasting, on-chain metrics, technical analysis signals. Use RSI, MACD, funding rates, open interest, fear & greed index with real numbers.',
    research: 'protocol research & analysis — tokenomics review, whitepaper quality, team credibility, market opportunity sizing. Include vesting schedules, distribution percentages, team backgrounds.',
    validation: 'AI output validation — trading signal accuracy, smart contract code review, AI summary fact-checking. Validate AI-generated predictions and summaries against known facts.',
    creative: 'crypto content quality rating — AI-generated tweets, educational threads, marketing copy, explainer articles. Rate clarity, accuracy, engagement potential.',
}

const REWARD_BY_DIFFICULTY = { easy: 10, medium: 30, hard: 50 }
const TIME_BY_DIFFICULTY = { easy: '1-2 min', medium: '2-4 min', hard: '4-6 min' }

/**
 * POST /api/ai-tasks
 * Generate AI-powered tasks using OpenAI SDK → OpenRouter → Llama 4 Maverick
 */
export async function POST(request) {
    try {
        const { category = 'sentiment', difficulty = 'medium', count = 3 } = await request.json()

        if (!process.env.OPENROUTER_API_KEY) {
            return NextResponse.json({ error: 'OPENROUTER_API_KEY not configured' }, { status: 500 })
        }

        const catContext = CATEGORY_PROMPTS[category] || CATEGORY_PROMPTS.sentiment
        const reward = REWARD_BY_DIFFICULTY[difficulty] || 30
        const timeEst = TIME_BY_DIFFICULTY[difficulty] || '2-4 min'

        const prompt = `You are a task designer for SYNTHOS, a crypto AI training platform where users label data to train AI models and earn SYNTR tokens.

Generate ${count} unique, realistic data labeling tasks for the "${category}" category at "${difficulty}" difficulty.

CONTEXT: ${catContext}

REQUIREMENTS:
- Use REAL crypto protocols (Uniswap, Aave, Binance, Ethereum, Solana, Chainlink, etc.)
- Include specific numbers, percentages, dates to make scenarios authentic
- Each task needs EXACTLY 5 distinct answer options
- Tasks should be educational and completable in ${timeEst}
- Make each scenario different — no repetition

Return ONLY a valid JSON array (no markdown, no explanation, start with [ end with ]):
[
  {
    "title": "Short specific title under 65 chars",
    "description": "Detailed realistic scenario with specific data points and context. 2-3 sentences.",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4", "Option 5"],
    "difficulty": "${difficulty}",
    "base_reward": ${reward},
    "estimated_time": "${timeEst}",
    "category": "${category}",
    "task_type": "${category}",
    "ai_powered": true,
    "ai_generated": true,
    "min_level": 1
  }
]`

        const response = await openai.chat.completions.create({
            model: 'meta-llama/llama-4-maverick',
            messages: [
                {
                    role: 'system',
                    content: 'You are a creative task designer for a crypto AI training platform. Always return valid JSON arrays only. Never include markdown code blocks, backticks, or explanations. Start your response with [ and end with ].'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.75,
            max_tokens: 4000,
        })

        const content = response.choices[0]?.message?.content?.trim()

        if (!content) {
            throw new Error('Empty response from AI model')
        }

        console.log('🤖 AI raw response preview:', content.substring(0, 400))

        // ─── Robust multi-strategy JSON extractor ────────────────────────────
        let tasks = null

        // Strategy 1: direct parse (model returned clean JSON)
        try { tasks = JSON.parse(content) } catch { }

        // Strategy 2: extract JSON array with regex
        if (!tasks) {
            const arrMatch = content.match(/\[[\s\S]*\]/)
            if (arrMatch) {
                try { tasks = JSON.parse(arrMatch[0]) } catch { }
            }
        }

        // Strategy 3: model returned a single object — wrap it
        if (!tasks) {
            const objMatch = content.match(/\{[\s\S]*\}/)
            if (objMatch) {
                try { tasks = [JSON.parse(objMatch[0])] } catch { }
            }
        }

        // Strategy 4: extract multiple objects via brace-counting
        if (!tasks) {
            const extracted = []
            let depth = 0, start = -1
            for (let i = 0; i < content.length; i++) {
                if (content[i] === '{') {
                    if (depth === 0) start = i
                    depth++
                } else if (content[i] === '}') {
                    depth--
                    if (depth === 0 && start !== -1) {
                        try {
                            const obj = JSON.parse(content.slice(start, i + 1))
                            if (obj.title) extracted.push(obj)
                        } catch { }
                        start = -1
                    }
                }
            }
            if (extracted.length > 0) tasks = extracted
        }

        if (!tasks || (Array.isArray(tasks) && tasks.length === 0)) {
            throw new Error(`Could not extract valid tasks from AI response. Preview: ${content.substring(0, 200)}`)
        }

        // Ensure it's an array
        if (!Array.isArray(tasks)) tasks = [tasks]


        // Sanitize each task
        const sanitized = tasks.slice(0, count).map((task, i) => ({
            id: `ai-${category}-${Date.now()}-${i}`,
            title: String(task.title || 'AI Generated Task').substring(0, 80),
            description: String(task.description || ''),
            options: Array.isArray(task.options) && task.options.length >= 4
                ? task.options.slice(0, 5).map(String)
                : ['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree'],
            difficulty: task.difficulty || difficulty,
            base_reward: Number(task.base_reward) || reward,
            estimated_time: task.estimated_time || timeEst,
            category: task.category || category,
            task_type: task.task_type || category,
            ai_powered: true,
            ai_generated: true,
            min_level: Number(task.min_level) || 1,
        }))

        console.log(`✅ Generated ${sanitized.length} AI tasks for [${category}/${difficulty}]`)

        return NextResponse.json({
            success: true,
            tasks: sanitized,
            count: sanitized.length,
            model: 'meta-llama/llama-4-maverick',
            generated_at: new Date().toISOString(),
        })

    } catch (error) {
        console.error('❌ AI task generation error:', error.message)

        // Surface detailed error for debugging
        return NextResponse.json({
            error: 'Failed to generate AI tasks',
            details: error.message,
            hint: error.status === 401 ? 'Check OPENROUTER_API_KEY in .env' : undefined,
        }, { status: 500 })
    }
}

export async function GET() {
    return NextResponse.json({
        status: 'ready',
        model: 'meta-llama/llama-4-maverick',
        sdk: 'openai (OpenRouter-compatible)',
        base_url: 'https://openrouter.ai/api/v1',
        supported_categories: Object.keys(CATEGORY_PROMPTS),
        api_configured: !!process.env.OPENROUTER_API_KEY,
    })
}
