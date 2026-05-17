'use client'

import { useAccount, useDisconnect } from 'wagmi'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    RiWalletLine, RiLogoutBoxLine, RiShieldCheckLine,
    RiFileCopyLine, RiCheckLine,
    RiExternalLinkLine, RiAlertLine,
} from 'react-icons/ri'

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

    const [showChainWarning, setShowChainWarning] = useState(false)
    const [showDropdown, setShowDropdown] = useState(false)
    const [copied, setCopied] = useState(false)
    const dropdownRef = useRef(null)

    // Chain check
    useEffect(() => {
        if (isConnected && chain) {
            setShowChainWarning(chain.id !== 56 && chain.id !== 97) // BSC Mainnet & Testnet
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

    const handleDisconnect = () => {
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
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => open()}
                className="relative flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-[14px] overflow-hidden group transition-all shadow-[0_4px_15px_-4px_rgba(255,113,0,0.4)] hover:shadow-[0_8px_20px_-6px_rgba(255,113,0,0.5)]"
                style={{
                    background: 'linear-gradient(135deg, #FF8A33 0%, #FF7100 100%)',
                    color: '#FFFFFF',
                    border: '1px solid rgba(255,255,255,0.2)'
                }}
            >
                {/* Fast Shine Sweep */}
                <span
                    className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-[1.2s] ease-in-out bg-gradient-to-r from-transparent via-white/30 to-transparent"
                />
                <RiWalletLine className="text-base shrink-0 relative z-10" />
                <span className="relative z-10 tracking-wide drop-shadow-sm">Connect</span>
            </motion.button>
        )
    }

    // ── Connected — show address + dropdown ────────────────────────────────
    return (
        <div className="relative" ref={dropdownRef}>
            {/* Main connected pill */}
            <motion.button
                whileHover={{ scale: 1.02, backgroundColor: '#F8FAFC' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowDropdown(v => !v)}
                className="flex items-center gap-2.5 sm:px-4 px-3 py-2 rounded-xl border font-bold sm:text-[13px] text-[11px] transition-all bg-white"
                style={{
                    color: '#475569', // slate-600
                    borderColor: showDropdown ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.06)',
                    boxShadow: showDropdown ? '0 4px 15px -5px rgba(0,0,0,0.05)' : '0 2px 8px -2px rgba(0,0,0,0.02)',
                }}
            >
                {/* Active Network Status Dot */}
                <span className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-xl bg-[#10B981] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]" />
                </span>
                <span className="font-mono tracking-tight text-slate-700">{truncAddr(address)}</span>
                
                {/* Chevron */}
                <motion.span
                    animate={{ rotate: showDropdown ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-slate-400 text-xs ml-0.5"
                >
                    ▾
                </motion.span>
            </motion.button>

            {/* Premium Light Dropdown */}
            <AnimatePresence>
                {showDropdown && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-full right-0 mt-3 w-64 rounded-[1.25rem] border overflow-hidden z-50 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]"
                        style={{
                            background: 'rgba(255,255,255,0.95)',
                            borderColor: 'rgba(0,0,0,0.08)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)'
                        }}
                    >
                        {/* Address block header */}
                        <div className="px-5 pt-5 pb-4 border-b border-slate-100 bg-slate-50/50">
                            <div className="flex items-center gap-2 mb-1.5">
                                <RiShieldCheckLine className="text-[#10B981] text-sm" />
                                <span className="text-[#10B981] text-[10px] font-semibold">Network Connected</span>
                            </div>
                            <div className="font-mono text-slate-600 text-xs break-all leading-relaxed font-medium">
                                {address}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="p-2 space-y-1">
                            <button
                                onClick={handleCopy}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all text-left"
                            >
                                {copied
                                    ? <RiCheckLine className="text-[#10B981] text-base shrink-0" />
                                    : <RiFileCopyLine className="text-base shrink-0" />
                                }
                                <span>{copied ? 'Address Copied!' : 'Copy Wallet Address'}</span>
                            </button>

                            <a
                                href={`https://bscscan.com/address/${address}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all"
                            >
                                <RiExternalLinkLine className="text-base shrink-0" />
                                <span>View on BSCScan</span>
                            </a>

                            <div className="h-px bg-slate-100 my-2 mx-2" />

                            <button
                                onClick={handleDisconnect}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-red-500/80 hover:text-red-600 hover:bg-red-50 transition-all text-left"
                            >
                                <RiLogoutBoxLine className="text-base shrink-0" />
                                <span>Disconnect Wallet</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Chain warning tooltip (Updated for Light Theme) */}
            <AnimatePresence>
                {showChainWarning && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="absolute top-full mt-3 right-0 flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#F59E0B]/30 bg-[#FFFBEB] text-[#D97706] text-xs font-bold whitespace-nowrap z-50 shadow-md"
                    >
                        <RiAlertLine className="text-sm" />
                        Switch to BNB Smart Chain
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}