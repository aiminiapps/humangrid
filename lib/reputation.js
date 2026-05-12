// Reputation system configuration

// Points awarded per task difficulty
export const TASK_POINTS = {
    easy: 10,
    medium: 25,
    hard: 50,
}

// Level thresholds
export const LEVEL_THRESHOLDS = [
    { level: 1, minPoints: 0, name: 'Beginner Contributor', multiplier: 1.0 },
    { level: 2, minPoints: 100, name: 'Verified Trainer', multiplier: 1.1 },
    { level: 3, minPoints: 300, name: 'AI Guardian', multiplier: 1.25 },
    { level: 4, minPoints: 600, name: 'Data Architect', multiplier: 1.5 },
    { level: 5, minPoints: 1000, name: 'Master Contributor', multiplier: 2.0 },
]

// Calculate user level from reputation score
export function getUserLevel(reputationScore) {
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
        if (reputationScore >= LEVEL_THRESHOLDS[i].minPoints) {
            return LEVEL_THRESHOLDS[i]
        }
    }
    return LEVEL_THRESHOLDS[0]
}

// Calculate points to next level
export function getPointsToNextLevel(reputationScore) {
    const currentLevel = getUserLevel(reputationScore)
    const nextLevelIndex = LEVEL_THRESHOLDS.findIndex(l => l.level === currentLevel.level) + 1

    if (nextLevelIndex >= LEVEL_THRESHOLDS.length) {
        return 0 // Max level reached
    }

    const nextLevel = LEVEL_THRESHOLDS[nextLevelIndex]
    return nextLevel.minPoints - reputationScore
}

// Calculate reward amount based on difficulty and level
export function calculateReward(difficulty, userLevel) {
    const baseReward = {
        easy: 5,
        medium: 15,
        hard: 30,
    }[difficulty] || 5

    const levelInfo = LEVEL_THRESHOLDS.find(l => l.level === userLevel) || LEVEL_THRESHOLDS[0]
    return baseReward * levelInfo.multiplier
}
