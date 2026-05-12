// Advanced authentication utilities for SYNTHOS
import { recoverMessageAddress } from 'viem'

/**
 * Generate a random nonce for authentication
 */
export function generateNonce() {
    return Math.floor(Math.random() * 1000000).toString()
}

/**
 * Create a sign-in message for wallet signature
 * @param {string} address - User's wallet address
 * @param {string} nonce - Random nonce
 */
export function createSignInMessage(address, nonce) {
    const domain = typeof window !== 'undefined' ? window.location.host : 'synthos.ai'
    const timestamp = new Date().toISOString()

    return `Welcome to SYNTHOS!

Sign this message to authenticate your wallet and start earning rewards.

Wallet: ${address}
Nonce: ${nonce}
Domain: ${domain}
Timestamp: ${timestamp}

This signature will not trigger any blockchain transaction or cost gas fees.`
}

/**
 * Verify a signed message
 * @param {string} message - Original message that was signed
 * @param {string} signature - Signature from wallet
 * @param {string} expectedAddress - Expected signer address
 */
export async function verifySignature(message, signature, expectedAddress) {
    try {
        const recoveredAddress = await recoverMessageAddress({
            message,
            signature,
        })

        return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase()
    } catch (error) {
        console.error('Error verifying signature:', error)
        return false
    }
}

/**
 * Session management
 */
export const SessionManager = {
    // Store session in localStorage
    saveSession(address, signature, nonce) {
        const session = {
            address: address.toLowerCase(),
            signature,
            nonce,
            timestamp: Date.now(),
            expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
        }

        if (typeof window !== 'undefined') {
            localStorage.setItem('synthos_session', JSON.stringify(session))
        }

        return session
    },

    // Get current session
    getSession() {
        if (typeof window === 'undefined') return null

        const sessionStr = localStorage.getItem('synthos_session')
        if (!sessionStr) return null

        try {
            const session = JSON.parse(sessionStr)

            // Check if expired
            if (Date.now() > session.expiresAt) {
                this.clearSession()
                return null
            }

            return session
        } catch {
            return null
        }
    },

    // Check if session is valid
    isSessionValid() {
        const session = this.getSession()
        return session !== null
    },

    // Clear session
    clearSession() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('synthos_session')
        }
    },

    // Refresh session expiry
    refreshSession() {
        const session = this.getSession()
        if (session) {
            session.expiresAt = Date.now() + (24 * 60 * 60 * 1000)
            if (typeof window !== 'undefined') {
                localStorage.setItem('synthos_session', JSON.stringify(session))
            }
        }
    }
}

/**
 * Authentication state management
 */
export const AuthState = {
    // Check if user is authenticated
    isAuthenticated(address) {
        const session = SessionManager.getSession()
        if (!session) return false

        return session.address.toLowerCase() === address?.toLowerCase()
    },

    // Get authentication status
    getAuthStatus(address) {
        const session = SessionManager.getSession()

        return {
            isAuthenticated: this.isAuthenticated(address),
            session,
            needsSignature: !session && !!address,
        }
    }
}

/**
 * Rate limiting helper
 */
export class RateLimiter {
    constructor(maxAttempts = 5, windowMs = 60000) {
        this.maxAttempts = maxAttempts
        this.windowMs = windowMs
        this.attempts = new Map()
    }

    canAttempt(key) {
        const now = Date.now()
        const userAttempts = this.attempts.get(key) || []

        // Filter out old attempts
        const recentAttempts = userAttempts.filter(time => now - time < this.windowMs)

        if (recentAttempts.length >= this.maxAttempts) {
            return false
        }

        return true
    }

    recordAttempt(key) {
        const now = Date.now()
        const userAttempts = this.attempts.get(key) || []
        userAttempts.push(now)
        this.attempts.set(key, userAttempts)
    }

    getRemainingAttempts(key) {
        const now = Date.now()
        const userAttempts = this.attempts.get(key) || []
        const recentAttempts = userAttempts.filter(time => now - time < this.windowMs)

        return Math.max(0, this.maxAttempts - recentAttempts.length)
    }
}
