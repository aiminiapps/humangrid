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
        { icon: RiGlobalLine, color: '#FF7100', prefix: '', val: 10, suffix: 'K+', label: 'Contributors' },
        { icon: RiTokenSwapLine, color: '#3B82F6', prefix: '$', val: 250, suffix: 'K+', label: 'SYNTR Paid' },
        { icon: RiBarChartLine, color: '#8B5CF6', prefix: '', val: 1, suffix: 'M+', label: 'Tasks Done' },
        { icon: RiCheckLine, color: '#10B981', prefix: '', val: 99, suffix: '%', label: 'Uptime' },
    ]

    return (
        <section
            ref={sectionRef}
            className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 pt-28 pb-20 overflow-hidden bg-[#FAFAFA]"
        >
            {/* ── Ultra-premium Light Background ── */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {/* Subtle dot grid for structural, high-end feel */}
                <div 
                    className="absolute inset-0" 
                    style={{ 
                        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.05) 1px, transparent 0)',
                        backgroundSize: '32px 32px' 
                    }} 
                />
                
                {/* Refined soft ambient light (no bad gradients, just a smooth vignette) */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-white opacity-80 rounded-full blur-[100px]" />
            </div>

            {/* ── All text content — z-10 ── */}
            <motion.div
                style={{ y, opacity }}
                className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center"
            >
                {/* Headline */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center mb-8"
                >
                    <h1
                        className="font-extrabold text-zinc-900 leading-[1.05] tracking-tight"
                        style={{ fontSize: 'clamp(3rem, 8vw, 5.5rem)' }}
                    >
                        Train AI Systems,
                        <br />
                        <span className="relative inline-block mt-1 sm:mt-3">
                            <span className="relative z-10 text-zinc-900">Earn Crypto Rewards</span>
                            {/* Tasteful orange gradient highlight */}
                            <span 
                                className="absolute bottom-2 sm:bottom-4 left-0 w-full h-3 sm:h-5 -rotate-1 rounded-sm z-0" 
                                style={{ 
                                    background: 'linear-gradient(90deg, rgba(255,113,0,0.25), rgba(230,74,0,0.4))',
                                    transformOrigin: 'bottom left' 
                                }} 
                            />
                        </span>
                    </h1>
                    <p
                        className="text-slate-500 mt-8 text-balance leading-relaxed mx-auto max-w-2xl"
                        style={{ fontSize: 'clamp(1rem, 1.5vw, 1.15rem)' }}
                    >
                        Complete precision micro-tasks that improve AI models.
                        Get paid in <span className="text-zinc-800 font-semibold">HGAI tokens</span> directly
                        to your BNB Chain wallet no middlemen, no delays.
                    </p>
                </motion.div>

                {/* CTA row */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14 w-full sm:w-auto"
                >
                    {/* Highly detailed, creative, effective CTA button */}
                    <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => router.push('/ai')}
                        className="relative flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-sm overflow-hidden group transition-all w-full sm:w-auto"
                        style={{ 
                            background: 'linear-gradient(135deg, #FF7100 0%, #E64A00 100%)', 
                            color: '#FFFFFF', 
                            boxShadow: '0 14px 32px -8px rgba(255, 90, 0, 0.4), inset 0 2px 2px rgba(255,255,255,0.25), inset 0 -2px 4px rgba(0,0,0,0.1)',
                            border: '1px solid rgba(255,100,0,0.8)'
                        }}
                    >
                        {/* Shimmer effect */}
                        <span 
                            className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" 
                            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)' }} 
                        />
                        {/* Soft inner radial gradient for 3D effect */}
                        <span 
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
                            style={{ background: 'radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, transparent 70%)' }} 
                        />
                        <Image 
                            src="/icon.png" 
                            alt="icon" 
                            width={20} 
                            height={20} 
                            className="relative z-10 shrink-0 filter invert opacity-95 group-hover:opacity-100 transition-opacity" 
                        />
                        <span className="relative z-10 tracking-wide font-bold text-[15px] drop-shadow-sm">Launch Dashboard</span>
                        <RiArrowRightLine className="text-sm relative z-10 group-hover:translate-x-1 transition-transform duration-300 opacity-90 group-hover:opacity-100" />
                    </motion.button>

                    {/* Secondary refined button */}
                    <motion.button
                        whileHover={{ scale: 1.02, backgroundColor: '#F8FAFC' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                        className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-[15px] transition-all duration-300 w-full sm:w-auto"
                        style={{
                            color: '#475569',
                            border: '1px solid #E2E8F0',
                            background: '#FFFFFF',
                            boxShadow: '0 2px 8px -2px rgba(0,0,0,0.04)'
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
                    className="flex flex-wrap items-center justify-center gap-4 mt-2"
                >
                    {[
                        { icon: RiShieldStarLine, label: 'Non-custodial', color: '#10B981' },
                        { icon: RiCheckLine, label: 'Audited Contracts', color: '#3B82F6' },
                        { icon: RiGlobalLine, label: 'BNB Chain Native', color: '#F59E0B' },
                    ].map(({ icon: Icon, label, color }) => (
                        <div key={label} className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow duration-300 cursor-default">
                            <Icon style={{ color }} className="text-base shrink-0" />
                            <span className="text-slate-600 text-[13px] font-semibold tracking-wide">{label}</span>
                        </div>
                    ))}
                </motion.div>
            </motion.div>
        </section>
    )
}
