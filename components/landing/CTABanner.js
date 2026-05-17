'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { 
    RiArrowRightUpLine, 
    RiBrainLine, 
    RiGlobalLine, 
    RiCoinLine 
} from 'react-icons/ri'

// Updated to match HumanGrid AI Core Concepts
const PILLS = [
    { icon: RiBrainLine, label: 'AI Data Network' },
    { icon: RiCoinLine, label: 'Label-to-Earn' },
    { icon: RiGlobalLine, label: 'Decentralized' },
]

export default function CTABanner() {
    const router = useRouter()
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: '-80px' })

    return (
        <section className="px-4 sm:px-6 py-20 bg-[#FAFAFC] w-full flex justify-center">
            {/* Increased width to max-w-7xl for a wider, more premium cinematic feel */}
            <div className="w-full max-w-7xl">
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 30, scale: 0.98 }}
                    animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="relative rounded-[2.5rem] overflow-hidden flex flex-col items-center text-center px-6 py-16 sm:py-20 bg-white border border-slate-200/80 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]"
                >
                    {/* ── Creative Background Elements ── */}
                    
                    {/* 1. Premium Dot Matrix with Opacity Fade (Masking) */}
                    <div 
                        className="absolute inset-0 z-0 pointer-events-none"
                        style={{
                            backgroundImage: 'radial-gradient(circle at 1px 1px, #CBD5E1 1px, transparent 0)',
                            backgroundSize: '24px 24px',
                            // This mask makes the dots visible in the center and fade out to the edges
                            WebkitMaskImage: 'radial-gradient(ellipse 70% 80% at 50% 50%, black 20%, transparent 100%)',
                            maskImage: 'radial-gradient(ellipse 70% 80% at 50% 50%, black 20%, transparent 100%)',
                            opacity: 0.7
                        }}
                    />

                    {/* 2. Soft Ambient Brand Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[800px] h-[300px] bg-gradient-to-r from-[#FF7100]/[0.03] via-[#FF7100]/[0.08] to-[#FF7100]/[0.03] blur-[80px] rounded-[100%] pointer-events-none z-0" />
                    
                    {/* Subtle top glow line */}
                    <div className="absolute top-0 inset-x-0 h-[2px]"
                        style={{ background: 'linear-gradient(90deg, transparent 10%, rgba(255,113,0,0.3) 50%, transparent 90%)' }} />

                    {/* ── Content ── */}
                    
                    {/* Ecosystem Pills */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="flex flex-wrap items-center justify-center gap-3 mb-10 relative z-10"
                    >
                        {PILLS.map(({ icon: Icon, label }) => (
                            <div
                                key={label}
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.04)] transition-colors hover:border-slate-300"
                            >
                                <Icon className="text-[#FF7100] text-[15px]" />
                                <span className="text-slate-700 text-xs font-bold tracking-wider uppercase">{label}</span>
                            </div>
                        ))}
                    </motion.div>

                    {/* HumanGrid Headline */}
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.7, delay: 0.15 }}
                        className="font-semibold text-slate-900 leading-[1.05] mb-6 tracking-tighter relative z-10"
                        style={{
                            fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)',
                            maxWidth: 900,
                        }}
                    >
                        Power the Future of AI <br className="hidden sm:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF7100] to-[#E65C00] drop-shadow-sm pr-2">
                            Earn HGAI
                        </span>{' '}
                        Today
                    </motion.h2>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="text-slate-500 text-[1.1rem] text-balance leading-relaxed mb-12 max-w-2xl font-medium relative z-10"
                    >
                        Join the HumanGrid community-powered ecosystem. Complete precision AI data labeling, verification, and training micro-tasks to earn real crypto rewards.
                    </motion.p>

                    {/* Reference-Matched Rectangular CTA Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.7, delay: 0.25 }}
                        className="relative z-10 w-full sm:w-auto flex justify-center"
                    >
                        <motion.button
                            whileHover={{ scale: 1.03, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => router.push('/ai')}
                            className="relative flex items-center justify-center gap-3 px-10 py-4.5 rounded-xl font-bold text-[15px] overflow-hidden group transition-all duration-300 w-full sm:w-auto shadow-[0_8px_20px_-6px_rgba(255,113,0,0.4)] hover:shadow-[0_14px_25px_-8px_rgba(255,113,0,0.5)]"
                            style={{
                                background: 'linear-gradient(135deg, #FF8A33 0%, #FF7100 100%)',
                                color: '#FFFFFF',
                                border: '1px solid rgba(255,255,255,0.15)',
                                padding: '18px 40px' // Slightly thicker padding for a premium feel
                            }}
                        >
                            {/* Fast Shine Sweep */}
                            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-[1.2s] ease-in-out bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                            
                            <Image 
                                src="/icon.png" 
                                alt="HGAI icon" 
                                width={20} 
                                height={20} 
                                className="relative z-10 shrink-0 filter invert opacity-95 group-hover:opacity-100 transition-opacity" 
                            />
                            <span className="relative z-10 tracking-wide drop-shadow-sm text-base">Launch HumanGrid</span>
                            <RiArrowRightUpLine className="relative z-10 text-xl group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300 opacity-90 group-hover:opacity-100" />
                        </motion.button>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}