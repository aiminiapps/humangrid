'use client'

import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import { useRef } from 'react'
import {
    RiBrainLine, RiShieldCheckLine,
    RiTrophyLine, RiCheckLine,
    RiStarLine, RiCpuLine,
    RiDatabase2Line, RiImageLine, RiFileTextLine,
    RiNodeTree, RiArrowRightUpLine, RiTimeLine, RiLineChartLine, RiLockPasswordLine, RiKey2Line
} from 'react-icons/ri'

// ─── Refined Card Shell ───────────────────────────────────────────────
function BentoCard({ className = '', color = '#FF7100', label, title, children, delay = 0 }) {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: '-40px' })

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
            className={`relative rounded-[2rem] overflow-hidden flex flex-col group bg-white border border-slate-200/60 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.03)] hover:shadow-[0_24px_40px_-12px_rgba(0,0,0,0.08)] transition-all duration-700 ${className}`}
        >
            {/* Elegant glass shimmer on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none bg-gradient-to-b from-white/40 to-transparent z-20" />
            
            <div className="px-8 pt-8 pb-5 shrink-0 relative z-10 border-b border-slate-50/50">
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-slate-500" style={{color: color }}>{label}</span>
                </div>
                <h3 className="text-2xl font-semibold text-slate-900 leading-tight tracking-tight">{title}</h3>
            </div>

            <div className="flex-1 px-8 pb-8 pt-2 min-h-0 relative z-10 bg-slate-50/30">{children}</div>
        </motion.div>
    )
}

// ══════════════════════════════════════════════════════════════
// CELL A — AI Task Matching (Content Heavy Data Table)
// ══════════════════════════════════════════════════════════════
const ACTIVE_TASKS = [
    { icon: RiFileTextLine, title: 'LLM Response Grading', type: 'NLP Model', difficulty: 'Expert', reward: '120 HGAI', time: '5m', color: '#FF7100' },
    { icon: RiImageLine, title: 'Spatial Bounding Boxes', type: 'Computer Vision', difficulty: 'Intermediate', reward: '45 HGAI', time: '2m', color: '#3B82F6' },
    { icon: RiDatabase2Line, title: 'Sentiment Alignment', type: 'Data Structuring', difficulty: 'Beginner', reward: '15 HGAI', time: '1m', color: '#8B5CF6' },
    { icon: RiCpuLine, title: 'Logic Validation Check', type: 'Reasoning AI', difficulty: 'Advanced', reward: '250 HGAI', time: '15m', color: '#10B981' },
]

function AIMatchingCell() {
    return (
        <div className="flex flex-col gap-3 mt-4 w-full">
            <div className="grid grid-cols-12 gap-4 px-4 pb-2 text-[10px] font-bold tracking-widest uppercase text-slate-400 border-b border-slate-200/60">
                <div className="col-span-6 md:col-span-5">Available Task</div>
                <div className="col-span-3 hidden md:block">Requirements</div>
                <div className="col-span-6 md:col-span-4 text-right">Yield Target</div>
            </div>

            {ACTIVE_TASKS.map((task, i) => (
                <motion.div
                    key={task.title}
                    whileHover={{ x: 4, backgroundColor: '#FFFFFF', borderColor: 'rgba(0,0,0,0.05)' }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-12 gap-4 items-center p-4 rounded-2xl border border-transparent cursor-pointer group"
                >
                    <div className="col-span-6 md:col-span-5 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-white border border-slate-100 shadow-sm group-hover:scale-105 transition-transform duration-300">
                            <task.icon style={{ color: task.color }} className="text-lg" />
                        </div>
                        <div>
                            <div className="text-slate-900 text-sm font-bold tracking-tight">{task.title}</div>
                            <div className="text-slate-500 text-[11px] font-medium mt-0.5">{task.type}</div>
                        </div>
                    </div>
                    
                    <div className="col-span-3 hidden md:flex items-center">
                        <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-[11px] font-semibold">
                            {task.difficulty}
                        </span>
                    </div>

                    <div className="col-span-6 md:col-span-4 flex items-center justify-end gap-4">
                        <div className="text-right">
                            <div className="text-slate-900 text-sm font-bold">{task.reward}</div>
                            <div className="text-slate-400 text-[11px] flex items-center justify-end gap-1 mt-0.5">
                                <RiTimeLine /> {task.time}
                            </div>
                        </div>
                        <RiArrowRightUpLine className="text-slate-300 group-hover:text-slate-600 transition-colors" />
                    </div>
                </motion.div>
            ))}
        </div>
    )
}

// ══════════════════════════════════════════════════════════════
// CELL B — Reputation (Premium Level-Up Dashboard)
// ══════════════════════════════════════════════════════════════
function ReputationCell() {
    return (
        <div className="flex flex-col h-full mt-4">
            {/* Immersive Profile Status Area */}
            <div className="relative flex flex-col items-center justify-center p-8 rounded-3xl bg-gradient-to-b from-[#8B5CF6]/[0.08] to-transparent border border-[#8B5CF6]/15 mb-6 overflow-hidden group">
                {/* Subtle background glow on hover */}
                <div className="absolute inset-0 bg-[#8B5CF6]/5 blur-3xl group-hover:bg-[#8B5CF6]/10 transition-colors duration-700" />
                
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                    className="relative z-10 w-20 h-20 rounded-full bg-white shadow-[0_8px_30px_-10px_rgba(139,92,246,0.25)] border border-slate-100 flex items-center justify-center mb-5"
                >
                    <Image src="/icon.png" alt="Human Grid" width={80} height={80} className="rounded-2xl" />
                </motion.div>
                
                <div className="relative z-10 text-center">
                    <div className="text-[#8B5CF6] text-[10px] mb-1.5">Current Status</div>
                    <div className="text-slate-900 text-2xl font-semibold">Expert Validator</div>
                </div>
            </div>

            {/* Elevated Multiplier Highlight */}
            <motion.div 
                whileHover={{ y: -2 }}
                className="flex items-center justify-between p-5 rounded-2xl bg-white border border-slate-200/80 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.04)] mb-8 transition-all duration-300 hover:shadow-[0_8px_20px_-8px_rgba(139,92,246,0.15)] hover:border-[#8B5CF6]/30 cursor-default"
            >
                <div>
                    <div className="text-slate-400 text-[10px] font-semibold mb-1">Active Yield Multiplier</div>
                    <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9]">
                        2.50<span className="text-lg text-[#8B5CF6]/60 font-medium ml-0.5">x</span>
                    </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                    <RiArrowRightUpLine className="text-[#8B5CF6] text-xl" />
                </div>
            </motion.div>

            {/* Segmented Level-Up Progression */}
            <div className="mb-6">
                <div className="flex justify-between items-end mb-3">
                    <span className="text-slate-500 text-xs font-semibold">Next: <span className="text-slate-900 font-bold">Master (3.0x)</span></span>
                    <span className="text-[#8B5CF6] text-xs font-black tracking-wide">84%</span>
                </div>
                
                {/* Premium Segmented Bar */}
                <div className="flex gap-1 h-2.5">
                    {[1, 2, 3, 4, 5].map((segment) => (
                        <div key={segment} className="flex-1 rounded-full bg-slate-200/60 overflow-hidden relative">
                            {segment <= 4 && (
                                <motion.div 
                                    initial={{ width: 0 }}
                                    whileInView={{ width: '100%' }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: segment * 0.1, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9]" 
                                />
                            )}
                            {segment === 5 && (
                                <motion.div 
                                    initial={{ width: 0 }}
                                    whileInView={{ width: '20%' }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9]" 
                                />
                            )}
                        </div>
                    ))}
                </div>
                <div className="text-right text-slate-400 text-[10px] font-semibold mt-2.5 tracking-wide">1,550 XP to unlock</div>
            </div>

            {/* Visual Unlock Path */}
            <div className="mt-auto pt-5 flex items-center justify-between border-t border-slate-200/80">
                <div className="text-slate-400 text-[10px] font-semibold">Unlock Path</div>
                <div className="flex gap-2">
                    {[
                        { icon: RiCheckLine, active: true, title: "Validator" },
                        { icon: RiStarLine, active: true, title: "Expert" },
                        { icon: RiTrophyLine, active: false, title: "Master" },
                    ].map((badge, i) => (
                        <div 
                            key={i} 
                            title={badge.title}
                            className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300
                                ${badge.active 
                                    ? 'bg-white border-slate-200 text-slate-700 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]' 
                                    : 'bg-slate-50/50 border-transparent text-slate-300 opacity-60'}`}
                        >
                            <badge.icon className="text-[15px]" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

// ══════════════════════════════════════════════════════════════
// CELL C — On-Chain Speed (Static Analytical Dashboard)
// ══════════════════════════════════════════════════════════════
function SpeedCell() {
    // Abstract representation of stable, fast block times
    const bars = [60, 80, 45, 90, 65, 85, 40, 75, 50, 95, 70, 80]

    return (
        <div className="flex flex-col h-full mt-4">
            <div className="flex items-end justify-between mb-8">
                <div>
                    <div className="text-4xl font-black tracking-tighter text-slate-900">312<span className="text-xl text-slate-400 font-medium">ms</span></div>
                    <div className="text-slate-500 text-xs font-medium mt-1">Average Subnet Finality</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#10B981]/10 flex items-center justify-center">
                    <RiLineChartLine className="text-[#10B981] text-xl" />
                </div>
            </div>

            {/* Abstract Chart */}
            <div className="flex items-end justify-between h-20 gap-1.5 mb-6">
                {bars.map((height, i) => (
                    <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${height}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: i * 0.05, ease: "easeOut" }}
                        className="flex-1 rounded-t-sm bg-slate-200"
                    />
                ))}
            </div>

            {/* Network Stats */}
            <div className="grid grid-cols-2 gap-3 mt-auto">
                <div className="flex flex-col">
                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Uptime</span>
                    <span className="text-slate-900 text-sm font-bold">99.99%</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Active Nodes</span>
                    <span className="text-slate-900 text-sm font-bold">1,248</span>
                </div>
            </div>
        </div>
    )
}

// ══════════════════════════════════════════════════════════════
// CELL D — Security (Rich Descriptions)
// ══════════════════════════════════════════════════════════════
const SECURITY_FEATURES = [
    { icon: RiKey2Line, title: 'Zero Platform Custody', desc: 'Smart contracts execute payouts directly to your wallet. We never hold your HGAI.', color: '#FF7100' },
    { icon: RiShieldCheckLine, title: 'Audited Architecture', desc: 'Core logic rigorously tested and verified by top-tier Web3 security firms.', color: '#3B82F6' },
    { icon: RiLockPasswordLine, title: 'Permissionless Entry', desc: 'No KYC bottlenecks. Connect your wallet and begin earning immediately.', color: '#10B981' },
]

function SecurityCell() {
    return (
        <div className="flex flex-col gap-6 mt-4 h-full">
            {SECURITY_FEATURES.map((feature, i) => (
                <div key={feature.title} className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-white border border-slate-200 shadow-sm group-hover:scale-105 transition-transform duration-300">
                        <feature.icon style={{ color: feature.color }} className="text-lg" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-slate-900 mb-1">{feature.title}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">
                            {feature.desc}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    )
}

// ══════════════════════════════════════════════════════════════
// MAIN EXPORT
// ══════════════════════════════════════════════════════════════
export default function FeaturesSection() {
    return (
        <section id="features" className="px-4 sm:px-6 py-24 bg-[#FAFAFC] relative overflow-hidden">
            <div className="max-w-7xl mx-auto relative z-10">
                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center mb-20"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tighter mb-6 leading-tight">
                        Built for <span className="text-[#FF7100]">Serious Contributors</span>
                    </h2>
                    <p className="text-slate-500 text-lg max-w-2xl text-balance mx-auto leading-relaxed font-medium">
                        Every tool and feature in the HumanGrid ecosystem is engineered to maximize your HGAI rewards and streamline your labeling workflow.
                    </p>
                </motion.div>

                {/* Clean Light Theme Bento grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">

                    {/* A — AI Matching: 2 cols on LG */}
                    <div className="md:col-span-2 lg:col-span-2">
                        <BentoCard color="#FF7100" label="Smart Matching" title="AI assigns optimal datasets instantly" delay={0.1}>
                            <AIMatchingCell />
                        </BentoCard>
                    </div>

                    {/* B — Reputation: 1 col, 2 rows on LG */}
                    <div className="md:col-span-2 lg:col-span-1 lg:row-span-2">
                        <BentoCard color="#8B5CF6" label="Reputation & Ranks" title="Level up your profile, unlock bigger multipliers" delay={0.2} className="h-full" style={{ minHeight: 480 }}>
                            <ReputationCell />
                        </BentoCard>
                    </div>

                    {/* C — Speed: 1 col */}
                    <div className="md:col-span-1">
                        <BentoCard color="#10B981" label="On-Chain Finality" title="Transactions confirmed in milliseconds" delay={0.3}>
                            <SpeedCell />
                        </BentoCard>
                    </div>

                    {/* D — Security: 1 col */}
                    <div className="md:col-span-1">
                        <BentoCard color="#3B82F6" label="Total Security" title="Decentralized, non-custodial architecture" delay={0.4}>
                            <SecurityCell />
                        </BentoCard>
                    </div>
                </div>
            </div>
        </section>
    )
}