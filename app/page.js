'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import WalletButton from '@/components/WalletButton'
import HeroSection from '@/components/landing/HeroSection'
import HowItWorks from '@/components/landing/HowItWorks'
import AboutSection from '@/components/landing/AboutSection'
import FeaturesSection from '@/components/landing/FeaturesSection'
import CommunitySection from '@/components/landing/CommunitySection'
import CTABanner from '@/components/landing/CTABanner'
import LandingFooter from '@/components/landing/LandingFooter'
import { RiMenuLine, RiCloseLine, RiArrowRightLine } from 'react-icons/ri'

// ─── NavLink ─────────────────────────────────────────────────────────────────
function NavLink({ label, onClick }) {
    return (
        <button
            onClick={onClick}
            className="relative text-sm font-medium text-white/50 hover:text-white transition-colors duration-200 group"
        >
            {label}
            <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#C6FF1A] group-hover:w-full transition-all duration-300" />
        </button>
    )
}

// ─── Film Grain ───────────────────────────────────────────────────────────────
function FilmGrain() {
    return (
        <>
            {/* SVG filter definition */}
            <svg width="0" height="0" className="absolute" aria-hidden>
                <defs>
                    <filter id="film-grain" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="linearRGB">
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.65"
                            numOctaves="3"
                            stitchTiles="stitch"
                            result="noise"
                        />
                        <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
                        <feBlend in="SourceGraphic" in2="grayNoise" mode="overlay" result="blend" />
                        <feComponentTransfer in="blend">
                            <feFuncA type="linear" slope="1" />
                        </feComponentTransfer>
                    </filter>
                </defs>
            </svg>

            {/* Animated noise overlay */}
            <div
                aria-hidden
                className="film-grain-overlay"
            />

            <style>{`
                @keyframes grainShift {
                    0%   { transform: translate(0, 0); }
                    10%  { transform: translate(-2%, -3%); }
                    20%  { transform: translate(3%, 2%); }
                    30%  { transform: translate(-1%, 4%); }
                    40%  { transform: translate(4%, -1%); }
                    50%  { transform: translate(-3%, 1%); }
                    60%  { transform: translate(2%, -4%); }
                    70%  { transform: translate(-4%, 2%); }
                    80%  { transform: translate(1%, -2%); }
                    90%  { transform: translate(-2%, 3%); }
                    100% { transform: translate(0, 0); }
                }
                .film-grain-overlay {
                    position: fixed;
                    inset: -50%;
                    width: 200%;
                    height: 200%;
                    z-index: 9999;
                    pointer-events: none;
                    opacity: 0.028;
                    animation: grainShift 0.12s steps(1) infinite;
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
                    background-repeat: repeat;
                    background-size: 256px 256px;
                }
            `}</style>
        </>
    )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
    const router = useRouter()
    const [mobileOpen, setMobileOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 24)
        window.addEventListener('scroll', handler, { passive: true })
        return () => window.removeEventListener('scroll', handler)
    }, [])

    const navItems = [
        { label: 'How It Works', id: 'how-it-works' },
        { label: 'Features', id: 'features' },
        { label: 'Community', id: 'community' },
    ]

    return (
        <div className="min-h-screen text-white overflow-x-hidden" style={{ background: '#060A07' }}>

            {/* ── Film grain ── */}
            <FilmGrain />

            {/* ── Background mesh ── */}
            <div className="fixed inset-0 pointer-events-none" aria-hidden>
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: 'radial-gradient(ellipse 80% 45% at 50% -5%, rgba(198,255,26,0.06) 0%, transparent 60%)',
                }} />
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)',
                    backgroundSize: '60px 60px',
                }} />
            </div>

            {/* ══════════════════════════════════════════════
                NAVBAR  (unchanged from original)
            ═══════════════════════════════════════════════ */}
            <header
                className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
                style={{ paddingTop: scrolled ? 8 : 16, paddingBottom: scrolled ? 8 : 12 }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center justify-between gap-6 px-5 py-3 rounded-2xl transition-all duration-500"
                        style={{
                            background: scrolled ? 'rgba(6,10,7,0.92)' : 'rgba(6,10,7,0.6)',
                            border: '1px solid',
                            borderColor: scrolled ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.06)',
                            backdropFilter: 'blur(24px)',
                            boxShadow: scrolled
                                ? '0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(198,255,26,0.06)'
                                : '0 4px 20px rgba(0,0,0,0.3)',
                        }}
                    >
                        {/* Logo */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="flex items-center gap-2.5 shrink-0"
                        >
                            <Image src="/logo.png" alt="SYNTHOS" width={130} height={36} />
                        </motion.button>

                        {/* Desktop nav links */}
                        <nav className="hidden md:flex items-center gap-7">
                            {navItems.map(item => (
                                <NavLink
                                    key={item.label}
                                    label={item.label}
                                    onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })}
                                />
                            ))}
                        </nav>

                        {/* Right side */}
                        <div className="flex items-center gap-3">
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => router.push('/ai')}
                                className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white/60 hover:text-white border border-white/8 hover:border-white/20 bg-white/3 hover:bg-white/6 transition-all"
                            >
                                Dashboard
                                <RiArrowRightLine className="text-xs" />
                            </motion.button>

                            <WalletButton />

                            <button
                                className="md:hidden p-2 rounded-xl border border-white/10 bg-white/5 text-white/60 hover:text-white transition-colors"
                                onClick={() => setMobileOpen(v => !v)}
                            >
                                {mobileOpen ? <RiCloseLine className="text-lg" /> : <RiMenuLine className="text-lg" />}
                            </button>
                        </div>
                    </motion.div>

                    {/* Mobile drawer */}
                    <AnimatePresence>
                        {mobileOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.2 }}
                                className="mt-2 rounded-2xl border border-white/8 overflow-hidden md:hidden"
                                style={{ background: 'rgba(6,10,7,0.97)', backdropFilter: 'blur(24px)' }}
                            >
                                <div className="px-5 py-4 space-y-1">
                                    {navItems.map(item => (
                                        <button
                                            key={item.label}
                                            onClick={() => {
                                                document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })
                                                setMobileOpen(false)
                                            }}
                                            className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all"
                                        >
                                            {item.label}
                                        </button>
                                    ))}
                                    <div className="pt-2 border-t border-white/6">
                                        <button
                                            onClick={() => { router.push('/ai'); setMobileOpen(false) }}
                                            className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-[#C6FF1A] hover:bg-[#C6FF1A]/8 transition-all"
                                        >
                                            → Launch Dashboard
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </header>

            {/* ══════════════════════════════════════════════
                PAGE SECTIONS
            ═══════════════════════════════════════════════ */}
            <main>
                <HeroSection />
                <HowItWorks />
                <AboutSection />
                <FeaturesSection />
                <CommunitySection />
                <CTABanner />
            </main>

            <LandingFooter />
        </div>
    )
}
