'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
    RiShieldStarFill, RiFlashlightFill, RiTrophyFill,
    RiCheckLine, RiLockLine, RiBarChartBoxLine, 
    RiTimeLine, RiBriefcase4Fill, RiVipCrown2Fill,
    RiMedalFill, RiStarSmileFill, RiRocket2Fill
} from 'react-icons/ri'
import { getUserLevel, getPointsToNextLevel, LEVEL_THRESHOLDS } from '@/lib/reputation'

// ─── Level Config (Updated for Light Theme & Icons) ───────────────────────────
const LEVEL_STYLES = {
    1: { color: '#94A3B8', glow: 'rgba(148, 163, 184, 0.2)', label: 'Beginner', icon: RiStarSmileFill, ring: '#CBD5E1' },
    2: { color: '#10B981', glow: 'rgba(16, 185, 129, 0.2)', label: 'Verified', icon: RiMedalFill, ring: '#10B981' },
    3: { color: '#3B82F6', glow: 'rgba(59, 130, 246, 0.2)', label: 'Guardian', icon: RiShieldStarFill, ring: '#3B82F6' },
    4: { color: '#F59E0B', glow: 'rgba(245, 158, 11, 0.2)', label: 'Architect', icon: RiRocket2Fill, ring: '#F59E0B' },
    5: { color: '#FF7100', glow: 'rgba(255, 113, 0, 0.25)', label: 'Master', icon: RiVipCrown2Fill, ring: '#FF7100' },
}

// ─── SVG Progress Ring ────────────────────────────────────────────────────────
function ProgressRing({ progress, level, score }) {
    const style = LEVEL_STYLES[level] || LEVEL_STYLES[1]
    const Icon = style.icon
    const radius = 54
    const stroke = 6
    const normalizedRadius = radius - stroke
    const circumference = normalizedRadius * 2 * Math.PI
    const strokeDashoffset = circumference - (progress / 100) * circumference

    return (
        <div className="relative flex items-center justify-center shrink-0" style={{ width: 120, height: 120 }}>
            {/* Soft backdrop glow */}
            <div
                className="absolute inset-0 rounded-full blur-2xl opacity-50"
                style={{ background: style.glow }}
            />
            {/* SVG ring */}
            <svg width="120" height="120" className="rotate-[-90deg]">
                {/* Track */}
                <circle
                    cx="60" cy="60"
                    r={normalizedRadius}
                    fill="transparent"
                    stroke="#F1F5F9" // slate-100
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
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
                <Icon className="text-xl mb-0.5" style={{ color: style.color }} />
                <span className="font-extrabold text-slate-800 text-lg leading-none tracking-tight">{score}</span>
                <span className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mt-0.5">pts</span>
            </div>
        </div>
    )
}

// ─── Milestone row ────────────────────────────────────────────────────────────
function MilestoneRow({ threshold, currentScore, isLast }) {
    const style = LEVEL_STYLES[threshold.level] || LEVEL_STYLES[1]
    const Icon = style.icon
    const isUnlocked = currentScore >= threshold.minPoints
    const isCurrent = (() => {
        const cur = getUserLevel(currentScore)
        return cur.level === threshold.level
    })()

    return (
        <div className="flex items-start gap-4 group">
            {/* Line + dot timeline */}
            <div className="flex flex-col items-center mt-1.5" style={{ width: 16 }}>
                <div
                    className={`w-4 h-4 rounded-full border-[3px] flex items-center justify-center shrink-0 z-10 transition-colors
                        ${isCurrent ? 'bg-white' : isUnlocked ? 'bg-white' : 'bg-slate-100'}`}
                    style={{
                        borderColor: isCurrent ? style.color : isUnlocked ? style.color : '#E2E8F0', // slate-200
                        boxShadow: isCurrent ? `0 0 12px ${style.glow}` : 'none',
                    }}
                >
                    {isUnlocked && !isCurrent && <RiCheckLine style={{ color: style.color }} className="text-[10px] font-bold" />}
                    {!isUnlocked && <RiLockLine className="text-slate-300 text-[9px]" />}
                </div>
                {!isLast && (
                    <div
                        className="w-0.5 flex-1 min-h-[28px] -mt-1"
                        style={{ background: isUnlocked ? style.color : '#F1F5F9' }} // slate-100
                    />
                )}
            </div>

            {/* Content Label */}
            <div className={`flex-1 flex items-center justify-between pb-4 ${isCurrent ? 'opacity-100' : isUnlocked ? 'opacity-80' : 'opacity-40'}`}>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: isUnlocked ? `${style.color}15` : '#F1F5F9' }}>
                        <Icon style={{ color: isUnlocked ? style.color : '#94A3B8' }} className="text-sm" />
                    </div>
                    <div>
                        <div className="text-slate-800 text-sm font-bold leading-none mb-1">{threshold.name}</div>
                        <div className="text-slate-500 text-[10px] font-medium">{threshold.minPoints} pts required</div>
                    </div>
                </div>
                
                <div className="flex flex-col items-end gap-1">
                    {isCurrent && (
                        <span
                            className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest"
                            style={{ color: style.color, background: `${style.color}15` }}
                        >
                            Current
                        </span>
                    )}
                    <span className="text-[11px] font-bold" style={{ color: isUnlocked ? style.color : '#94A3B8' }}>
                        ×{threshold.multiplier.toFixed(1)}
                    </span>
                </div>
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
    const LevelIcon = style.icon

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
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">

            {/* ── Header Area ── */}
            <div className="p-6 pb-5">
                <div className="flex items-center gap-3 mb-6">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                        style={{ background: `${style.color}10`, border: `1px solid ${style.color}25` }}
                    >
                        <RiShieldStarFill style={{ color: style.color }} className="text-xl" />
                    </div>
                    <div>
                        <h3 className="text-slate-900 font-extrabold text-base">Your Reputation</h3>
                        <p className="text-slate-500 text-xs font-medium mt-0.5">Level {currentLevel.level} · {currentLevel.name}</p>
                    </div>
                </div>

                {/* Ring + Level Info */}
                <div className="flex items-center gap-6">
                    <ProgressRing progress={progress} level={currentLevel.level} score={score} />

                    <div className="flex-1 space-y-4">
                        {/* Level badge */}
                        <div
                            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-sm"
                            style={{
                                color: style.color,
                                border: `1px solid ${style.color}30`,
                                background: `${style.color}10`,
                            }}
                        >
                            <LevelIcon className="text-sm" /> 
                            {currentLevel.name}
                        </div>

                        {/* Progress to next */}
                        {!isMaxLevel ? (
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-slate-400 text-[10px] font-semibold">Next Level</span>
                                    <span className="text-slate-600 text-[11px] font-bold">{pointsToNext} pts needed</span>
                                </div>
                                <div className="h-2 rounded-full bg-slate-100 overflow-hidden shadow-inner">
                                    <motion.div
                                        className="h-full rounded-full"
                                        style={{ background: `linear-gradient(90deg, ${style.color}90, ${style.color})` }}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 }}
                                    />
                                </div>
                                <div className="flex justify-between mt-1.5">
                                    <span className="text-slate-400 text-[10px] font-medium">{score} pts</span>
                                    <span className="text-slate-400 text-[10px] font-medium">{score + pointsToNext} pts</span>
                                </div>
                            </div>
                        ) : (
                            <div
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm"
                                style={{ color: style.color, border: `1px solid ${style.color}25`, background: `${style.color}10` }}
                            >
                                <RiTrophyFill className="text-base" />
                                Max Level Reached!
                            </div>
                        )}

                        {/* Reward multiplier */}
                        <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 w-fit">
                            <RiFlashlightFill className="text-amber-500 text-sm" />
                            <span className="text-amber-700 text-[11px] font-medium">Reward multiplier:</span>
                            <span className="text-amber-600 text-xs font-black">×{currentLevel.multiplier.toFixed(1)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Stats Grid ── */}
            <div className="grid grid-cols-3 bg-slate-50 border-y border-slate-100">
                {[
                    { label: 'Total Score', value: score, suffix: 'pts', icon: RiFlashlightFill, color: '#3B82F6' },
                    { label: 'Tasks Done', value: contributions, suffix: '', icon: RiBriefcase4Fill, color: '#10B981' },
                    { label: 'Total Earned', value: `${Number(totalRewards).toFixed(0)}`, suffix: 'S', icon: RiTrophyFill, color: '#FF7100' },
                ].map((stat, idx) => {
                    const Icon = stat.icon
                    return (
                        <div key={stat.label} className={`p-4 text-center ${idx !== 2 ? 'border-r border-slate-200/60' : ''}`}>
                            <Icon style={{ color: stat.color }} className="text-lg mx-auto mb-2 opacity-80" />
                            <div className="font-extrabold text-slate-800 text-lg leading-none tracking-tight">
                                {stat.value}<span className="text-[10px] text-slate-400 font-bold ml-0.5">{stat.suffix}</span>
                            </div>
                            <div className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mt-1.5">{stat.label}</div>
                        </div>
                    )
                })}
            </div>

            {/* ── Level Milestones Timeline ── */}
            <div className="p-6">
                <div className="flex items-center gap-2 mb-6">
                    <RiBarChartBoxLine className="text-slate-400 text-sm" />
                    <span className="text-slate-500 text-[11px] font-semibold">Progression Path</span>
                </div>
                
                <div className="pl-2">
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
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-start gap-2.5">
                <RiTimeLine className="text-slate-400 text-sm shrink-0 mt-0.5" />
                <p className="text-slate-500 text-xs font-medium leading-relaxed">
                    {isMaxLevel
                        ? 'You have reached the highest tier. Keep contributing to maintain your standing!'
                        : `Complete tasks to earn ${pointsToNext} more points and unlock the Level ${currentLevel.level + 1} multiplier.`
                    }
                </p>
            </div>
        </div>
    )
}