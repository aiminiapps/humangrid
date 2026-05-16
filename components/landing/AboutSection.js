'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import {
    RiSearchEyeLine,
    RiBrainLine,
    RiFlashlightLine,
    RiNodeTree
} from 'react-icons/ri'

// ─── Animation Variants ────────────────────────────────────────────────────────
const containerVars = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.15 }
    }
}

const itemVars = {
    hidden: { opacity: 0, y: 30, scale: 0.96, filter: 'blur(8px)' },
    show: { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        filter: 'blur(0px)',
        transition: { type: "spring", stiffness: 70, damping: 20 }
    }
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function AboutSection() {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: '-80px' })

    return (
        <section
            id="about"
            ref={ref}
            className="relative px-4 sm:px-6 py-24 overflow-hidden bg-[#FAFAFC]"
        >
            {/* Subtle background architectural grid */}
            <div 
                className="absolute inset-0 opacity-[0.4] pointer-events-none" 
                style={{ 
                    backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.02) 1px, transparent 1px)',
                    backgroundSize: '64px 64px' 
                }} 
            />

            <motion.div 
                variants={containerVars}
                initial="hidden"
                animate={inView ? "show" : "hidden"}
                className="relative max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8"
            >
                {/* ── Main Ecosystem Block (Left) ── */}
                <motion.div variants={itemVars} className="md:col-span-2 lg:col-span-5 lg:row-span-2 rounded-[2.5rem] bg-white p-8 sm:p-12 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.06)] border border-slate-100 flex flex-col justify-between group overflow-hidden relative transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)]">
                    {/* Subtle glow in corner */}
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#FF7100]/5 rounded-full blur-3xl group-hover:bg-[#FF7100]/10 transition-colors duration-700" />
                    
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-8 rounded-full bg-[#FF7100]/10 text-[#FF7100] text-xs font-bold tracking-wide uppercase border border-[#FF7100]/20">
                            <RiNodeTree className="text-sm" />
                            HumanGrid AI Ecosystem
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 leading-[1.08] tracking-tight mb-6">
                            Human Input. <br/>
                            <span className="text-[#FF7100]">Machine Precision.</span>
                        </h2>
                        <p className="text-slate-500 text-[17px] leading-relaxed">
                            We bridge the gap between human validators and decentralized intelligence networks. 
                            Remove the friction, provide the context, and earn crypto native rewards.
                        </p>
                    </div>
                    
                    <div className="flex gap-8 mt-12 border-t border-slate-100 pt-8 relative z-10">
                        <div>
                            <div className="text-4xl font-black text-slate-900 tracking-tighter">&lt;60s</div>
                            <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2">Avg Task Time</div>
                        </div>
                        <div className="w-px h-12 bg-slate-100" />
                        <div>
                            <div className="text-4xl font-black text-slate-900 tracking-tighter">100%</div>
                            <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2">On-Chain</div>
                        </div>
                    </div>
                </motion.div>

                {/* ── Step 1 Block (Top Right) ── */}
                <motion.div variants={itemVars} className="md:col-span-2 lg:col-span-7 rounded-[2.5rem] bg-white p-8 sm:p-10 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.06)] border border-slate-100 relative overflow-hidden group hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-500">
                    <div className="absolute -top-6 -right-6 text-[180px] leading-none font-black text-slate-50 opacity-60 group-hover:scale-105 group-hover:text-[#FF7100]/5 transition-all duration-700 pointer-events-none select-none">01</div>
                    <div className="relative z-10 flex flex-col justify-center h-full">
                        <div className="w-14 h-14 rounded-2xl bg-[#FF7100]/10 flex items-center justify-center mb-6 text-[#FF7100] border border-[#FF7100]/20 group-hover:scale-110 transition-transform duration-500">
                            <RiSearchEyeLine className="text-2xl" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">Discover Micro-Tasks</h3>
                        <p className="text-slate-500 text-[16px] max-w-lg leading-relaxed">
                            Our engine instantly matches your profile with high-value AI labeling tasks—ranging from sentiment analysis to complex model logic validation.
                        </p>
                    </div>
                </motion.div>

                {/* ── Step 2 Block (Bottom Left of Right Column) ── */}
                <motion.div variants={itemVars} className="md:col-span-1 lg:col-span-4 rounded-[2.5rem] bg-white p-8 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.06)] border border-slate-100 relative overflow-hidden group hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-500">
                    <div className="absolute -bottom-4 -right-2 text-[120px] leading-none font-black text-slate-50 opacity-60 group-hover:scale-105 group-hover:text-blue-500/5 transition-all duration-700 pointer-events-none select-none">02</div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-5 text-blue-500 border border-blue-100 group-hover:scale-110 transition-transform duration-500">
                            <RiBrainLine className="text-xl" />
                        </div>
                        <h3 className="text-[19px] font-bold text-slate-900 mb-2 tracking-tight">Provide Intelligence</h3>
                        <p className="text-slate-500 text-[15px] leading-relaxed relative z-10">
                            Submit inputs with absolute precision. Your verified feedback directly trains models.
                        </p>
                    </div>
                </motion.div>

                {/* ── Step 3 Block (Bottom Right of Right Column - Solid Color Highlight) ── */}
                <motion.div variants={itemVars} className="md:col-span-1 lg:col-span-3 rounded-[2.5rem] bg-gradient-to-br from-[#FF7100] to-[#E65C00] p-8 shadow-[0_12px_30px_-10px_rgba(255,113,0,0.4)] relative overflow-hidden group hover:shadow-[0_20px_40px_-12px_rgba(255,113,0,0.5)] hover:-translate-y-1 transition-all duration-500">
                    {/* Noise grain effect overlay */}
                    <div 
                        className="absolute inset-0 w-full h-full pointer-events-none z-0 mix-blend-overlay opacity-30 group-hover:opacity-50 transition-opacity duration-500"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E")` }}
                    />
                    <div className="absolute -bottom-4 -right-2 text-[120px] leading-none font-black text-white/10 opacity-50 group-hover:scale-105 transition-all duration-700 pointer-events-none select-none">03</div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-5 text-white border border-white/30 group-hover:scale-110 transition-transform duration-500 backdrop-blur-sm">
                            <RiFlashlightLine className="text-xl" />
                        </div>
                        <h3 className="text-[19px] font-bold text-white mb-2 tracking-tight">Earn HGAI</h3>
                        <p className="text-white/90 text-[15px] leading-relaxed font-medium">
                            Rewards land on-chain instantly. Zero intermediaries.
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    )
}
