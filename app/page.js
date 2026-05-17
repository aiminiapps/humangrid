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
            className="relative text-sm font-bold tracking-wide text-slate-500 hover:text-slate-900 transition-colors duration-300 group"
        >
            {label}
            <span className="absolute -bottom-1 left-0 w-0 h-[2px] rounded-full bg-[#FF7100] group-hover:w-full transition-all duration-300" />
        </button>
    )
}

// ─── Subtle Light Mesh & Grain ────────────────────────────────────────────────
function PremiumBackground() {
    return (
        <div className="fixed inset-0 pointer-events-none z-0" aria-hidden>
            {/* Elegant Top Ambient Glow */}
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'radial-gradient(ellipse 80% 40% at 50% -5%, rgba(255,113,0,0.06) 0%, transparent 60%)',
            }} />
            
            {/* Minimalist Grid Pattern */}
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px)',
                backgroundSize: '48px 48px',
            }} />
            
            {/* Ultra-faint film grain for texture (replaces the heavy dark grain) */}
            <div 
                className="absolute inset-0 opacity-[0.03] mix-blend-multiply"
                style={{
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
                }} 
            />
        </div>
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
        <div className="min-h-screen text-slate-900 overflow-x-hidden bg-[#FAFAFC]">

            <PremiumBackground />

            {/* ══════════════════════════════════════════════
                PREMIUM LIGHT NAVBAR
            ═══════════════════════════════════════════════ */}
            <header
                className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
                style={{ paddingTop: scrolled ? 12 : 24, paddingBottom: scrolled ? 12 : 20 }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="flex items-center justify-between gap-6 px-6 py-3.5 rounded-xl transition-all duration-500"
                        style={{
                            background: scrolled ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.5)',
                            border: '1px solid',
                            borderColor: scrolled ? 'rgba(0, 0, 0, 0.08)' : 'rgba(0, 0, 0, 0.03)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            boxShadow: scrolled
                                ? '0 10px 40px -10px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,1)'
                                : '0 4px 20px -10px rgba(0,0,0,0.02)',
                        }}
                    >
                        {/* Logo */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="flex items-center gap-2.5 shrink-0"
                        >
                            <Image src="/logo.png" alt="HumanGrid AI" width={130} height={36} className="drop-shadow-sm" />
                        </motion.button>

                        {/* Desktop nav links */}
                        <nav className="hidden md:flex items-center gap-8">
                            {navItems.map(item => (
                                <NavLink
                                    key={item.label}
                                    label={item.label}
                                    onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })}
                                />
                            ))}
                        </nav>

                        {/* Right side */}
                        <div className="flex items-center gap-4">
                            <motion.button
                                whileHover={{ scale: 1.03, backgroundColor: '#F8FAFC' }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => router.push('/ai')}
                                className="hidden sm:flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[13px] font-bold text-slate-600 hover:text-slate-900 border border-slate-200 bg-white shadow-sm transition-all"
                            >
                                Dashboard
                                <RiArrowRightLine className="text-sm text-[#FF7100]" />
                            </motion.button>

                            <WalletButton />

                            {/* Mobile Menu Toggle */}
                            <button
                                className="md:hidden p-2.5 rounded-full border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-sm"
                                onClick={() => setMobileOpen(v => !v)}
                            >
                                {mobileOpen ? <RiCloseLine className="text-lg" /> : <RiMenuLine className="text-lg" />}
                            </button>
                        </div>
                    </motion.div>

                    {/* Mobile drawer (Light Theme) */}
                    <AnimatePresence>
                        {mobileOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                                transition={{ duration: 0.25, ease: "easeOut" }}
                                className="mt-3 rounded-[1.5rem] border border-slate-200/80 overflow-hidden md:hidden shadow-xl"
                                style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)' }}
                            >
                                <div className="px-5 py-5 space-y-1">
                                    {navItems.map(item => (
                                        <button
                                            key={item.label}
                                            onClick={() => {
                                                document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })
                                                setMobileOpen(false)
                                            }}
                                            className="w-full text-left px-4 py-3 rounded-xl text-[15px] font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
                                        >
                                            {item.label}
                                        </button>
                                    ))}
                                    <div className="pt-3 mt-2 border-t border-slate-100">
                                        <button
                                            onClick={() => { router.push('/ai'); setMobileOpen(false) }}
                                            className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-[15px] font-bold text-white shadow-md"
                                            style={{ background: 'linear-gradient(135deg, #FF8A33 0%, #FF7100 100%)' }}
                                        >
                                            Launch Dashboard
                                            <RiArrowRightLine />
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
            <main className="relative z-10">
                <HeroSection />
                <HowItWorks />
                <AboutSection />
                <FeaturesSection />
                <CommunitySection />
                <CTABanner />
            </main>

            <div className="relative z-10">
                <LandingFooter />
            </div>
        </div>
    )
}