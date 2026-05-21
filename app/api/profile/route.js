import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const address = searchParams.get('address')

        if (!address) {
            return NextResponse.json({ error: 'Address required' }, { status: 400 })
        }

        const walletAddress = address.toLowerCase()

        if (!process.env.DATABASE_URL) {
            console.log('📦 Using mock profile data (DATABASE_URL not set)')
            return NextResponse.json({
                id: 'mock-user-id',
                wallet_address: walletAddress,
                reputation_score: 150,
                level: 2,
                total_contributions: 5,
                total_rewards: 25.5,
                created_at: new Date().toISOString()
            })
        }

        let user = await prisma.user.findUnique({
            where: { wallet_address: walletAddress }
        })

        if (!user) {
            user = await prisma.user.create({
                data: {
                    wallet_address: walletAddress,
                    reputation_score: 0,
                    level: 1,
                    total_contributions: 0,
                    total_rewards: 0,
                }
            })
        }

        return NextResponse.json(user)
    } catch (error) {
        console.error('Profile API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
