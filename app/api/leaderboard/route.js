import { NextResponse } from 'next/server'
import { getServerSupabase } from '@/lib/supabase'

export async function GET(request) {
    try {
        const supabase = getServerSupabase()
        const { searchParams } = new URL(request.url)
        const userAddress = searchParams.get('address')

        // Fetch top contributors ordered by reputation score
        const { data: users, error } = await supabase
            .from('users')
            .select('*')
            .order('reputation_score', { ascending: false })
            .order('total_contributions', { ascending: false })
            .limit(100)

        if (error) {
            console.error('Error fetching leaderboard:', error)
            return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 })
        }

        // Get total user count for rank context
        const { count: dbCount } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true })

        // Simulate a large community (60k–70k) — use real count if > 1000, else simulate
        const totalUsers = dbCount && dbCount > 1000
            ? dbCount
            : 60000 + Math.floor(Math.random() * 10000)

        // Find current user's rank if address provided
        let userRank = null
        if (userAddress) {
            const { count: aboveCount } = await supabase
                .from('users')
                .select('*', { count: 'exact', head: true })
                .filter('reputation_score', 'gt',
                    users?.find(u => u.wallet_address?.toLowerCase() === userAddress.toLowerCase())?.reputation_score ?? 0
                )
            if (aboveCount !== null) userRank = aboveCount + 1
        }

        return NextResponse.json({
            users: users || [],
            total_users: totalUsers,
            user_rank: userRank,
        })
    } catch (error) {
        console.error('Leaderboard API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
