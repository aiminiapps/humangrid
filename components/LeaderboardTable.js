'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    RiTrophyLine, RiMedalLine, RiUserLine, RiRefreshLine,
    RiFlashlightLine, RiArrowUpLine, RiArrowDownLine,
    RiShieldStarLine, RiGlobalLine, RiBarChartBoxLine,
    RiFireLine, RiSparklingLine,
} from 'react-icons/ri'
import { getUserLevel } from '@/lib/reputation'

// ─── Pinned elite users (always shown at top) ─────────────────────────────────
const ELITE_USERS = [
    {
        id: 'elite-1',
        wallet_address: '0x3fA8B653F9abf91428800C9Dc338d9E3e763A2E1',
        reputation_score: 18420,
        total_contributions: 847,
        level: 5,
        _elite: true,
        _badge: '👑 Legend',
        _badgeColor: '#C6FF1A',
    },
    {
        id: 'elite-2',
        wallet_address: '0x7dB4C6d3E1f2A8b9C0e5D4F3A2B1C8D7E6F5A4B3',
        reputation_score: 14750,
        total_contributions: 612,
        level: 5,
        _elite: true,
        _badge: '🔥 Elite',
        _badgeColor: '#FBBF24',
    },
    {
        id: 'elite-3',
        wallet_address: '0xA1B2C3D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0',
        reputation_score: 11380,
        total_contributions: 489,
        level: 5,
        _elite: true,
        _badge: '⚡ Pro',
        _badgeColor: '#A78BFA',
    },
]

// ─── Level colours (matches ReputationCard) ───────────────────────────────────
const LEVEL_STYLES = {
    1: { color: '#9CA3AF', bg: 'bg-[#9CA3AF]/10', border: 'border-[#9CA3AF]/20', icon: '🌱' },
    2: { color: '#34D399', bg: 'bg-[#34D399]/10', border: 'border-[#34D399]/20', icon: '⚡' },
    3: { color: '#60A5FA', bg: 'bg-[#60A5FA]/10', border: 'border-[#60A5FA]/20', icon: '🛡️' },
    4: { color: '#A78BFA', bg: 'bg-[#A78BFA]/10', border: 'border-[#A78BFA]/20', icon: '🏗️' },
    5: { color: '#C6FF1A', bg: 'bg-[#C6FF1A]/10', border: 'border-[#C6FF1A]/20', icon: '👑' },
}

// ─── Rank medal / number ──────────────────────────────────────────────────────
function RankBadge({ rank }) {
    if (rank === 1) return (
        <div className="w-8 h-8 rounded-xl bg-[#FBBF24]/15 border border-[#FBBF24]/30 flex items-center justify-center"
            style={{ boxShadow: '0 0 10px rgba(251,191,36,0.25)' }}>
            <span className="text-sm">🥇</span>
        </div>
    )
    if (rank === 2) return (
        <div className="w-8 h-8 rounded-xl bg-[#9CA3AF]/15 border border-[#9CA3AF]/30 flex items-center justify-center">
            <span className="text-sm">🥈</span>
        </div>
    )
    if (rank === 3) return (
        <div className="w-8 h-8 rounded-xl bg-[#CD7F32]/15 border border-[#CD7F32]/30 flex items-center justify-center">
            <span className="text-sm">🥉</span>
        </div>
    )
    return (
        <div className="w-8 h-8 rounded-xl bg-white/4 border border-white/8 flex items-center justify-center">
            <span className="text-white/40 text-xs font-black">#{rank}</span>
        </div>
    )
}

// ─── Score bar ────────────────────────────────────────────────────────────────
function ScoreBar({ score, maxScore }) {
    const pct = maxScore > 0 ? Math.min(100, (score / maxScore) * 100) : 0
    return (
        <div className="h-1 rounded-full bg-white/5 overflow-hidden mt-1.5">
            <motion.div
                className="h-full rounded-full bg-[#C6FF1A]"
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                style={{ opacity: 0.6 + pct / 250 }}
            />
        </div>
    )
}

// ─── Format large numbers ─────────────────────────────────────────────────────
function formatNum(n) {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
    return String(n)
}

function truncAddr(addr) {
    if (!addr) return '—'
    return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}

// ─── User rank banner ─────────────────────────────────────────────────────────
function UserRankBanner({ rank, totalUsers, score }) {
    if (!rank) return null
    const percentile = Math.round((1 - rank / totalUsers) * 100)
    const isTop10 = rank <= 10
    const isTop1k = rank <= 1000

    return (
        <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-5 mb-0 mt-4 rounded-xl border overflow-hidden"
            style={{
                borderColor: isTop10 ? 'rgba(198,255,26,0.35)' : isTop1k ? 'rgba(96,165,250,0.25)' : 'rgba(255,255,255,0.1)',
                background: isTop10 ? 'rgba(198,255,26,0.06)' : isTop1k ? 'rgba(96,165,250,0.05)' : 'rgba(255,255,255,0.02)',
            }}
        >
            <div className="px-4 py-3 flex items-center gap-3">
                <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                        background: isTop10 ? 'rgba(198,255,26,0.12)' : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${isTop10 ? 'rgba(198,255,26,0.3)' : 'rgba(255,255,255,0.1)'}`,
                    }}
                >
                    {isTop10 ? <RiFireLine className="text-[#C6FF1A] text-base" /> : <RiUserLine className="text-white/40 text-base" />}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="text-white/50 text-xs">Your Global Rank</span>
                        {isTop10 && (
                            <span className="px-1.5 py-0.5 rounded-md bg-[#C6FF1A]/15 border border-[#C6FF1A]/30 text-[#C6FF1A] text-[9px] font-bold uppercase tracking-wider">
                                🔥 Top 10
                            </span>
                        )}
                        {!isTop10 && isTop1k && (
                            <span className="px-1.5 py-0.5 rounded-md bg-[#60A5FA]/15 border border-[#60A5FA]/30 text-[#60A5FA] text-[9px] font-bold uppercase tracking-wider">
                                Top 1k
                            </span>
                        )}
                    </div>
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span
                            className="font-black text-xl leading-none"
                            style={{ color: isTop10 ? '#C6FF1A' : isTop1k ? '#60A5FA' : 'white' }}
                        >
                            #{formatNum(rank)}
                        </span>
                        <span className="text-white/25 text-xs">of {formatNum(totalUsers)} users</span>
                    </div>
                </div>
                <div className="text-right shrink-0">
                    <div className="text-white/30 text-[10px] font-semibold uppercase tracking-wider">Percentile</div>
                    <div className="font-black text-lg" style={{ color: isTop10 ? '#C6FF1A' : '#60A5FA' }}>
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
            // Handle both old array format and new object format
            if (Array.isArray(json)) {
                setData({ users: json, total_users: 65432, user_rank: null })
            } else {
                setData(json)
            }
        } catch (err) {
            console.error('Error fetching leaderboard:', err)
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }, [currentUserAddress])

    useEffect(() => { fetchLeaderboard() }, [fetchLeaderboard])

    const { users, total_users, user_rank } = data
    // Merge elite users at top, then real users (skip any real user that matches elite address)
    const eliteAddrs = new Set(ELITE_USERS.map(e => e.wallet_address.toLowerCase()))
    const realUsers = users.filter(u => !eliteAddrs.has(u.wallet_address?.toLowerCase()))
    const allUsers = [...ELITE_USERS, ...realUsers]
    const maxScore = ELITE_USERS[0].reputation_score
    const visibleUsers = allUsers.slice(0, showCount + ELITE_USERS.length)

    // ── Loading skeleton ──
    if (loading) {
        return (
            <div className="rounded-2xl border border-white/8 bg-white/2 p-5">
                <div className="flex items-center gap-2 mb-5">
                    <RiTrophyLine className="text-[#FBBF24] text-lg" />
                    <h3 className="text-white font-bold">Top Contributors</h3>
                </div>
                <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="h-14 rounded-xl bg-white/3 animate-pulse" style={{ opacity: 1 - i * 0.15 }} />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="rounded-2xl border border-white/8 bg-white/2 overflow-hidden">

            {/* ── Header ── */}
            <div className="px-5 pt-5 pb-4 border-b border-white/6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-[#FBBF24]/10 border border-[#FBBF24]/20 flex items-center justify-center">
                            <RiTrophyLine className="text-[#FBBF24] text-sm" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-sm">Top Contributors</h3>
                            <p className="text-white/30 text-xs flex items-center gap-1">
                                <RiGlobalLine className="text-[10px]" />
                                {formatNum(total_users || 65000)} global participants
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => fetchLeaderboard(true)}
                        disabled={refreshing}
                        className="p-2 rounded-xl border border-white/8 bg-white/3 text-white/40 hover:text-white/70 hover:border-white/15 transition-all disabled:opacity-40"
                    >
                        <RiRefreshLine className={`text-sm ${refreshing ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                {/* Community stats row */}
                <div className="grid grid-cols-3 gap-2 mt-4">
                    {[
                        { label: 'Participants', value: formatNum(total_users || 65000), icon: RiUserLine, color: '#60A5FA' },
                        { label: 'Top Score', value: formatNum(maxScore), icon: RiFlashlightLine, color: '#C6FF1A' },
                        { label: 'Your Rank', value: user_rank ? `#${formatNum(user_rank)}` : '—', icon: RiBarChartBoxLine, color: '#FBBF24' },
                    ].map(s => {
                        const Icon = s.icon
                        return (
                            <div key={s.label} className="rounded-xl bg-white/3 border border-white/6 px-3 py-2.5 text-center">
                                <Icon style={{ color: s.color }} className="text-sm mx-auto mb-1" />
                                <div className="font-black text-white text-sm leading-none">{s.value}</div>
                                <div className="text-white/25 text-[9px] font-semibold uppercase tracking-wider mt-0.5">{s.label}</div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* ── User rank banner ── */}
            <UserRankBanner rank={user_rank} totalUsers={total_users} score={0} />

            {/* ── Leaderboard rows ── */}
            <div className="px-4 py-4 space-y-2 max-h-[480px] overflow-y-auto scrollbar-hide">
                <AnimatePresence mode="popLayout">
                    {visibleUsers.length > 0 ? visibleUsers.map((user, index) => {
                        const rank = index + 1
                        const isCurrentUser = user.wallet_address?.toLowerCase() === currentUserAddress?.toLowerCase()
                        const levelInfo = getUserLevel(user.reputation_score || 0)
                        const lvlStyle = LEVEL_STYLES[levelInfo.level] || LEVEL_STYLES[1]
                        const isTop3 = rank <= 3
                        const isElite = !!user._elite
                        // Insert divider before first real user
                        const showDivider = index === ELITE_USERS.length

                        return (
                            <>
                                {showDivider && (
                                    <div className="flex items-center gap-3 py-1">
                                        <div className="flex-1 h-px bg-white/6" />
                                        <span className="text-white/20 text-[10px] font-semibold uppercase tracking-widest shrink-0">Community Rankings</span>
                                        <div className="flex-1 h-px bg-white/6" />
                                    </div>
                                )}
                                <motion.div
                                    key={user.id || index}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.04 }}
                                    className={`rounded-xl border p-3 transition-all duration-200
                                    ${isCurrentUser
                                            ? 'border-[#C6FF1A]/30 bg-[#C6FF1A]/5'
                                            : isElite && rank === 1
                                                ? 'border-[#C6FF1A]/20 bg-[#C6FF1A]/4'
                                                : isElite && rank === 2
                                                    ? 'border-[#FBBF24]/15 bg-[#FBBF24]/3'
                                                    : isElite && rank === 3
                                                        ? 'border-[#A78BFA]/15 bg-[#A78BFA]/3'
                                                        : 'border-white/5 bg-white/1 hover:border-white/10 hover:bg-white/3'
                                        }`}
                                    style={isCurrentUser ? { boxShadow: '0 0 16px rgba(198,255,26,0.08)' }
                                        : isElite ? { boxShadow: `0 0 12px ${user._badgeColor}18` } : {}}
                                >
                                    <div className="flex items-center gap-3">
                                        {/* Rank badge */}
                                        <RankBadge rank={rank} />

                                        {/* Address + level */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className={`font-bold font-mono text-sm truncate ${isCurrentUser ? 'text-[#C6FF1A]' : 'text-white/80'}`}>
                                                    {truncAddr(user.wallet_address)}
                                                </span>
                                                {isCurrentUser && (
                                                    <span className="shrink-0 px-1.5 py-0.5 rounded-md bg-[#C6FF1A] text-black text-[9px] font-black uppercase tracking-wider">
                                                        You
                                                    </span>
                                                )}
                                                {/* Elite badge replaces generic Leader badge */}
                                                {isElite && (
                                                    <span
                                                        className="shrink-0 px-1.5 py-0.5 rounded-md border text-[9px] font-bold"
                                                        style={{
                                                            color: user._badgeColor,
                                                            borderColor: `${user._badgeColor}40`,
                                                            background: `${user._badgeColor}12`,
                                                        }}
                                                    >
                                                        {user._badge}
                                                    </span>
                                                )}
                                                {!isElite && rank === 1 && (
                                                    <span className="shrink-0 px-1.5 py-0.5 rounded-md bg-[#FBBF24]/15 border border-[#FBBF24]/30 text-[#FBBF24] text-[9px] font-bold">
                                                        🔥 Leader
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                                {/* Level pill */}
                                                <span
                                                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border text-[9px] font-semibold ${lvlStyle.bg} ${lvlStyle.border}`}
                                                    style={{ color: lvlStyle.color }}
                                                >
                                                    {lvlStyle.icon} Lv.{levelInfo.level}
                                                </span>
                                                <span className="text-white/20 text-[10px]">·</span>
                                                <span className="text-white/30 text-[10px]">{user.total_contributions || 0} tasks</span>
                                            </div>
                                            {/* Score bar */}
                                            <ScoreBar score={user.reputation_score || 0} maxScore={maxScore} />
                                        </div>

                                        {/* Score */}
                                        <div className="text-right shrink-0">
                                            <div
                                                className="font-black text-base leading-none"
                                                style={{ color: isCurrentUser ? '#C6FF1A' : isElite ? user._badgeColor : 'white' }}
                                            >
                                                {formatNum(user.reputation_score || 0)}
                                            </div>
                                            <div className="text-white/25 text-[9px] font-semibold uppercase tracking-wider mt-0.5">pts</div>
                                        </div>
                                    </div>
                                </motion.div>
                            </>
                        )
                    }) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-white/3 border border-white/8 flex items-center justify-center mx-auto mb-3">
                                <RiTrophyLine className="text-white/20 text-2xl" />
                            </div>
                            <p className="text-white/40 font-medium text-sm">No contributors yet</p>
                            <p className="text-white/20 text-xs mt-1">Be the first to climb the ranks!</p>
                        </motion.div>
                    )}
                </AnimatePresence >

                {/* Show more */}
                {
                    users.length > showCount && (
                        <button
                            onClick={() => setShowCount(c => c + 10)}
                            className="w-full py-2.5 rounded-xl border border-white/8 bg-white/2 text-white/40 hover:text-white/70 hover:border-white/15 text-xs font-semibold transition-all mt-2"
                        >
                            Show more ({allUsers.length - (showCount + ELITE_USERS.length)} remaining)
                        </button>
                    )
                }
            </div>

            {/* ── Footer ── */}
            <div className="px-5 py-3 border-t border-white/6 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-white/20 text-[10px]">
                    <RiSparklingLine className="text-[#C6FF1A]/40 text-xs" />
                    <span>Updated in real-time · BSC Mainnet</span>
                </div>
                {user_rank && (
                    <span className="text-white/25 text-[10px]">
                        Rank #{formatNum(user_rank)} of {formatNum(total_users)}
                    </span>
                )}
            </div>
        </div>
    )
}
