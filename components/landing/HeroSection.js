'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { RiArrowRightLine, RiShieldStarLine, RiCheckLine, RiGlobalLine } from 'react-icons/ri'
import Grainient from './ui/Grainient'

// ─── Animation Configurations ─────────────────────────────────────────────────
const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
}

const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
    show: { 
        opacity: 1, 
        y: 0, 
        filter: 'blur(0px)', 
        transition: { type: "spring", stiffness: 45, damping: 15 } 
    }
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
export default function HeroSection() {
    const router = useRouter()

    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-8 pt-32 pb-24 overflow-hidden bg-[#FAFAFC]">
            
            {/* ── Creative & Dynamic Light Background ── */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {/* Architectural Grid */}
                <div 
                    className="absolute inset-0 opacity-[0.3]" 
                    style={{ 
                        backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)',
                        backgroundSize: '48px 48px' 
                    }} 
                />
                
                {/* Drifting Ambient Orbs */}
                <motion.div 
                    animate={{ 
                        x: ['-10%', '10%', '-10%'], 
                        y: ['-5%', '5%', '-5%'] 
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[5%] left-[30%] w-[60vw] h-[50vw] max-w-[800px] bg-slate-300/30 blur-[120px] rounded-full mix-blend-multiply" 
                />
                <motion.div 
                    animate={{ 
                        x: ['10%', '-10%', '10%'], 
                        y: ['5%', '-5%', '5%'] 
                    }}
                    transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[20%] right-[20%] w-[50vw] h-[40vw] max-w-[600px] bg-[#FF7100]/5 blur-[140px] rounded-full mix-blend-multiply" 
                />
                
                {/* High-End Grain Overlay */}
                <div className="absolute inset-0 opacity-40 mix-blend-multiply">
                    <Grainient
                        color1="#FAFAFC"
                        color2="#FFF5F0"
                        color3="#FAFAFC"
                        timeSpeed={0.1}
                        colorBalance={0}
                        warpStrength={0.3}
                        warpFrequency={3}
                        warpSpeed={1}
                        warpAmplitude={20}
                        blendAngle={0}
                        blendSoftness={0.1}
                        rotationAmount={300}
                        noiseScale={1.5}
                        grainAmount={0.04}
                        grainScale={1.2}
                        grainAnimated={true}
                        contrast={1.1}
                        gamma={1}
                        saturation={0.4}
                        centerX={0}
                        centerY={0}
                        zoom={1}
                    />
                </div>
            </div>

            {/* ── Orchestrated Text & UI Content ── */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center"
            >
                {/* Elevated Typography Headline */}
                <motion.div variants={itemVariants} className="text-center mb-10 w-full">
                    <h1
                        className="font-extrabold leading-[0.95] tracking-tighter"
                        style={{ fontSize: 'clamp(3.5rem, 8vw, 7.5rem)' }}
                    >
                        <span className="text-slate-900 drop-shadow-sm">
                            Train AI Systems
                        </span>
                        <br />
                        <span className="relative inline-block mt-2">
                            <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-[#FF7100] via-[#FF913B] to-[#FF7100] italic pr-4 font-bold tracking-tight">
                                Earn Crypto
                            </span>
                        </span>
                    </h1>
                    <p
                        className="mt-8 text-slate-500 text-balance font-normal leading-relaxed mx-auto max-w-2xl"
                        style={{ fontSize: 'clamp(1.1rem, 1.2vw, 1.25rem)' }}
                    >
                        Complete precision micro-tasks that refine intelligence models. 
                        Receive <span className="text-slate-900 font-semibold">HGAI tokens</span> instantly to your BNB Chain wallet. No friction.
                    </p>
                </motion.div>

                {/* Premium Liquid Glass CTA */}
                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-24 w-full sm:w-auto">
                    <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => router.push('/ai')}
                        className="relative flex items-center justify-center gap-3 px-8 py-4 rounded-full font-semibold text-[15px] overflow-hidden group transition-all w-full sm:w-auto shadow-[0_12px_30px_-10px_rgba(255,113,0,0.4)] hover:shadow-[0_20px_40px_-12px_rgba(255,113,0,0.5)]"
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
                <motion.div variants={itemVariants} className="flex items-center justify-center w-full max-w-2xl">
                    <div className="flex flex-wrap items-center justify-center gap-6 w-full border-t border-slate-200/80 pt-8 relative">
                        {/* Subtle highlight line on the border */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
                        
                        {[
                            { icon: RiShieldStarLine, label: 'Non-custodial' },
                            { icon: RiCheckLine, label: 'Audited Contracts' },
                            { icon: RiGlobalLine, label: 'BNB Chain Native' },
                        ].map((item) => (
                            <div key={item.label} className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/70 backdrop-blur-xl border border-white shadow-[0_2px_15px_-5px_rgba(0,0,0,0.05)] group transition-all duration-300 hover:bg-white">
                                <item.icon className="text-slate-400 text-lg group-hover:text-[#FF7100] transition-colors duration-500" />
                                <span className="text-slate-600 text-xs tracking-wider uppercase font-bold">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </section>
    )
}