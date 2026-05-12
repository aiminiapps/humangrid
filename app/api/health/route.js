import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getRewardWalletInfo } from '@/lib/tokenReward'

/**
 * GET /api/health
 * Check database, reward wallet, and system health
 */
export async function GET() {
    const health = {
        timestamp: new Date().toISOString(),
        status: 'healthy',
        checks: {
            database: 'unknown',
            reward_wallet: 'unknown',
            api: 'ok'
        },
        details: {}
    }

    // ─── Supabase check ────────────────────────────────────────────────────────
    try {
        const { data, error } = await supabase
            .from('users')
            .select('count')
            .limit(1)

        if (error) {
            health.checks.database = 'error'
            health.status = 'degraded'
            health.details.database_error = error.message
        } else {
            health.checks.database = 'connected'
            health.details.database_message = '✅ Supabase connected'
        }
    } catch (error) {
        health.checks.database = 'error'
        health.status = 'degraded'
        health.details.database_error = error.message
    }

    // ─── Reward wallet check ───────────────────────────────────────────────────
    try {
        const walletInfo = await getRewardWalletInfo()
        if (walletInfo.status === 'healthy') {
            health.checks.reward_wallet = 'connected'
            health.details.reward_wallet = {
                adminWallet: walletInfo.adminWallet,
                tokenContract: walletInfo.tokenContract,
                tokenSymbol: walletInfo.tokenSymbol,
                network: walletInfo.network,
                chainId: walletInfo.chainId,
                blockNumber: walletInfo.blockNumber,
            }
        } else {
            health.checks.reward_wallet = 'error'
            health.status = 'degraded'
            health.details.reward_wallet_error = walletInfo.error
        }
    } catch (error) {
        health.checks.reward_wallet = 'error'
        health.details.reward_wallet_error = error.message
    }

    // ─── Env vars check ────────────────────────────────────────────────────────
    health.details.environment = {
        supabase_url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        supabase_anon_key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        walletconnect_id: !!process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
        openrouter_key: !!process.env.OPENROUTER_API_KEY,
        reward_wallet_key: !!process.env.REWARD_WALLET_PRIVATE_KEY,
        token_contract: !!process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS,
    }

    const httpStatus = health.status === 'healthy' ? 200 : 503
    return NextResponse.json(health, { status: httpStatus })
}
