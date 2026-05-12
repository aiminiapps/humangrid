/**
 * OpenRouter AI Integration for SYNTHOS
 * Provides intelligent task validation and feedback
 */

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1'

/**
 * Validate a task submission using AI
 * @param {Object} task - The task object
 * @param {string} userAnswer - User's submitted answer
 * @returns {Object} - { isValid, confidence, feedback, aiAnalysis }
 */
export async function validateTaskWithAI(task, userAnswer) {
    if (!OPENROUTER_API_KEY) {
        console.warn('OpenRouter API key not configured - using fallback validation')
        return fallbackValidation(task, userAnswer)
    }

    try {
        const prompt = createValidationPrompt(task, userAnswer)

        const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://synthos.ai',
                'X-Title': 'SYNTHOS AI Training Platform',
            },
            body: JSON.stringify({
                model: 'mistralai/mistral-7b-instruct:free', // Free model for MVP
                messages: [
                    {
                        role: 'system',
                        content: 'You are an AI validator for data labeling tasks. Analyze user responses and provide confidence scores and feedback.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.3,
                max_tokens: 500,
            })
        })

        if (!response.ok) {
            throw new Error(`OpenRouter API error: ${response.status}`)
        }

        const data = await response.json()
        const aiResponse = data.choices[0].message.content

        // Parse AI response
        return parseAIResponse(aiResponse, userAnswer)

    } catch (error) {
        console.error('AI validation error:', error)
        return fallbackValidation(task, userAnswer)
    }
}

/**
 * Generate enhanced feedback using AI
 */
export async function generateAIFeedback(task, userAnswer, isCorrect) {
    if (!OPENROUTER_API_KEY) {
        return getGenericFeedback(isCorrect)
    }

    try {
        const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'mistralai/mistral-7b-instruct:free',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful AI providing brief, encouraging feedback on data labeling tasks. Keep responses under 20 words.'
                    },
                    {
                        role: 'user',
                        content: `Task: ${task.title}\nUser answer: ${userAnswer}\nResult: ${isCorrect ? 'Correct' : 'Needs review'}\n\nProvide brief feedback:`
                    }
                ],
                temperature: 0.7,
                max_tokens: 50,
            })
        })

        const data = await response.json()
        return data.choices[0].message.content.trim()

    } catch (error) {
        return getGenericFeedback(isCorrect)
    }
}

/**
 * Create validation prompt for AI
 */
function createValidationPrompt(task, userAnswer) {
    return `Analyze this data labeling task submission:

Task Type: ${task.task_type}
Title: ${task.title}
Description: ${task.description}
Options: ${JSON.stringify(task.options)}
User Answer: ${userAnswer}

Provide your analysis in this exact format:
VALID: yes/no
CONFIDENCE: 0-100
FEEDBACK: brief explanation (max 20 words)
REASONING: detailed analysis (max 50 words)`
}

/**
 * Parse AI response into structured format
 */
function parseAIResponse(aiResponse, userAnswer) {
    try {
        const lines = aiResponse.split('\n')
        const result = {
            isValid: true,
            confidence: 85,
            feedback: 'Contribution accepted',
            aiAnalysis: aiResponse
        }

        lines.forEach(line => {
            if (line.startsWith('VALID:')) {
                result.isValid = line.toLowerCase().includes('yes')
            } else if (line.startsWith('CONFIDENCE:')) {
                const conf = parseInt(line.split(':')[1].trim())
                result.confidence = isNaN(conf) ? 85 : conf
            } else if (line.startsWith('FEEDBACK:')) {
                result.feedback = line.split(':')[1].trim()
            }
        })

        return result
    } catch (error) {
        console.error('Error parsing AI response:', error)
        return fallbackValidation(null, userAnswer)
    }
}

/**
 * Fallback validation when AI is unavailable
 */
function fallbackValidation(task, userAnswer) {
    // Simple heuristic validation
    const hasAnswer = userAnswer && userAnswer.trim().length > 0

    return {
        isValid: hasAnswer,
        confidence: hasAnswer ? 80 : 50,
        feedback: hasAnswer ? 'Contribution accepted' : 'Answer appears incomplete',
        aiAnalysis: 'AI validation unavailable - using fallback'
    }
}

/**
 * Generic feedback messages
 */
function getGenericFeedback(isCorrect) {
    const positive = [
        'Great work! AI confidence improved.',
        'Excellent contribution to the training data.',
        'Perfect! This helps improve our models.',
        'Well done! Your input is valuable.',
    ]

    const review = [
        'Thank you! Our AI will review this.',
        'Contribution received. Processing...',
        'Accepted for review. Thank you!',
    ]

    const messages = isCorrect ? positive : review
    return messages[Math.floor(Math.random() * messages.length)]
}

/**
 * Get AI processing status message
 */
export function getAIProcessingMessage() {
    const messages = [
        'AI neural network processing...',
        'Analyzing contribution patterns...',
        'Validating against training data...',
        'Computing confidence score...',
        'Processing through AI model...',
    ]

    return messages[Math.floor(Math.random() * messages.length)]
}
