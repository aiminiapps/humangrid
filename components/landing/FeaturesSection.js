'use client'

import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import {
    RiBrainLine, RiShieldCheckLine,
    RiTrophyLine, RiCheckLine,
    RiStarLine, RiCpuLine,
    RiDatabase2Line, RiImageLine, RiFileTextLine,
    RiKey2Line, RiNodeTree
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
function BentoCard({ className = '', style = {}, color = '#FF7100', label, title, children, delay = 0 }) {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: '-60px' })

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.7, delay, type: 'spring', stiffness: 70, damping: 20 }}
            className={`relative rounded-[2rem] overflow-hidden flex flex-col group bg-white shadow-[0_8px_30px_-12px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 border border-slate-100 ${className}`}
            style={style}
        >
            {/* Subtle corner glow on hover */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none blur-3xl rounded-full"
                style={{ background: color, opacity: 0.05 }} />

            <div className="px-6 pt-6 pb-4 shrink-0 relative z-10">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold" style={{ color: color }}>{label}</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 leading-snug tracking-tight">{title}</h3>
            </div>

            <div className="flex-1 px-6 pb-6 min-h-0 overflow-hidden relative z-10">{children}</div>
        </motion.div>
    )
}

// ══════════════════════════════════════════════════════════════
// CELL A — AI Task Matching
// ══════════════════════════════════════════════════════════════
const TASK_TYPES = [
    { icon: RiFileTextLine, label: 'Text Labeling', score: 94, color: '#FF7100' },
    { icon: RiImageLine, label: 'Image Review', score: 88, color: '#3B82F6' },
    { icon: RiDatabase2Line, label: 'Data Ranking', score: 91, color: '#8B5CF6' },
    { icon: RiCpuLine, label: 'Model Validation', score: 85, color: '#10B981' },
]

function AIMatchingCell() {
    const [active, setActive] = useState(0)
    const [score, setScore] = useState(0)
    const [scanning, setScanning] = useState(false)

    useEffect(() => {
        let cancelled = false
        const run = async () => {
            while (!cancelled) {
                setScanning(true)
                setScore(0)
                await new Promise(r => setTimeout(r, 400))
                const target = TASK_TYPES[active % TASK_TYPES.length].score
                const interval = setInterval(() => {
                    setScore(prev => Math.min(prev + 3, target))
                }, 28)
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
        <div className="flex flex-col gap-4 select-none mt-2">
            {/* Active scanner */}
            <div className="rounded-2xl p-4 relative overflow-hidden transition-colors duration-500"
                style={{ background: `${current.color}0A`, border: `1px solid ${current.color}20` }}>
                <AnimatePresence>
                    {scanning && (
                        <motion.div
                            key="sweep"
                            initial={{ x: '-100%' }}
                            animate={{ x: '300%' }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8, ease: 'linear' }}
                            className="absolute inset-y-0 w-1/2 pointer-events-none"
                            style={{ background: `linear-gradient(90deg, transparent, ${current.color}15, transparent)` }}
                        />
                    )}
                </AnimatePresence>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-white shadow-sm border border-slate-100">
                            <current.icon style={{ color: current.color }} className="text-xl" />
                        </div>
                        <div>
                            <div className="text-slate-800 text-sm font-bold">{current.label}</div>
                            <div className="text-slate-400 text-[11px] font-medium">{scanning ? 'Analyzing dataset...' : 'Perfect Match Found'}</div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-black leading-none" style={{ color: current.color }}>{score}%</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Accuracy</div>
                    </div>
                </div>
                {/* Score bar */}
                <div className="mt-4 h-2 rounded-full overflow-hidden bg-slate-100">
                    <motion.div
                        className="h-full rounded-full"
                        animate={{ width: `${score}%` }}
                        transition={{ ease: 'linear', duration: 0.05 }}
                        style={{ background: `linear-gradient(90deg, ${current.color}80, ${current.color})` }}
                    />
                </div>
            </div>

            {/* Queue */}
            <div className="flex flex-col gap-2">
                {TASK_TYPES.map((t, i) => {
                    const isActive = i === active
                    return (
                        <motion.div
                            key={t.label}
                            animate={{ opacity: isActive ? 1 : 0.4, x: isActive ? 4 : 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex items-center justify-between px-3 py-2.5 rounded-xl border"
                            style={{
                                background: isActive ? '#FFFFFF' : 'transparent',
                                borderColor: isActive ? 'rgba(0,0,0,0.05)' : 'transparent',
                                boxShadow: isActive ? '0 2px 8px -2px rgba(0,0,0,0.05)' : 'none'
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <t.icon className="text-sm shrink-0" style={{ color: t.color }} />
                                <span className="text-[13px] font-semibold text-slate-600">{t.label}</span>
                            </div>
                            <motion.div
                                animate={isActive ? { opacity: [0.4, 1, 0.4], scale: [0.8, 1, 0.8] } : { opacity: 1, scale: 1 }}
                                transition={{ duration: 1.4, repeat: Infinity }}
                                className="w-2 h-2 rounded-full"
                                style={{ background: isActive ? t.color : '#E2E8F0' }}
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
// ══════════════════════════════════════════════════════════════
const RANKS = [
    { name: 'Novice', color: '#94A3B8', xpMax: 500, mult: '1.0x', icon: RiStarLine },
    { name: 'Validator', color: '#3B82F6', xpMax: 1200, mult: '1.5x', icon: RiCheckLine },
    { name: 'Expert', color: '#8B5CF6', xpMax: 3000, mult: '2.0x', icon: RiBrainLine },
    { name: 'Master', color: '#FF7100', xpMax: 6000, mult: '3.0x', icon: RiTrophyLine },
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
        <div className="flex flex-col gap-5 select-none h-full mt-2">
            {/* Rank badge */}
            <div className="relative flex flex-col items-center py-6 rounded-2xl overflow-hidden transition-colors duration-500"
                style={{ background: `${rank.color}08`, border: `1px solid ${rank.color}15` }}>
                
                {sparks && [15, 30, 50, 70, 85].map((x, i) => (
                    <Particle key={i} color={rank.color} delay={i * 0.1} x={x} size={4} />
                ))}

                <motion.div
                    key={`badge-${ri}`}
                    initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 250, damping: 20 }}
                    className="w-20 h-20 rounded-3xl flex items-center justify-center mb-4 relative bg-white shadow-sm border border-slate-100"
                >
                    <rank.icon style={{ color: rank.color }} className="text-4xl" />
                    {sparks && (
                        <motion.div
                            animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.6, 0] }}
                            transition={{ duration: 0.6 }}
                            className="absolute inset-0 rounded-3xl"
                            style={{ background: rank.color, opacity: 0 }}
                        />
                    )}
                </motion.div>

                <AnimatePresence mode="popLayout">
                    <motion.div
                        key={`name-${ri}`}
                        initial={{ y: 15, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                        className="text-2xl font-black tracking-tight" style={{ color: rank.color }}>
                        {rank.name}
                    </motion.div>
                </AnimatePresence>
                <div className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mt-1.5">Network Rank</div>
            </div>

            {/* XP */}
            <div>
                <div className="flex justify-between mb-2 px-1">
                    <span className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">Experience</span>
                    <motion.span key={xp} className="text-[12px] font-black" style={{ color: rank.color }}>
                        {xp.toLocaleString()} XP
                    </motion.span>
                </div>
                <div className="h-3 rounded-full overflow-hidden relative bg-slate-100">
                    <motion.div className="h-full rounded-full relative"
                        style={{ background: `linear-gradient(90deg, ${rank.color}90, ${rank.color})` }}
                        animate={{ width: `${Math.min(pct, 100)}%` }}
                        transition={{ ease: 'linear', duration: 0.05 }}
                    >
                        <motion.div
                            className="absolute inset-0"
                            animate={{ x: ['-100%', '200%'] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', repeatDelay: 0.5 }}
                            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)' }}
                        />
                    </motion.div>
                </div>
                <div className="flex justify-between mt-1.5 px-1">
                    <span className="text-slate-300 text-[10px] font-semibold">0</span>
                    <span className="text-slate-300 text-[10px] font-semibold">{rank.xpMax.toLocaleString()} XP</span>
                </div>
            </div>

            {/* Multiplier */}
            <div className="grid grid-cols-2 gap-3 mt-auto">
                <div className="rounded-2xl p-4 text-center border transition-colors duration-500"
                    style={{ background: `${rank.color}05`, borderColor: `${rank.color}20` }}>
                    <div className="text-3xl font-black tracking-tighter" style={{ color: rank.color }}>{rank.mult}</div>
                    <div className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-widest">HGAI Bonus</div>
                </div>
                <div className="rounded-2xl p-4 text-center bg-slate-50 border border-slate-100">
                    <div className="text-3xl font-black tracking-tighter text-slate-700">
                        {Math.round(100 - pct)}<span className="text-lg text-slate-400">%</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-widest">To Next Rank</div>
                </div>
            </div>
        </div>
    )
}

// ══════════════════════════════════════════════════════════════
// CELL C — On-Chain Speed
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
        <div className="flex flex-col gap-4 select-none h-full mt-2">
            <div className="flex items-end gap-2">
                <motion.span
                    key={ms}
                    initial={{ y: -8, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className="text-4xl font-black tracking-tighter text-slate-800"
                >{ms}</motion.span>
                <div className="mb-1">
                    <div className="text-slate-400 text-sm font-bold leading-none">ms</div>
                    <div className="text-slate-400 text-[10px] leading-none mt-1 font-semibold uppercase tracking-wider">avg finality</div>
                </div>
            </div>

            {/* Waveform */}
            <div className="flex items-end gap-1.5 h-16 mt-2">
                {history.map((v, i) => {
                    const h = 15 + ((v - minH) / Math.max(maxH - minH, 1)) * 40
                    const isLast = i === history.length - 1
                    return (
                        <motion.div
                            key={i}
                            animate={{ height: h }}
                            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                            className="flex-1 rounded-t-md"
                            style={{
                                background: isLast ? '#10B981' : '#E2E8F0',
                            }}
                        />
                    )
                })}
            </div>

            {/* Block feed */}
            <div className="flex flex-col gap-2 flex-1 mt-2">
                {blocks.map((b, i) => (
                    <motion.div
                        key={b.id}
                        initial={i === 0 ? { opacity: 0, x: -12 } : { opacity: 1 }}
                        animate={{ opacity: 1 - i * 0.3, x: 0 }}
                        transition={{ duration: 0.35, type: 'spring', stiffness: 300 }}
                        className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-100"
                    >
                        <div className="flex items-center gap-2.5">
                            <motion.div animate={i === 0 ? { scale: [1, 1.3, 1] } : {}} transition={{ duration: 0.4 }}>
                                <RiCheckLine className="text-[#10B981] text-sm" />
                            </motion.div>
                            <span className="text-slate-500 font-mono text-[11px] font-semibold">
                                Block #{b.num.toLocaleString()}
                            </span>
                        </div>
                        <span className="font-mono text-[11px] font-bold" style={{ color: b.ms < 300 ? '#10B981' : '#F59E0B' }}>
                            {b.ms}ms
                        </span>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

// ══════════════════════════════════════════════════════════════
// CELL D — Security
// ══════════════════════════════════════════════════════════════
const CHECKS = [
    { label: 'No KYC required', color: '#10B981' },
    { label: 'Your keys, your tokens', color: '#10B981' },
    { label: 'Audited smart contracts', color: '#3B82F6' },
    { label: 'Zero platform custody', color: '#8B5CF6' },
    { label: 'Instant withdrawals', color: '#FF7100' },
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
        <div className="flex flex-col gap-2 select-none h-full mt-2">
            {CHECKS.map((c, i) => {
                const isActive = i === activeCheck
                return (
                    <motion.div
                        key={c.label}
                        animate={{
                            background: isActive ? `${c.color}0A` : '#F8FAFC',
                            borderColor: isActive ? `${c.color}30` : 'transparent',
                        }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center gap-3 px-3.5 py-3 rounded-xl border border-transparent"
                    >
                        <motion.div
                            animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                            transition={{ duration: 0.3 }}
                            className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 bg-white shadow-sm border border-slate-100">
                            <RiShieldCheckLine style={{ color: isActive ? c.color : '#CBD5E1', fontSize: 12 }} />
                        </motion.div>
                        <span className="text-[13px] font-semibold" style={{ color: isActive ? '#1E293B' : '#64748B' }}>
                            {c.label}
                        </span>
                        {isActive && (
                            <motion.div initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="ml-auto">
                                <RiKey2Line style={{ color: c.color }} className="text-sm" />
                            </motion.div>
                        )}
                    </motion.div>
                )
            })}
        </div>
    )
}

// ══════════════════════════════════════════════════════════════
// MAIN EXPORT
// ══════════════════════════════════════════════════════════════
export default function FeaturesSection() {
    return (
        <section id="features" className="px-4 sm:px-6 py-20 bg-[#FAFAFC] relative overflow-hidden">
            <div className="max-w-7xl mx-auto relative z-10">
                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-5 leading-[1.1]">
                        Built for <span className="text-[#FF7100]">Serious Contributors</span>
                    </h2>
                    <p className="text-slate-500 text-lg max-w-2xl text-balance mx-auto leading-relaxed">
                        Every tool and feature in the HumanGrid ecosystem is engineered to maximize your HGAI rewards and streamline your labeling workflow.
                    </p>
                </motion.div>

                {/* Clean Light Theme Bento grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">

                    {/* A — AI Matching: 2 cols on LG */}
                    <div className="md:col-span-2 lg:col-span-2">
                        <BentoCard color="#FF7100" label="Smart Matching" title="AI assigns optimal datasets instantly" delay={0}>
                            <AIMatchingCell />
                        </BentoCard>
                    </div>

                    {/* B — Reputation: 1 col, 2 rows on LG */}
                    <div className="md:col-span-2 lg:col-span-1 lg:row-span-2">
                        <BentoCard color="#3B82F6" label="Reputation & Ranks" title="Level up your profile, unlock bigger multipliers" delay={0.1} className="h-full" style={{ minHeight: 480 }}>
                            <ReputationCell />
                        </BentoCard>
                    </div>

                    {/* C — Speed: 1 col */}
                    <div className="md:col-span-1">
                        <BentoCard color="#10B981" label="On-Chain Finality" title="Transactions confirmed in milliseconds" delay={0.15}>
                            <SpeedCell />
                        </BentoCard>
                    </div>

                    {/* D — Security: 1 col */}
                    <div className="md:col-span-1">
                        <BentoCard color="#8B5CF6" label="Total Security" title="Decentralized, non-custodial architecture" delay={0.2}>
                            <SecurityCell />
                        </BentoCard>
                    </div>
                </div>
            </div>
        </section>
    )
}
