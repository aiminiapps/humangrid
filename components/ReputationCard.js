'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
    RiShieldStarLine, RiFlashlightLine, RiTrophyLine,
    RiArrowUpLine, RiCheckLine, RiLockLine, RiSparklingLine,
    RiBarChartBoxLine, RiTimeLine, RiBriefcaseLine,
} from 'react-icons/ri'
import { getUserLevel, getPointsToNextLevel, LEVEL_THRESHOLDS } from '@/lib/reputation'

// ─── Level config ─────────────────────────────────────────────────────────────
const LEVEL_STYLES = {
    1: { color: '#9CA3AF', glow: 'rgba(156,163,175,0.3)', label: 'Beginner', icon: '🌱', ring: '#9CA3AF' },
    2: { color: '#34D399', glow: 'rgba(52,211,153,0.3)', label: 'Verified', icon: '⚡', ring: '#34D399' },
    3: { color: '#60A5FA', glow: 'rgba(96,165,250,0.3)', label: 'Guardian', icon: '🛡️', ring: '#60A5FA' },
    4: { color: '#A78BFA', glow: 'rgba(167,139,250,0.3)', label: 'Architect', icon: '🏗️', ring: '#A78BFA' },
    5: { color: '#C6FF1A', glow: 'rgba(198,255,26,0.4)', label: 'Master', icon: '👑', ring: '#C6FF1A' },
}

// ─── SVG Progress Ring ────────────────────────────────────────────────────────
function ProgressRing({ progress, level, score }) {
    const style = LEVEL_STYLES[level] || LEVEL_STYLES[1]
    const radius = 52
    const stroke = 5
    const normalizedRadius = radius - stroke
    const circumference = normalizedRadius * 2 * Math.PI
    const strokeDashoffset = circumference - (progress / 100) * circumference

    return (
        <div className="relative flex items-center justify-center" style={{ width: 120, height: 120 }}>
            {/* Glow backdrop */}
            <div
                className="absolute inset-0 rounded-full blur-xl opacity-30"
                style={{ background: style.glow }}
            />
            {/* SVG ring */}
            <svg width="120" height="120" className="rotate-[-90deg]">
                {/* Track */}
                <circle
                    cx="60" cy="60"
                    r={normalizedRadius}
                    fill="transparent"
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth={stroke}
                />
                {/* Progress */}
                <motion.circle
                    cx="60" cy="60"
                    r={normalizedRadius}
                    fill="transparent"
                    stroke={style.ring}
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    strokeDasharray={`${circumference} ${circumference}`}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                />
            </svg>
            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl leading-none">{style.icon}</span>
                <span className="font-black text-white text-lg leading-none mt-1">{score}</span>
                <span className="text-white/30 text-[9px] font-semibold uppercase tracking-wider">pts</span>
            </div>
        </div>
    )
}

// ─── Milestone row ────────────────────────────────────────────────────────────
function MilestoneRow({ threshold, currentScore, isLast }) {
    const style = LEVEL_STYLES[threshold.level] || LEVEL_STYLES[1]
    const isUnlocked = currentScore >= threshold.minPoints
    const isCurrent = (() => {
        const cur = getUserLevel(currentScore)
        return cur.level === threshold.level
    })()

    return (
        <div className="flex items-center gap-3">
            {/* Line + dot */}
            <div className="flex flex-col items-center" style={{ width: 20 }}>
                {!isLast && (
                    <div
                        className="w-px flex-1 min-h-[20px]"
                        style={{ background: isUnlocked ? style.color : 'rgba(255,255,255,0.08)' }}
                    />
                )}
                <div
                    className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0"
                    style={{
                        borderColor: isUnlocked ? style.color : 'rgba(255,255,255,0.12)',
                        background: isUnlocked ? `${style.color}22` : 'transparent',
                        boxShadow: isCurrent ? `0 0 8px ${style.glow}` : 'none',
                    }}
                >
                    {isUnlocked
                        ? <RiCheckLine style={{ color: style.color }} className="text-[9px]" />
                        : <RiLockLine className="text-white/20 text-[9px]" />
                    }
                </div>
            </div>

            {/* Label */}
            <div className={`flex-1 flex items-center justify-between py-1.5 ${isCurrent ? 'opacity-100' : isUnlocked ? 'opacity-70' : 'opacity-35'}`}>
                <div className="flex items-center gap-2">
                    <span className="text-sm">{LEVEL_STYLES[threshold.level]?.icon}</span>
                    <div>
                        <div className="text-white text-xs font-semibold leading-none">{threshold.name}</div>
                        <div className="text-white/30 text-[10px] mt-0.5">{threshold.minPoints} pts required</div>
                    </div>
                    {isCurrent && (
                        <span
                            className="px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border"
                            style={{ color: style.color, borderColor: `${style.color}40`, background: `${style.color}12` }}
                        >
                            Current
                        </span>
                    )}
                </div>
                <span className="text-[10px] font-semibold" style={{ color: isUnlocked ? style.color : 'rgba(255,255,255,0.2)' }}>
                    ×{threshold.multiplier.toFixed(1)}
                </span>
            </div>
        </div>
    )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ReputationCard({ userProfile }) {
    const score = userProfile?.reputation_score || 0
    const contributions = userProfile?.total_contributions || 0
    const totalRewards = userProfile?.total_rewards || 0

    const currentLevel = useMemo(() => getUserLevel(score), [score])
    const pointsToNext = useMemo(() => getPointsToNextLevel(score), [score])
    const style = LEVEL_STYLES[currentLevel.level] || LEVEL_STYLES[1]

    // Progress % within current level band
    const progress = useMemo(() => {
        const nextIdx = LEVEL_THRESHOLDS.findIndex(l => l.level === currentLevel.level) + 1
        if (nextIdx >= LEVEL_THRESHOLDS.length) return 100
        const nextMin = LEVEL_THRESHOLDS[nextIdx].minPoints
        const curMin = currentLevel.minPoints
        return Math.min(100, Math.round(((score - curMin) / (nextMin - curMin)) * 100))
    }, [score, currentLevel])

    const isMaxLevel = currentLevel.level === LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1].level

    return (
        <div className="rounded-2xl border border-white/8 bg-white/2 overflow-hidden">

            {/* ── Header ── */}
            <div className="px-5 pt-5 pb-4 border-b border-white/6">
                <div className="flex items-center gap-2 mb-4">
                    <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center border"
                        style={{ background: `${style.color}15`, borderColor: `${style.color}30` }}
                    >
                        <RiShieldStarLine style={{ color: style.color }} className="text-sm" />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-sm">Your Reputation</h3>
                        <p className="text-white/30 text-xs">Level {currentLevel.level} · {currentLevel.name}</p>
                    </div>
                </div>

                {/* Ring + level info */}
                <div className="flex items-center gap-5">
                    <ProgressRing progress={progress} level={currentLevel.level} score={score} />

                    <div className="flex-1 space-y-3">
                        {/* Level badge */}
                        <div
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold"
                            style={{
                                color: style.color,
                                borderColor: `${style.color}35`,
                                background: `${style.color}12`,
                                boxShadow: `0 0 12px ${style.glow}`,
                            }}
                        >
                            {/* <RiSparklingLine className="text-xs" /> */}
                            {style.icon} {currentLevel.name}
                        </div>

                        {/* Progress to next */}
                        {!isMaxLevel ? (
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-white/30 text-[10px] font-semibold uppercase tracking-wider">Next Level</span>
                                    <span className="text-white/50 text-[10px] font-semibold">{pointsToNext} pts needed</span>
                                </div>
                                <div className="h-1.5 rounded-full bg-white/6 overflow-hidden">
                                    <motion.div
                                        className="h-full rounded-full"
                                        style={{ background: `linear-gradient(90deg, ${style.color}80, ${style.color})` }}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 }}
                                    />
                                </div>
                                <div className="flex justify-between mt-1">
                                    <span className="text-white/20 text-[9px]">{score} pts</span>
                                    <span className="text-white/20 text-[9px]">{score + pointsToNext} pts</span>
                                </div>
                            </div>
                        ) : (
                            <div
                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold"
                                style={{ color: style.color, borderColor: `${style.color}30`, background: `${style.color}10` }}
                            >
                                <RiTrophyLine />
                                Max Level Reached! 🎉
                            </div>
                        )}

                        {/* Reward multiplier */}
                        <div className="flex items-center gap-1.5">
                            <RiFlashlightLine className="text-[#FBBF24] text-xs" />
                            <span className="text-white/30 text-[10px]">Reward multiplier:</span>
                            <span className="text-[#FBBF24] text-xs font-black">×{currentLevel.multiplier.toFixed(1)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Stats Grid ── */}
            <div className="grid grid-cols-3 gap-px bg-white/5 border-b border-white/6">
                {[
                    { label: 'Score', value: score, suffix: 'pts', icon: RiFlashlightLine, color: '#60A5FA' },
                    { label: 'Tasks', value: contributions, suffix: '', icon: RiBriefcaseLine, color: '#34D399' },
                    { label: 'Rewards', value: `${Number(totalRewards).toFixed(0)}`, suffix: 'S', icon: RiTrophyLine, color: '#C6FF1A' },
                ].map(stat => {
                    const Icon = stat.icon
                    return (
                        <div key={stat.label} className="bg-[#080C09] px-3 py-3 text-center">
                            <Icon style={{ color: stat.color }} className="text-base mx-auto mb-1" />
                            <div className="font-black text-white text-base leading-none">
                                {stat.value}<span className="text-[10px] text-white/30 font-medium ml-0.5">{stat.suffix}</span>
                            </div>
                            <div className="text-white/25 text-[10px] font-semibold uppercase tracking-wider mt-0.5">{stat.label}</div>
                        </div>
                    )
                })}
            </div>

            {/* ── Level Milestones ── */}
            <div className="px-5 py-4">
                <div className="flex items-center gap-2 mb-3">
                    <RiBarChartBoxLine className="text-white/30 text-xs" />
                    <span className="text-white/30 text-[10px] font-semibold uppercase tracking-wider">Level Milestones</span>
                </div>
                <div className="space-y-0">
                    {LEVEL_THRESHOLDS.map((threshold, i) => (
                        <MilestoneRow
                            key={threshold.level}
                            threshold={threshold}
                            currentScore={score}
                            isLast={i === LEVEL_THRESHOLDS.length - 1}
                        />
                    ))}
                </div>
            </div>

            {/* ── Footer tip ── */}
            <div className="px-5 py-3 border-t border-white/6 flex items-center gap-2">
                <RiTimeLine className="text-white/20 text-xs shrink-0" />
                <p className="text-white/20 text-[10px]">
                    {isMaxLevel
                        ? 'You have reached the highest level. Keep contributing!'
                        : `Earn ${pointsToNext} more points to reach Level ${currentLevel.level + 1}`
                    }
                </p>
            </div>
        </div>
    )
}
