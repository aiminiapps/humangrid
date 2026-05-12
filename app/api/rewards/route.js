import { NextResponse } from 'next/server'
import { getServerSupabase } from '@/lib/supabase'

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const address = searchParams.get('address')

        const supabase = getServerSupabase()

        let query = supabase
            .from('rewards')
            .select(`
        *,
        users!inner(wallet_address)
      `)
            .order('created_at', { ascending: false })

        // Filter by address if provided
        if (address) {
            query = query.eq('users.wallet_address', address.toLowerCase())
        }

        const { data: rewards, error } = await query

        if (error) {
            console.error('Error fetching rewards:', error)
            return NextResponse.json({ error: 'Failed to fetch rewards' }, { status: 500 })
        }

        return NextResponse.json(rewards || [])
    } catch (error) {
        console.error('Rewards API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function POST(request) {
    try {
        const { rewardId } = await request.json()

        if (!rewardId) {
            return NextResponse.json({ error: 'Reward ID required' }, { status: 400 })
        }

        const supabase = getServerSupabase()

        // Get reward details
        const { data: reward, error: rewardError } = await supabase
            .from('rewards')
            .select(`
        *,
        users!inner(wallet_address)
      `)
            .eq('id', rewardId)
            .single()

        if (rewardError || !reward) {
            return NextResponse.json({ error: 'Reward not found' }, { status: 404 })
        }

        // TODO: Implement actual token transfer using viem
        // For MVP, simulate the transaction
        const mockTxHash = `0x${Math.random().toString(16).substring(2, 66)}`

        // Update reward status
        const { error: updateError } = await supabase
            .from('rewards')
            .update({
                tx_hash: mockTxHash,
                status: 'confirmed',
                confirmed_at: new Date().toISOString(),
            })
            .eq('id', rewardId)

        if (updateError) {
            console.error('Error updating reward:', updateError)
            return NextResponse.json({ error: 'Failed to update reward' }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            tx_hash: mockTxHash,
            amount: reward.amount,
            recipient: reward.users.wallet_address,
        })
    } catch (error) {
        console.error('Reward send API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
