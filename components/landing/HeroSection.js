'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useRef, useState, useEffect } from 'react'
import {
    RiArrowRightLine,
    RiShieldStarLine, RiCheckLine, RiGlobalLine,
    RiBarChartLine, RiTokenSwapLine,
} from 'react-icons/ri'
import Orb from './ui/Orb'

// ─── Animated count ───────────────────────────────────────────────────────────
function CountUp({ target, prefix = '', suffix = '' }) {
    const [val, setVal] = useState(0)
    const ref = useRef(null)
    const [fired, setFired] = useState(false)

    useEffect(() => {
        const io = new IntersectionObserver(([e]) => {
            if (e.isIntersecting && !fired) {
                setFired(true)
                let n = 0
                const inc = target / 50
                const t = setInterval(() => {
                    n += inc
                    if (n >= target) { setVal(target); clearInterval(t) }
                    else setVal(Math.floor(n))
                }, 20)
            }
        }, { threshold: 0.5 })
        if (ref.current) io.observe(ref.current)
        return () => io.disconnect()
    }, [target, fired])

    return <span ref={ref}>{prefix}{val.toLocaleString()}{suffix}</span>
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
export default function HeroSection() {
    const router = useRouter()
    const sectionRef = useRef(null)
    const { scrollY } = useScroll()
    const y = useTransform(scrollY, [0, 500], [0, 80])
    const opacity = useTransform(scrollY, [0, 350], [1, 0])

    const stats = [
        { icon: RiGlobalLine, color: '#C6FF1A', prefix: '', val: 10, suffix: 'K+', label: 'Contributors' },
        { icon: RiTokenSwapLine, color: '#60A5FA', prefix: '$', val: 250, suffix: 'K+', label: 'SYNTR Paid' },
        { icon: RiBarChartLine, color: '#A78BFA', prefix: '', val: 1, suffix: 'M+', label: 'Tasks Done' },
        { icon: RiCheckLine, color: '#34D399', prefix: '', val: 99, suffix: '%', label: 'Uptime' },
    ]

    return (
        <section
            ref={sectionRef}
            className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 pt-28 pb-20 overflow-hidden"
        >
            {/* ── Orb — absolute full-cover background ── */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 0,
                    opacity: 0.88,
                    pointerEvents: 'auto',
                }}
            >
                <Orb
                    hoverIntensity={0.5}
                    rotateOnHover
                    hue={80}
                    forceHoverState={false}
                    backgroundColor="#060A07"
                />
            </div>

            {/* Thin center rule — above orb */}
            <div
                aria-hidden
                className="absolute left-0 right-0 pointer-events-none"
                style={{ top: '50%', height: 1, zIndex: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)' }}
            />

            {/* ── All text content — z-10 ── */}
            <motion.div
                style={{ y, opacity }}
                className="relative z-10 w-full max-w-5xl mx-auto"
            >
                {/* Headline */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.65, delay: 0.1 }}
                    className="text-center mb-7"
                >
                    <h1
                        className="font-bold text-white leading-[1.02] tracking-[-0.03em]"
                        style={{ fontSize: 'clamp(3rem, 9vw, 6rem)' }}
                    >
                        Train AI
                        <br />
                        <span style={{ color: '#C6FF1A' }}>Earn Crypto</span>
                    </h1>
                    <p
                        className="text-white/45 mt-6 text-balance leading-relaxed mx-auto"
                        style={{ fontSize: 'clamp(0.95rem, 2vw, 1.15rem)' }}
                    >
                        Complete precision micro-tasks that improve AI systems,
                        and receive <span className="text-white/75 font-medium">SYNTR tokens</span> directly
                        to your BNB Chain wallet — no middlemen, no delays.
                    </p>
                </motion.div>

                {/* CTA row */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.25 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-14"
                >
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => router.push('/ai')}
                        className="relative flex items-center gap-2.5 px-7 py-2.5 rounded-xl font-bold text-sm overflow-hidden group"
                        style={{ background: '#C6FF1A', color: '#060A07', boxShadow: '0 2px 24px rgba(198,255,26,0.18)' }}
                    >
                        <span
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                            style={{ background: 'linear-gradient(110deg, transparent 35%, rgba(255,255,255,0.22) 50%, transparent 65%)' }}
                        />
                        <Image src="/icon.png" alt="icon" width={24} height={24} className="relative z-10 shrink-0" />
                        <span className="relative z-10">Launch Dashboard</span>
                        <RiArrowRightLine className="text-sm relative z-10 group-hover:translate-x-0.5 transition-transform duration-200" />
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                        className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200"
                        style={{
                            color: 'rgba(255,255,255,0.5)',
                            border: '1px solid rgba(255,255,255,0.09)',
                            background: 'rgba(255,255,255,0.03)',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.color = 'rgba(255,255,255,0.8)'
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.color = 'rgba(255,255,255,0.5)'
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'
                        }}
                    >
                        See How It Works
                    </motion.button>
                </motion.div>

                {/* Trust badges */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2.5"
                >
                    {[
                        { icon: RiShieldStarLine, label: 'Non-custodial', color: '#34D399' },
                        { icon: RiCheckLine, label: 'Audited Contracts', color: '#60A5FA' },
                        { icon: RiGlobalLine, label: 'BNB Chain Native', color: '#FBBF24' },
                    ].map(({ icon: Icon, label, color }) => (
                        <div key={label} className="flex items-center gap-1.5">
                            <Icon style={{ color, opacity: 0.75 }} className="text-sm shrink-0" />
                            <span className="text-white/28 text-xs font-medium">{label}</span>
                        </div>
                    ))}
                </motion.div>
            </motion.div>
        </section>
    )
}
