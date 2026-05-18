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

// ─── Category Config (Updated for Premium Light Theme) ────────────────────────
const CATEGORIES = [
    { id: 'all', label: 'All Tasks', icon: RiGlobalLine, color: '#FF7100', bg: 'bg-[#FF7100]/10' },
    { id: 'sentiment', label: 'Sentiment', icon: RiBarChartLine, color: '#FF7100', bg: 'bg-[#FF7100]/10' },
    { id: 'risk', label: 'Risk', icon: RiShieldLine, color: '#EF4444', bg: 'bg-[#EF4444]/10' },
    { id: 'tagging', label: 'Tagging', icon: RiHashtag, color: '#8B5CF6', bg: 'bg-[#8B5CF6]/10' },
    { id: 'prediction', label: 'Prediction', icon: RiSparklingLine, color: '#0EA5E9', bg: 'bg-[#0EA5E9]/10' },
    { id: 'research', label: 'Research', icon: RiSearchLine, color: '#10B981', bg: 'bg-[#10B981]/10' },
    { id: 'validation', label: 'AI Validation', icon: RiRobot2Line, color: '#3B82F6', bg: 'bg-[#3B82F6]/10' },
    { id: 'creative', label: 'Creative', icon: RiPaletteLine, color: '#F59E0B', bg: 'bg-[#F59E0B]/10' },
    { id: 'social', label: 'Social', icon: RiGlobalLine, color: '#EC4899', bg: 'bg-[#EC4899]/10' },
]

const DIFFICULTY_CONFIG = {
    easy: { label: 'EASY', color: '#10B981', bg: 'bg-[#10B981]/10 border-[#10B981]/30 text-[#10B981]' },
    medium: { label: 'MEDIUM', color: '#F59E0B', bg: 'bg-[#F59E0B]/10 border-[#F59E0B]/30 text-[#F59E0B]' },
    hard: { label: 'HARD', color: '#EF4444', bg: 'bg-[#EF4444]/10 border-[#EF4444]/30 text-[#EF4444]' },
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
                animate={{ opacity: 0.6, scale: 0.99 }}
                className="relative rounded-2xl border border-emerald-200 bg-emerald-50 p-5 overflow-hidden shadow-sm"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                        <RiCheckLine className="text-emerald-600 text-xl" />
                    </div>
                    <div>
                        <p className="text-emerald-700 font-bold text-sm">Completed successfully</p>
                        <p className="text-emerald-600/70 text-xs font-medium">{task.title}</p>
                    </div>
                    <div className="ml-auto text-emerald-600 font-black text-sm">+{task.base_reward} HGAI</div>
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
                        ? 'border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed'
                        : isExpanded
                            ? 'border-slate-300 bg-white shadow-md'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                    }`}
                onClick={() => !isLocked && !isExpanded && setIsExpanded(true)}
            >
                {/* Category color accent edge */}
                <div
                    className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl transition-opacity"
                    style={{ backgroundColor: catConfig.color, opacity: isExpanded ? 1 : 0.4 }}
                />

                <div className="p-5 pl-7">
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            {/* Badges */}
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border ${diffConfig.bg}`}>
                                    {diffConfig.label}
                                </span>

                                <span
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border"
                                    style={{
                                        color: catConfig.color,
                                        borderColor: `${catConfig.color}40`,
                                        backgroundColor: `${catConfig.color}15`
                                    }}
                                >
                                    <catConfig.icon className="text-xs" />
                                    {catConfig.label}
                                </span>

                                {task.ai_powered && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border border-blue-200 bg-blue-50 text-blue-600">
                                        <RiRobot2Line className="text-xs" />
                                        AI Validated
                                    </span>
                                )}

                                {task.is_one_time && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border border-pink-200 bg-pink-50 text-pink-600">
                                        <RiStarLine className="text-xs" />
                                        One-Time
                                    </span>
                                )}

                                {isLocked && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border border-slate-200 bg-slate-100 text-slate-500">
                                        <RiLockLine className="text-xs" />
                                        Level {task.min_level}+
                                    </span>
                                )}
                            </div>

                            {/* Title */}
                            <h3 className={`text-base font-extrabold leading-snug mb-1.5 transition-colors ${isExpanded ? 'text-[#FF7100]' : 'text-slate-900 group-hover:text-slate-700'}`}>
                                {task.title}
                            </h3>

                            {/* Description preview */}
                            {!isExpanded && (
                                <p className="text-slate-500 text-sm font-medium leading-relaxed line-clamp-2">
                                    {task.description}
                                </p>
                            )}
                        </div>

                        {/* Reward + Time */}
                        <div className="flex flex-col items-end gap-2 shrink-0">
                            <div className="flex items-center gap-1.5 bg-[#FF7100]/10 border border-[#FF7100]/20 rounded-xl px-3 py-2">
                                <RiCoinLine className="text-[#FF7100] text-sm" />
                                <span className="text-[#FF7100] font-black text-sm">+{task.base_reward}</span>
                                <span className="text-[#FF7100]/70 text-xs font-bold">HGAI</span>
                            </div>
                            {task.estimated_time && (
                                <div className="flex items-center gap-1 text-slate-400 font-medium text-xs">
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
                                className="mt-5 pt-5 border-t border-slate-100"
                            >
                                {/* Full description */}
                                <p className="text-slate-600 text-sm font-medium leading-relaxed mb-5 bg-slate-50 rounded-xl p-4 border border-slate-100">
                                    {task.description}
                                </p>

                                {/* Social action button */}
                                {task.action_url && (
                                    <a
                                        href={task.action_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={e => e.stopPropagation()}
                                        className="inline-flex items-center gap-2 mb-4 px-4 py-2.5 rounded-xl border border-pink-200 bg-pink-50 text-pink-600 text-sm font-bold hover:bg-pink-100 transition-all shadow-sm"
                                    >
                                        <RiExternalLinkLine />
                                        Complete Action First
                                        <RiArrowRightLine />
                                    </a>
                                )}

                                {/* Options */}
                                <div className="space-y-2.5 mb-6">
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">Select your answer:</p>
                                    {task.options?.map((option, i) => (
                                        <motion.button
                                            key={i}
                                            whileHover={{ x: 4 }}
                                            whileTap={{ scale: 0.99 }}
                                            onClick={e => { e.stopPropagation(); setSelectedAnswer(option) }}
                                            className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all text-sm font-bold
                                                ${selectedAnswer === option
                                                    ? 'border-[#FF7100] bg-[#FF7100]/5 text-[#FF7100] shadow-sm'
                                                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900'
                                                }`}
                                        >
                                            <span>{option}</span>
                                            {selectedAnswer === option && (
                                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                                    <RiCheckLine className="text-[#FF7100] text-xl" />
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
                                            className="mb-5 flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 border border-blue-200 shadow-sm"
                                        >
                                            <RiLoader4Line className="text-blue-500 text-lg animate-spin" />
                                            <span className="text-blue-600 text-sm font-bold">{aiMessage}</span>
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
                                            bg-gradient-to-r from-[#FF7100] to-[#D95A00] text-white shadow-md hover:shadow-lg
                                            disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <RiLoader4Line className="animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <RiSparklingLine />
                                                Submit & Earn {task.base_reward} HGAI
                                            </>
                                        )}
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={e => { e.stopPropagation(); setIsExpanded(false); setSelectedAnswer(null) }}
                                        className="px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
                                    >
                                        <RiCloseLine className="text-xl" />
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Collapsed click hint */}
                    {!isExpanded && !isLocked && (
                        <div className="mt-3 flex items-center gap-1.5 text-slate-400 font-medium text-xs group-hover:text-[#FF7100] transition-colors">
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
    const [sortBy, setSortBy] = useState('reward')
    const [aiTasks, setAiTasks] = useState([])
    const [isGenerating, setIsGenerating] = useState(false)
    const [generatingCategory, setGeneratingCategory] = useState(null)
    const [showAIPanel, setShowAIPanel] = useState(false)
    const [aiDifficulty, setAiDifficulty] = useState('medium')

    const allTasks = [...tasks, ...aiTasks]

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

    const categoryCounts = {}
    CATEGORIES.forEach(cat => {
        categoryCounts[cat.id] = cat.id === 'all'
            ? allTasks.length
            : allTasks.filter(t => t.category === cat.id).length
    })

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

    const totalPotential = filteredTasks.reduce((sum, t) => sum + (t.base_reward || 0), 0)

    return (
        <div className="space-y-6">
            {/* ── Section Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                        <RiFireLine className="text-[#FF7100]" />
                        Available Tasks
                        <span className="text-sm font-semibold text-slate-400 ml-1">
                            ({filteredTasks.length} tasks)
                        </span>
                    </h2>
                    <p className="text-slate-500 font-medium text-sm mt-1">
                        Earn up to <span className="text-[#FF7100] font-black">{totalPotential} HGAI</span> from current selection
                    </p>
                </div>

                {/* AI Generate Button */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAIPanel(!showAIPanel)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-blue-200 bg-blue-50 text-blue-600 text-sm font-bold hover:bg-blue-100 transition-all shadow-sm"
                >
                    <Image src="/icon.png" alt="Logo" width={20} height={20} className="filter-none opacity-80" />
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
                        className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-5 overflow-hidden shadow-sm"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <h3 className="text-slate-800 font-extrabold">AI Task Generator</h3>
                            <span className="text-xs font-bold text-blue-400 ml-auto bg-blue-100 px-2 py-1 rounded-md">Powered by Mistral 7B</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                            {/* Category select */}
                            <div>
                                <label className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2 block">Category</label>
                                <select
                                    value={generatingCategory || 'sentiment'}
                                    onChange={e => setGeneratingCategory(e.target.value)}
                                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-700 text-sm font-medium shadow-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
                                >
                                    {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                                        <option key={cat.id} value={cat.id} className="bg-white">{cat.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Difficulty select */}
                            <div>
                                <label className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2 block">Difficulty</label>
                                <select
                                    value={aiDifficulty}
                                    onChange={e => setAiDifficulty(e.target.value)}
                                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-700 text-sm font-medium shadow-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
                                >
                                    <option value="easy" className="bg-white">Easy (10 HGAI)</option>
                                    <option value="medium" className="bg-white">Medium (30 HGAI)</option>
                                    <option value="hard" className="bg-white">Hard (50 HGAI)</option>
                                </select>
                            </div>

                            {/* Generate button */}
                            <div className="flex items-end">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={generateAITasks}
                                    disabled={isGenerating}
                                    className="w-full py-2.5 rounded-xl bg-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm disabled:opacity-60 hover:bg-blue-600 transition-all"
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
                            <div className="flex items-center justify-between text-xs mt-2 pt-4 border-t border-blue-100">
                                <span className="text-slate-500 font-medium">{aiTasks.length} AI-generated tasks added</span>
                                <button
                                    onClick={() => setAiTasks([])}
                                    className="text-slate-400 hover:text-red-500 font-bold transition-colors flex items-center gap-1"
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
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-bold whitespace-nowrap transition-all shrink-0 shadow-sm
                                ${isActive
                                    ? 'border-[#FF7100]/40 bg-[#FF7100]/10 text-[#FF7100]'
                                    : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700 hover:bg-slate-50'
                                }`}
                        >
                            <cat.icon className="text-sm" />
                            {cat.label}
                            {count > 0 && (
                                <span className={`text-xs px-2 py-0.5 rounded-md font-black ${isActive ? 'bg-[#FF7100]/20 text-[#FF7100]' : 'bg-slate-100 text-slate-400'}`}>
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
                    <RiSearchLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-slate-800 text-sm font-medium placeholder-slate-400 shadow-sm focus:outline-none focus:border-[#FF7100]/50 focus:ring-1 focus:ring-[#FF7100]/50 transition-all"
                    />
                </div>

                {/* Difficulty filter */}
                <div className="flex gap-2">
                    {['all', 'easy', 'medium', 'hard'].map(d => (
                        <button
                            key={d}
                            onClick={() => setDifficultyFilter(d)}
                            className={`px-4 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all shadow-sm
                                ${difficultyFilter === d
                                    ? d === 'all' ? 'border-slate-300 bg-slate-800 text-white'
                                        : d === 'easy' ? 'border-emerald-300 bg-emerald-50 text-emerald-600'
                                            : d === 'medium' ? 'border-amber-300 bg-amber-50 text-amber-600'
                                                : 'border-red-300 bg-red-50 text-red-600'
                                    : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-800'
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
                    className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-700 font-bold text-sm shadow-sm focus:outline-none focus:border-[#FF7100]/50 transition-all"
                >
                    <option value="reward" className="bg-white font-medium">Sort: Highest Reward</option>
                    <option value="difficulty" className="bg-white font-medium">Sort: Easiest First</option>
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
                            className="text-center py-16 rounded-2xl border border-slate-200 bg-white shadow-sm"
                        >
                            <RiLightbulbLine className="text-4xl text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-800 font-extrabold">No tasks found</p>
                            <p className="text-slate-500 font-medium text-sm mt-1">Try a different category or generate AI tasks</p>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                onClick={generateAITasks}
                                disabled={isGenerating}
                                className="mt-5 px-6 py-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 text-sm font-bold hover:bg-blue-100 transition-all flex items-center gap-2 mx-auto shadow-sm"
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
                <div className="flex justify-center pt-4">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={generateAITasks}
                        disabled={isGenerating}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-bold hover:border-slate-300 hover:text-slate-900 hover:bg-slate-50 shadow-sm transition-all disabled:opacity-60"
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