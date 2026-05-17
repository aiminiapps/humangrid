'use client'

import { motion, useAnimation, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import {
    RiWallet3Line, RiCheckLine, RiFlashlightLine,
    RiBrainLine, RiTokenSwapLine, RiArrowRightLine,
    RiShieldCheckLine, RiTimeLine, RiArrowUpLine, RiBarChartBoxLine, RiTaskLine
} from 'react-icons/ri'

// ─── Shared section header ─────────────────────────────────────────────────────
function SectionHeading() {
    return (
        <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mt-2 mb-4 tracking-tight leading-[1.1]">
                Decentralized AI Training <br /> Data Platform
            </h2>
            <p className="text-slate-500 mt-5 text-lg text-balance max-w-2xl mx-auto leading-relaxed">
                Join the community-powered AI data labeling, verification, and reward ecosystem. 
                Complete micro-tasks and earn <span className="font-bold text-slate-800">HGAI</span> natively.
            </p>
        </div>
    )
}

// ─── Card shell ───────────────────────────────────────────────────────────────
function Card({ color, title, desc, children, delay = 0, isHighlight = false }) {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: '-40px' })

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40, scale: 0.96, filter: 'blur(8px)' }}
            animate={inView ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' } : {}}
            transition={{ duration: 0.8, delay, type: "spring", stiffness: 70, damping: 20 }}
            className={`group relative rounded-3xl flex flex-col p-5 sm:p-6 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(255,113,0,0.25)] bg-white ${
                isHighlight ? 'shadow-[0_12px_40px_-10px_rgba(255,113,0,0.15)]' : 'shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)]'
            }`}
            style={{
                border: isHighlight ? '2px solid rgba(255,113,0,0.15)' : '1px solid rgba(0,0,0,0.04)',
            }}
        >
            {/* Orange gradient background */}
            <div 
                className="absolute inset-0 w-full h-full pointer-events-none z-0 transition-opacity duration-500 opacity-60 group-hover:opacity-100"
                style={{ background: 'linear-gradient(180deg, rgba(255,113,0,0.15) 0%, rgba(255,113,0,0.02) 50%, transparent 100%)' }}
            />
            {/* Noise grain effect */}
            <div 
                className="absolute inset-0 w-full h-full pointer-events-none z-0 mix-blend-overlay opacity-50 group-hover:opacity-80 transition-opacity duration-500"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.25'/%3E%3C/svg%3E")` }}
            />

            {/* Animated illustration area */}
            <div className="mb-6 flex-1 rounded-2xl overflow-hidden bg-[#FAFAFC] relative flex items-center justify-center p-4 sm:p-6 shadow-inner z-10"
                style={{ minHeight: 260, border: '1px solid rgba(0,0,0,0.03)' }}>
                {children}
            </div>
            
            {/* Header / Text content */}
            <div className="flex-shrink-0 z-10 px-1">
                <h3 className="text-lg font-bold text-slate-900 mb-2 tracking-tight">{title}</h3>
                <p className="text-slate-500 text-[15px] leading-relaxed">{desc}</p>
            </div>
        </motion.div>
    )
}

// ══════════════════════════════════════════════════════════════
// CARD 1: Connect Wallet (Light Theme)
// ══════════════════════════════════════════════════════════════
const WALLET_ADDR = '0x4F3a...C7B2'
const WALLET_FULL = '0x4F3aC91BE88f2d9c71e3C7B2'

function WalletCard() {
    // Phase 0 = idle, 1 = connecting, 2 = connected
    const [phase, setPhase] = useState(0)
    const [typed, setTyped] = useState('')

    useEffect(() => {
        let timer = setTimeout(() => setPhase(1), 1200)
        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        if (phase !== 1) return
        let i = 0
        setTyped('')
        const t = setInterval(() => {
            i++
            setTyped(WALLET_FULL.slice(0, i))
            if (i >= WALLET_FULL.length) {
                clearInterval(t)
                setTimeout(() => setPhase(2), 600)
            }
        }, 40)
        return () => clearInterval(t)
    }, [phase])

    useEffect(() => {
        if (phase !== 2) return
        const t = setTimeout(() => {
            setPhase(0)
            setTyped('')
            setTimeout(() => setPhase(1), 800)
        }, 3500)
        return () => clearTimeout(t)
    }, [phase])

    const isConnected = phase === 2

    return (
        <div className="w-full h-full flex flex-col justify-center gap-4 select-none max-w-[280px]">
            {/* Top Bar */}
            <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#FF7100]/10 border border-[#FF7100]/20">
                        <RiWallet3Line className="text-[#FF7100] text-sm" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-slate-800 text-[11px] font-bold">MetaMask</span>
                        <span className="text-slate-400 text-[9px]">BNB Chain</span>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded-md border border-slate-100">
                    <motion.div
                        animate={isConnected ? { scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] } : { scale: 1, opacity: 0.3 }}
                        transition={{ duration: 1.5, repeat: isConnected ? Infinity : 0 }}
                        className="w-1.5 h-1.5 rounded-full bg-[#10B981]"
                        style={{ backgroundColor: isConnected ? '#10B981' : '#CBD5E1' }}
                    />
                    <span className="text-[9px] font-semibold text-slate-500">{isConnected ? 'Connected' : 'Offline'}</span>
                </div>
            </div>

            {/* Address Field */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex flex-col gap-1.5">
                <span className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold">Wallet Address</span>
                <div className="font-mono text-xs text-slate-700 h-4 truncate">
                    {phase === 0 ? <span className="text-slate-300">Awaiting connection...</span>
                        : phase === 1 ? <>{typed}<motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} className="text-[#FF7100]">|</motion.span></>
                        : <span className="text-slate-700 font-bold">{WALLET_ADDR}</span>
                    }
                </div>
            </div>

            {/* Connecting animation */}
            <motion.div
                animate={isConnected ? { background: '#F0FDF4', borderColor: '#BBF7D0' } : { background: '#FFF7ED', borderColor: '#FFEDD5' }}
                className="rounded-xl px-4 py-3 flex items-center justify-center gap-2 border transition-colors"
            >
                {isConnected
                    ? <><RiCheckLine className="text-[#10B981] text-sm" /><span className="text-[#10B981] text-xs font-bold">Authentication Success</span></>
                    : <><RiWallet3Line className="text-[#FF7100] text-sm" /><span className="text-[#FF7100] text-xs font-bold">Connecting Wallet...</span></>
                }
            </motion.div>
        </div>
    )
}

// ══════════════════════════════════════════════════════════════
// CARD 2: AI Task Validation (Light Theme)
// ══════════════════════════════════════════════════════════════
const TASKS = [
    { type: 'Sentiment', color: '#3B82F6', question: 'Analyze output emotion', options: ['Positive', 'Neutral', 'Negative'], correct: 0 },
    { type: 'Safety', color: '#F59E0B', question: 'Flag inappropriate content', options: ['Safe', 'Warning', 'Violates Policy'], correct: 2 },
    { type: 'Logic', color: '#10B981', question: 'Verify factual accuracy', options: ['Accurate ✓', 'Needs edit', 'False'], correct: 0 },
]

function TaskCard() {
    const [taskIdx, setTaskIdx] = useState(0)
    const [selected, setSelected] = useState(null)
    const [progress, setProgress] = useState(0)
    
    const task = TASKS[taskIdx]

    useEffect(() => {
        let mounted = true
        setSelected(null)
        setProgress(0)

        const startTime = Date.now()
        const duration = 2000
        const raf = () => {
            const p = Math.min((Date.now() - startTime) / duration, 1)
            if (mounted) setProgress(p)
            if (p < 1) requestAnimationFrame(raf)
            else {
                if (mounted) setSelected(task.correct)
                setTimeout(() => {
                    if (mounted) setTaskIdx(i => (i + 1) % TASKS.length)
                }, 1500)
            }
        }
        const id = requestAnimationFrame(raf)
        return () => { mounted = false; cancelAnimationFrame(id) }
    }, [taskIdx])

    return (
        <div className="w-full h-full flex flex-col justify-center gap-3 select-none max-w-[280px]">
            {/* Header */}
            <div className="flex items-center justify-between bg-white px-3 py-2.5 rounded-lg shadow-sm border border-slate-100">
                <div className="flex items-center gap-2">
                    <RiBrainLine style={{ color: task.color }} className="text-sm" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700">{task.type} Task</span>
                </div>
                <div className="text-[10px] font-semibold text-slate-400 bg-slate-50 px-2 py-0.5 rounded">#0{taskIdx + 1}</div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <div className="text-slate-800 text-[13px] font-semibold mb-3 leading-snug">{task.question}</div>
                
                {/* Options */}
                <div className="flex flex-col gap-2">
                    {task.options.map((opt, i) => {
                        const isSelected = selected === i
                        return (
                            <motion.div
                                key={`${taskIdx}-${i}`}
                                animate={isSelected
                                    ? { borderColor: `${task.color}50`, background: `${task.color}10`, scale: 1.02 }
                                    : { borderColor: '#F1F5F9', background: '#FFFFFF', scale: 1 }}
                                className="flex items-center justify-between px-3 py-2 rounded-lg text-xs border"
                            >
                                <span className={isSelected ? 'font-bold text-slate-800' : 'font-medium text-slate-500'}>{opt}</span>
                                {isSelected && <RiCheckLine style={{ color: task.color }} className="text-sm shrink-0" />}
                            </motion.div>
                        )
                    })}
                </div>
            </div>

            {/* Progress */}
            <div className="h-1.5 rounded-full overflow-hidden bg-slate-200 mt-1">
                <motion.div
                    className="h-full rounded-full"
                    style={{ width: `${progress * 100}%`, background: task.color }}
                />
            </div>
        </div>
    )
}

// ══════════════════════════════════════════════════════════════
// CARD 3: Tracking Pipeline (Bar Chart)
// ══════════════════════════════════════════════════════════════
function PipelineCard() {
    const bars = [40, 65, 30, 85, 55, 90, 75]
    const [activeIndex, setActiveIndex] = useState(5)

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex(prev => (prev + 1) % bars.length)
        }, 1200)
        return () => clearInterval(interval)
    }, [bars.length])

    return (
        <div className="w-full h-full flex flex-col justify-center bg-white p-5 rounded-2xl shadow-sm border border-slate-100 select-none max-w-[280px]">
            <div className="flex justify-between items-end mb-4">
                <div>
                    <h4 className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1">Total Tasks</h4>
                    <div className="text-2xl font-black text-slate-800">4,120</div>
                </div>
                <div className="flex items-center gap-1 bg-green-50 text-green-600 px-2 py-1 rounded font-bold text-[10px]">
                    <RiArrowUpLine /> +12%
                </div>
            </div>

            <div className="flex items-end justify-between h-24 gap-1.5 mt-2 relative">
                {/* Horizontal guide lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                    {[1,2,3].map(i => (
                        <div key={i} className="w-full h-px border-t border-dashed border-slate-200" />
                    ))}
                </div>
                
                {bars.map((height, i) => (
                    <div key={i} className="relative flex flex-col items-center flex-1 z-10 group">
                        {activeIndex === i && (
                            <motion.div 
                                initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                                className="absolute -top-7 bg-slate-800 text-white text-[9px] font-bold py-1 px-2 rounded"
                            >
                                {height * 12}
                            </motion.div>
                        )}
                        <motion.div 
                            animate={{ 
                                height: `${height}%`,
                                backgroundColor: activeIndex === i ? '#FF7100' : '#F1F5F9'
                            }}
                            transition={{ type: 'spring', stiffness: 100 }}
                            className="w-full rounded-t-sm"
                        />
                    </div>
                ))}
            </div>
            
            <div className="flex justify-between mt-3 text-[9px] font-semibold text-slate-400">
                <span>Mon</span>
                <span>Wed</span>
                <span>Fri</span>
                <span>Sun</span>
            </div>
        </div>
    )
}

// ══════════════════════════════════════════════════════════════
// CARD 4: Total Profit (EarnCard)
// ══════════════════════════════════════════════════════════════
function EarnCard() {
    const [balance, setBalance] = useState(1248.6)

    useEffect(() => {
        const t = setInterval(() => {
            setBalance(prev => parseFloat((prev + (Math.random() * 2)).toFixed(2)))
        }, 1500)
        return () => clearInterval(t)
    }, [])

    return (
        <div className="w-full h-full flex flex-col justify-center select-none max-w-[280px]">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-4">
                <div>
                    <h4 className="text-slate-400 text-[10px] font-bold uppercase tracking-wider flex items-center justify-between">
                        Total HGAI Earned
                        <RiBarChartBoxLine className="text-slate-400 text-sm" />
                    </h4>
                    <div className="mt-2 flex items-baseline gap-1">
                        <motion.span
                            key={Math.floor(balance)}
                            initial={{ color: '#FF7100' }}
                            animate={{ color: '#1E293B' }}
                            className="text-3xl font-black tracking-tight"
                        >
                            {balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </motion.span>
                    </div>
                </div>

                <div className="h-px w-full bg-slate-100" />

                <div className="flex flex-col gap-2.5">
                    {[
                        { label: 'Classification', val: '+45.2', color: '#3B82F6' },
                        { label: 'Validation', val: '+12.8', color: '#10B981' },
                        { label: 'RLHF Feedback', val: '+84.5', color: '#8B5CF6' },
                    ].map(item => (
                        <div key={item.label} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="text-[11px] font-medium text-slate-600">{item.label}</span>
                            </div>
                            <span className="text-[11px] font-bold text-slate-800">{item.val}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

// ══════════════════════════════════════════════════════════════
// MAIN EXPORT
// ══════════════════════════════════════════════════════════════
export default function HowItWorks() {
    const cards = [
        {
            step: 1,
            title: 'Secure Authentication',
            desc: 'Connect your BNB Chain wallet instantly. Enter the HumanGrid AI Data Network securely and anonymously.',
            delay: 0,
            isHighlight: true,
            children: <WalletCard />,
        },
        {
            step: 2,
            title: 'Label-to-Earn Tasks',
            desc: 'Provide community-powered AI data labeling and verification. Refine models through our decentralized platform.',
            delay: 0.1,
            isHighlight: false,
            children: <TaskCard />,
        },
        {
            step: 3,
            title: 'Data Pipeline Tracking',
            desc: 'Monitor your data contributions across the platform in real-time. Watch your verification output scale.',
            delay: 0.2,
            isHighlight: false,
            children: <PipelineCard />,
        },
        {
            step: 4,
            title: 'Instant HGAI Rewards',
            desc: 'Our reward ecosystem pays HGAI directly to your wallet for every approved labeling task. Zero friction.',
            delay: 0.3,
            isHighlight: false,
            children: <EarnCard />,
        },
    ]

    return (
        <section id="how-it-works" className="px-4 sm:px-6 py-20 bg-[#FAFAFC] relative">
            <div className="max-w-6xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55 }}
                >
                    <SectionHeading />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                    {cards.map((c) => (
                        <Card key={c.step} {...c} />
                    ))}
                </div>
            </div>
        </section>
    )
}
