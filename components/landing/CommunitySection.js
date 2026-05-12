'use client'

import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { RiDoubleQuotesL, RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri'

// ─── Testimonials ──────────────────────────────────────────────────────────────
const TESTIMONIALS = [
    {
        quote: "I made x340 in my first weekend just labeling AI responses. No experience needed the tasks are clear and the rewards hit my wallet instantly.",
        name: 'Arjun M.',
        role: 'Software Engineer, Mumbai',
        earned: 'x340',
        period: 'first weekend',
    },
    {
        quote: "I've tried a dozen earn-crypto platforms. SYNTHOS is the only one that actually pays what it promises on chain, every time, no waiting.",
        name: 'Lena F.',
        role: 'Freelancer, Berlin',
        earned: 'x1,200+',
        period: 'first month',
    },
    {
        quote: "The reputation system is genius. The better your track record, the higher the tasks pay. It genuinely rewards quality work.",
        name: 'Kofi A.',
        role: 'Data Analyst, Accra',
        earned: '×3.0',
        period: 'reward multiplier',
    },
    {
        quote: "Non-custodial means I never hand over my wallet. SYNTR goes straight to my MetaMask the second a task is approved. This is how it should work.",
        name: 'Sofia R.',
        role: 'UX Researcher, São Paulo',
        earned: '0 days',
        period: 'payout delay',
    },
]

export default function CommunitySection() {
    const [idx, setIdx] = useState(0)
    const [dir, setDir] = useState(1) // 1 = forward, -1 = backward
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: '-80px' })

    // Auto-advance
    useEffect(() => {
        const t = setInterval(() => {
            setDir(1)
            setIdx(i => (i + 1) % TESTIMONIALS.length)
        }, 5000)
        return () => clearInterval(t)
    }, [])

    const go = (d) => {
        setDir(d)
        setIdx(i => (i + d + TESTIMONIALS.length) % TESTIMONIALS.length)
    }

    const item = TESTIMONIALS[idx]

    const variants = {
        enter: d => ({ x: d > 0 ? 32 : -32, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: d => ({ x: d > 0 ? -32 : 32, opacity: 0 }),
    }

    return (
        <section id="community" ref={ref} className="px-4 sm:px-6 py-20">
            <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
                {/* ── Headline ── */}
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.08 }}
                    className="text-3xl md:text-4xl font-black text-white mt-4 mb-5 tracking-tight"
                >
                    Join the Community<br />
                    Training the{' '}
                    <span style={{ color: '#C6FF1A' }}>Future of AI.</span>
                </motion.h2>

                {/* ── Testimonial card ── */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.65, delay: 0.16 }}
                    className="w-full relative"
                >
                    <div
                        className="relative rounded-2xl overflow-hidden px-8 pt-8 pb-6 text-left"
                        style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.08)',
                        }}
                    >
                        {/* Top accent */}
                        <div className="absolute top-0 inset-x-16 h-px"
                            style={{ background: 'linear-gradient(90deg, transparent, rgba(198,255,26,0.3), transparent)' }} />

                        {/* Big quote mark */}
                        <RiDoubleQuotesL
                            className="text-5xl mb-4"
                            style={{ color: 'rgba(255,255,255,0.1)' }}
                        />

                        {/* Sliding quote */}
                        <div className="overflow-hidden" style={{ minHeight: 100 }}>
                            <AnimatePresence mode="wait" custom={dir}>
                                <motion.p
                                    key={idx}
                                    custom={dir}
                                    variants={variants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                    className="text-gray-500 text-xl sm:text-2xl font-semibold leading-snug"
                                    style={{ letterSpacing: '-0.01em' }}
                                >
                                    {item.quote}
                                </motion.p>
                            </AnimatePresence>
                        </div>

                        {/* Divider */}
                        <div className="my-5 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />

                        {/* Author row */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`author-${idx}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="flex items-center justify-between"
                            >
                                {/* Author */}
                                <div>
                                    <div className="text-white/75 text-sm font-bold">{item.name}</div>
                                    <div className="text-white/30 text-xs mt-0.5">{item.role}</div>
                                </div>

                                {/* Earned badge */}
                                <div className="flex flex-col items-end gap-0.5">
                                    <div className="text-sm font-black" style={{ color: '#C6FF1A' }}>
                                        {item.earned}
                                    </div>
                                    <div className="text-white/28 text-[10px] uppercase tracking-wider">
                                        {item.period}
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Navigation arrows */}
                    <div className="flex items-center justify-between mt-5 px-1">
                        {/* Dots */}
                        <div className="flex items-center gap-2">
                            {TESTIMONIALS.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => { setDir(i > idx ? 1 : -1); setIdx(i) }}
                                    className="transition-all duration-300"
                                    style={{
                                        width: i === idx ? 20 : 6,
                                        height: 6,
                                        borderRadius: 99,
                                        background: i === idx ? '#C6FF1A' : 'rgba(255,255,255,0.12)',
                                    }}
                                />
                            ))}
                        </div>

                        {/* Prev / Next */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => go(-1)}
                                className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                                style={{ border: '1px solid rgba(255,255,255,0.09)', background: 'transparent' }}
                                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}
                                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'}
                            >
                                <RiArrowLeftSLine className="text-white/50 text-base" />
                            </button>
                            <button
                                onClick={() => go(1)}
                                className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                                style={{ border: '1px solid rgba(255,255,255,0.09)', background: 'transparent' }}
                                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(198,255,26,0.3)'}
                                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'}
                            >
                                <RiArrowRightSLine className="text-white/50 text-base" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
