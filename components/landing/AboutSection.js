'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import {
    RiSearchEyeLine,
    RiBrainLine,
    RiFlashlightLine,
    RiArrowRightUpLine,
} from 'react-icons/ri'

// ─── Step data ─────────────────────────────────────────────────────────────────
const STEPS = [
    {
        num: '01',
        icon: RiSearchEyeLine,
        color: '#C6FF1A',
        title: 'Select a Task',
        desc: 'AI matches you with micro-tasks tuned to your skill data labeling, model validation, research prompts.',
    },
    {
        num: '02',
        icon: RiBrainLine,
        color: '#60A5FA',
        title: 'Complete It',
        desc: 'Answer with precision. Each submission directly trains a production AI system in real time.',
    },
    {
        num: '03',
        icon: RiFlashlightLine,
        color: '#A78BFA',
        title: 'Earn On-Chain',
        desc: 'SYNTR tokens land in your wallet the instant your task is accepted. Zero delays, zero middlemen.',
    },
]

// ─── Stat pill ────────────────────────────────────────────────────────────────
function StatPill({ val, label }) {
    return (
        <div className="flex flex-col">
            <span
                className="text-white font-black tracking-tight leading-none"
                style={{ fontSize: 'clamp(1.35rem, 3vw, 1.75rem)', letterSpacing: '-0.02em' }}
            >
                {val}
            </span>
            <span className="text-white/28 text-[10px] font-semibold uppercase tracking-[0.18em] mt-1">
                {label}
            </span>
        </div>
    )
}

// ─── Step card ────────────────────────────────────────────────────────────────
function StepCard({ step, index }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, delay: index * 0.13, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -3 }}
            className="group relative rounded-2xl p-3 transition-all duration-300 cursor-default"
            style={{
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.07)',
            }}
            onMouseEnter={e => {
                e.currentTarget.style.background = `${step.color}06`
                e.currentTarget.style.borderColor = `${step.color}22`
            }}
            onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.025)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
            }}
        >
            {/* Hover top line */}
            <div
                className="absolute inset-x-10 top-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                style={{ background: `linear-gradient(90deg, transparent, ${step.color}60, transparent)` }}
            />

            <div className="flex items-start gap-5">
                {/* Step number + icon column */}
                <div className="flex flex-col items-center gap-2 shrink-0 pt-0.5">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: `${step.color}0f`, border: `1px solid ${step.color}22` }}
                    >
                        <step.icon style={{ color: step.color }} className="text-lg" />
                    </div>
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3 mb-2">
                        <h3 className="text-[15px] font-bold text-white/80">{step.title}</h3>
                        <RiArrowRightUpLine
                            className="text-base shrink-0 opacity-0 group-hover:opacity-60 transition-opacity duration-200"
                            style={{ color: step.color }}
                        />
                    </div>
                    <p className="text-white/40 text-[13px] leading-relaxed">{step.desc}</p>
                </div>
            </div>
        </motion.div>
    )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AboutSection() {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: '-80px' })

    return (
        <section
            id="about"
            ref={ref}
            className="relative px-4 sm:px-6 py-14 overflow-hidden"
        >
            {/* Very subtle background dot grid */}
            <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(rgba(255,255,255,0.028) 1px, transparent 1px)',
                    backgroundSize: '28px 28px',
                }}
            />

            <div className="relative max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

                    {/* ── Left ──────────────────────────────────────────── */}
                    <div className="lg:sticky lg:top-28">
                        {/* Headline */}
                        <motion.h2
                            initial={{ opacity: 0, y: 22 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.07 }}
                            className="font-black text-white leading-[1.04] tracking-tight mb-6"
                            style={{
                                fontSize: 'clamp(2rem, 4.5vw, 3.2rem)',
                                letterSpacing: '-0.03em',
                            }}
                        >
                            Select&nbsp;
                            <span className="text-white/20">→</span>
                            {' '}Complete&nbsp;
                            <span className="text-white/20">→</span>
                            {' '}<span style={{ color: '#C6FF1A' }}>Earn</span>
                        </motion.h2>

                        {/* Kicker */}
                        <motion.p
                            initial={{ opacity: 0, y: 16 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.55, delay: 0.14 }}
                            className="text-white/40 text-[15px] leading-relaxed mb-10 max-w-sm"
                        >
                            SYNTHOS pairs you with real AI training tasks the moment you connect.
                            Every accepted answer sends SYNTR tokens on-chain instantly.
                        </motion.p>

                        {/* Divider */}
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={inView ? { scaleX: 1 } : {}}
                            transition={{ duration: 0.5, delay: 0.2, origin: 0 }}
                            className="h-px mb-10 origin-left"
                            style={{ background: 'rgba(255,255,255,0.06)', maxWidth: 320 }}
                        />

                        {/* Stats row */}
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: 0.24 }}
                            className="flex items-center gap-8"
                        >
                            <StatPill val="&lt;&nbsp;60s" label="avg task time" />
                            <div className="w-px h-8 bg-white/6 shrink-0" />
                            <StatPill val="100%" label="on-chain payouts" />
                            <div className="w-px h-8 bg-white/6 shrink-0" />
                            <StatPill val="0%" label="platform cut" />
                        </motion.div>
                    </div>

                    {/* ── Right: cards ──────────────────────────────────── */}
                    <div className="flex flex-col gap-3.5">
                        {STEPS.map((step, i) => (
                            <StepCard key={step.num} step={step} index={i} />
                        ))}
                    </div>

                </div>
            </div>
        </section>
    )
}
