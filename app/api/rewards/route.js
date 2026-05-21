import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const address = searchParams.get('address')

        let where = {}
        if (address) {
            where = { user: { wallet_address: address.toLowerCase() } }
        }

        if (!process.env.DATABASE_URL) {
            console.log('📦 Using mock rewards data (DATABASE_URL not set)')
            return NextResponse.json([
                { id: '1', amount: 50.0, status: 'confirmed', created_at: new Date().toISOString(), tx_hash: '0xmock123', users: { wallet_address: address || '0xmock' } },
                { id: '2', amount: 12.5, status: 'pending', created_at: new Date().toISOString(), users: { wallet_address: address || '0xmock' } }
            ])
        }

        const rewards = await prisma.reward.findMany({
            where,
            include: { user: true },
            orderBy: { created_at: 'desc' }
        })

        // Map `user` relation to `users` for backwards compatibility with Supabase client
        const formattedRewards = rewards.map(r => ({ ...r, users: r.user }))

        return NextResponse.json(formattedRewards || [])
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

        const reward = await prisma.reward.findUnique({
            where: { id: rewardId },
            include: { user: true }
        })

        if (!reward) {
            return NextResponse.json({ error: 'Reward not found' }, { status: 404 })
        }

        const mockTxHash = `0x${Math.random().toString(16).substring(2, 66)}`

        await prisma.reward.update({
            where: { id: rewardId },
            data: {
                tx_hash: mockTxHash,
                status: 'confirmed',
                confirmed_at: new Date(),
            }
        })

        return NextResponse.json({
            success: true,
            tx_hash: mockTxHash,
            amount: reward.amount,
            recipient: reward.user?.wallet_address,
        })
    } catch (error) {
        console.error('Reward send API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
