'use client'

import { motion, useAnimation, useInView, animate } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import {
    RiWallet3Line, RiCheckLine, RiFlashlightLine,
    RiBrainLine, RiTokenSwapLine, RiArrowRightLine,
    RiShieldCheckLine, RiTimeLine, RiArrowUpLine,
} from 'react-icons/ri'

// ─── Shared section header ─────────────────────────────────────────────────────
function SectionHeading() {
    return (
        <div className="text-center mb-16">
            <h2
                className="text-3xl md:text-4xl font-black text-white mt-4 mb-3 tracking-tight"
            >
                How&nbsp;<span style={{ color: '#C6FF1A' }}>SYNTHOS</span>&nbsp;Works
            </h2>
            <p className="text-white/35 mt-3 text-base max-w-xs mx-auto leading-relaxed">
                Three steps from zero to earning on-chain
            </p>
        </div>
    )
}

// ─── Card shell ───────────────────────────────────────────────────────────────
function Card({ step, color, title, desc, children, delay = 0 }) {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: '-80px' })

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 36 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-2xl flex flex-col overflow-hidden"
            style={{
                border: '1px solid rgba(255,255,255,0.07)',
                background: 'rgba(255,255,255,0.025)',
            }}
        >
            {/* Top accent line */}
            <div className="absolute top-0 left-6 right-6 h-px" style={{ background: `linear-gradient(90deg, transparent, ${color}55, transparent)` }} />

            {/* Header */}
            <div className="px-6 pt-7 pb-5 flex-shrink-0">
                <div className="flex items-start justify-between mb-4">
                    {/* <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: `${color}12`, border: `1px solid ${color}25` }}>
                        <span className="text-xs font-black" style={{ color }}>{step}</span>
                    </div> */}
                    <span className="text-white/12 text-5xl font-black leading-none select-none"
                        style={{ color: `${color}12` }}>{String(step).padStart(2, '0')}</span>
                </div>
                <h3 className="text-base font-bold text-white mb-1.5">{title}</h3>
                <p className="text-white/38 text-sm leading-relaxed">{desc}</p>
            </div>

            {/* Animated illustration area */}
            <div className="mx-4 mb-4 flex-1 rounded-xl overflow-hidden"
                style={{ minHeight: 220, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}>
                {children}
            </div>
        </motion.div>
    )
}

// ══════════════════════════════════════════════════════════════
// CARD 1: Connect Wallet — typing address, pulsing chain badge
// ══════════════════════════════════════════════════════════════
const WALLET_ADDR = '0x4F3a...C7B2'
const WALLET_FULL = '0x4F3aC91BE88f2d9c71e3C7B2'

function WalletCard() {
    const [phase, setPhase] = useState(0)
    // 0 = idle, 1 = connecting, 2 = connected, 3 = reset
    const [typed, setTyped] = useState('')

    useEffect(() => {
        let timer
        const loop = () => {
            // Phase 0 → 1: start typing
            timer = setTimeout(() => setPhase(1), 1200)
        }
        loop()
        return () => clearTimeout(timer)
    }, [])

    // Typing effect when phase === 1
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
        }, 55)
        return () => clearInterval(t)
    }, [phase])

    // After connected, reset loop
    useEffect(() => {
        if (phase !== 2) return
        const t = setTimeout(() => {
            setPhase(0)
            setTyped('')
            setTimeout(() => setPhase(1), 800)
        }, 3000)
        return () => clearTimeout(t)
    }, [phase])

    const isConnected = phase === 2

    return (
        <div className="w-full h-full p-4 flex flex-col gap-3 select-none">
            {/* Wallet icon + status */}
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: '#C6FF1A14', border: '1px solid #C6FF1A25' }}>
                    <RiWallet3Line style={{ color: '#C6FF1A' }} className="text-base" />
                </div>
                <div className="flex-1">
                    <div className="text-white/70 text-xs font-semibold">MetaMask</div>
                    <div className="text-white/28 text-[10px]">BNB Smart Chain</div>
                </div>
                <motion.div
                    animate={isConnected
                        ? { scale: [1, 1.15, 1], opacity: [0.8, 1, 0.8] }
                        : { scale: 1, opacity: 0.3 }}
                    transition={{ duration: 1.5, repeat: isConnected ? Infinity : 0 }}
                    className="w-2 h-2 rounded-full"
                    style={{ background: isConnected ? '#C6FF1A' : '#6b7280' }}
                />
            </div>

            {/* Address field */}
            <div className="rounded-lg p-3 font-mono text-xs"
                style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="text-white/22 text-[9px] mb-1 uppercase tracking-wider">Wallet Address</div>
                <div className="text-white/75 truncate">
                    {phase === 0 ? <span className="text-white/20">Connect your wallet…</span>
                        : phase === 1 ? <>{typed}<motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} className="text-[#C6FF1A]">|</motion.span></>
                            : WALLET_ADDR
                    }
                </div>
            </div>

            {/* Network badge */}
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
                    style={{ background: '#FBBF2410', border: '1px solid #FBBF2422' }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FBBF24] inline-block" />
                    <span className="text-[#FBBF24] text-[10px] font-bold">BNB Chain</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
                    style={{ background: '#34D39910', border: '1px solid #34D39922' }}>
                    <RiShieldCheckLine className="text-[#34D399] text-xs" />
                    <span className="text-[#34D399] text-[10px] font-bold">Non-custodial</span>
                </div>
            </div>

            {/* Connect button animation */}
            <motion.div
                animate={isConnected
                    ? { background: ['rgba(198,255,26,0.12)', 'rgba(198,255,26,0.18)', 'rgba(198,255,26,0.12)'] }
                    : { background: 'rgba(198,255,26,0.08)' }}
                transition={{ duration: 1.6, repeat: isConnected ? Infinity : 0 }}
                className="rounded-xl px-4 py-2.5 flex items-center justify-center gap-2"
                style={{ border: '1px solid rgba(198,255,26,0.2)' }}
            >
                {isConnected
                    ? <><RiCheckLine style={{ color: '#C6FF1A' }} className="text-sm" /><span className="text-[#C6FF1A] text-xs font-bold">Wallet Connected</span></>
                    : <><RiWallet3Line style={{ color: '#C6FF1A' }} className="text-sm" /><span className="text-[#C6FF1A] text-xs font-semibold">Connect Wallet</span></>
                }
            </motion.div>
        </div>
    )
}

// ══════════════════════════════════════════════════════════════
// CARD 2: AI Task — cycling tasks, progress bar, selection
// ══════════════════════════════════════════════════════════════
const TASKS = [
    {
        type: 'Label',
        color: '#60A5FA',
        question: 'Is this AI response accurate?',
        options: ['Accurate ✓', 'Needs edit', 'Incorrect'],
        correct: 0,
        reward: '+0.8 SYNTR',
    },
    {
        type: 'Validate',
        color: '#A78BFA',
        question: 'Classify the sentiment of this text',
        options: ['Positive', 'Neutral', 'Negative'],
        correct: 1,
        reward: '+1.2 SYNTR',
    },
    {
        type: 'Review',
        color: '#C6FF1A',
        question: 'Does this image match the caption?',
        options: ['Yes, matches', 'Partially', 'No match'],
        correct: 0,
        reward: '+0.6 SYNTR',
    },
]

function TaskCard() {
    const [taskIdx, setTaskIdx] = useState(0)
    const [selected, setSelected] = useState(null)
    const [progress, setProgress] = useState(0)
    const [showReward, setShowReward] = useState(false)

    const task = TASKS[taskIdx]

    useEffect(() => {
        let mounted = true
        setSelected(null)
        setProgress(0)
        setShowReward(false)

        // Fill progress bar
        const startTime = Date.now()
        const duration = 1800
        const raf = () => {
            const p = Math.min((Date.now() - startTime) / duration, 1)
            if (mounted) setProgress(p)
            if (p < 1) requestAnimationFrame(raf)
            else {
                // Select correct
                if (mounted) setSelected(task.correct)
                setTimeout(() => { if (mounted) setShowReward(true) }, 500)
                setTimeout(() => {
                    if (mounted) {
                        setShowReward(false)
                        setTaskIdx(i => (i + 1) % TASKS.length)
                    }
                }, 2000)
            }
        }
        const id = requestAnimationFrame(raf)
        return () => { mounted = false; cancelAnimationFrame(id) }
    }, [taskIdx])

    return (
        <div className="w-full h-full p-4 flex flex-col gap-3 select-none">
            {/* Task header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <RiBrainLine style={{ color: task.color }} className="text-base" />
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: task.color }}>{task.type} Task</span>
                </div>
                <div className="text-[10px] text-white/30 font-mono">Task #{taskIdx + 1}/3</div>
            </div>

            {/* Progress bar */}
            <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <motion.div
                    className="h-full rounded-full"
                    style={{ width: `${progress * 100}%`, background: task.color, transition: 'width 0.05s linear' }}
                />
            </div>

            {/* Question */}
            <div className="text-white/70 text-xs font-medium leading-relaxed px-1">{task.question}</div>

            {/* Options */}
            <div className="flex flex-col gap-1.5">
                {task.options.map((opt, i) => {
                    const isSelected = selected === i
                    const isCorrect = i === task.correct
                    return (
                        <motion.div
                            key={`${taskIdx}-${i}`}
                            animate={isSelected
                                ? { borderColor: `${task.color}80`, background: `${task.color}12`, scale: [1, 1.015, 1] }
                                : { borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs"
                            style={{ border: '1px solid rgba(255,255,255,0.06)' }}
                        >
                            <span style={{ color: isSelected ? task.color : 'rgba(255,255,255,0.48)' }} className="font-medium">{opt}</span>
                            {isSelected && <RiCheckLine style={{ color: task.color }} className="text-sm shrink-0" />}
                        </motion.div>
                    )
                })}
            </div>

            {/* Reward toast */}
            <motion.div
                animate={showReward ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                className="flex items-center justify-center gap-2 py-2 rounded-xl"
                style={{ background: '#C6FF1A10', border: '1px solid #C6FF1A20' }}
            >
                <RiFlashlightLine className="text-[#C6FF1A] text-sm" />
                <span className="text-[#C6FF1A] text-xs font-bold">{task.reward} earned!</span>
            </motion.div>
        </div>
    )
}

// ══════════════════════════════════════════════════════════════
// CARD 3: Earn — live token stream + balance counter
// ══════════════════════════════════════════════════════════════
const TX_POOL = [
    { addr: '0x4F3a…C7B2', amount: '+2.40', age: '1s ago' },
    { addr: '0x91BE…88f2', amount: '+0.80', age: '3s ago' },
    { addr: '0x3aC9…1e3C', amount: '+1.20', age: '7s ago' },
    { addr: '0x7B2d…9c71', amount: '+0.60', age: '12s ago' },
]

function EarnCard() {
    const [balance, setBalance] = useState(1248.6)
    const [txList, setTxList] = useState(TX_POOL.slice(0, 3))
    const balanceRef = useRef(balance)

    // Add new tx every 2.2s
    useEffect(() => {
        const amounts = [0.6, 0.8, 1.2, 2.4, 0.4]
        let idx = 0
        const t = setInterval(() => {
            const amt = amounts[idx % amounts.length]
            idx++
            const newTx = { addr: TX_POOL[idx % TX_POOL.length].addr, amount: `+${amt.toFixed(2)}`, age: 'just now' }
            setTxList(prev => [newTx, ...prev].slice(0, 4))
            setBalance(prev => parseFloat((prev + amt).toFixed(2)))
        }, 2200)
        return () => clearInterval(t)
    }, [])

    return (
        <div className="w-full h-full p-4 flex flex-col gap-3 select-none">
            {/* Balance display */}
            <div className="rounded-xl p-4 text-center"
                style={{ background: 'rgba(198,255,26,0.04)', border: '1px solid rgba(198,255,26,0.12)' }}>
                <div className="text-white/30 text-[9px] uppercase tracking-[0.2em] mb-1 font-semibold">Your SYNTR Balance</div>
                <motion.div
                    key={Math.floor(balance)}
                    initial={{ scale: 1.05, color: '#C6FF1A' }}
                    animate={{ scale: 1, color: '#ffffff' }}
                    transition={{ duration: 0.4 }}
                    className="text-2xl font-black tracking-tight"
                >
                    {balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    <span className="text-sm font-bold text-white/40 ml-1.5">SYNTR</span>
                </motion.div>
                <div className="flex items-center justify-center gap-1 mt-1.5">
                    <RiArrowUpLine className="text-[#34D399] text-xs" />
                    <span className="text-[#34D399] text-[10px] font-semibold">+12.4% this week</span>
                </div>
            </div>

            {/* Live tx feed */}
            <div className="text-[9px] text-white/25 uppercase tracking-[0.18em] font-semibold mb-0.5 px-1">Live Transactions</div>
            <div className="flex flex-col gap-1.5 overflow-hidden" style={{ maxHeight: 110 }}>
                {txList.map((tx, i) => (
                    <motion.div
                        key={`${tx.addr}-${i}-${tx.age}`}
                        initial={i === 0 ? { opacity: 0, y: -10 } : { opacity: 1, y: 0 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35 }}
                        className="flex items-center justify-between px-2.5 py-1.5 rounded-lg"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
                    >
                        <div className="flex items-center gap-2">
                            <RiTokenSwapLine className="text-[#60A5FA] text-xs shrink-0" />
                            <span className="font-mono text-white/45 text-[10px]">{tx.addr}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[#C6FF1A] text-[10px] font-bold">{tx.amount}</span>
                            <span className="text-white/20 text-[9px]">{tx.age}</span>
                        </div>
                    </motion.div>
                ))}
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
            color: '#C6FF1A',
            title: 'Connect Wallet',
            desc: 'Link your BNB Chain wallet in one click. No KYC, no middlemen, full custody.',
            delay: 0,
            children: <WalletCard />,
        },
        {
            step: 2,
            color: '#60A5FA',
            title: 'Complete AI Tasks',
            desc: 'Label data, validate AI outputs, and answer research prompts. Each task pays.',
            delay: 0.12,
            children: <TaskCard />,
        },
        {
            step: 3,
            color: '#A78BFA',
            title: 'Earn On-Chain',
            desc: 'SYNTR tokens land in your wallet instantly. Claim, stake, or trade anytime.',
            delay: 0.24,
            children: <EarnCard />,
        },
    ]

    return (
        <section id="how-it-works" className="px-4 sm:px-6 py-14">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55 }}
                >
                    <SectionHeading />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {cards.map((c) => (
                        <Card key={c.step} {...c} />
                    ))}
                </div>
            </div>
        </section>
    )
}
