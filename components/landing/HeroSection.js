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
        transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
}

// Slightly refined the spring animation for a "smoother", more premium entrance
const itemVariants = {
    hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
    show: { 
        opacity: 1, 
        y: 0, 
        filter: 'blur(0px)', 
        transition: { type: "spring", stiffness: 40, damping: 20 } 
    }
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
export default function HeroSection() {
    const router = useRouter()

    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-8 pt-32 pb-24 overflow-hidden bg-[#FAFAFC] selection:bg-[#FF7100]/20 selection:text-[#FF7100]">
            
            {/* ── Creative & Dynamic Light Background ── */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                
                {/* 1. Seamless Top-to-Bottom Dot Mesh */}
                <div 
                    className="absolute inset-0 opacity-[0.35]" 
                    style={{ 
                        // Creates the precise dot pattern
                        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(15, 23, 42, 0.15) 1px, transparent 0)',
                        backgroundSize: '32px 32px',
                        // Masks the top and bottom so the dots fade smoothly into the background
                        maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)'
                    }} 
                />
                
                {/* 2. Drifting Ambient Orbs */}
                <motion.div 
                    animate={{ 
                        x: ['-10%', '10%', '-10%'], 
                        y: ['-5%', '5%', '-5%'] 
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[5%] left-[30%] w-[60vw] h-[50vw] max-w-[800px] bg-slate-300/40 blur-[120px] rounded-full mix-blend-multiply" 
                />
                <motion.div 
                    animate={{ 
                        x: ['10%', '-10%', '10%'], 
                        y: ['5%', '-5%', '5%'] 
                    }}
                    transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[20%] right-[20%] w-[50vw] h-[40vw] max-w-[600px] bg-[#FF7100]/5 blur-[140px] rounded-full mix-blend-multiply" 
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
                    {/* Replaced clamp() with Tailwind responsive font sizes for precision */}
                    <h1 className="font-bold leading-[1.05] text-4xl sm:text-5xl md:text-6xl lg:text-[5.5rem]">
                        <span className="text-slate-900 drop-shadow-sm">
                            Power the Future of AI
                        </span>
                        <br />
                        <span className="relative inline-block mt-2 sm:mt-4">
                            <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-[#FF7100] via-[#FF913B] to-[#FF7100] italic pr-4 font-bold">
                                Earn Crypto Instantly
                            </span>
                        </span>
                    </h1>
                    
                    {/* Adjusted line-height and font-weight for better readability */}
                    <p className="mt-8 text-slate-500 text-balance font-medium leading-relaxed mx-auto max-w-2xl text-lg sm:text-xl">
                        Complete precision micro-tasks that refine intelligence models. 
                        Receive <span className="text-slate-900 font-bold">HGAI tokens</span> directly to your BNB Chain wallet. No friction, just rewards.
                    </p>
                </motion.div>

                {/* Premium Liquid Glass CTA (Unchanged per your request) */}
                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-24 w-full sm:w-auto">
                    <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => router.push('/ai')}
                        className="relative flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-semibold text-[15px] overflow-hidden group transition-all w-full sm:w-auto shadow-[0_12px_30px_-10px_rgba(255,113,0,0.4)] hover:shadow-[0_20px_40px_-12px_rgba(255,113,0,0.5)]"
                        style={{ 
                            background: 'linear-gradient(135deg, #FF7100 0%, #D95A00 100%)', 
                            color: '#FFFFFF', 
                            boxShadow: 'inset 0 1.5px 2px rgba(255,255,255,0.4), inset 0 -2px 6px rgba(0,0,0,0.15)',
                            border: '1px solid #E65C00'
                        }}
                    >
                        {/* Elegant Sweep Shimmer */}
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

                {/* Milky Glass Trust Metrics */}
                <motion.div variants={itemVariants} className="flex items-center justify-center w-full max-w-3xl">
                    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 w-full border-t border-slate-200/80 pt-10 relative">
                        {/* Subtle highlight line on the border */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
                        
                        {[
                            { icon: RiShieldStarLine, label: 'Non-custodial' },
                            { icon: RiCheckLine, label: 'Audited Contracts' },
                            { icon: RiGlobalLine, label: 'BNB Chain Native' },
                        ].map((item) => (
                            <div key={item.label} className="flex items-center gap-2.5 px-6 py-3 rounded-full bg-white/70 backdrop-blur-xl border border-white shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)] group transition-all duration-300 hover:bg-white hover:shadow-[0_8px_25px_-5px_rgba(0,0,0,0.08)] hover:-translate-y-0.5">
                                <item.icon className="text-slate-400 text-xl group-hover:text-[#FF7100] transition-colors duration-500" />
                                <span className="text-slate-700 text-xs tracking-wider uppercase font-bold">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </section>
    )
}