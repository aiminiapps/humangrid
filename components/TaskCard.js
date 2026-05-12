'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RiCheckLine, RiCloseLine, RiCoinLine } from 'react-icons/ri'
import RewardAnimation from './RewardAnimation'

export default function TaskCard({ task, userAddress, userLevel, onComplete }) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [selectedAnswer, setSelectedAnswer] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showReward, setShowReward] = useState(false)
    const [rewardData, setRewardData] = useState(null)

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'easy':
                return 'text-success border-success'
            case 'medium':
                return 'text-warning border-warning'
            case 'hard':
                return 'text-error border-error'
            default:
                return 'text-gray-secondary border-gray-border'
        }
    }

    const handleSubmit = async () => {
        if (!selectedAnswer) return

        setIsSubmitting(true)

        try {
            // Submit task
            const submitRes = await fetch('/api/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    taskId: task.id,
                    answer: selectedAnswer,
                    userAddress,
                }),
            })

            const submitData = await submitRes.json()

            if (submitData.success) {
                // Show reward animation
                setRewardData({
                    amount: submitData.reward_amount,
                    txHash: submitData.tx_hash,
                })
                setShowReward(true)

                // After animation, call onComplete to refresh
                setTimeout(() => {
                    setShowReward(false)
                    onComplete()
                }, 5000)
            }
        } catch (error) {
            console.error('Error submitting task:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`card-luxury p-6 rounded-xl hover:border-neon/50 transition-all cursor-pointer group ${isExpanded ? 'border-neon/40 shadow-neon-sm' : ''}`}
                onClick={() => !isExpanded && setIsExpanded(true)}
            >
                {/* Task Header */}
                <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide border bg-industrial-black/50 ${getDifficultyColor(task.difficulty)}`}>
                                {task.difficulty.toUpperCase()}
                            </span>
                            <span className="text-neon font-bold flex items-center gap-1 drop-shadow-sm">
                                <RiCoinLine /> +{task.base_reward} SYNTR
                            </span>
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-gray-primary group-hover:text-neon transition-colors">{task.title}</h3>
                        <p className="text-gray-secondary text-sm leading-relaxed">{task.description}</p>
                    </div>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-6 pt-6 border-t border-gray-divider"
                        >
                            {/* Options */}
                            <div className="space-y-3 mb-6">
                                {task.options?.map((option, index) => (
                                    <motion.button
                                        key={index}
                                        whileHover={{ scale: 1.01, x: 4 }}
                                        whileTap={{ scale: 0.99 }}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setSelectedAnswer(option)
                                        }}
                                        className={`w-full p-4 rounded-xl border transition-all text-left flex items-center justify-between group ${selectedAnswer === option
                                            ? 'border-neon bg-neon/10 shadow-neon-sm'
                                            : 'border-gray-border bg-industrial-black/30 hover:border-neon/30 hover:bg-industrial-dark'
                                            }`}
                                    >
                                        <span className={`font-medium ${selectedAnswer === option ? 'text-neon' : 'text-gray-secondary group-hover:text-gray-primary'}`}>
                                            {option}
                                        </span>
                                        {selectedAnswer === option && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                            >
                                                <RiCheckLine className="text-neon text-xl" />
                                            </motion.div>
                                        )}
                                    </motion.button>
                                ))}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleSubmit()
                                    }}
                                    disabled={!selectedAnswer || isSubmitting}
                                    className="flex-1 px-6 py-4 bg-gradient-neon text-industrial-black font-bold text-lg rounded-xl transition-all shadow-neon hover:shadow-neon-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex justify-center items-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-industrial-black border-t-transparent rounded-full animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        'Submit Contribution'
                                    )}
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setIsExpanded(false)
                                        setSelectedAnswer(null)
                                    }}
                                    className="px-6 py-4 border border-gray-border hover:border-error/50 text-gray-secondary hover:text-error font-semibold rounded-xl transition-all bg-industrial-black/50"
                                >
                                    <RiCloseLine className="text-2xl" />
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Reward Animation */}
            <AnimatePresence>
                {showReward && <RewardAnimation rewardData={rewardData} />}
            </AnimatePresence>
        </>
    )
}
