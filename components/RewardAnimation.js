'use client'

import { motion } from 'framer-motion'
import { RiCheckDoubleLine, RiCpuLine, RiCoinLine } from 'react-icons/ri'

export default function RewardAnimation({ rewardData }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-industrial-black/90 backdrop-blur-md"
        >
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, type: 'spring' }}
                className="glass-effect p-12 rounded-2xl max-w-md w-full mx-4 text-center border-2 border-neon"
            >
                {/* Success Icon */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="w-20 h-20 rounded-full bg-success/20 border-2 border-success flex items-center justify-center mx-auto mb-6"
                >
                    <RiCheckDoubleLine className="text-4xl text-success" />
                </motion.div>

                {/* Title */}
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl font-bold mb-2"
                >
                    Contribution Accepted!
                </motion.h2>

                {/* Status Messages */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-3 mb-6"
                >
                    <div className="flex items-center justify-center gap-2 text-success">
                        <RiCpuLine className="text-xl" />
                        <span>AI confidence improved</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-neon">
                        <RiCoinLine className="text-xl animate-bounce" />
                        <span className="text-2xl font-bold">+{rewardData?.amount} SYNTR</span>
                    </div>
                </motion.div>

                {/* Processing Animation */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mb-4"
                >
                    <div className="h-2 bg-industrial-surface rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ delay: 0.7, duration: 1.5, ease: 'easeInOut' }}
                            className="h-full bg-gradient-to-r from-neon-dark via-neon to-neon-bright"
                        />
                    </div>
                    <p className="text-sm text-gray-muted mt-2">Reward calculated</p>
                </motion.div>

                {/* Transaction Info */}
                {rewardData?.txHash && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="text-xs text-gray-muted"
                    >
                        <p>Transaction: {rewardData.txHash.slice(0, 10)}...{rewardData.txHash.slice(-8)}</p>
                    </motion.div>
                )}

                {/* Auto-close indicator */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="text-sm text-gray-secondary mt-6"
                >
                    Returning to dashboard...
                </motion.p>
            </motion.div>
        </motion.div>
    )
}
