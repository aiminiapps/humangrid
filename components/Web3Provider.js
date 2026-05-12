'use client'

import { createWeb3Modal } from '@web3modal/wagmi/react'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { wagmiConfig, projectId, web3ModalConfig } from '@/lib/web3'
import { useState, useEffect } from 'react'

// Global flag to track initialization across all instances
if (typeof globalThis !== 'undefined') {
    globalThis.__WEB3MODAL_INITIALIZED__ = globalThis.__WEB3MODAL_INITIALIZED__ || false
}

// Initialize Web3Modal at module level (before any component renders)
if (typeof window !== 'undefined' && !globalThis.__WEB3MODAL_INITIALIZED__) {
    try {
        createWeb3Modal(web3ModalConfig)
        globalThis.__WEB3MODAL_INITIALIZED__ = true
        console.log('✅ Web3Modal initialized for BNB Chain')
        console.log('🔒 Social logins disabled - Web3 wallets only')

        if (!projectId || projectId === 'placeholder-walletconnect-project-id') {
            console.warn('⚠️ Using placeholder Project ID - get a real one at cloud.walletconnect.com')
        }
    } catch (error) {
        // Silently handle if already initialized
        if (!error.message?.includes('already initialized')) {
            console.error('❌ Error initializing Web3Modal:', error)
        }
    }
}

export function Web3Provider({ children }) {
    const [queryClient] = useState(() => new QueryClient())
    const [showWarning, setShowWarning] = useState(false)

    useEffect(() => {
        // Show warning banner if Project ID is invalid
        if (!projectId || projectId === 'placeholder-walletconnect-project-id') {
            setShowWarning(true)
        }
    }, [])

    return (
        <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
                {showWarning && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        background: '#FFE66D',
                        color: '#0B0F0C',
                        padding: '12px 20px',
                        textAlign: 'center',
                        fontWeight: '600',
                        zIndex: 9999,
                        fontSize: '14px'
                    }}>
                        ⚠️ WalletConnect not configured. Get your Project ID at{' '}
                        <a
                            href="https://cloud.walletconnect.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ textDecoration: 'underline', color: '#0B0F0C' }}
                        >
                            cloud.walletconnect.com
                        </a>
                        {' '}and add it to .env.local
                    </div>
                )}
                {children}
            </QueryClientProvider>
        </WagmiProvider>
    )
}
