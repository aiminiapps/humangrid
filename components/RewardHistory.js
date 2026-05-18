'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    RiHistoryLine, RiCheckDoubleLine, RiTimeLine, RiCloseLine,
    RiCoinLine, RiExternalLinkLine, RiFileCopyLine, RiCheckLine,
    RiRefreshLine, RiLoader4Line, RiSparklingLine,
    RiShieldCheckLine, RiArrowRightUpLine
} from 'react-icons/ri'

// ─── Status Config (Premium Light Theme) ──────────────────────────────────────
const STATUS_CONFIG = {
    confirmed: {
        label: 'Confirmed',
        icon: RiCheckDoubleLine,
        color: '#10B981', // Emerald
        bg: 'bg-emerald-50 border-emerald-200',
        dot: 'bg-emerald-500',
    },
    sent: {
        label: 'Sent',
        icon: RiCheckLine,
        color: '#3B82F6', // Blue
        bg: 'bg-blue-50 border-blue-200',
        dot: 'bg-blue-500',
    },
    pending: {
        label: 'Pending',
        icon: RiTimeLine,
        color: '#F59E0B', // Amber
        bg: 'bg-amber-50 border-amber-200',
        dot: 'bg-amber-500 animate-pulse',
    },
    failed: {
        label: 'Failed',
        icon: RiCloseLine,
        color: '#EF4444', // Red
        bg: 'bg-red-50 border-red-200',
        dot: 'bg-red-500',
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
            className="p-1 rounded-md hover:bg-slate-100 transition-all text-slate-400 hover:text-slate-700"
            title="Copy to clipboard"
        >
            {copied
                ? <RiCheckLine className="text-emerald-500 text-sm" />
                : <RiFileCopyLine className="text-sm" />
            }
        </button>
    )
}

// ─── Reward Row (Ledger Style) ────────────────────────────────────────────────
function RewardRow({ reward, index }) {
    const [expanded, setExpanded] = useState(false)
    const status = STATUS_CONFIG[reward.status] || STATUS_CONFIG.pending
    const StatusIcon = status.icon

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`rounded-2xl border transition-all duration-300 overflow-hidden shadow-sm
                ${expanded ? 'border-[#FF7100]/30 bg-orange-50/30' : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'}`}
        >
            {/* Main Row */}
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center justify-between p-4 text-left group"
            >
                <div className="flex items-center gap-4">
                    {/* Status dot + icon */}
                    <div className="relative shrink-0">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm ${status.bg}`}>
                            <StatusIcon style={{ color: status.color }} className="text-lg" />
                        </div>
                        <div className={`absolute -top-1 -right-1 w-2.5 h-2.5 border-2 border-white rounded-full ${status.dot}`} />
                    </div>

                    {/* Amount + time */}
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className={`font-black text-lg ${expanded ? 'text-[#FF7100]' : 'text-slate-800 transition-colors group-hover:text-[#FF7100]'}`}>
                                +{reward.amount}
                            </span>
                            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">HGAI</span>
                            
                            {reward.ai_powered && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-blue-600 text-[9px] font-bold uppercase tracking-wider ml-1">
                                    <RiSparklingLine /> AI
                                </span>
                            )}
                        </div>
                        <span className="text-slate-400 text-[11px] font-medium mt-0.5">{timeAgo(reward.created_at)}</span>
                    </div>
                </div>

                {/* Right Side: Status Badge */}
                <div className="flex flex-col items-end gap-2">
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest shadow-sm ${status.bg}`}
                        style={{ color: status.color }}>
                        {status.label}
                    </div>
                    {reward.tx_hash && (
                        <span className="text-slate-300 text-[10px] font-mono">{truncateHash(reward.tx_hash, 4, 4)}</span>
                    )}
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
                        className="border-t border-[#FF7100]/10 px-5 pb-5 pt-4 space-y-4 bg-white/50"
                    >
                        <div className="grid grid-cols-2 gap-4">
                            {/* Amount Detail */}
                            <div>
                                <span className="block text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Total Amount</span>
                                <span className="text-slate-800 font-extrabold text-sm">{reward.amount} HGAI</span>
                            </div>
                            
                            {/* Date Detail */}
                            <div>
                                <span className="block text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Date Processed</span>
                                <span className="text-slate-600 text-xs font-medium">
                                    {reward.created_at ? new Date(reward.created_at).toLocaleString() : '—'}
                                </span>
                            </div>
                        </div>

                        {/* TX Hash Row */}
                        {reward.tx_hash && (
                            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                                <div>
                                    <span className="block text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Transaction Hash</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-600 text-xs font-mono bg-slate-100 px-2 py-1 rounded-md">{truncateHash(reward.tx_hash, 10, 8)}</span>
                                        <CopyButton text={reward.tx_hash} />
                                    </div>
                                </div>
                                
                                <a
                                    href={`https://bscscan.com/tx/${reward.tx_hash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={e => e.stopPropagation()}
                                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-[11px] font-bold uppercase tracking-wider hover:bg-slate-100 hover:text-slate-900 transition-all shadow-sm"
                                >
                                    Verify
                                    <RiArrowRightUpLine className="text-sm" />
                                </a>
                            </div>
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
    const [filter, setFilter] = useState('all') 

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

    const filtered = filter === 'all' ? rewards : rewards.filter(r => r.status === filter)

    // ── Loading skeleton (Light Theme) ──
    if (loading) {
        return (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-slate-100 rounded-lg">
                        <RiHistoryLine className="text-slate-400 text-xl" />
                    </div>
                    <h3 className="text-slate-900 font-extrabold text-base">Recent Rewards</h3>
                </div>
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-20 rounded-2xl bg-slate-100 animate-pulse" />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col max-h-[750px]">
            {/* ── Header Area ── */}
            <div className="p-6 pb-5 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div>
                            <h3 className="text-slate-900 font-extrabold text-base">Ledger History</h3>
                            <p className="text-slate-500 text-xs font-medium mt-0.5">{rewards.length} tracked transactions</p>
                        </div>
                    </div>
                    <button
                        onClick={() => fetchRewards(true)}
                        disabled={refreshing}
                        className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-[#FF7100] hover:border-[#FF7100]/30 shadow-sm transition-all disabled:opacity-50"
                        title="Refresh Ledger"
                    >
                        <RiRefreshLine className={`text-base ${refreshing ? 'animate-spin text-[#FF7100]' : ''}`} />
                    </button>
                </div>

                {/* KPI Stats Row */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-2xl bg-white border border-[#FF7100]/20 p-4 shadow-[0_2px_10px_rgba(255,113,0,0.04)] relative overflow-hidden">
                        <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-[#FF7100]/5 rounded-full blur-xl" />
                        <div className="text-[#FF7100] font-black text-2xl leading-none tracking-tight">{totalEarned}</div>
                        <div className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mt-1.5">Total HGAI</div>
                    </div>
                    <div className="rounded-2xl bg-white border border-emerald-200 p-4 shadow-sm relative overflow-hidden">
                        <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl" />
                        <div className="text-emerald-500 font-black text-2xl leading-none tracking-tight">{confirmedCount}</div>
                        <div className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mt-1.5">Confirmed</div>
                    </div>
                    <div className="rounded-2xl bg-white border border-amber-200 p-4 shadow-sm relative overflow-hidden">
                        <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-amber-500/5 rounded-full blur-xl" />
                        <div className="text-amber-500 font-black text-2xl leading-none tracking-tight">{pendingCount}</div>
                        <div className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mt-1.5">Pending</div>
                    </div>
                </div>
            </div>

            {/* ── Filter Tabs ── */}
            <div className="flex gap-2 px-6 py-4 border-b border-slate-100 bg-white z-10">
                {['all', 'sent', 'confirmed', 'pending'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all
                            ${filter === f
                                ? 'bg-[#FF7100] text-white shadow-md'
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800'
                            }`}
                    >
                        {f === 'all' ? `All (${rewards.length})` : f}
                    </button>
                ))}
            </div>

            {/* ── Reward List (Scrollable Area) ── */}
            <div className="flex-1 p-6 space-y-3 overflow-y-auto custom-scrollbar">
                <AnimatePresence mode="popLayout">
                    {filtered.length > 0 ? (
                        filtered.map((reward, i) => (
                            <RewardRow key={reward.id || i} reward={reward} index={i} />
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto mb-4 shadow-sm">
                                <RiCoinLine className="text-slate-300 text-3xl" />
                            </div>
                            <p className="text-slate-800 font-extrabold text-base">No ledger entries yet</p>
                            <p className="text-slate-500 text-sm font-medium mt-1">Complete tasks to start earning rewards.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ── Footer ── */}
            {rewards.length > 0 && (
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
                        <RiShieldCheckLine className="text-emerald-500 text-sm" />
                        <span>BSC Mainnet Secure</span>
                    </div>
                    <a
                        href={`https://bscscan.com/address/${userAddress}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-slate-500 hover:text-[#FF7100] text-[11px] font-bold uppercase tracking-widest transition-colors"
                    >
                        Open Scanner
                        <RiExternalLinkLine className="text-sm" />
                    </a>
                </div>
            )}
            
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #E2E8F0;
                    border-radius: 10px;
                }
            `}</style>
        </div>
    )
}