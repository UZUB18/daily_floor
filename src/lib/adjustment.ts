import type {
    DailyFloor,
    FloorExercise,
    Feedback,
    UserProfile,
    AdjustmentResult,
} from './types';
import { EXERCISES, getExerciseById } from './exercises';

/**
 * FLOOR ADJUSTMENT ALGORITHM
 * 
 * Safety constraints:
 * - Never increase intensity more than 30% in one day
 * - If user reports "Too hard" 2x in 3 days → auto-deload
 * - If user reports soreness + "Too hard" → swap to joint-friendly alternatives
 */

const MAX_INCREASE_PERCENT = 0.30;
const MAX_DECREASE_PERCENT = 0.40;

/**
 * Calculate adjustment multiplier based on feedback
 */
function getAdjustmentMultiplier(
    feedback: Feedback,
    recentFeedback: Feedback[]
): number {
    let multiplier = 1.0;

    // Base adjustment from current feedback
    if (feedback.difficulty === 'easier') {
        multiplier = 1.15; // Increase by 15%
    } else if (feedback.difficulty === 'harder') {
        multiplier = 0.85; // Decrease by 15%
    }

    // Check for "too hard" pattern (2x in 3 days)
    const recentHardCount = recentFeedback
        .slice(0, 3)
        .filter(f => f.difficulty === 'harder')
        .length;

    if (feedback.difficulty === 'harder' && recentHardCount >= 1) {
        multiplier = 0.70; // Significant deload (30%)
    }

    // Adjust for energy level
    if (feedback.energy === 'low') {
        multiplier *= 0.9;
    } else if (feedback.energy === 'high') {
        multiplier *= 1.1;
    }

    // Clamp to safety limits
    multiplier = Math.min(1 + MAX_INCREASE_PERCENT, multiplier);
    multiplier = Math.max(1 - MAX_DECREASE_PERCENT, multiplier);

    return multiplier;
}

/**
 * Find alternative exercise for muscle groups when soreness reported
 */
function findAlternativeExercise(
    currentExercise: FloorExercise,
    constraints: string[]
): FloorExercise | null {
    const exercise = getExerciseById(currentExercise.exerciseId);
    if (!exercise) return null;

    // Find exercises with same movement type but different primary muscles
    const alternatives = EXERCISES.filter(alt => {
        if (alt.id === exercise.id) return false;
        if (alt.movementType !== exercise.movementType) return false;
        if (alt.difficultyLevel > exercise.difficultyLevel) return false;
        if (alt.contraindications.some(c => constraints.includes(c))) return false;

        // Prefer exercises with less overlap in muscle groups
        const overlap = alt.muscleGroups.filter(m =>
            exercise.muscleGroups.includes(m)
        ).length;

        return overlap < exercise.muscleGroups.length;
    });

    if (alternatives.length === 0) return null;

    // Pick the one with lowest difficulty
    const chosen = alternatives.sort((a, b) => a.difficultyLevel - b.difficultyLevel)[0];

    return {
        exerciseId: chosen.id,
        exerciseName: chosen.name,
        targetReps: chosen.baseReps,
        targetTime: chosen.baseTime,
        isBonus: currentExercise.isBonus,
        completed: false,
    };
}

/**
 * Scale exercise targets by multiplier
 */
function scaleExercise(
    exercise: FloorExercise,
    multiplier: number
): FloorExercise {
    return {
        ...exercise,
        targetReps: exercise.targetReps
            ? Math.max(3, Math.round(exercise.targetReps * multiplier))
            : undefined,
        targetTime: exercise.targetTime
            ? Math.max(10, Math.round(exercise.targetTime * multiplier))
            : undefined,
    };
}

/**
 * Adjust floor based on feedback
 */
export function adjustFloor(
    currentFloor: DailyFloor,
    feedback: Feedback,
    recentFeedback: Feedback[],
    userProfile: UserProfile | null
): AdjustmentResult {
    const changes: string[] = [];
    const constraints = userProfile?.constraints ?? [];

    // Get adjustment multiplier
    const multiplier = getAdjustmentMultiplier(feedback, recentFeedback);

    // Check if soreness + hard = need to swap exercises
    const needsSwap = feedback.soreness === 'sore' && feedback.difficulty === 'harder';

    // Adjust each exercise
    const adjustedExercises = currentFloor.exercises.map(exercise => {
        // Check if we need to swap this exercise
        if (needsSwap && !exercise.isBonus) {
            const alternative = findAlternativeExercise(exercise, constraints);
            if (alternative) {
                changes.push(`Swapped ${exercise.exerciseName} → ${alternative.exerciseName}`);
                return scaleExercise(alternative, 0.85); // Start alternative at lower intensity
            }
        }

        // Scale the exercise
        const scaled = scaleExercise(exercise, multiplier);

        if (scaled.targetReps !== exercise.targetReps) {
            const diff = (scaled.targetReps || 0) - (exercise.targetReps || 0);
            const sign = diff > 0 ? '+' : '';
            changes.push(`${exercise.exerciseName}: ${sign}${diff} reps`);
        }
        if (scaled.targetTime !== exercise.targetTime) {
            const diff = (scaled.targetTime || 0) - (exercise.targetTime || 0);
            const sign = diff > 0 ? '+' : '';
            changes.push(`${exercise.exerciseName}: ${sign}${diff}s`);
        }

        return scaled;
    });

    if (changes.length === 0) {
        changes.push('No changes needed');
    }

    return {
        floor: {
            ...currentFloor,
            exercises: adjustedExercises,
        },
        changes,
    };
}

/**
 * Quick adjust (single direction, no full feedback)
 */
export function quickAdjust(
    floor: DailyFloor,
    direction: 'easier' | 'harder'
): AdjustmentResult {
    const multiplier = direction === 'easier' ? 0.85 : 1.15;
    const changes: string[] = [];

    const adjustedExercises = floor.exercises.map(exercise => {
        const scaled = scaleExercise(exercise, multiplier);

        if (scaled.targetReps !== exercise.targetReps) {
            const diff = (scaled.targetReps || 0) - (exercise.targetReps || 0);
            const sign = diff > 0 ? '+' : '';
            changes.push(`${exercise.exerciseName}: ${sign}${diff} reps`);
        }
        if (scaled.targetTime !== exercise.targetTime) {
            const diff = (scaled.targetTime || 0) - (exercise.targetTime || 0);
            const sign = diff > 0 ? '+' : '';
            changes.push(`${exercise.exerciseName}: ${sign}${diff}s`);
        }

        return scaled;
    });

    return {
        floor: {
            ...floor,
            exercises: adjustedExercises,
        },
        changes,
    };
}
