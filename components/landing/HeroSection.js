'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { RiArrowRightLine, RiShieldStarLine, RiCheckLine, RiGlobalLine } from 'react-icons/ri'

// ─── Animation Configurations ─────────────────────────────────────────────────
const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.12, delayChildren: 0.1 }
    }
}

// Added a very subtle scale effect (0.98 -> 1) for a "breathing" entrance
const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98, filter: 'blur(10px)' },
    show: { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        filter: 'blur(0px)', 
        transition: { type: "spring", stiffness: 45, damping: 25 } 
    }
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
export default function HeroSection() {
    const router = useRouter()

    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-8 pt-32 pb-24 overflow-hidden selection:bg-slate-900/10 selection:text-slate-900">
            
            {/* ── Premium Orange to White Gradient Base ── */}
            <div 
                className="absolute inset-0 z-0 pointer-events-none" 
                style={{ background: 'linear-gradient(180deg, #FF6A00 0%, #FF9D4A 35%, #FAFAFC 80%, #FAFAFC 100%)' }}
            />

            {/* ── Background Textures ── */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                
                {/* 1. Seamless Top-to-Bottom White Dot Mesh with Overlay Blend */}
                <div 
                    className="absolute inset-0 opacity-[0.5] mix-blend-overlay" 
                    style={{ 
                        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255, 255, 255, 0.8) 1px, transparent 0)',
                        backgroundSize: '32px 32px',
                        maskImage: 'linear-gradient(to bottom, black 0%, black 25%, transparent 60%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 25%, transparent 60%)'
                    }} 
                />
                
                {/* 2. Premium Static Fine Film Grain */}
                <div
                    className="absolute inset-0 opacity-[0.12] mix-blend-overlay pointer-events-none"
                    style={{ 
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
                    }}
                />

                {/* 3. Drifting Ambient Orbs (Warmer tones to enrich the orange) */}
                <motion.div 
                    animate={{ x: ['-8%', '8%', '-8%'], y: ['-4%', '4%', '-4%'] }}
                    transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[5%] left-[25%] w-[60vw] h-[50vw] max-w-[800px] bg-white/20 blur-[130px] rounded-full mix-blend-overlay" 
                />
                <motion.div 
                    animate={{ x: ['8%', '-8%', '8%'], y: ['4%', '-4%', '4%'] }}
                    transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[15%] right-[20%] w-[50vw] h-[40vw] max-w-[600px] bg-[#FFD580]/15 blur-[150px] rounded-full mix-blend-overlay" 
                />
            </div>

            {/* ── Orchestrated Text & UI Content ── */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center"
            >
                {/* Elevated Typography Headline */}
                <motion.div variants={itemVariants} className="text-center mb-12 w-full">
                    <h1 className="font-bold leading-[1.05] tracking-tight text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem]">
                        {/* Warm custom drop shadow for natural, high-end lighting */}
                        <span className="text-white drop-shadow-[0_4px_24px_rgba(200,60,0,0.4)]">
                            Power the Future of AI
                        </span>
                        <br />
                        <span className="relative inline-block mt-3 sm:mt-4">
                            {/* Deeper, richer slate gradient for perfect contrast */}
                            <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 italic pr-4 font-black">
                                Earn Crypto Instantly
                            </span>
                        </span>
                    </h1>
                    
                    <p className="mt-8 text-slate-700 text-balance font-medium leading-relaxed mx-auto max-w-2xl text-lg sm:text-[1.35rem]">
                        Complete precision micro-tasks that refine intelligence models. 
                        Receive <span className="text-slate-950 font-bold">HGAI tokens</span> directly to your BNB Chain wallet. No friction, just rewards.
                    </p>
                </motion.div>

                {/* Premium Liquid Glass CTA */}
                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-24 w-full sm:w-auto">
                    <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => router.push('/ai')}
                        className="relative flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-semibold text-[15px] overflow-hidden group transition-all w-full sm:w-auto shadow-[0_12px_30px_-10px_rgba(255,113,0,0.4)] hover:shadow-[0_24px_45px_-12px_rgba(255,113,0,0.6)]"
                        style={{ 
                            background: 'linear-gradient(135deg, #FF7100 0%, #D95A00 100%)', 
                            color: '#FFFFFF', 
                            boxShadow: 'inset 0 1.5px 2px rgba(255,255,255,0.4), inset 0 -2px 6px rgba(0,0,0,0.15)',
                            border: '1px solid #E65C00'
                        }}
                    >
                        <span 
                            className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-[1.2s] ease-in-out" 
                            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)' }} 
                        />
                        
                        <Image 
                            src="/icon.png" 
                            alt="icon" 
                            width={18} 
                            height={18} 
                            className="relative z-10 shrink-0 filter invert opacity-95 group-hover:opacity-100 transition-opacity duration-300" 
                        />
                        <span className="relative z-10 tracking-wide drop-shadow-sm">Launch Dashboard</span>
                        <RiArrowRightLine className="text-sm relative z-10 group-hover:translate-x-1 transition-transform duration-300 opacity-90 group-hover:opacity-100" />
                    </motion.button>
                </motion.div>

                {/* Milky Glass Trust Metrics (Refined Realism) */}
                <motion.div variants={itemVariants} className="flex items-center justify-center w-full max-w-3xl">
                    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 w-full border-t border-slate-200/60 pt-10 relative">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-slate-300 to-transparent opacity-70" />
                        
                        {[
                            { icon: RiShieldStarLine, label: 'Non-custodial' },
                            { icon: RiCheckLine, label: 'Audited Contracts' },
                            { icon: RiGlobalLine, label: 'BNB Chain Native' },
                        ].map((item) => (
                            <div key={item.label} className="flex items-center gap-2.5 px-6 py-3 rounded-full bg-white/50 backdrop-blur-2xl border border-white/80 shadow-[0_8px_30px_-5px_rgba(0,0,0,0.04)] group transition-all duration-300 hover:bg-white/80 hover:shadow-[0_12px_35px_-5px_rgba(0,0,0,0.08)] hover:-translate-y-0.5">
                                <item.icon className="text-slate-400 text-lg group-hover:text-[#FF7100] transition-colors duration-500" />
                                {/* Widened the tracking and reduced size slightly for a cleaner, editorial look */}
                                <span className="text-slate-700 text-[11px] tracking-[0.15em] uppercase font-bold">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </section>
    )
}