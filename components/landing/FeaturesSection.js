'use client'

import { motion, useInView, AnimatePresence, useSpring, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import {
    RiBrainLine, RiTokenSwapLine, RiShieldCheckLine,
    RiFlashlightLine, RiTrophyLine, RiCheckLine,
    RiArrowUpLine, RiStarLine, RiMedalLine,
    RiFireLine, RiSparkling2Line, RiCpuLine,
    RiDatabase2Line, RiImageLine, RiFileTextLine,
    RiBarChartLine, RiLockLine, RiKey2Line,
} from 'react-icons/ri'

// ─── Floating particle ───────────────────────────────────────
function Particle({ color, delay, x, size = 3 }) {
    return (
        <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{ width: size, height: size, background: color, left: `${x}%`, bottom: -6 }}
            animate={{ y: [0, -55, -70], opacity: [0, 0.7, 0], scale: [1, 1.2, 0.4] }}
            transition={{ duration: 2.2, delay, repeat: Infinity, ease: 'easeOut' }}
        />
    )
}

// ─── Card shell ───────────────────────────────────────────────
function BentoCard({ className = '', style = {}, color = '#C6FF1A', label, title, children, delay = 0 }) {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: '-60px' })

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
            className={`relative rounded-2xl overflow-hidden flex flex-col group ${className}`}
            style={{
                background: 'rgba(255,255,255,0.023)',
                border: '1px solid rgba(255,255,255,0.07)',
                ...style,
            }}
            whileHover={{
                borderColor: `${color}22`,
                boxShadow: `0 0 0 1px ${color}12, 0 16px 40px rgba(0,0,0,0.4)`,
            }}
            transition={{ duration: 0.2 }}
        >
            {/* Top gradient accent */}
            <div className="absolute top-0 inset-x-0 h-px"
                style={{ background: `linear-gradient(90deg, transparent 10%, ${color}50 50%, transparent 90%)` }} />

            {/* Subtle corner glow on hover */}
            <div className="absolute top-0 right-0 w-24 h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(circle at top right, ${color}0a, transparent 70%)` }} />

            <div className="px-5 pt-5 pb-3 shrink-0">
                <div className="flex items-center gap-1.5 mb-1.5">
                    <div className="w-1 h-1 rounded-full" style={{ background: color }} />
                    <span className="text-[9px] font-bold uppercase tracking-[0.22em]" style={{ color: `${color}70` }}>{label}</span>
                </div>
                <h3 className="text-[13px] font-bold text-white/85 leading-snug">{title}</h3>
            </div>

            <div className="flex-1 px-4 pb-4 min-h-0 overflow-hidden">{children}</div>
        </motion.div>
    )
}

// ══════════════════════════════════════════════════════════════
// CELL A — AI Task Matching
// Radar-style skill scanner + task queue with score bars
// ══════════════════════════════════════════════════════════════
const TASK_TYPES = [
    { icon: RiFileTextLine, label: 'Text Labeling', score: 94, color: '#C6FF1A' },
    { icon: RiImageLine, label: 'Image Review', score: 88, color: '#60A5FA' },
    { icon: RiDatabase2Line, label: 'Data Ranking', score: 91, color: '#A78BFA' },
    { icon: RiCpuLine, label: 'Model Validation', score: 85, color: '#34D399' },
]

function AIMatchingCell() {
    const [active, setActive] = useState(0)
    const [score, setScore] = useState(0)
    const [scanning, setScanning] = useState(false)

    useEffect(() => {
        let cancelled = false
        const run = async () => {
            while (!cancelled) {
                // Scan phase
                setScanning(true)
                setScore(0)
                await new Promise(r => setTimeout(r, 400))
                // Count up
                const target = TASK_TYPES[active % TASK_TYPES.length].score
                const step = () => {
                    setScore(prev => {
                        if (prev >= target) return prev
                        return Math.min(prev + 3, target)
                    })
                }
                const interval = setInterval(step, 28)
                await new Promise(r => setTimeout(r, 1100))
                clearInterval(interval)
                setScore(target)
                setScanning(false)
                await new Promise(r => setTimeout(r, 1200))
                if (!cancelled) setActive(a => (a + 1) % TASK_TYPES.length)
            }
        }
        run()
        return () => { cancelled = true }
    }, [active])

    const current = TASK_TYPES[active]

    return (
        <div className="flex flex-col gap-3 select-none">
            {/* Active scanner */}
            <div className="rounded-xl p-3 relative overflow-hidden"
                style={{ background: `${current.color}06`, border: `1px solid ${current.color}18` }}>
                {/* Scanning sweep */}
                <AnimatePresence>
                    {scanning && (
                        <motion.div
                            key="sweep"
                            initial={{ x: '-100%' }}
                            animate={{ x: '200%' }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6, ease: 'linear' }}
                            className="absolute inset-y-0 w-1/3 pointer-events-none"
                            style={{ background: `linear-gradient(90deg, transparent, ${current.color}18, transparent)` }}
                        />
                    )}
                </AnimatePresence>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                            style={{ background: `${current.color}12`, border: `1px solid ${current.color}28` }}>
                            <current.icon style={{ color: current.color }} className="text-base" />
                        </div>
                        <div>
                            <div className="text-white/75 text-xs font-bold">{current.label}</div>
                            <div className="text-white/28 text-[10px]">{scanning ? 'Scanning profile…' : 'Match found'}</div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-lg font-black leading-none" style={{ color: current.color }}>{score}%</div>
                        <div className="text-[9px] text-white/28">match</div>
                    </div>
                </div>
                {/* Score bar */}
                <div className="mt-2.5 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <motion.div
                        className="h-full rounded-full"
                        animate={{ width: `${score}%` }}
                        transition={{ ease: 'linear', duration: 0.05 }}
                        style={{ background: `linear-gradient(90deg, ${current.color}80, ${current.color})` }}
                    />
                </div>
            </div>

            {/* Queue */}
            <div className="flex flex-col gap-1.5">
                {TASK_TYPES.map((t, i) => {
                    const isActive = i === active
                    return (
                        <motion.div
                            key={t.label}
                            animate={{
                                opacity: isActive ? 1 : 0.32,
                                x: isActive ? 0 : -2,
                            }}
                            transition={{ duration: 0.3 }}
                            className="flex items-center justify-between px-2.5 py-1.5 rounded-lg"
                            style={{
                                background: isActive ? `${t.color}08` : 'transparent',
                                border: `1px solid ${isActive ? t.color + '20' : 'rgba(255,255,255,0.04)'}`,
                            }}
                        >
                            <div className="flex items-center gap-2">
                                <t.icon className="text-xs shrink-0" style={{ color: t.color }} />
                                <span className="text-[11px] font-medium text-white/60">{t.label}</span>
                            </div>
                            <motion.div
                                animate={isActive ? { opacity: [0.7, 1, 0.7] } : { opacity: 1 }}
                                transition={{ duration: 1.4, repeat: Infinity }}
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ background: isActive ? t.color : 'rgba(255,255,255,0.1)' }}
                            />
                        </motion.div>
                    )
                })}
            </div>
        </div>
    )
}

// ══════════════════════════════════════════════════════════════
// CELL B — Reputation (tall)
// Rank card with animated XP bar + sparkling level-up
// ══════════════════════════════════════════════════════════════
const RANKS = [
    { name: 'Novice', color: '#9CA3AF', xpMax: 500, mult: '×1.0', icon: RiStarLine },
    { name: 'Validator', color: '#60A5FA', xpMax: 1200, mult: '×1.5', icon: RiCheckLine },
    { name: 'Expert', color: '#A78BFA', xpMax: 3000, mult: '×2.0', icon: RiBrainLine },
    { name: 'Master', color: '#C6FF1A', xpMax: 6000, mult: '×3.0', icon: RiTrophyLine },
]
const RANK_XP = [380, 950, 2200, 4100]

function ReputationCell() {
    const [ri, setRi] = useState(0)
    const [xp, setXp] = useState(0)
    const [sparks, setSparks] = useState(false)

    useEffect(() => {
        let cancelled = false
        const run = async () => {
            while (!cancelled) {
                const target = RANK_XP[ri]
                const start = Date.now()
                const dur = 1800
                await new Promise(res => {
                    const raf = () => {
                        const p = Math.min((Date.now() - start) / dur, 1)
                        setXp(Math.round(p * target))
                        if (p < 1 && !cancelled) requestAnimationFrame(raf)
                        else res()
                    }
                    requestAnimationFrame(raf)
                })
                if (cancelled) break
                setSparks(true)
                await new Promise(r => setTimeout(r, 1600))
                setSparks(false)
                await new Promise(r => setTimeout(r, 300))
                if (!cancelled) setRi(i => (i + 1) % RANKS.length)
                setXp(0)
            }
        }
        run()
        return () => { cancelled = true }
    }, [ri])

    const rank = RANKS[ri]
    const pct = (xp / rank.xpMax) * 100

    return (
        <div className="flex flex-col gap-3.5 select-none h-full">
            {/* Rank badge */}
            <div className="relative flex flex-col items-center py-4 rounded-xl overflow-hidden"
                style={{ background: `${rank.color}07`, border: `1px solid ${rank.color}18` }}>
                {/* Spark particles */}
                {sparks && [8, 22, 38, 55, 70, 85].map((x, i) => (
                    <Particle key={i} color={rank.color} delay={i * 0.12} x={x} size={i % 2 === 0 ? 3 : 2} />
                ))}

                <motion.div
                    key={`badge-${ri}`}
                    initial={{ scale: 0.7, opacity: 0, rotate: -15 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3 relative"
                    style={{ background: `${rank.color}12`, border: `1px solid ${rank.color}30` }}
                >
                    <rank.icon style={{ color: rank.color }} className="text-2xl" />
                    {sparks && (
                        <motion.div
                            animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.8, 0] }}
                            transition={{ duration: 0.6 }}
                            className="absolute inset-0 rounded-2xl"
                            style={{ background: rank.color, opacity: 0 }}
                        />
                    )}
                </motion.div>

                <AnimatePresence mode="popLayout">
                    <motion.div
                        key={`name-${ri}`}
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -8, opacity: 0 }}
                        className="text-base font-black" style={{ color: rank.color }}>
                        {rank.name}
                    </motion.div>
                </AnimatePresence>
                <div className="text-white/28 text-[10px] mt-0.5">Contributor Rank</div>
            </div>

            {/* XP */}
            <div>
                <div className="flex justify-between mb-1.5 px-0.5">
                    <span className="text-white/30 text-[10px] font-semibold uppercase tracking-wider">Experience</span>
                    <motion.span key={xp} className="text-[10px] font-black" style={{ color: rank.color }}>
                        {xp.toLocaleString()} XP
                    </motion.span>
                </div>
                <div className="h-2 rounded-full overflow-hidden relative" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <motion.div className="h-full rounded-full relative"
                        style={{ background: `linear-gradient(90deg, ${rank.color}80, ${rank.color})` }}
                        animate={{ width: `${Math.min(pct, 100)}%` }}
                        transition={{ ease: 'linear', duration: 0.05 }}
                    >
                        {/* Shimmer */}
                        <motion.div
                            className="absolute inset-0"
                            animate={{ x: ['-100%', '200%'] }}
                            transition={{ duration: 1.4, repeat: Infinity, ease: 'linear', repeatDelay: 0.4 }}
                            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)', borderRadius: 99 }}
                        />
                    </motion.div>
                </div>
                <div className="flex justify-between mt-1 px-0.5">
                    <span className="text-white/18 text-[9px]">0</span>
                    <span className="text-white/18 text-[9px]">{rank.xpMax.toLocaleString()} XP</span>
                </div>
            </div>

            {/* Multiplier + next reward */}
            <div className="grid grid-cols-2 gap-2 mt-auto">
                <div className="rounded-xl p-2.5 text-center"
                    style={{ background: `${rank.color}08`, border: `1px solid ${rank.color}20` }}>
                    <div className="text-xl font-black leading-none" style={{ color: rank.color }}>{rank.mult}</div>
                    <div className="text-[9px] text-white/28 mt-0.5 uppercase tracking-wider">Multiplier</div>
                </div>
                <div className="rounded-xl p-2.5 text-center"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div className="text-xl font-black leading-none text-white">
                        {Math.round(100 - pct)}
                        <span className="text-xs text-white/30">%</span>
                    </div>
                    <div className="text-[9px] text-white/28 mt-0.5 uppercase tracking-wider">To next</div>
                </div>
            </div>

            {/* Level up flash */}
            <AnimatePresence>
                {sparks && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -4 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center justify-center gap-2 py-2.5 rounded-xl"
                        style={{ background: `${rank.color}10`, border: `1px solid ${rank.color}28` }}>
                        <RiSparkling2Line style={{ color: rank.color }} className="text-sm" />
                        <span className="text-xs font-bold" style={{ color: rank.color }}>Level Up!</span>
                        <RiSparkling2Line style={{ color: rank.color }} className="text-sm" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

// ══════════════════════════════════════════════════════════════
// CELL C — On-Chain Speed
// Animated waveform + live block feed
// ══════════════════════════════════════════════════════════════
function SpeedCell() {
    const [ms, setMs] = useState(312)
    const [history, setHistory] = useState([280, 320, 295, 310, 288, 305, 312])
    const [blocks, setBlocks] = useState([
        { id: 'a', num: 9182641, ms: 312 },
        { id: 'b', num: 9182640, ms: 298 },
    ])

    useEffect(() => {
        const t = setInterval(() => {
            const newMs = 265 + Math.floor(Math.random() * 90)
            setMs(newMs)
            setHistory(h => [...h.slice(-6), newMs])
            setBlocks(prev => [
                { id: Date.now().toString(), num: prev[0].num + 1, ms: newMs },
                ...prev.slice(0, 2),
            ])
        }, 1800)
        return () => clearInterval(t)
    }, [])

    const maxH = Math.max(...history)
    const minH = Math.min(...history)

    return (
        <div className="flex flex-col gap-3 select-none h-full">
            {/* Hero number */}
            <div className="flex items-end gap-1.5 mt-3">
                <motion.span
                    key={ms}
                    initial={{ y: -8, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className="text-3xl font-black tracking-tight leading-none"
                    style={{ color: '#C6FF1A', letterSpacing: '-0.03em' }}
                >{ms}</motion.span>
                <div className="mb-0.5">
                    <div className="text-white/55 text-sm font-bold leading-none">ms</div>
                    <div className="text-white/22 text-[9px] leading-none mt-0.5">avg confirm</div>
                </div>
            </div>

            {/* Mini waveform */}
            <div className="flex items-end gap-1 h-10">
                {history.map((v, i) => {
                    const h = 8 + ((v - minH) / Math.max(maxH - minH, 1)) * 28
                    const isLast = i === history.length - 1
                    return (
                        <motion.div
                            key={i}
                            animate={{ height: h }}
                            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                            className="flex-1 rounded-sm"
                            style={{
                                background: isLast
                                    ? '#C6FF1A'
                                    : `rgba(198,255,26,${0.12 + (i / history.length) * 0.2})`,
                                boxShadow: isLast ? '0 0 8px rgba(198,255,26,0.35)' : 'none',
                            }}
                        />
                    )
                })}
            </div>

            {/* Block feed */}
            <div className="flex flex-col gap-1.5 flex-1">
                {blocks.map((b, i) => (
                    <motion.div
                        key={b.id}
                        initial={i === 0 ? { opacity: 0, x: -12 } : { opacity: 1 }}
                        animate={{ opacity: 1 - i * 0.3, x: 0 }}
                        transition={{ duration: 0.35, type: 'spring', stiffness: 300 }}
                        className="flex items-center justify-between px-2.5 py-1.5 rounded-lg"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
                    >
                        <div className="flex items-center gap-2">
                            <motion.div
                                animate={i === 0 ? { scale: [1, 1.3, 1] } : {}}
                                transition={{ duration: 0.4 }}
                            >
                                <RiCheckLine className="text-[#34D399] text-xs" />
                            </motion.div>
                            <span className="text-white/40 font-mono text-[10px]">
                                #{b.num.toLocaleString()}
                            </span>
                        </div>
                        <span className="font-mono text-[10px] font-bold"
                            style={{ color: b.ms < 300 ? '#34D399' : '#C6FF1A' }}>
                            {b.ms}ms ✓
                        </span>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

// ══════════════════════════════════════════════════════════════
// CELL D — Daily Streak
// Animated bar chart + floating token rewards
// ══════════════════════════════════════════════════════════════
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function StreakCell() {
    const [bars, setBars] = useState([6, 9, 4, 11, 7, 3, 0])
    const [today, setToday] = useState(4) // Fri
    const [floats, setFloats] = useState([])
    const [streak, setStreak] = useState(14)

    useEffect(() => {
        const t = setInterval(() => {
            const incDay = (prev) => {
                const next = (prev + 1) % 7
                setBars(b => b.map((v, i) => i === next ? v + 1 : v))
                setStreak(s => s + 1)
                // Float a token
                setFloats(f => [...f, { id: Date.now(), x: 40 + Math.random() * 20 }])
                setTimeout(() => setFloats(f => f.slice(1)), 1200)
                return next
            }
            setToday(incDay)
        }, 2200)
        return () => clearInterval(t)
    }, [])

    const max = Math.max(...bars, 1)

    return (
        <div className="flex flex-col gap-3 select-none h-full relative">
            {/* Floating +SYNTR tokens */}
            <AnimatePresence>
                {floats.map(f => (
                    <motion.div
                        key={f.id}
                        className="absolute pointer-events-none z-10 text-[10px] font-black"
                        style={{ left: `${f.x}%`, bottom: '40%', color: '#C6FF1A' }}
                        initial={{ y: 0, opacity: 1 }}
                        animate={{ y: -36, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.1, ease: 'easeOut' }}
                    >
                        +SYNTR
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* Streak counter */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <motion.div
                        animate={{ scale: [1, 1.15, 1] }}
                        transition={{ duration: 1.4, repeat: Infinity }}>
                        <RiFireLine className="text-[#FBBF24] text-base" />
                    </motion.div>
                    <div>
                        <motion.span
                            key={streak}
                            initial={{ scale: 1.2, color: '#FBBF24' }}
                            animate={{ scale: 1, color: '#ffffff' }}
                            transition={{ duration: 0.4 }}
                            className="text-lg font-black leading-none"
                            style={{ letterSpacing: '-0.02em' }}
                        >{streak}</motion.span>
                        <span className="text-white/35 text-xs font-semibold"> day streak</span>
                    </div>
                </div>
                <div className="text-[10px] px-2 py-1 rounded-full"
                    style={{ background: '#FBBF2410', color: '#FBBF24', border: '1px solid #FBBF2422' }}>
                    🔥 On fire
                </div>
            </div>

            {/* Bar chart */}
            <div className="flex items-end gap-1.5 flex-1 px-0.5">
                {bars.map((v, i) => {
                    const isToday = i === today
                    const heightPct = Math.max(8, (v / max) * 72)
                    return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                            <motion.div
                                className="w-full rounded-[5px] relative overflow-hidden"
                                animate={{ height: heightPct }}
                                transition={{ type: 'spring', stiffness: 180, damping: 22 }}
                                style={{
                                    background: isToday
                                        ? 'linear-gradient(180deg, #FBBF24, #C6FF1A)'
                                        : v === 0
                                            ? 'rgba(255,255,255,0.04)'
                                            : 'rgba(198,255,26,0.18)',
                                    boxShadow: isToday ? '0 0 12px rgba(198,255,26,0.3)' : 'none',
                                }}
                            >
                                {isToday && (
                                    <motion.div
                                        className="absolute inset-0"
                                        animate={{ opacity: [0.2, 0.5, 0.2] }}
                                        transition={{ duration: 1.2, repeat: Infinity }}
                                        style={{ background: 'rgba(255,255,255,0.3)' }}
                                    />
                                )}
                            </motion.div>
                            <span className="text-[8px] font-semibold"
                                style={{ color: isToday ? '#C6FF1A' : 'rgba(255,255,255,0.2)' }}>
                                {DAY_LABELS[i].slice(0, 1)}
                            </span>
                        </div>
                    )
                })}
            </div>

            {/* Bonus label */}
            <div className="rounded-lg px-3 py-2 flex items-center justify-between"
                style={{ background: 'rgba(198,255,26,0.04)', border: '1px solid rgba(198,255,26,0.1)' }}>
                <span className="text-white/35 text-[10px]">Streak bonus</span>
                <span className="text-[#C6FF1A] text-xs font-black">+28% earnings</span>
            </div>
        </div>
    )
}

// ══════════════════════════════════════════════════════════════
// CELL E — Non-custodial Security
// Animated lock + shimmer checklist
// ══════════════════════════════════════════════════════════════
const CHECKS = [
    { label: 'No KYC required', color: '#34D399' },
    { label: 'Your keys, your tokens', color: '#34D399' },
    { label: 'Audited smart contracts', color: '#60A5FA' },
    { label: 'Zero platform custody', color: '#A78BFA' },
    { label: 'Instant withdrawals', color: '#C6FF1A' },
]

function SecurityCell() {
    const [activeCheck, setActiveCheck] = useState(-1)

    useEffect(() => {
        let i = 0
        const t = setInterval(() => {
            setActiveCheck(i % CHECKS.length)
            i++
        }, 900)
        return () => clearInterval(t)
    }, [])

    return (
        <div className="flex flex-col gap-3.5 select-none h-full">
            {/* Shield */}
            {/* Animated checklist */}
            <div className="flex flex-col gap-1.5 flex-1">
                {CHECKS.map((c, i) => {
                    const isActive = i === activeCheck
                    return (
                        <motion.div
                            key={c.label}
                            animate={{
                                background: isActive ? `${c.color}09` : 'rgba(255,255,255,0.01)',
                                borderColor: isActive ? `${c.color}25` : 'rgba(255,255,255,0.04)',
                            }}
                            transition={{ duration: 0.25 }}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl"
                            style={{ border: '1px solid rgba(255,255,255,0.04)' }}
                        >
                            <motion.div
                                animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                                transition={{ duration: 0.3 }}
                                className="w-4.5 h-4.5 rounded-full flex items-center justify-center shrink-0"
                                style={{ background: `${c.color}15`, border: `1px solid ${c.color}30` }}>
                                <RiCheckLine style={{ color: c.color, fontSize: 9 }} />
                            </motion.div>
                            <span className="text-[11px]"
                                style={{ color: isActive ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.35)' }}>
                                {c.label}
                            </span>
                            {isActive && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.7 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="ml-auto"
                                >
                                    <RiKey2Line style={{ color: c.color }} className="text-xs" />
                                </motion.div>
                            )}
                        </motion.div>
                    )
                })}
            </div>
        </div>
    )
}

// ══════════════════════════════════════════════════════════════
// MAIN EXPORT
// ══════════════════════════════════════════════════════════════
export default function FeaturesSection() {
    return (
        <section id="features" className="px-4 sm:px-6 py-14">
            <div className="max-w-6xl mx-auto">
                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-3"
                        style={{ letterSpacing: '-0.025em' }}>
                        Built for{' '}
                        <span style={{ color: '#C6FF1A' }}>Serious Contributors</span>
                    </h2>
                    <p className="text-white/35 text-sm text-balance mx-auto leading-relaxed">
                        Every feature is designed to put more SYNTR in your wallet
                    </p>
                </motion.div>

                {/* Bento grid */}
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">

                    {/* A — AI Matching: 4 cols */}
                    <div className="md:col-span-4">
                        <BentoCard color="#C6FF1A" label="Smart Matching" title="AI pairs you with the right task in milliseconds" delay={0}>
                            <AIMatchingCell />
                        </BentoCard>
                    </div>

                    {/* B — Reputation: 2 cols, 2 rows */}
                    <div className="md:col-span-2 md:row-span-2">
                        <BentoCard color="#A78BFA" label="Reputation" title="Level up, unlock bigger rewards" delay={0.1} className="h-full" style={{ minHeight: 420 }}>
                            <ReputationCell />
                        </BentoCard>
                    </div>

                    {/* C — Speed: 2 cols */}
                    <div className="md:col-span-2">
                        <BentoCard color="#C6FF1A" label="On-Chain Speed" title="Confirmed before you blink" delay={0.15}>
                            <SpeedCell />
                        </BentoCard>
                    </div>

                    {/* D — Streak: 2 cols */}
                    <div className="md:col-span-2">
                        <BentoCard color="#FBBF24" label="Daily Streaks" title="Show up daily, earn exponentially" delay={0.2}>
                            <SecurityCell />
                        </BentoCard>
                    </div>
                </div>
            </div>
        </section>
    )
}
