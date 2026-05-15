'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useRef } from 'react'
import {
    RiSparklingFill,
    RiMailLine,
} from 'react-icons/ri'

export default function HeroSection() {
    const router = useRouter()
    const sectionRef = useRef(null)
    const { scrollY } = useScroll()
    const y = useTransform(scrollY, [0, 500], [0, 80])
    const opacity = useTransform(scrollY, [0, 350], [1, 0])

    return (
        <section
            ref={sectionRef}
            className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 pt-32 pb-20 overflow-hidden bg-white"
        >
            {/* ── Background elements ── */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-[#FAFAFA]">
                {/* Soft right-side orange gradient as seen in the reference */}
                <div 
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-[50vw] h-[80vh] opacity-90"
                    style={{
                        background: 'radial-gradient(ellipse at right center, rgba(255,102,51,0.3) 0%, rgba(255,102,51,0.05) 50%, rgba(250,250,250,0) 80%)',
                        filter: 'blur(60px)',
                        transform: 'translate(20%, 0)'
                    }}
                />
            </div>

            {/* ── All text content — z-10 ── */}
            <motion.div
                style={{ y, opacity }}
                className="relative z-10 w-full max-w-[1000px] mx-auto flex flex-col items-center mt-12"
            >
                {/* Top Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 shadow-sm"
                    style={{ background: '#F96531' }}
                >
                    <RiSparklingFill className="text-white text-sm" />
                    <span className="text-white text-xs sm:text-sm font-medium tracking-wide">
                        Best AI Micro-Task Platform of the Year
                    </span>
                </motion.div>

                {/* Headline */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.65, delay: 0.2 }}
                    className="text-center mb-6"
                >
                    <h1
                        className="text-[#1A1A1A] leading-[1.05] tracking-tight font-semibold"
                        style={{ fontSize: 'clamp(3.5rem, 7vw, 6.5rem)' }}
                    >
                        Train AI Models. Grow <br />
                        <span className="italic font-medium">Earnings Faster.</span>
                    </h1>
                </motion.div>

                {/* Subtitle */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.65, delay: 0.3 }}
                    className="text-center mb-12 max-w-[850px]"
                >
                    <p
                        className="text-[#4B5563] text-balance leading-relaxed mx-auto font-medium"
                        style={{ fontSize: 'clamp(1rem, 1.5vw, 1.125rem)' }}
                    >
                        SYNTR is the simple, powerful platform that captures your skills, automates verification, tracks your contributions in real time, and delivers crypto rewards, so you earn smarter and win more without the chaos.
                    </p>
                </motion.div>

                {/* CTA Form Component */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.65, delay: 0.4 }}
                    className="w-full max-w-[460px] bg-white rounded-2xl p-1.5 flex items-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow duration-300"
                >
                    <div className="pl-4 pr-2 flex items-center justify-center text-gray-400">
                        <RiMailLine className="text-xl" />
                    </div>
                    <input 
                        type="email" 
                        placeholder="Enter your work email" 
                        className="flex-1 bg-transparent border-none outline-none py-3 text-gray-700 placeholder:text-gray-400 text-[15px] font-medium"
                    />
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => router.push('/ai')}
                        className="bg-[#111111] text-white px-7 py-3.5 rounded-xl font-semibold text-[15px] transition-colors hover:bg-black whitespace-nowrap shadow-sm"
                    >
                        Start Free Trial
                    </motion.button>
                </motion.div>

            </motion.div>
        </section>
    )
}
