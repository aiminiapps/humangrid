import { NextResponse } from 'next/server'
import { getServerSupabase } from '@/lib/supabase'

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const address = searchParams.get('address')

        if (!address) {
            return NextResponse.json({ error: 'Address required' }, { status: 400 })
        }

        const supabase = getServerSupabase()

        // Check if user exists
        let { data: user, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('wallet_address', address.toLowerCase())
            .single()

        // If user doesn't exist, create them
        if (fetchError || !user) {
            const { data: newUser, error: createError } = await supabase
                .from('users')
                .insert([
                    {
                        wallet_address: address.toLowerCase(),
                        reputation_score: 0,
                        level: 1,
                        total_contributions: 0,
                        total_rewards: 0,
                    },
                ])
                .select()
                .single()

            if (createError) {
                console.error('Error creating user:', createError)
                return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
            }

            user = newUser
        }

        return NextResponse.json(user)
    } catch (error) {
        console.error('Profile API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
