'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { RiArrowRightUpLine, RiPlayCircleLine, RiShieldCheckLine, RiFlashlightLine, RiWallet3Line } from 'react-icons/ri'

const PILLS = [
    { icon: RiWallet3Line, label: 'No KYC Required' },
    { icon: RiFlashlightLine, label: 'Instant Payouts' },
    { icon: RiShieldCheckLine, label: 'Non-Custodial' },
]

export default function CTABanner() {
    const router = useRouter()
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: '-80px' })

    return (
        <section className="px-4 sm:px-6 py-14">
            <div className="max-w-5xl mx-auto">
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 28, scale: 0.98 }}
                    animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                    transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                    className="relative rounded-3xl overflow-hidden flex flex-col items-center text-center px-6 py-16 sm:py-20"
                    style={{
                        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(198,255,26,0.06) 0%, transparent 65%), rgba(255,255,255,0.025)',
                        border: '1px solid rgba(255,255,255,0.08)',
                    }}
                >
                    {/* Subtle top glow */}
                    <div className="absolute top-0 inset-x-0 h-px"
                        style={{ background: 'linear-gradient(90deg, transparent 10%, rgba(198,255,26,0.35) 50%, transparent 90%)' }} />

                    {/* Corner grain texture */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.015]"
                        style={{
                            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
                            backgroundSize: '180px',
                        }} />

                    {/* Pills */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.45, delay: 0.1 }}
                        className="flex flex-wrap items-center justify-center gap-2 mb-8"
                    >
                        {PILLS.map(({ icon: Icon, label }) => (
                            <div
                                key={label}
                                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full"
                                style={{
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    background: 'rgba(255,255,255,0.05)',
                                }}
                            >
                                <Icon className="text-white/40 text-xs" />
                                <span className="text-white/55 text-[11px] font-medium">{label}</span>
                            </div>
                        ))}
                    </motion.div>

                    {/* Headline */}
                    <motion.h2
                        initial={{ opacity: 0, y: 18 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.16 }}
                        className="font-bold text-white leading-[1.05] mb-4"
                        style={{
                            fontSize: 'clamp(2rem, 5.5vw, 3.6rem)',
                            letterSpacing: '-0.03em',
                            maxWidth: 720,
                        }}
                    >
                        Start Earning{' '}
                        <span style={{ color: '#C6FF1A' }}>SYNTR</span>{' '}
                        Today
                    </motion.h2>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 14 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.55, delay: 0.22 }}
                        className="text-white/38 text-[15px] text-balance leading-relaxed mb-10 max-w-md"
                    >
                        Connect your wallet in 30 seconds. No credit card. No KYC.
                        Just AI tasks that pay real crypto.
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.28 }}
                        className="flex flex-col sm:flex-row items-center gap-3"
                    >
                        {/* Primary */}
                        <motion.button
                            whileHover={{ scale: 1.03, boxShadow: '0 4px 28px rgba(198,255,26,0.25)' }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => router.push('/ai')}
                            className="relative flex items-center gap-2.5 px-7 py-3.5 rounded-full font-bold text-sm overflow-hidden group"
                            style={{
                                background: '#C6FF1A',
                                color: '#060A07',
                            }}
                        >
                            {/* Shine sweep */}
                            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                style={{ background: 'linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.28) 50%, transparent 70%)' }} />
                            <Image src="/icon.png" alt="" width={20} height={20} className="relative z-10 shrink-0" />
                            <span className="relative z-10">Launch Dashboard</span>
                            <RiArrowRightUpLine className="relative z-10 text-sm group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                        </motion.button>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}
