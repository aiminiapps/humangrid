'use client'

import { useAccount } from 'wagmi'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import WalletButton from '@/components/WalletButton'
import TasksSection from '@/components/TasksSection'
import ReputationCard from '@/components/ReputationCard'
import LeaderboardTable from '@/components/LeaderboardTable'
import RewardHistory from '@/components/RewardHistory'
import {
    RiBriefcaseLine,
    RiTrophyLine,
    RiCoinLine,
    RiFlashlightLine,
    RiArrowUpLine,
    RiLoader4Line,
    RiRobot2Line,
    RiShieldCheckLine,
} from 'react-icons/ri'
import Image from 'next/image'

export default function DashboardPage() {
    const { address, isConnected } = useAccount()
    const router = useRouter()
    const [userProfile, setUserProfile] = useState(null)
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)
    const [refreshKey, setRefreshKey] = useState(0)
    const isFirstLoad = refreshKey === 0

    useEffect(() => {
        if (!isConnected) {
            router.push('/')
            return
        }
        fetchData()
    }, [address, isConnected, router, refreshKey])

    const fetchData = async () => {
        // Only show full skeleton on first load; silent refresh otherwise
        if (isFirstLoad) setLoading(true)
        try {
            const [profileRes, tasksRes] = await Promise.all([
                fetch(`/api/profile?address=${address}`),
                fetch('/api/tasks')
            ])
            const [profileData, tasksData] = await Promise.all([
                profileRes.json(),
                tasksRes.json()
            ])
            setUserProfile(profileData)
            setTasks(tasksData)
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    if (!isConnected) {
        return (
            <div className="min-h-screen bg-[#FAFAFC] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-slate-500 mb-4 font-medium">Please connect your wallet to access the dashboard</p>
                    <WalletButton />
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FAFAFC]" style={{ backgroundImage: 'radial-gradient(ellipse at 20% 0%, rgba(255,113,0,0.05) 0%, transparent 60%)' }}>
                {/* Skeleton header */}
                <header className="sticky top-0 z-50">
                    <div className="max-w-[1500px] mx-auto px-4 sm:px-6 pt-3 pb-1">
                        <div className="flex items-center justify-between px-5 py-3 rounded-2xl border border-slate-200 bg-white/70 backdrop-blur-xl shadow-sm">
                            <div className="h-8 w-32 rounded-xl bg-slate-200 animate-pulse" />
                            <div className="h-9 w-36 rounded-xl bg-slate-200 animate-pulse" />
                        </div>
                    </div>
                </header>

                <div className="max-w-[1500px] mx-auto px-4 sm:px-6 py-8 space-y-8">
                    {/* Stat cards skeleton */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" style={{ opacity: 1 - i * 0.15 }}>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="h-3 w-20 rounded-full bg-slate-200 animate-pulse" />
                                    <div className="w-7 h-7 rounded-lg bg-slate-200 animate-pulse" />
                                </div>
                                <div className="h-7 w-24 rounded-lg bg-slate-200 animate-pulse" />
                            </div>
                        ))}
                    </div>

                    {/* Main grid skeleton */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        {/* Task list skeleton */}
                        <div className="xl:col-span-2 space-y-3">
                            {/* Header */}
                            <div className="flex justify-between items-center mb-4">
                                <div className="h-7 w-40 rounded-xl bg-slate-200 animate-pulse" />
                                <div className="h-9 w-36 rounded-xl bg-slate-200 animate-pulse" />
                            </div>
                            {/* Category tabs */}
                            <div className="flex gap-2 overflow-hidden">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="h-9 rounded-xl bg-slate-200 animate-pulse shrink-0" style={{ width: 80 + i * 10 }} />
                                ))}
                            </div>
                            {/* Task rows */}
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" style={{ opacity: 1 - i * 0.2 }}>
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 space-y-3">
                                            <div className="flex gap-2">
                                                <div className="h-5 w-14 rounded-lg bg-slate-200 animate-pulse" />
                                                <div className="h-5 w-20 rounded-lg bg-slate-200 animate-pulse" />
                                            </div>
                                            <div className="h-4 w-3/4 rounded-full bg-slate-200 animate-pulse" />
                                            <div className="h-3 w-full rounded-full bg-slate-100 animate-pulse" />
                                            <div className="h-3 w-2/3 rounded-full bg-slate-100 animate-pulse" />
                                        </div>
                                        <div className="rounded-xl bg-slate-100 px-4 py-3 text-center shrink-0 animate-pulse">
                                            <div className="h-4 w-12 rounded bg-slate-200" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Right panel skeleton */}
                        <div className="space-y-4">
                            {[140, 200, 260].map((h, i) => (
                                <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-8 h-8 rounded-xl bg-slate-200 animate-pulse" />
                                        <div className="h-4 w-28 rounded-full bg-slate-200 animate-pulse" />
                                    </div>
                                    <div className="space-y-3">
                                        {[...Array(3)].map((_, j) => (
                                            <div key={j} className="h-10 rounded-xl bg-slate-100 animate-pulse" style={{ opacity: 1 - j * 0.2 }} />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Shimmer overlay for light mode */}
                <style>{`
                    @keyframes shimmer {
                        0% { background-position: -200% 0; }
                        100% { background-position: 200% 0; }
                    }
                    .animate-pulse {
                        background-image: linear-gradient(90deg, transparent 25%, rgba(255,255,255,0.6) 50%, transparent 75%);
                        background-size: 200% 100%;
                        animation: shimmer 2s infinite;
                    }
                `}</style>
            </div>
        )
    }

    const stats = [
        {
            label: 'SYNTR Balance',
            value: userProfile?.total_rewards || 0,
            suffix: 'SYNTR',
            icon: RiCoinLine,
            color: '#FF7100', // Sunrise Orange
            glow: 'shadow-[0_4px_15px_rgba(255,113,0,0.08)]',
            border: 'border-[#FF7100]/20',
            bg: 'bg-gradient-to-br from-[#FF7100]/10 to-[#FF7100]/5',
        },
        {
            label: 'Contributions',
            value: userProfile?.total_contributions || 0,
            suffix: 'tasks',
            icon: RiBriefcaseLine,
            color: '#10B981', // Emerald
            glow: 'shadow-sm',
            border: 'border-slate-200',
            bg: 'bg-white',
        },
        {
            label: 'Level',
            value: userProfile?.level || 1,
            suffix: '',
            icon: RiTrophyLine,
            color: '#F59E0B', // Amber
            glow: 'shadow-sm',
            border: 'border-slate-200',
            bg: 'bg-white',
        },
        {
            label: 'Reputation',
            value: userProfile?.reputation_score || 0,
            suffix: 'pts',
            icon: RiFlashlightLine,
            color: '#3B82F6', // Blue
            glow: 'shadow-sm',
            border: 'border-slate-200',
            bg: 'bg-white',
        },
    ]

    return (
        <div className="min-h-screen bg-[#FAFAFC]" style={{ backgroundImage: 'radial-gradient(ellipse at 20% 0%, rgba(255,113,0,0.05) 0%, transparent 60%), radial-gradient(ellipse at 80% 100%, rgba(59,130,246,0.03) 0%, transparent 60%)' }}>

            {/* ── Header ── */}
            <header className="sticky top-0 z-50">
                {/* Floating island container */}
                <div className="max-w-[1500px] mx-auto px-4 sm:px-6 pt-3 pb-1">
                    <motion.div
                        initial={{ opacity: 0, y: -16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        className="flex items-center justify-between gap-4 px-4 sm:px-5 py-3 rounded-2xl border"
                        style={{
                            background: 'rgba(255, 255, 255, 0.85)',
                            borderColor: 'rgba(15, 23, 42, 0.08)',
                            backdropFilter: 'blur(24px)',
                            boxShadow: '0 4px 20px -5px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,1)',
                        }}
                    >
                        {/* ── Logo ── */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            onClick={() => router.push('/')}
                            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
                        >
                            {/* Assuming logo.png is adapted for light mode or you have a light-mode version */}
                            <Image src="/logo.png" alt="Logo" width={120} height={50} className="object-contain" />
                        </motion.div>

                        {/* ── Center nav ── */}
                        <nav className="hidden md:flex items-center gap-1">
                            {[
                                { label: 'Home', path: '/' },
                                { label: 'Dashboard', path: '/ai', active: true },
                            ].map(item => (
                                <button
                                    key={item.label}
                                    onClick={() => router.push(item.path)}
                                    className="px-4 py-1.5 rounded-full text-xs font-bold transition-all uppercase tracking-wider"
                                    style={{
                                        color: item.active ? '#FF7100' : '#64748B', // Orange vs Slate-500
                                        background: item.active ? 'rgba(255,113,0,0.08)' : 'transparent',
                                        border: item.active ? '1px solid rgba(255,113,0,0.2)' : '1px solid transparent',
                                    }}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </nav>

                        {/* ── Right side ── */}
                        <div className="flex items-center gap-3 shrink-0">
                            {/* BSC live badge */}
                            <div
                                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-sm"
                                style={{
                                    borderColor: 'rgba(16, 185, 129, 0.2)',
                                    background: 'rgba(16, 185, 129, 0.05)',
                                }}
                            >
                                <span className="relative flex h-2 w-2 shrink-0">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-60" />
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]" />
                                </span>
                                <span className="text-[#10B981] text-[10px] font-bold uppercase tracking-widest">BSC Live</span>
                            </div>

                            {/* Wallet button */}
                            <WalletButton />
                        </div>
                    </motion.div>
                </div>
            </header>


            {/* ── Main Content ── */}
            <div className="max-w-[1500px] mx-auto px-4 sm:px-6 py-8">

                {/* ── Stats Grid ── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            className={`rounded-2xl border p-5 ${stat.border} ${stat.bg} ${stat.glow}`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">{stat.label}</span>
                                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}>
                                    <stat.icon style={{ color: stat.color }} className="text-lg" />
                                </div>
                            </div>
                            <div className="flex items-end gap-1.5">
                                <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{stat.value.toLocaleString()}</span>
                                {stat.suffix && <span className="text-slate-400 text-sm font-medium mb-1">{stat.suffix}</span>}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* ── Main Grid ── */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                    {/* Left: Tasks (2/3 width) */}
                    <div className="xl:col-span-2 space-y-6">
                        <TasksSection
                            tasks={tasks}
                            userAddress={address}
                            userLevel={userProfile?.level || 1}
                            onTaskComplete={() => setRefreshKey(k => k + 1)}
                        />
                        <RewardHistory userAddress={address} />
                    </div>

                    {/* Right: Reputation + Leaderboard (1/3 width) */}
                    <div className="space-y-6">
                        {/* Level Progress Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                        >
                            <div className="flex items-center gap-2 mb-5">
                                <div className="p-2 bg-[#FF7100]/10 rounded-lg">
                                    <RiShieldCheckLine className="text-[#FF7100] text-xl" />
                                </div>
                                <h3 className="text-slate-900 font-bold text-base">Level Progress</h3>
                                <span className="ml-auto text-[#FF7100] font-black text-xl">Lv.{userProfile?.level || 1}</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2.5 mb-3 overflow-hidden shadow-inner">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${((userProfile?.reputation_score || 0) % 100)}%` }}
                                    transition={{ duration: 1, ease: 'easeOut' }}
                                    className="h-full rounded-full bg-gradient-to-r from-[#FF7100] to-[#FF9D4A]"
                                />
                            </div>
                            <div className="flex justify-between text-xs font-medium text-slate-500 uppercase tracking-wide">
                                <span>{(userProfile?.reputation_score || 0) % 100} / 100 XP</span>
                                <span>Next: Lv.{(userProfile?.level || 1) + 1}</span>
                            </div>
                        </motion.div>

                        <ReputationCard userProfile={userProfile} />
                        <LeaderboardTable currentUserAddress={address} />
                    </div>
                </div>
            </div>
        </div>
    )
}