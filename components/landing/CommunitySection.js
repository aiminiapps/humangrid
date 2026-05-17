'use client'

import { motion, useInView, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useRef, useState, useEffect } from 'react'
import { 
    RiBrainLine, RiArrowRightUpLine, RiWallet3Line, 
    RiFileTextLine, RiImageLine, RiCheckDoubleLine, RiExternalLinkLine 
} from 'react-icons/ri'

const STEPS = [
    {
        id: 1,
        title: 'Connect Your Wallet',
        desc: 'Sync your Web3 wallet for seamless, non-custodial access to the network. Enjoy permissionless entry with zero KYC requirements and instant onboarding.',
    },
    {
        id: 2,
        title: 'Complete Micro-Tasks',
        desc: 'Access the dashboard and select from a variety of AI data labeling, verification, and grading tasks. The smarter you work, the higher your reputation tier grows.',
    },
    {
        id: 3,
        title: 'Earn HGAI Instantly',
        desc: 'Get paid directly on-chain the moment your work is validated. Experience transparent, zero-delay payouts without middlemen holding your funds.',
    },
]

export default function OnboardingSteps() {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: '-80px' })
    const [activeStep, setActiveStep] = useState(1)
    const [isHovered, setIsHovered] = useState(false)

    // Auto-advance logic
    useEffect(() => {
        if (isHovered) return // Pause auto-play when user is interacting
        const timer = setInterval(() => {
            setActiveStep((prev) => (prev === STEPS.length ? 1 : prev + 1))
        }, 5000) // 5 seconds per tab
        return () => clearInterval(timer)
    }, [isHovered])

    // Dynamic content for the right-side App Card
    const renderCardContent = () => {
        switch (activeStep) {
            case 1:
                return (
                    <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="w-full">
                        <div className="text-center mb-8">
                            <h4 className="text-[17px] font-bold text-slate-900 mb-1">Access the Data Network</h4>
                            <p className="text-xs text-slate-500 font-medium">Securely connect your Web3 wallet</p>
                        </div>
                        <div className="flex flex-col gap-4 mb-8">
                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Preferred Network</label>
                                <div className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-700 text-sm font-semibold">
                                    <div className="w-5 h-5 rounded-full bg-[#F3BA2F] flex items-center justify-center shrink-0">
                                        <RiWallet3Line className="text-white text-xs" />
                                    </div>
                                    BNB Smart Chain
                                </div>
                            </div>
                        </div>
                        <button className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-[15px] text-white shadow-[0_8px_20px_-6px_rgba(255,113,0,0.4)] hover:shadow-[0_12px_25px_-8px_rgba(255,113,0,0.5)] transition-all duration-300" style={{ background: 'linear-gradient(135deg, #FF8A33 0%, #FF7100 100%)' }}>
                            Connect Wallet <RiArrowRightUpLine className="text-lg" />
                        </button>
                    </motion.div>
                )
            case 2:
                return (
                    <motion.div key="step2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="w-full">
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="text-[17px] font-bold text-slate-900">Task Board</h4>
                            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-widest">Live</span>
                        </div>
                        <div className="flex flex-col gap-3 mb-6">
                            <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-sm flex justify-between items-center group cursor-pointer hover:border-[#FF7100]/30 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center"><RiImageLine /></div>
                                    <div>
                                        <div className="text-sm font-bold text-slate-900">Verify Bounding Boxes</div>
                                        <div className="text-[11px] text-slate-500 font-medium">Computer Vision • 2m</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-bold text-[#FF7100]">15 HGAI</div>
                                </div>
                            </div>
                            <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-sm flex justify-between items-center group cursor-pointer hover:border-[#FF7100]/30 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-500 flex items-center justify-center"><RiFileTextLine /></div>
                                    <div>
                                        <div className="text-sm font-bold text-slate-900">Grade LLM Response</div>
                                        <div className="text-[11px] text-slate-500 font-medium">NLP Model • 5m</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-bold text-[#FF7100]">45 HGAI</div>
                                </div>
                            </div>
                        </div>
                        <button className="w-full py-3.5 rounded-xl font-bold text-[14px] text-slate-700 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors">
                            View All Tasks
                        </button>
                    </motion.div>
                )
            case 3:
                return (
                    <motion.div key="step3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="w-full text-center">
                        <div className="w-16 h-16 mx-auto rounded-full bg-green-50 flex items-center justify-center mb-4">
                            <RiCheckDoubleLine className="text-green-500 text-3xl" />
                        </div>
                        <h4 className="text-[17px] font-bold text-slate-900 mb-1">Task Approved!</h4>
                        <p className="text-xs text-slate-500 font-medium mb-6">Rewards sent directly to your wallet</p>
                        
                        <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 mb-8">
                            <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">Payout Amount</div>
                            <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF7100] to-[#E65C00] tracking-tighter mb-2">
                                +60.00
                            </div>
                            <div className="text-sm font-bold text-slate-600">HGAI Tokens</div>
                        </div>
                    </motion.div>
                )
            default:
                return null
        }
    }

    return (
        <section 
            id="how-it-works" 
            className="relative px-4 sm:px-6 py-24 bg-[#FAFAFC] overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            
            {/* Soft Ambient Background */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-l from-[#FF7100]/[0.07] to-transparent blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* ── Top Header ── */}
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center max-w-3xl mx-auto mb-20"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tighter mb-5">
                        Get Started in Three Simple Steps
                    </h2>
                    <p className="text-slate-500 text-[1.1rem] text-balance leading-relaxed font-medium">
                        Connect your wallet and effortlessly start completing AI training tasks with minimal setup and no learning curve required.
                    </p>
                </motion.div>

                {/* ── Two Column Layout ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                    
                    {/* Left Column: Interactive Tabs */}
                    <div className="flex flex-col gap-2">
                        {STEPS.map((step, index) => (
                            <motion.div
                                key={step.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={inView ? { opacity: 1, x: 0 } : {}}
                                transition={{ duration: 0.6, delay: 0.1 + index * 0.15 }}
                                onClick={() => setActiveStep(step.id)}
                                className={`relative pl-8 pr-6 py-6 cursor-pointer rounded-2xl transition-all duration-300 ${activeStep === step.id ? 'bg-white shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-slate-100' : 'hover:bg-slate-100/50 border border-transparent'}`}
                            >
                                {/* Vertical Timeline Line */}
                                <div 
                                    className="absolute left-0 top-6 bottom-6 w-[3px] transition-colors duration-500 rounded-r-full"
                                    style={{
                                        backgroundColor: activeStep === step.id ? '#FF7100' : 'rgba(203, 213, 225, 0.4)'
                                    }}
                                />

                                <h3 
                                    className="text-2xl font-bold mb-3 transition-colors duration-300 tracking-tight"
                                    style={{ color: activeStep === step.id ? '#0F172A' : '#475569' }}
                                >
                                    {step.title}
                                </h3>
                                <p 
                                    className="text-[15px] leading-relaxed transition-colors duration-300 font-medium"
                                    style={{ color: activeStep === step.id ? '#64748B' : '#94A3B8' }}
                                >
                                    {step.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Right Column: Dynamic Premium App Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="relative w-full max-w-md mx-auto lg:ml-auto"
                    >
                        {/* Outer protective glass border */}
                        <div className="absolute inset-[-12px] bg-white/40 backdrop-blur-xl rounded-[2.5rem] border border-slate-200/50 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] pointer-events-none" />
                        
                        {/* Inner High-Fidelity Card */}
                        <div className="relative bg-white rounded-[2rem] p-8 sm:p-10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] border border-slate-100 min-h-[460px] flex flex-col">
                            
                            {/* Logo Row (Static across all tabs) */}
                            <div className="flex items-center justify-center gap-2 mb-8 shrink-0">
                                <div className="w-8 h-8 rounded-lg bg-[#FF7100]/10 flex items-center justify-center">
                                    <Image src="/icon.png" alt="Logo" width={32} height={32} />
                                </div>
                                <span className="text-xl font-bold text-slate-900 tracking-tight">HumanGrid</span>
                            </div>

                            {/* Dynamic Content Area */}
                            <div className="flex-1 flex flex-col justify-center relative">
                                <AnimatePresence mode="wait">
                                    {renderCardContent()}
                                </AnimatePresence>
                            </div>

                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}