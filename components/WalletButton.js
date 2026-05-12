'use client'

import { useAccount, useSignMessage, useDisconnect } from 'wagmi'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    RiWalletLine, RiLogoutBoxLine, RiShieldCheckLine,
    RiLoader4Line, RiFileCopyLine, RiCheckLine,
    RiExternalLinkLine, RiAlertLine,
} from 'react-icons/ri'
import {
    generateNonce,
    createSignInMessage,
    SessionManager,
    AuthState,
} from '@/lib/auth'

// ─── Truncate address ─────────────────────────────────────────────────────────
function truncAddr(addr) {
    if (!addr) return ''
    return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}

// ─── SSR guard wrapper ────────────────────────────────────────────────────────
export default function WalletButton() {
    const [isMounted, setIsMounted] = useState(false)
    useEffect(() => { setIsMounted(true) }, [])
    if (!isMounted) return null
    return <WalletButtonContent />
}

// ─── Main button ──────────────────────────────────────────────────────────────
function WalletButtonContent() {
    const { open } = useWeb3Modal()
    const { address, isConnected, chain } = useAccount()
    const { disconnect } = useDisconnect()
    const { signMessageAsync } = useSignMessage()

    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isAuthenticating, setIsAuthenticating] = useState(false)
    const [showChainWarning, setShowChainWarning] = useState(false)
    const [showDropdown, setShowDropdown] = useState(false)
    const [copied, setCopied] = useState(false)
    const dropdownRef = useRef(null)

    // Auth status
    useEffect(() => {
        if (address) {
            const s = AuthState.getAuthStatus(address)
            setIsAuthenticated(s.isAuthenticated)
            if (s.isAuthenticated) SessionManager.refreshSession()
        } else {
            setIsAuthenticated(false)
        }
    }, [address])

    // Chain check
    useEffect(() => {
        if (isConnected && chain) {
            setShowChainWarning(chain.id !== 56 && chain.id !== 97)
        } else {
            setShowChainWarning(false)
        }
    }, [isConnected, chain])

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const handleAuthenticate = async () => {
        if (!address || isAuthenticating) return
        setIsAuthenticating(true)
        try {
            const nonce = generateNonce()
            const message = createSignInMessage(address, nonce)
            const signature = await signMessageAsync({ message })
            if (signature) {
                SessionManager.saveSession(address, signature, nonce)
                setIsAuthenticated(true)
            }
        } catch (err) {
            console.error('Auth failed:', err)
        } finally {
            setIsAuthenticating(false)
        }
    }

    const handleDisconnect = () => {
        SessionManager.clearSession()
        setIsAuthenticated(false)
        disconnect()
        setShowDropdown(false)
    }

    const handleCopy = () => {
        if (!address) return
        navigator.clipboard.writeText(address)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    // ── Not connected ──────────────────────────────────────────────────────────
    if (!isConnected) {
        return (
            <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => open()}
                className="relative flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-bold text-sm overflow-hidden group"
                style={{
                    background: 'linear-gradient(135deg, #C6FF1A, #9ECC00)',
                    color: '#080C09',
                    boxShadow: '0 0 20px rgba(198,255,26,0.25), inset 0 1px 0 rgba(255,255,255,0.3)',
                }}
            >
                {/* Shine sweep */}
                <span
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.25) 50%, transparent 60%)' }}
                />
                <RiWalletLine className="text-base shrink-0 relative z-10" />
                <span className="relative z-10">Connect Wallet</span>
            </motion.button>
        )
    }

    // ── Connected but not authenticated ────────────────────────────────────────
    if (!isAuthenticated) {
        return (
            <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleAuthenticate}
                disabled={isAuthenticating}
                className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-bold text-sm border transition-all"
                style={{
                    color: '#FBBF24',
                    borderColor: 'rgba(251,191,36,0.35)',
                    background: 'rgba(251,191,36,0.08)',
                    boxShadow: '0 0 16px rgba(251,191,36,0.1)',
                }}
            >
                {isAuthenticating ? (
                    <><RiLoader4Line className="text-base animate-spin" /><span>Signing…</span></>
                ) : (
                    <><RiShieldCheckLine className="text-base" /><span>Sign to Verify</span></>
                )}
            </motion.button>
        )
    }

    // ── Authenticated — show address + dropdown ────────────────────────────────
    return (
        <div className="relative" ref={dropdownRef}>
            {/* Main pill */}
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowDropdown(v => !v)}
                className="flex items-center gap-2.5 sm:px-4 px-1.5 py-2.5 rounded-xl border font-semibold sm:text-sm text-[10px] transition-all"
                style={{
                    color: '#C6FF1A',
                    borderColor: 'rgba(198,255,26,0.25)',
                    background: 'rgba(198,255,26,0.06)',
                    boxShadow: showDropdown ? '0 0 20px rgba(198,255,26,0.15)' : '0 0 12px rgba(198,255,26,0.06)',
                }}
            >
                {/* Status dot */}
                <span className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C6FF1A] opacity-50" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C6FF1A]" />
                </span>
                <span className="font-mono">{truncAddr(address)}</span>
                {/* Chevron */}
                <motion.span
                    animate={{ rotate: showDropdown ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-[#C6FF1A]/50 text-xs"
                >
                    ▾
                </motion.span>
            </motion.button>

            {/* Dropdown */}
            <AnimatePresence>
                {showDropdown && (
                    <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full right-0 mt-2 w-64 rounded-2xl border overflow-hidden z-50"
                        style={{
                            background: 'rgba(8,12,9,0.95)',
                            borderColor: 'rgba(198,255,26,0.15)',
                            backdropFilter: 'blur(20px)',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(198,255,26,0.08)',
                        }}
                    >
                        {/* Address block */}
                        <div className="px-4 pt-4 pb-3 border-b border-white/6">
                            <div className="flex items-center gap-2 mb-1">
                                <RiShieldCheckLine className="text-[#C6FF1A] text-sm" />
                                <span className="text-[#C6FF1A] text-xs font-bold uppercase tracking-wider">Verified</span>
                            </div>
                            <div className="font-mono text-white/70 text-xs break-all leading-relaxed">
                                {address}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="p-2 space-y-1">
                            <button
                                onClick={handleCopy}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all text-left"
                            >
                                {copied
                                    ? <RiCheckLine className="text-[#C6FF1A] text-base shrink-0" />
                                    : <RiFileCopyLine className="text-base shrink-0" />
                                }
                                <span>{copied ? 'Copied!' : 'Copy Address'}</span>
                            </button>

                            <a
                                href={`https://bscscan.com/address/${address}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all"
                            >
                                <RiExternalLinkLine className="text-base shrink-0" />
                                <span>View on BSCScan</span>
                            </a>

                            <div className="h-px bg-white/6 my-1" />

                            <button
                                onClick={handleDisconnect}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400/70 hover:text-red-400 hover:bg-red-400/8 transition-all text-left"
                            >
                                <RiLogoutBoxLine className="text-base shrink-0" />
                                <span>Disconnect</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Chain warning tooltip */}
            <AnimatePresence>
                {showChainWarning && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="absolute top-full mt-2 right-0 flex items-center gap-2 px-3 py-2 rounded-xl border border-[#FBBF24]/30 bg-[#FBBF24]/10 text-[#FBBF24] text-xs font-semibold whitespace-nowrap z-50"
                    >
                        <RiAlertLine className="text-sm" />
                        Switch to BNB Chain
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
