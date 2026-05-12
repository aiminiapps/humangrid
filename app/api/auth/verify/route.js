import { NextResponse } from 'next/server'
import { verifyMessage } from 'viem'

/**
 * POST /api/auth/verify
 * Verify a wallet signature for authentication
 */
export async function POST(request) {
    try {
        const { address, signature, message, nonce } = await request.json()

        // Validate inputs
        if (!address || !signature || !message || !nonce) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Verify the signature
        const isValid = await verifyMessage({
            address,
            message,
            signature,
        })

        if (!isValid) {
            return NextResponse.json(
                { error: 'Invalid signature' },
                { status: 401 }
            )
        }

        // In production, you would:
        // 1. Store the nonce in database/cache
        // 2. Check if nonce was already used
        // 3. Create a JWT token or session
        // 4. Return the token

        return NextResponse.json({
            success: true,
            address: address.toLowerCase(),
            authenticated: true,
            timestamp: new Date().toISOString(),
        })

    } catch (error) {
        console.error('Auth verification error:', error)
        return NextResponse.json(
            { error: 'Authentication failed' },
            { status: 500 }
        )
    }
}

/**
 * GET /api/auth/nonce
 * Generate a new nonce for authentication
 */
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const address = searchParams.get('address')

        if (!address) {
            return NextResponse.json(
                { error: 'Address required' },
                { status: 400 }
            )
        }

        // Generate a random nonce
        const nonce = Math.floor(Math.random() * 1000000).toString()

        // In production, store this nonce in database/cache linked to address
        // Set expiry (e.g., 5 minutes)

        return NextResponse.json({
            nonce,
            address: address.toLowerCase(),
            expiresAt: Date.now() + (5 * 60 * 1000), // 5 minutes
        })

    } catch (error) {
        console.error('Nonce generation error:', error)
        return NextResponse.json(
            { error: 'Failed to generate nonce' },
            { status: 500 }
        )
    }
}
