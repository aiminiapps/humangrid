import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { calculateReward, TASK_POINTS } from '@/lib/reputation'
import { validateTaskWithAI, generateAIFeedback, getAIProcessingMessage } from '@/lib/openrouter'
import { sendHGAIReward } from '@/lib/tokenReward'
import { getTaskById } from '@/data/mockTasks'

export async function POST(request) {
    try {
        const { taskId, answer, userAddress, taskData: inlineTaskData } = await request.json()

        if (!taskId || !answer || !userAddress) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        let task = null
        let useMockData = false

        try {
            task = await prisma.task.findUnique({
                where: { id: taskId }
            })

            if (!task) {
                task = getTaskById(taskId)
                useMockData = true
            }
        } catch (error) {
            task = getTaskById(taskId)
            useMockData = true
        }

        if (!task && inlineTaskData) {
            task = inlineTaskData
            useMockData = true
            console.log('📦 Using inline task data for AI-generated task:', taskId)
        }

        if (!task) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 })
        }

        console.log('🤖 AI validating submission...')
        const aiValidation = await validateTaskWithAI(task, answer)

        const baseReward = task.base_reward || task.reward || 10
        const confidenceMultiplier = aiValidation.confidence > 80 ? 1.0 : 0.8
        const rewardAmount = Math.floor(baseReward * confidenceMultiplier)

        const reputationPoints = TASK_POINTS[task.difficulty] || 10

        console.log(`💸 Sending ${rewardAmount} HGAI to ${userAddress}...`)
        const transferResult = await sendHGAIReward(userAddress, rewardAmount)

        const txHash = transferResult.success
            ? transferResult.txHash
            : `0x${Math.random().toString(16).substring(2, 66)}`

        if (transferResult.success) {
            console.log(`✅ HGAI transfer confirmed: ${txHash}`)
        } else {
            console.warn(`⚠️ HGAI transfer failed (${transferResult.error}) — recording reward as pending`)
        }

        if (useMockData) {
            console.log('📦 Using mock submission (DB not connected)')

            return NextResponse.json({
                success: true,
                submission_id: `mock-${Date.now()}`,
                reward_amount: rewardAmount,
                tx_hash: txHash,
                transfer_success: transferResult.success,
                reputation_gained: reputationPoints,
                ai_powered: true,
                ai_validation: {
                    confidence: aiValidation.confidence,
                    feedback: aiValidation.feedback,
                },
                message: transferResult.success
                    ? `✨ ${rewardAmount} HGAI sent to your wallet!`
                    : '✨ AI-validated contribution accepted! Reward pending.',
                processing_message: getAIProcessingMessage()
            })
        }

        // Real Database Flow using Prisma
        const user = await prisma.user.findUnique({
            where: { wallet_address: userAddress.toLowerCase() }
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const submission = await prisma.submission.create({
            data: {
                user_id: user.id,
                task_id: taskId,
                answer: { value: answer, ai_confidence: aiValidation.confidence, ai_feedback: aiValidation.feedback },
                reward_amount: rewardAmount,
                status: aiValidation.isValid ? 'validated' : 'pending_review',
            }
        })

        const newReputationScore = user.reputation_score + reputationPoints
        const newLevel = Math.floor(newReputationScore / 100) + 1

        await prisma.user.update({
            where: { id: user.id },
            data: {
                reputation_score: newReputationScore,
                level: newLevel,
                total_contributions: user.total_contributions + 1,
                total_rewards: Number(user.total_rewards || 0) + Number(rewardAmount),
            }
        })

        await prisma.reward.create({
            data: {
                user_id: user.id,
                submission_id: submission.id,
                amount: rewardAmount,
                tx_hash: txHash,
                status: transferResult.success ? 'sent' : 'pending',
            }
        })

        const aiFeedback = await generateAIFeedback(task, answer, aiValidation.isValid)

        return NextResponse.json({
            success: true,
            submission_id: submission.id,
            reward_amount: rewardAmount,
            tx_hash: txHash,
            transfer_success: transferResult.success,
            reputation_gained: reputationPoints,
            ai_powered: true,
            ai_validation: {
                confidence: aiValidation.confidence,
                feedback: aiFeedback,
            },
            message: transferResult.success
                ? `✨ ${rewardAmount} HGAI sent to your wallet!`
                : '✨ AI-validated contribution accepted! Reward pending.',
            processing_message: getAIProcessingMessage()
        })

    } catch (error) {
        console.error('Submit API error:', error)
        return NextResponse.json({
            error: 'Internal server error',
            details: error.message
        }, { status: 500 })
    }
}
