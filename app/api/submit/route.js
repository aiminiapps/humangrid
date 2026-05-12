import { NextResponse } from 'next/server'
import { getServerSupabase, supabase } from '@/lib/supabase'
import { calculateReward, TASK_POINTS } from '@/lib/reputation'
import { validateTaskWithAI, generateAIFeedback, getAIProcessingMessage } from '@/lib/openrouter'
import { sendSYNTRReward } from '@/lib/tokenReward'
import { getTaskById } from '@/data/mockTasks'

export async function POST(request) {
    try {
        // taskData is sent by client for AI-generated tasks not in the DB/mockTasks
        const { taskId, answer, userAddress, taskData: inlineTaskData } = await request.json()

        if (!taskId || !answer || !userAddress) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Get task: DB → mockTasks → inline (for AI-generated tasks)
        let task = null
        let useMockData = false

        try {
            const { data: dbTask, error: taskError } = await supabase
                .from('tasks')
                .select('*')
                .eq('id', taskId)
                .single()

            if (!taskError && dbTask) {
                task = dbTask
            } else {
                task = getTaskById(taskId)
                useMockData = true
            }
        } catch (error) {
            task = getTaskById(taskId)
            useMockData = true
        }

        // Fallback: use inline task data sent from client (AI-generated tasks)
        if (!task && inlineTaskData) {
            task = inlineTaskData
            useMockData = true
            console.log('📦 Using inline task data for AI-generated task:', taskId)
        }

        if (!task) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 })
        }

        // AI-POWERED VALIDATION
        console.log('🤖 AI validating submission...')
        const aiValidation = await validateTaskWithAI(task, answer)

        // Calculate reward based on difficulty and AI confidence
        const baseReward = task.base_reward || task.reward || 10
        const confidenceMultiplier = aiValidation.confidence > 80 ? 1.0 : 0.8
        const rewardAmount = Math.floor(baseReward * confidenceMultiplier)

        // Calculate reputation points
        const reputationPoints = TASK_POINTS[task.difficulty] || 10

        // ─── REAL SYNTR TOKEN TRANSFER ─────────────────────────────────────────
        console.log(`💸 Sending ${rewardAmount} SYNTR to ${userAddress}...`)
        const transferResult = await sendSYNTRReward(userAddress, rewardAmount)

        const txHash = transferResult.success
            ? transferResult.txHash
            : `0x${Math.random().toString(16).substring(2, 66)}` // fallback mock hash if transfer fails

        if (transferResult.success) {
            console.log(`✅ SYNTR transfer confirmed: ${txHash}`)
        } else {
            console.warn(`⚠️ SYNTR transfer failed (${transferResult.error}) — recording reward as pending`)
        }
        // ───────────────────────────────────────────────────────────────────────

        // If using mock data, return response (with real tx if transfer succeeded)
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
                    ? `✨ ${rewardAmount} SYNTR sent to your wallet!`
                    : '✨ AI-validated contribution accepted! Reward pending.',
                processing_message: getAIProcessingMessage()
            })
        }

        // REAL DATABASE FLOW
        const serverSupabase = getServerSupabase()

        // Get user
        const { data: user, error: userError } = await serverSupabase
            .from('users')
            .select('*')
            .eq('wallet_address', userAddress.toLowerCase())
            .single()

        if (userError || !user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Create submission record
        const { data: submission, error: submissionError } = await serverSupabase
            .from('submissions')
            .insert([
                {
                    user_id: user.id,
                    task_id: taskId,
                    answer: { value: answer, ai_confidence: aiValidation.confidence, ai_feedback: aiValidation.feedback },
                    reward_amount: rewardAmount,
                    status: aiValidation.isValid ? 'validated' : 'pending_review',
                },
            ])
            .select()
            .single()

        if (submissionError) {
            console.error('Error creating submission:', submissionError)
            return NextResponse.json({ error: 'Failed to create submission' }, { status: 500 })
        }

        // Update user stats
        const newReputationScore = user.reputation_score + reputationPoints
        const newLevel = Math.floor(newReputationScore / 100) + 1

        await serverSupabase
            .from('users')
            .update({
                reputation_score: newReputationScore,
                level: newLevel,
                total_contributions: user.total_contributions + 1,
                total_rewards: parseFloat(user.total_rewards) + parseFloat(rewardAmount),
            })
            .eq('id', user.id)

        // Create reward record with real tx hash
        const { data: reward } = await serverSupabase
            .from('rewards')
            .insert([
                {
                    user_id: user.id,
                    submission_id: submission.id,
                    amount: rewardAmount,
                    tx_hash: txHash,
                    status: transferResult.success ? 'sent' : 'pending',
                },
            ])
            .select()
            .single()

        // Generate AI feedback
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
                ? `✨ ${rewardAmount} SYNTR sent to your wallet!`
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

