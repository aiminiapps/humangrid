'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    RiHistoryLine, RiCheckDoubleLine, RiTimeLine, RiCloseLine,
    RiCoinLine, RiExternalLinkLine, RiFileCopyLine, RiCheckLine,
    RiRefreshLine, RiLoader4Line, RiArrowUpLine, RiSparklingLine,
    RiShieldCheckLine, RiErrorWarningLine, RiBarChartLine,
} from 'react-icons/ri'

const STATUS_CONFIG = {
    confirmed: {
        label: 'Confirmed',
        icon: RiCheckDoubleLine,
        color: '#34D399',
        bg: 'bg-[#34D399]/10 border-[#34D399]/30',
        dot: 'bg-[#34D399]',
    },
    sent: {
        label: 'Sent',
        icon: RiCheckLine,
        color: '#C6FF1A',
        bg: 'bg-[#C6FF1A]/10 border-[#C6FF1A]/30',
        dot: 'bg-[#C6FF1A]',
    },
    pending: {
        label: 'Pending',
        icon: RiTimeLine,
        color: '#FBBF24',
        bg: 'bg-[#FBBF24]/10 border-[#FBBF24]/30',
        dot: 'bg-[#FBBF24] animate-pulse',
    },
    failed: {
        label: 'Failed',
        icon: RiCloseLine,
        color: '#FF6B35',
        bg: 'bg-[#FF6B35]/10 border-[#FF6B35]/30',
        dot: 'bg-[#FF6B35]',
    },
}

function truncateHash(hash, start = 6, end = 4) {
    if (!hash || hash.length < start + end + 3) return hash || '—'
    return `${hash.slice(0, start)}...${hash.slice(-end)}`
}

function timeAgo(dateStr) {
    if (!dateStr) return '—'
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    const hrs = Math.floor(mins / 60)
    const days = Math.floor(hrs / 24)
    if (days > 0) return `${days}d ago`
    if (hrs > 0) return `${hrs}h ago`
    if (mins > 0) return `${mins}m ago`
    return 'Just now'
}

// ─── Copy Button ──────────────────────────────────────────────────────────────
function CopyButton({ text }) {
    const [copied, setCopied] = useState(false)
    const handleCopy = async (e) => {
        e.stopPropagation()
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }
    return (
        <button
            onClick={handleCopy}
            className="p-1 rounded-md hover:bg-white/10 transition-all text-white/30 hover:text-white/70"
            title="Copy to clipboard"
        >
            {copied
                ? <RiCheckLine className="text-[#34D399] text-xs" />
                : <RiFileCopyLine className="text-xs" />
            }
        </button>
    )
}

// ─── Reward Row ───────────────────────────────────────────────────────────────
function RewardRow({ reward, index }) {
    const [expanded, setExpanded] = useState(false)
    const status = STATUS_CONFIG[reward.status] || STATUS_CONFIG.pending
    const StatusIcon = status.icon

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className={`rounded-xl border transition-all duration-200 overflow-hidden
                ${expanded ? 'border-white/15 bg-white/4' : 'border-white/6 bg-white/2 hover:border-white/12 hover:bg-white/3'}`}
        >
            {/* Main Row */}
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center gap-3 p-4 text-left"
            >
                {/* Status dot + icon */}
                <div className="relative shrink-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${status.bg}`}>
                        <StatusIcon style={{ color: status.color }} className="text-base" />
                    </div>
                    <div className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full ${status.dot}`} />
                </div>

                {/* Amount + time */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="text-[#C6FF1A] font-black text-base">+{reward.amount}</span>
                        <span className="text-white/40 text-xs font-medium">SYNTR</span>
                        {reward.ai_powered && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-[#60A5FA]/10 border border-[#60A5FA]/20 text-[#60A5FA] text-[10px] font-semibold">
                                <RiSparklingLine className="text-[9px]" />
                                AI
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-white/25 text-xs">{timeAgo(reward.created_at)}</span>
                        {reward.tx_hash && (
                            <>
                                <span className="text-white/15 text-xs">·</span>
                                <span className="text-white/30 text-xs font-mono">{truncateHash(reward.tx_hash)}</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Status badge */}
                <div className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold ${status.bg}`}
                    style={{ color: status.color }}>
                    {status.label}
                </div>
            </button>

            {/* Expanded Details */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-white/6 px-4 pb-4 pt-3 space-y-3"
                    >
                        {/* TX Hash */}
                        {reward.tx_hash && (
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-white/30 text-xs font-semibold uppercase tracking-wider">Transaction</span>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-white/60 text-xs font-mono">{truncateHash(reward.tx_hash, 10, 8)}</span>
                                    <CopyButton text={reward.tx_hash} />
                                    <a
                                        href={`https://bscscan.com/tx/${reward.tx_hash}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={e => e.stopPropagation()}
                                        className="p-1 rounded-md hover:bg-white/10 transition-all text-white/30 hover:text-[#C6FF1A]"
                                        title="View on BSCScan"
                                    >
                                        <RiExternalLinkLine className="text-xs" />
                                    </a>
                                </div>
                            </div>
                        )}

                        {/* Amount detail */}
                        <div className="flex items-center justify-between">
                            <span className="text-white/30 text-xs font-semibold uppercase tracking-wider">Amount</span>
                            <span className="text-[#C6FF1A] font-bold text-sm">{reward.amount} SYNTR</span>
                        </div>

                        {/* Date */}
                        <div className="flex items-center justify-between">
                            <span className="text-white/30 text-xs font-semibold uppercase tracking-wider">Date</span>
                            <span className="text-white/50 text-xs">
                                {reward.created_at ? new Date(reward.created_at).toLocaleString() : '—'}
                            </span>
                        </div>

                        {/* Status */}
                        <div className="flex items-center justify-between">
                            <span className="text-white/30 text-xs font-semibold uppercase tracking-wider">Status</span>
                            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold ${status.bg}`}
                                style={{ color: status.color }}>
                                <StatusIcon className="text-xs" />
                                {status.label}
                            </div>
                        </div>

                        {/* BSCScan link button */}
                        {reward.tx_hash && (
                            <a
                                href={`https://bscscan.com/tx/${reward.tx_hash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={e => e.stopPropagation()}
                                className="flex items-center justify-center gap-2 w-full py-2 rounded-xl border border-[#C6FF1A]/20 bg-[#C6FF1A]/5 text-[#C6FF1A] text-xs font-semibold hover:bg-[#C6FF1A]/10 transition-all mt-1"
                            >
                                <RiExternalLinkLine />
                                View on BSCScan
                                <RiExternalLinkLine className="opacity-50" />
                            </a>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function RewardHistory({ userAddress }) {
    const [rewards, setRewards] = useState([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [filter, setFilter] = useState('all') // all | confirmed | pending | sent

    const fetchRewards = useCallback(async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true)
        else setLoading(true)
        try {
            const res = await fetch(`/api/rewards?address=${userAddress}`)
            const data = await res.json()
            setRewards(Array.isArray(data) ? data : [])
        } catch (err) {
            console.error('Error fetching rewards:', err)
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }, [userAddress])

    useEffect(() => {
        if (userAddress) fetchRewards()
    }, [userAddress, fetchRewards])

    // Computed stats
    const totalEarned = rewards.reduce((sum, r) => sum + (r.amount || 0), 0)
    const confirmedCount = rewards.filter(r => r.status === 'confirmed' || r.status === 'sent').length
    const pendingCount = rewards.filter(r => r.status === 'pending').length

    // Filtered list
    const filtered = filter === 'all' ? rewards : rewards.filter(r => r.status === filter)

    // ── Loading skeleton ──
    if (loading) {
        return (
            <div className="rounded-2xl border border-white/8 bg-white/2 p-5">
                <div className="flex items-center gap-2 mb-5">
                    <RiHistoryLine className="text-[#C6FF1A] text-lg" />
                    <h3 className="text-white font-bold">Recent Rewards</h3>
                </div>
                <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-16 rounded-xl bg-white/3 animate-pulse" />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="rounded-2xl border border-white/8 bg-white/2 overflow-hidden">
            {/* ── Header ── */}
            <div className="px-5 pt-5 pb-4 border-b border-white/6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-[#C6FF1A]/10 border border-[#C6FF1A]/20 flex items-center justify-center">
                            <RiHistoryLine className="text-[#C6FF1A] text-sm" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-sm">Recent Rewards</h3>
                            <p className="text-white/30 text-xs">{rewards.length} transactions</p>
                        </div>
                    </div>
                    <button
                        onClick={() => fetchRewards(true)}
                        disabled={refreshing}
                        className="p-2 rounded-xl border border-white/8 bg-white/3 text-white/40 hover:text-white/70 hover:border-white/15 transition-all disabled:opacity-40"
                        title="Refresh"
                    >
                        <RiRefreshLine className={`text-sm ${refreshing ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-xl bg-[#C6FF1A]/8 border border-[#C6FF1A]/15 p-3 text-center">
                        <div className="text-[#C6FF1A] font-black text-lg leading-none">{totalEarned}</div>
                        <div className="text-white/30 text-[10px] font-semibold uppercase tracking-wider mt-1">Total SYNTR</div>
                    </div>
                    <div className="rounded-xl bg-[#34D399]/8 border border-[#34D399]/15 p-3 text-center">
                        <div className="text-[#34D399] font-black text-lg leading-none">{confirmedCount}</div>
                        <div className="text-white/30 text-[10px] font-semibold uppercase tracking-wider mt-1">Confirmed</div>
                    </div>
                    <div className="rounded-xl bg-[#FBBF24]/8 border border-[#FBBF24]/15 p-3 text-center">
                        <div className="text-[#FBBF24] font-black text-lg leading-none">{pendingCount}</div>
                        <div className="text-white/30 text-[10px] font-semibold uppercase tracking-wider mt-1">Pending</div>
                    </div>
                </div>
            </div>

            {/* ── Filter Tabs ── */}
            <div className="flex gap-1.5 px-5 py-3 border-b border-white/6">
                {['all', 'sent', 'confirmed', 'pending'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all
                            ${filter === f
                                ? 'bg-[#C6FF1A]/15 border border-[#C6FF1A]/30 text-[#C6FF1A]'
                                : 'text-white/30 hover:text-white/60'
                            }`}
                    >
                        {f === 'all' ? `All (${rewards.length})` : f}
                    </button>
                ))}
            </div>

            {/* ── Reward List ── */}
            <div className="p-4 space-y-2 max-h-[420px] overflow-y-auto scrollbar-hide">
                <AnimatePresence mode="popLayout">
                    {filtered.length > 0 ? (
                        filtered.map((reward, i) => (
                            <RewardRow key={reward.id || i} reward={reward} index={i} />
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-10"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-white/3 border border-white/8 flex items-center justify-center mx-auto mb-3">
                                <RiCoinLine className="text-white/20 text-2xl" />
                            </div>
                            <p className="text-white/40 font-medium text-sm">No rewards yet</p>
                            <p className="text-white/20 text-xs mt-1">Complete tasks to start earning SYNTR</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ── Footer ── */}
            {rewards.length > 0 && (
                <div className="px-5 py-3 border-t border-white/6 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-white/25 text-xs">
                        <RiShieldCheckLine className="text-[#34D399] text-xs" />
                        <span>Verified on BSC Mainnet</span>
                    </div>
                    <a
                        href={`https://bscscan.com/address/${userAddress}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[#C6FF1A]/60 hover:text-[#C6FF1A] text-xs font-semibold transition-colors"
                    >
                        View all on BSCScan
                        <RiExternalLinkLine className="text-xs" />
                    </a>
                </div>
            )}
        </div>
    )
}
