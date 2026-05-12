'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    RiCoinLine, RiCheckLine, RiCloseLine, RiTimeLine,
    RiSparklingLine, RiExternalLinkLine, RiLockLine,
    RiRobot2Line, RiShieldLine, RiBarChartLine,
    RiSearchLine, RiLightbulbLine, RiPaletteLine,
    RiHashtag, RiGlobalLine, RiArrowRightLine,
    RiFireLine, RiStarLine, RiRefreshLine, RiLoader4Line
} from 'react-icons/ri'
import RewardAnimation from './RewardAnimation'
import Image from 'next/image'

// ─── Category Config ──────────────────────────────────────────────────────────
const CATEGORIES = [
    { id: 'all', label: 'All Tasks', icon: RiGlobalLine, color: '#C6FF1A', bg: 'from-[#C6FF1A]/20 to-[#C6FF1A]/5' },
    { id: 'sentiment', label: 'Sentiment', icon: RiBarChartLine, color: '#C6FF1A', bg: 'from-[#C6FF1A]/20 to-[#C6FF1A]/5' },
    { id: 'risk', label: 'Risk', icon: RiShieldLine, color: '#FF6B35', bg: 'from-[#FF6B35]/20 to-[#FF6B35]/5' },
    { id: 'tagging', label: 'Tagging', icon: RiHashtag, color: '#A78BFA', bg: 'from-[#A78BFA]/20 to-[#A78BFA]/5' },
    { id: 'prediction', label: 'Prediction', icon: RiSparklingLine, color: '#38BDF8', bg: 'from-[#38BDF8]/20 to-[#38BDF8]/5' },
    { id: 'research', label: 'Research', icon: RiSearchLine, color: '#34D399', bg: 'from-[#34D399]/20 to-[#34D399]/5' },
    { id: 'validation', label: 'AI Validation', icon: RiRobot2Line, color: '#60A5FA', bg: 'from-[#60A5FA]/20 to-[#60A5FA]/5' },
    { id: 'creative', label: 'Creative', icon: RiPaletteLine, color: '#FBBF24', bg: 'from-[#FBBF24]/20 to-[#FBBF24]/5' },
    { id: 'social', label: 'Social', icon: RiGlobalLine, color: '#FB7185', bg: 'from-[#FB7185]/20 to-[#FB7185]/5' },
]

const DIFFICULTY_CONFIG = {
    easy: { label: 'EASY', color: '#34D399', bg: 'bg-[#34D399]/10 border-[#34D399]/40 text-[#34D399]' },
    medium: { label: 'MEDIUM', color: '#FBBF24', bg: 'bg-[#FBBF24]/10 border-[#FBBF24]/40 text-[#FBBF24]' },
    hard: { label: 'HARD', color: '#FF6B35', bg: 'bg-[#FF6B35]/10 border-[#FF6B35]/40 text-[#FF6B35]' },
}

const getCategoryConfig = (catId) => CATEGORIES.find(c => c.id === catId) || CATEGORIES[0]

// ─── Individual Task Card ─────────────────────────────────────────────────────
function TaskItem({ task, userAddress, userLevel, onComplete, index }) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [selectedAnswer, setSelectedAnswer] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showReward, setShowReward] = useState(false)
    const [rewardData, setRewardData] = useState(null)
    const [isCompleted, setIsCompleted] = useState(false)
    const [aiProcessing, setAiProcessing] = useState(false)
    const [aiMessage, setAiMessage] = useState('')

    const catConfig = getCategoryConfig(task.category)
    const diffConfig = DIFFICULTY_CONFIG[task.difficulty] || DIFFICULTY_CONFIG.medium
    const isLocked = (userLevel || 1) < (task.min_level || 1)

    const aiMessages = [
        '🤖 AI analyzing your response...',
        '🧠 Validating against training data...',
        '⚡ Computing confidence score...',
        '✨ Finalizing reward calculation...',
    ]

    const handleSubmit = async (e) => {
        e?.stopPropagation()
        if (!selectedAnswer || isSubmitting) return

        setIsSubmitting(true)
        setAiProcessing(true)

        // Cycle through AI messages
        let msgIdx = 0
        setAiMessage(aiMessages[0])
        const msgInterval = setInterval(() => {
            msgIdx = (msgIdx + 1) % aiMessages.length
            setAiMessage(aiMessages[msgIdx])
        }, 1200)

        try {
            const res = await fetch('/api/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    taskId: task.id,
                    answer: selectedAnswer,
                    userAddress,
                    // Send full task object so server can handle AI-generated tasks
                    // that don't exist in the DB or mockTasks
                    taskData: task.ai_generated ? task : undefined,
                }),
            })
            const data = await res.json()

            clearInterval(msgInterval)
            setAiProcessing(false)

            if (data.success) {
                setIsCompleted(true)
                setRewardData({ amount: data.reward_amount, txHash: data.tx_hash })
                setShowReward(true)
                setTimeout(() => {
                    setShowReward(false)
                    onComplete?.()
                }, 5000)
            }
        } catch (err) {
            clearInterval(msgInterval)
            setAiProcessing(false)
            console.error('Submit error:', err)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isCompleted) {
        return (
            <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 0.5, scale: 0.98 }}
                className="relative rounded-2xl border border-[#C6FF1A]/30 bg-[#C6FF1A]/5 p-5 overflow-hidden"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#C6FF1A]/20 flex items-center justify-center">
                        <RiCheckLine className="text-[#C6FF1A] text-xl" />
                    </div>
                    <div>
                        <p className="text-[#C6FF1A] font-semibold text-sm">Completed!</p>
                        <p className="text-white/40 text-xs">{task.title}</p>
                    </div>
                    <div className="ml-auto text-[#C6FF1A] font-bold text-sm">+{task.base_reward} SYNTR</div>
                </div>
                <AnimatePresence>{showReward && <RewardAnimation rewardData={rewardData} />}</AnimatePresence>
            </motion.div>
        )
    }

    return (
        <>
            <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`group relative rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer
                    ${isLocked
                        ? 'border-white/5 bg-white/2 opacity-50 cursor-not-allowed'
                        : isExpanded
                            ? 'border-[#C6FF1A]/40 bg-[#0B0F0C] shadow-[0_0_30px_rgba(198,255,26,0.08)]'
                            : 'border-white/8 bg-[#0D1210] hover:border-[#C6FF1A]/25 hover:bg-[#0F1612] hover:shadow-[0_0_20px_rgba(198,255,26,0.05)]'
                    }`}
                onClick={() => !isLocked && !isExpanded && setIsExpanded(true)}
            >
                {/* Glow accent top border */}
                {isExpanded && (
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C6FF1A]/60 to-transparent" />
                )}

                {/* Category color accent */}
                <div
                    className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-2xl"
                    style={{ backgroundColor: catConfig.color, opacity: isExpanded ? 1 : 0.3 }}
                />

                <div className="p-5 pl-6">
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            {/* Badges */}
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border ${diffConfig.bg}`}>
                                    {diffConfig.label}
                                </span>

                                <span
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border"
                                    style={{
                                        color: catConfig.color,
                                        borderColor: `${catConfig.color}30`,
                                        backgroundColor: `${catConfig.color}10`
                                    }}
                                >
                                    <catConfig.icon className="text-xs" />
                                    {catConfig.label}
                                </span>

                                {task.ai_powered && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border border-[#60A5FA]/30 bg-[#60A5FA]/10 text-[#60A5FA]">
                                        <RiRobot2Line className="text-xs" />
                                        AI Validated
                                    </span>
                                )}

                                {task.is_one_time && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border border-[#FB7185]/30 bg-[#FB7185]/10 text-[#FB7185]">
                                        <RiStarLine className="text-xs" />
                                        One-Time
                                    </span>
                                )}

                                {isLocked && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border border-white/10 bg-white/5 text-white/40">
                                        <RiLockLine className="text-xs" />
                                        Level {task.min_level}+
                                    </span>
                                )}
                            </div>

                            {/* Title */}
                            <h3 className={`text-base font-bold leading-snug mb-1.5 transition-colors ${isExpanded ? 'text-[#C6FF1A]' : 'text-white/90 group-hover:text-white'}`}>
                                {task.title}
                            </h3>

                            {/* Description preview */}
                            {!isExpanded && (
                                <p className="text-white/40 text-sm leading-relaxed line-clamp-2">
                                    {task.description}
                                </p>
                            )}
                        </div>

                        {/* Reward + Time */}
                        <div className="flex flex-col items-end gap-2 shrink-0">
                            <div className="flex items-center gap-1.5 bg-[#C6FF1A]/10 border border-[#C6FF1A]/25 rounded-xl px-3 py-2">
                                <RiCoinLine className="text-[#C6FF1A] text-sm" />
                                <span className="text-[#C6FF1A] font-black text-sm">+{task.base_reward}</span>
                                <span className="text-[#C6FF1A]/60 text-xs font-medium">SYNTR</span>
                            </div>
                            {task.estimated_time && (
                                <div className="flex items-center gap-1 text-white/30 text-xs">
                                    <RiTimeLine className="text-xs" />
                                    {task.estimated_time}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Expanded Content */}
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="mt-5 pt-5 border-t border-white/8"
                            >
                                {/* Full description */}
                                <p className="text-white/70 text-sm leading-relaxed mb-5 bg-white/3 rounded-xl p-4 border border-white/5">
                                    {task.description}
                                </p>

                                {/* Social action button */}
                                {task.action_url && (
                                    <a
                                        href={task.action_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={e => e.stopPropagation()}
                                        className="inline-flex items-center gap-2 mb-4 px-4 py-2.5 rounded-xl border border-[#FB7185]/30 bg-[#FB7185]/10 text-[#FB7185] text-sm font-semibold hover:bg-[#FB7185]/20 transition-all"
                                    >
                                        <RiExternalLinkLine />
                                        Complete Action First
                                        <RiArrowRightLine />
                                    </a>
                                )}

                                {/* Options */}
                                <div className="space-y-2.5 mb-5">
                                    <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-3">Select your answer:</p>
                                    {task.options?.map((option, i) => (
                                        <motion.button
                                            key={i}
                                            whileHover={{ x: 4 }}
                                            whileTap={{ scale: 0.99 }}
                                            onClick={e => { e.stopPropagation(); setSelectedAnswer(option) }}
                                            className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all text-sm font-medium
                                                ${selectedAnswer === option
                                                    ? 'border-[#C6FF1A]/60 bg-[#C6FF1A]/10 text-[#C6FF1A] shadow-[0_0_15px_rgba(198,255,26,0.1)]'
                                                    : 'border-white/8 bg-white/3 text-white/60 hover:border-white/20 hover:bg-white/5 hover:text-white/80'
                                                }`}
                                        >
                                            <span>{option}</span>
                                            {selectedAnswer === option && (
                                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                                    <RiCheckLine className="text-[#C6FF1A] text-lg" />
                                                </motion.div>
                                            )}
                                        </motion.button>
                                    ))}
                                </div>

                                {/* AI Processing Message */}
                                <AnimatePresence>
                                    {aiProcessing && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="mb-4 flex items-center gap-3 px-4 py-3 rounded-xl bg-[#60A5FA]/10 border border-[#60A5FA]/20"
                                        >
                                            <RiLoader4Line className="text-[#60A5FA] text-lg animate-spin" />
                                            <span className="text-[#60A5FA] text-sm font-medium">{aiMessage}</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleSubmit}
                                        disabled={!selectedAnswer || isSubmitting}
                                        className="flex-1 py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2
                                            bg-[#C6FF1A] text-[#0B0F0C] hover:bg-[#D4FF4D] shadow-[0_0_20px_rgba(198,255,26,0.3)]
                                            disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <RiLoader4Line className="animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <RiSparklingLine />
                                                Submit & Earn {task.base_reward} SYNTR
                                            </>
                                        )}
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={e => { e.stopPropagation(); setIsExpanded(false); setSelectedAnswer(null) }}
                                        className="px-4 py-3.5 rounded-xl border border-white/10 bg-white/3 text-white/40 hover:text-white/70 hover:border-white/20 transition-all"
                                    >
                                        <RiCloseLine className="text-xl" />
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Collapsed click hint */}
                    {!isExpanded && !isLocked && (
                        <div className="mt-3 flex items-center gap-1.5 text-white/20 text-xs group-hover:text-white/40 transition-colors">
                            <RiArrowRightLine className="text-xs" />
                            Click to start task
                        </div>
                    )}
                </div>
            </motion.div>

            <AnimatePresence>{showReward && <RewardAnimation rewardData={rewardData} />}</AnimatePresence>
        </>
    )
}

// ─── Main TasksSection Component ─────────────────────────────────────────────
export default function TasksSection({ tasks = [], userAddress, userLevel, onTaskComplete }) {
    const [activeCategory, setActiveCategory] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [difficultyFilter, setDifficultyFilter] = useState('all')
    const [sortBy, setSortBy] = useState('reward') // reward | difficulty | time
    const [aiTasks, setAiTasks] = useState([])
    const [isGenerating, setIsGenerating] = useState(false)
    const [generatingCategory, setGeneratingCategory] = useState(null)
    const [showAIPanel, setShowAIPanel] = useState(false)
    const [aiDifficulty, setAiDifficulty] = useState('medium')

    // Combine static + AI-generated tasks
    const allTasks = [...tasks, ...aiTasks]

    // Filter & sort
    const filteredTasks = allTasks
        .filter(task => {
            const matchCat = activeCategory === 'all' || task.category === activeCategory
            const matchDiff = difficultyFilter === 'all' || task.difficulty === difficultyFilter
            const matchSearch = !searchQuery ||
                task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                task.description?.toLowerCase().includes(searchQuery.toLowerCase())
            return matchCat && matchDiff && matchSearch
        })
        .sort((a, b) => {
            if (sortBy === 'reward') return (b.base_reward || 0) - (a.base_reward || 0)
            if (sortBy === 'difficulty') {
                const order = { easy: 0, medium: 1, hard: 2 }
                return (order[a.difficulty] || 0) - (order[b.difficulty] || 0)
            }
            return 0
        })

    // Category counts
    const categoryCounts = {}
    CATEGORIES.forEach(cat => {
        categoryCounts[cat.id] = cat.id === 'all'
            ? allTasks.length
            : allTasks.filter(t => t.category === cat.id).length
    })

    // Generate AI tasks
    const generateAITasks = async () => {
        const targetCategory = generatingCategory || (activeCategory !== 'all' ? activeCategory : 'sentiment')
        setIsGenerating(true)
        try {
            const res = await fetch('/api/ai-tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ category: targetCategory, difficulty: aiDifficulty, count: 3 })
            })
            const data = await res.json()
            if (data.success && data.tasks) {
                setAiTasks(prev => [...prev, ...data.tasks])
            }
        } catch (err) {
            console.error('AI generation error:', err)
        } finally {
            setIsGenerating(false)
        }
    }

    // Total potential earnings
    const totalPotential = filteredTasks.reduce((sum, t) => sum + (t.base_reward || 0), 0)

    return (
        <div className="space-y-6">
            {/* ── Section Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-white flex items-center gap-2">
                        <RiFireLine className="text-[#C6FF1A]" />
                        Available Tasks
                        <span className="text-sm font-normal text-white/30 ml-1">
                            ({filteredTasks.length} tasks)
                        </span>
                    </h2>
                    <p className="text-white/40 text-sm mt-1">
                        Earn up to <span className="text-[#C6FF1A] font-bold">{totalPotential} SYNTR</span> from current selection
                    </p>
                </div>

                {/* AI Generate Button */}
                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setShowAIPanel(!showAIPanel)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#60A5FA]/30 bg-[#60A5FA]/10 text-[#60A5FA] text-sm font-semibold hover:bg-[#60A5FA]/20 transition-all"
                >
                    <Image src="/icon.png" alt="Logo" width={25} height={25} />
                    AI Generate Tasks
                </motion.button>
            </div>

            {/* ── AI Generation Panel ── */}
            <AnimatePresence>
                {showAIPanel && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="rounded-2xl border border-[#60A5FA]/25 bg-gradient-to-br from-[#60A5FA]/10 to-[#60A5FA]/3 p-5 overflow-hidden"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <h3 className="text-white font-bold">AI Task Generator</h3>
                            <span className="text-xs text-white/30 ml-auto">Powered by Mistral 7B</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                            {/* Category select */}
                            <div>
                                <label className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2 block">Category</label>
                                <select
                                    value={generatingCategory || 'sentiment'}
                                    onChange={e => setGeneratingCategory(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white/80 text-sm focus:outline-none focus:border-[#60A5FA]/40"
                                >
                                    {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                                        <option key={cat.id} value={cat.id} className="bg-[#0B0F0C]">{cat.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Difficulty select */}
                            <div>
                                <label className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2 block">Difficulty</label>
                                <select
                                    value={aiDifficulty}
                                    onChange={e => setAiDifficulty(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white/80 text-sm focus:outline-none focus:border-[#60A5FA]/40"
                                >
                                    <option value="easy" className="bg-[#0B0F0C]">Easy (10 SYNTR)</option>
                                    <option value="medium" className="bg-[#0B0F0C]">Medium (30 SYNTR)</option>
                                    <option value="hard" className="bg-[#0B0F0C]">Hard (50 SYNTR)</option>
                                </select>
                            </div>

                            {/* Generate button */}
                            <div className="flex items-end">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={generateAITasks}
                                    disabled={isGenerating}
                                    className="w-full py-2.5 rounded-xl bg-[#60A5FA] text-[#0B0F0C] font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-[#93C5FD] transition-all"
                                >
                                    {isGenerating ? (
                                        <><RiLoader4Line className="animate-spin" /> Generating...</>
                                    ) : (
                                        <><RiSparklingLine /> Generate 3 Tasks</>
                                    )}
                                </motion.button>
                            </div>
                        </div>

                        {aiTasks.length > 0 && (
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-white/40">{aiTasks.length} AI-generated tasks added</span>
                                <button
                                    onClick={() => setAiTasks([])}
                                    className="text-white/30 hover:text-white/60 transition-colors flex items-center gap-1"
                                >
                                    <RiCloseLine /> Clear AI tasks
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Category Tabs ── */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {CATEGORIES.map(cat => {
                    const count = categoryCounts[cat.id] || 0
                    const isActive = activeCategory === cat.id
                    return (
                        <motion.button
                            key={cat.id}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold whitespace-nowrap transition-all shrink-0
                                ${isActive
                                    ? 'border-[#C6FF1A]/50 bg-[#C6FF1A]/15 text-[#C6FF1A] shadow-[0_0_15px_rgba(198,255,26,0.1)]'
                                    : 'border-white/8 bg-white/3 text-white/50 hover:border-white/15 hover:text-white/70'
                                }`}
                        >
                            <cat.icon className="text-sm" />
                            {cat.label}
                            {count > 0 && (
                                <span className={`text-xs px-1.5 py-0.5 rounded-md font-bold ${isActive ? 'bg-[#C6FF1A]/20 text-[#C6FF1A]' : 'bg-white/8 text-white/30'}`}>
                                    {count}
                                </span>
                            )}
                        </motion.button>
                    )
                })}
            </div>

            {/* ── Filters Row ── */}
            <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="relative flex-1">
                    <RiSearchLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 text-sm" />
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full bg-white/3 border border-white/8 rounded-xl pl-9 pr-4 py-2.5 text-white/80 text-sm placeholder-white/25 focus:outline-none focus:border-[#C6FF1A]/30 focus:bg-white/5 transition-all"
                    />
                </div>

                {/* Difficulty filter */}
                <div className="flex gap-2">
                    {['all', 'easy', 'medium', 'hard'].map(d => (
                        <button
                            key={d}
                            onClick={() => setDifficultyFilter(d)}
                            className={`px-3 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wide transition-all
                                ${difficultyFilter === d
                                    ? d === 'all' ? 'border-white/30 bg-white/10 text-white'
                                        : d === 'easy' ? 'border-[#34D399]/50 bg-[#34D399]/15 text-[#34D399]'
                                            : d === 'medium' ? 'border-[#FBBF24]/50 bg-[#FBBF24]/15 text-[#FBBF24]'
                                                : 'border-[#FF6B35]/50 bg-[#FF6B35]/15 text-[#FF6B35]'
                                    : 'border-white/8 bg-white/3 text-white/30 hover:text-white/60'
                                }`}
                        >
                            {d === 'all' ? 'All' : d}
                        </button>
                    ))}
                </div>

                {/* Sort */}
                <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="bg-white/3 border border-white/8 rounded-xl px-3 py-2.5 text-white/60 text-sm focus:outline-none focus:border-white/20 transition-all"
                >
                    <option value="reward" className="bg-[#0B0F0C]">Sort: Highest Reward</option>
                    <option value="difficulty" className="bg-[#0B0F0C]">Sort: Easiest First</option>
                </select>
            </div>

            {/* ── Task List ── */}
            <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                    {filteredTasks.length > 0 ? (
                        filteredTasks.map((task, i) => (
                            <TaskItem
                                key={task.id}
                                task={task}
                                index={i}
                                userAddress={userAddress}
                                userLevel={userLevel}
                                onComplete={onTaskComplete}
                            />
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-16 rounded-2xl border border-white/5 bg-white/2"
                        >
                            <RiLightbulbLine className="text-4xl text-white/15 mx-auto mb-3" />
                            <p className="text-white/40 font-medium">No tasks found</p>
                            <p className="text-white/20 text-sm mt-1">Try a different category or generate AI tasks</p>
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                onClick={generateAITasks}
                                disabled={isGenerating}
                                className="mt-4 px-5 py-2.5 rounded-xl bg-[#60A5FA]/15 border border-[#60A5FA]/25 text-[#60A5FA] text-sm font-semibold hover:bg-[#60A5FA]/25 transition-all flex items-center gap-2 mx-auto"
                            >
                                {isGenerating ? <RiLoader4Line className="animate-spin" /> : <RiSparklingLine />}
                                Generate AI Tasks
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ── Load More / Refresh ── */}
            {filteredTasks.length > 0 && (
                <div className="flex justify-center pt-2">
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={generateAITasks}
                        disabled={isGenerating}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 bg-white/3 text-white/50 text-sm font-semibold hover:border-white/20 hover:text-white/70 transition-all disabled:opacity-40"
                    >
                        {isGenerating ? (
                            <><RiLoader4Line className="animate-spin" /> Generating more tasks...</>
                        ) : (
                            <><RiRefreshLine /> Generate More AI Tasks</>
                        )}
                    </motion.button>
                </div>
            )}
        </div>
    )
}
