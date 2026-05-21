'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    RiTrophyLine, RiUserLine, RiRefreshLine,
    RiFlashlightLine, RiBarChartBoxLine,
    RiFireFill, RiSparklingLine,
    RiMedalFill, RiVipCrown2Fill, RiStarSmileFill,
    RiShieldStarFill, RiRocket2Fill, RiAwardFill, RiGlobalLine
} from 'react-icons/ri'
import { getUserLevel } from '@/lib/reputation'

// ─── Pinned elite users (Updated for Light Theme & Icons) ─────────────────────
const ELITE_USERS = [
    {
        id: 'elite-1',
        wallet_address: '0x3fA8B653F9abf91428800C9Dc338d9E3e763A2E1',
        reputation_score: 18420,
        total_contributions: 847,
        level: 5,
        _elite: true,
        _badge: 'Legend',
        _icon: RiVipCrown2Fill,
        _badgeColor: '#FF7100', // Sunrise Orange
        _badgeBg: 'bg-orange-50 border-orange-200',
    },
    {
        id: 'elite-2',
        wallet_address: '0x7dB4C6d3E1f2A8b9C0e5D4F3A2B1C8D7E6F5A4B3',
        reputation_score: 14750,
        total_contributions: 612,
        level: 5,
        _elite: true,
        _badge: 'Elite',
        _icon: RiFireFill,
        _badgeColor: '#F59E0B', // Amber
        _badgeBg: 'bg-amber-50 border-amber-200',
    },
    {
        id: 'elite-3',
        wallet_address: '0xA1B2C3D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0',
        reputation_score: 11380,
        total_contributions: 489,
        level: 5,
        _elite: true,
        _badge: 'Pro',
        _icon: RiRocket2Fill,
        _badgeColor: '#3B82F6', // Blue
        _badgeBg: 'bg-blue-50 border-blue-200',
    },
]

// ─── Level colours (Matches new ReputationCard) ───────────────────────────────
const LEVEL_STYLES = {
    1: { color: '#94A3B8', bg: 'bg-slate-100', border: 'border-slate-200', icon: RiStarSmileFill },
    2: { color: '#10B981', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: RiAwardFill },
    3: { color: '#3B82F6', bg: 'bg-blue-50', border: 'border-blue-200', icon: RiShieldStarFill },
    4: { color: '#F59E0B', bg: 'bg-amber-50', border: 'border-amber-200', icon: RiRocket2Fill },
    5: { color: '#FF7100', bg: 'bg-orange-50', border: 'border-orange-200', icon: RiVipCrown2Fill },
}

// ─── Rank medal / number (Premium Style) ──────────────────────────────────────
function RankBadge({ rank }) {
    if (rank === 1) return (
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-amber-50 border border-amber-200 flex items-center justify-center shadow-sm shrink-0">
            <RiMedalFill className="text-amber-500 text-xl drop-shadow-sm" />
        </div>
    )
    if (rank === 2) return (
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200 flex items-center justify-center shadow-sm shrink-0">
            <RiMedalFill className="text-slate-400 text-xl drop-shadow-sm" />
        </div>
    )
    if (rank === 3) return (
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-100 to-orange-50 border border-orange-200 flex items-center justify-center shadow-sm shrink-0">
            <RiMedalFill className="text-orange-500 text-xl drop-shadow-sm" />
        </div>
    )
    return (
        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
            <span className="text-slate-500 text-xs font-black tracking-tighter">#{rank}</span>
        </div>
    )
}

// ─── Score bar (Light Theme Gradient) ─────────────────────────────────────────
function ScoreBar({ score, maxScore }) {
    const pct = maxScore > 0 ? Math.min(100, (score / maxScore) * 100) : 0
    return (
        <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden mt-2 shadow-inner">
            <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#FF7100] to-[#FF9D4A]"
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
            />
        </div>
    )
}

// ─── Format Helpers ───────────────────────────────────────────────────────────
function formatNum(n) {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
    return String(n)
}

function truncAddr(addr) {
    if (!addr) return '—'
    return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}

// ─── User rank banner (Redesigned as Performance Card) ────────────────────────
function UserRankBanner({ rank, totalUsers, score }) {
    if (!rank) return null
    const percentile = Math.round((1 - rank / totalUsers) * 100)
    const isTop10 = rank <= 10
    const isTop1k = rank <= 1000

    return (
        <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mx-6 mb-2 mt-5 h-[150px] rounded-2xl border overflow-hidden shadow-sm transition-all
                ${isTop10 ? 'border-[#FF7100]/30 bg-orange-50/50' 
                : isTop1k ? 'border-blue-200 bg-blue-50/50' 
                : 'border-slate-200 bg-slate-50/50'}`}
        >
            <div className="px-5 py-4 flex items-center gap-4">
                <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border shadow-sm
                        ${isTop10 ? 'bg-[#FF7100]/10 border-[#FF7100]/20' 
                        : isTop1k ? 'bg-blue-100 border-blue-200' 
                        : 'bg-white border-slate-200'}`}
                >
                    {isTop10 ? <RiFireFill className="text-[#FF7100] text-xl" /> : <RiUserLine className="text-slate-400 text-xl" />}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="text-slate-500 text-[11px] font-bold uppercase tracking-widest">Global Standing</span>
                        {isTop10 && (
                            <span className="px-2 py-0.5 rounded-md bg-[#FF7100] text-white text-[9px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
                                <RiFireFill /> Top 10
                            </span>
                        )}
                        {!isTop10 && isTop1k && (
                            <span className="px-2 py-0.5 rounded-md bg-blue-100 border border-blue-200 text-blue-600 text-[9px] font-black uppercase tracking-wider">
                                Top 1k
                            </span>
                        )}
                    </div>
                    <div className="flex items-baseline gap-2 mt-1">
                        <span
                            className="font-black text-2xl leading-none tracking-tight"
                            style={{ color: isTop10 ? '#FF7100' : isTop1k ? '#3B82F6' : '#1E293B' }}
                        >
                            #{formatNum(rank)}
                        </span>
                        <span className="text-slate-400 text-xs font-medium">of {formatNum(totalUsers)} users</span>
                    </div>
                </div>
                <div className="text-right shrink-0 border-l border-slate-200/60 pl-5">
                    <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Percentile</div>
                    <div className="font-extrabold text-lg" style={{ color: isTop10 ? '#FF7100' : '#3B82F6' }}>
                        Top {100 - percentile < 1 ? '<1' : 100 - percentile}%
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function LeaderboardTable({ currentUserAddress }) {
    const [data, setData] = useState({ users: [], total_users: 0, user_rank: null })
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [showCount, setShowCount] = useState(10)

    const fetchLeaderboard = useCallback(async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true)
        else setLoading(true)
        try {
            const url = currentUserAddress
                ? `/api/leaderboard?address=${currentUserAddress}`
                : '/api/leaderboard'
            const res = await fetch(url)
            const json = await res.json()
            if (Array.isArray(json)) {
                setData({ users: json, total_users: 65432, user_rank: null })
            } else if (json && json.users) {
                setData(json)
            } else {
                setData({ users: [], total_users: 0, user_rank: null })
            }
        } catch (err) {
            console.error('Error fetching leaderboard:', err)
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }, [currentUserAddress])

    useEffect(() => { fetchLeaderboard() }, [fetchLeaderboard])

    const { users = [], total_users, user_rank } = data
    const eliteAddrs = new Set(ELITE_USERS.map(e => e.wallet_address.toLowerCase()))
    const realUsers = users.filter(u => !eliteAddrs.has(u.wallet_address?.toLowerCase()))
    const allUsers = [...ELITE_USERS, ...realUsers]
    const maxScore = ELITE_USERS[0].reputation_score
    const visibleUsers = allUsers.slice(0, showCount + ELITE_USERS.length)

    // ── Loading skeleton (Light Theme) ──
    if (loading) {
        return (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-amber-50 rounded-lg">
                        <RiTrophyLine className="text-amber-500 text-xl" />
                    </div>
                    <h3 className="text-slate-900 font-extrabold text-base">Top Contributors</h3>
                </div>
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="h-16 rounded-2xl bg-slate-100 animate-pulse" style={{ opacity: 1 - i * 0.15 }} />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col max-h-[750px]">

            {/* ── Header ── */}
            <div className="p-6 pb-5 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shadow-sm">
                            <RiTrophyLine className="text-amber-500 text-lg" />
                        </div>
                        <div>
                            <h3 className="text-slate-900 font-extrabold text-base">Top Contributors</h3>
                            <p className="text-slate-500 text-xs font-medium flex items-center gap-1.5 mt-0.5">
                                <RiUserLine className="text-slate-400" />
                                {formatNum(total_users || 65000)} global participants
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => fetchLeaderboard(true)}
                        disabled={refreshing}
                        className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-[#FF7100] hover:border-[#FF7100]/30 shadow-sm transition-all disabled:opacity-50"
                        title="Refresh Leaderboard"
                    >
                        <RiRefreshLine className={`text-base ${refreshing ? 'animate-spin text-[#FF7100]' : ''}`} />
                    </button>
                </div>

                {/* Community Stats Row */}
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: 'Network Size', value: formatNum(total_users || 65000), icon: RiGlobalLine, color: '#3B82F6', bg: 'bg-blue-50 border-blue-200' },
                        { label: 'Top Score', value: formatNum(maxScore), icon: RiFlashlightLine, color: '#FF7100', bg: 'bg-orange-50 border-orange-200' },
                        { label: 'Your Rank', value: user_rank ? `#${formatNum(user_rank)}` : '—', icon: RiBarChartBoxLine, color: '#F59E0B', bg: 'bg-amber-50 border-amber-200' },
                    ].map(s => {
                        const Icon = s.icon
                        return (
                            <div key={s.label} className="rounded-2xl bg-white border border-slate-200 px-3 py-4 text-center shadow-sm">
                                <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center border ${s.bg}`}>
                                    <Icon style={{ color: s.color }} className="text-sm" />
                                </div>
                                <div className="font-extrabold text-slate-800 text-base leading-none tracking-tight">{s.value}</div>
                                <div className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mt-1.5">{s.label}</div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* ── User rank banner ── */}
            <UserRankBanner rank={user_rank} totalUsers={total_users} score={0} />

            {/* ── Leaderboard rows ── */}
            <div className="px-6 py-4 space-y-3 flex-1 overflow-y-auto custom-scrollbar">
                <AnimatePresence mode="popLayout">
                    {visibleUsers.length > 0 ? visibleUsers.map((user, index) => {
                        const rank = index + 1
                        const isCurrentUser = user.wallet_address?.toLowerCase() === currentUserAddress?.toLowerCase()
                        const levelInfo = getUserLevel(user.reputation_score || 0)
                        const lvlStyle = LEVEL_STYLES[levelInfo.level] || LEVEL_STYLES[1]
                        const LevelIcon = lvlStyle.icon
                        const isElite = !!user._elite
                        const EliteIcon = user._icon
                        const showDivider = index === ELITE_USERS.length

                        return (
                            <div key={user.id || index}>
                                {showDivider && (
                                    <div className="flex items-center gap-4 py-3 opacity-60">
                                        <div className="flex-1 h-px bg-slate-200" />
                                        <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest shrink-0">Community Rankings</span>
                                        <div className="flex-1 h-px bg-slate-200" />
                                    </div>
                                )}
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.04 }}
                                    className={`rounded-2xl border p-4 transition-all duration-300 shadow-sm hover:shadow-md
                                    ${isCurrentUser
                                            ? 'border-[#FF7100]/40 bg-orange-50/40'
                                            : isElite
                                                ? `${user._badgeBg} bg-opacity-30`
                                                : 'border-slate-200 bg-white hover:border-slate-300'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        {/* Rank badge */}
                                        <RankBadge rank={rank} />

                                        {/* Address + details */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap mb-1">
                                                <span className={`font-extrabold font-mono text-[15px] truncate ${isCurrentUser ? 'text-[#FF7100]' : 'text-slate-800'}`}>
                                                    {truncAddr(user.wallet_address)}
                                                </span>
                                                {isCurrentUser && (
                                                    <span className="shrink-0 px-2 py-0.5 rounded-md bg-[#FF7100] text-white text-[9px] font-black uppercase tracking-wider shadow-sm">
                                                        You
                                                    </span>
                                                )}
                                                {isElite && (
                                                    <span
                                                        className="shrink-0 px-2 py-0.5 rounded-md border text-[9px] font-bold flex items-center gap-1 shadow-sm"
                                                        style={{
                                                            color: user._badgeColor,
                                                            borderColor: `${user._badgeColor}40`,
                                                            background: `${user._badgeColor}15`,
                                                        }}
                                                    >
                                                        {EliteIcon && <EliteIcon />} {user._badge}
                                                    </span>
                                                )}
                                                {!isElite && rank === 1 && (
                                                    <span className="shrink-0 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-600 text-[9px] font-bold flex items-center gap-1 shadow-sm">
                                                        <RiFireFill /> Leader
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3 mt-1.5">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[10px] font-bold shadow-sm ${lvlStyle.bg} ${lvlStyle.border}`}
                                                    style={{ color: lvlStyle.color }}
                                                >
                                                    <LevelIcon className="text-xs" /> Lv.{levelInfo.level}
                                                </span>
                                                <div className="w-1 h-1 rounded-full bg-slate-200" />
                                                <span className="text-slate-500 text-[11px] font-semibold">{user.total_contributions || 0} tasks completed</span>
                                            </div>
                                            <ScoreBar score={user.reputation_score || 0} maxScore={maxScore} />
                                        </div>

                                        {/* Score */}
                                        <div className="text-right shrink-0 border-l border-slate-100 pl-4 ml-2">
                                            <div
                                                className="font-semibold text-xl leading-none"
                                                style={{ color: isCurrentUser ? '#FF7100' : isElite ? user._badgeColor : '#1E293B' }}
                                            >
                                                {formatNum(user.reputation_score || 0)}
                                            </div>
                                            <div className="text-slate-400 text-[9px] font-semibold mt-1.5">points</div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        )
                    }) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto mb-4 shadow-sm">
                                <RiTrophyLine className="text-slate-300 text-3xl" />
                            </div>
                            <p className="text-slate-800 font-extrabold text-base">No contributors yet</p>
                            <p className="text-slate-500 text-sm font-medium mt-1">Be the first to climb the ranks!</p>
                        </motion.div>
                    )}
                </AnimatePresence >

                {/* Show more */}
                {
                    users.length > showCount && (
                        <button
                            onClick={() => setShowCount(c => c + 10)}
                            className="w-full py-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-slate-500 hover:text-slate-800 hover:bg-slate-100 text-xs font-bold transition-all mt-4 shadow-sm"
                        >
                            Load More Rankings ({allUsers.length - (showCount + ELITE_USERS.length)} remaining)
                        </button>
                    )
                }
            </div>

            {/* ── Footer ── */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2 text-slate-500 text-[11px] font-semibold">
                    <RiSparklingLine className="text-[#FF7100] text-sm" />
                    <span>Real-time · BSC Mainnet</span>
                </div>
                {user_rank && (
                    <span className="text-slate-600 text-[11px] font-bold">
                        Rank #{formatNum(user_rank)} of {formatNum(total_users)}
                    </span>
                )}
            </div>

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