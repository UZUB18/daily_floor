import type {
    DailyFloor,
    FloorExercise,
    UserProfile,
    Feedback,
    MuscleGroup,
    Constraint,
} from './types';
import {
    EXERCISES,
    getPrimaryExercises,
    getSupportExercises,
    getSafeExercises,
} from './exercises';

/**
 * FLOOR GENERATION ALGORITHM
 * 
 * Rules:
 * 1. Always include 1 "primary" movement (push/pull/squat/hinge)
 * 2. Always include 1 "support" movement (core/mobility)
 * 3. Optional 3rd as "bonus" (alternates between primary/support)
 * 4. Avoid consecutive-day overload of same muscle group
 * 5. Duration target: 3-6 minutes
 * 6. Respect user constraints (wrist, knee, etc.)
 */

/**
 * Get today's date as ISO string (YYYY-MM-DD)
 */
export function getToday(): string {
    return new Date().toISOString().split('T')[0];
}

/**
 * Generate a unique ID
 */
function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get muscle groups worked in recent floors
 */
function getRecentlyWorkedMuscles(
    recentFloors: DailyFloor[],
    daysBack: number = 1
): MuscleGroup[] {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysBack);
    const cutoffStr = cutoffDate.toISOString().split('T')[0];

    const recentMuscles: MuscleGroup[] = [];

    for (const floor of recentFloors) {
        if (floor.date >= cutoffStr && floor.completed) {
            for (const floorEx of floor.exercises) {
                if (floorEx.completed) {
                    const exercise = EXERCISES.find(e => e.id === floorEx.exerciseId);
                    if (exercise) {
                        recentMuscles.push(...exercise.muscleGroups);
                    }
                }
            }
        }
    }

    return recentMuscles;
}

/**
 * Calculate overlap score between exercise and recently worked muscles
 */
function getMuscleOverlapScore(
    exercise: typeof EXERCISES[0],
    recentMuscles: MuscleGroup[]
): number {
    return exercise.muscleGroups.filter(m => recentMuscles.includes(m)).length;
}

/**
 * Scale reps/time based on user level
 */
function scaleTarget(base: number, level: number): number {
    // Level 1 = 60% of base, Level 10 = 150% of base
    const multiplier = 0.6 + (level - 1) * 0.1;
    return Math.round(base * multiplier);
}

/**
 * Pick a weighted random exercise from a list
 * Exercises with lower muscle overlap are preferred
 */
function pickWeightedRandom<T extends typeof EXERCISES[0]>(
    exercises: T[],
    recentMuscles: MuscleGroup[]
): T {
    if (exercises.length === 0) {
        throw new Error('No exercises available');
    }

    if (exercises.length === 1) {
        return exercises[0];
    }

    // Calculate weights (lower overlap = higher weight)
    const weights = exercises.map(ex => {
        const overlap = getMuscleOverlapScore(ex, recentMuscles);
        return Math.max(1, 5 - overlap); // Weight from 1-5
    });

    const totalWeight = weights.reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;

    for (let i = 0; i < exercises.length; i++) {
        random -= weights[i];
        if (random <= 0) {
            return exercises[i];
        }
    }

    return exercises[exercises.length - 1];
}

/**
 * Estimate duration of a floor exercise in seconds
 */
function estimateExerciseDuration(ex: FloorExercise): number {
    if (ex.targetTime) {
        return ex.targetTime;
    }
    if (ex.targetReps) {
        // Assume ~3 seconds per rep on average
        return ex.targetReps * 3;
    }
    return 30; // Default fallback
}

/**
 * Generate daily floor workout
 */
export function generateDailyFloor(
    userProfile: UserProfile | null,
    recentFloors: DailyFloor[],
    recentFeedback: Feedback[],
    options?: { date?: string; includeBonus?: boolean }
): DailyFloor {
    const date = options?.date || getToday();
    const includeBonus = options?.includeBonus ?? true;

    // Default level if no profile
    const level = userProfile?.level ?? 5;
    const constraints = userProfile?.constraints ?? [];

    // Get safe exercises (respect constraints)
    const safeExercises = constraints.length > 0
        ? getSafeExercises(constraints)
        : EXERCISES;

    const safePrimary = safeExercises.filter(e => e.isPrimary);
    const safeSupport = safeExercises.filter(e => e.isSupport);

    if (safePrimary.length === 0 || safeSupport.length === 0) {
        // Fallback to all exercises if constraints too restrictive
        console.warn('Constraints too restrictive, falling back to full exercise list');
    }

    const primaryPool = safePrimary.length > 0 ? safePrimary : getPrimaryExercises();
    const supportPool = safeSupport.length > 0 ? safeSupport : getSupportExercises();

    // Get recently worked muscles to avoid
    const recentMuscles = getRecentlyWorkedMuscles(recentFloors, 1);

    // Check recent feedback for difficulty adjustments
    const lastFeedback = recentFeedback[0];
    let difficultyModifier = 1.0;

    if (lastFeedback) {
        if (lastFeedback.difficulty === 'easier') {
            difficultyModifier = 0.85;
        } else if (lastFeedback.difficulty === 'harder') {
            difficultyModifier = 1.15;
        }
    }

    // Auto-deload if marked "harder" multiple times
    const hardCount = recentFeedback.filter(f => f.difficulty === 'harder').length;
    if (hardCount >= 2) {
        difficultyModifier = 0.7; // Significant deload
    }

    const exercises: FloorExercise[] = [];
    const usedIds = new Set<string>();

    // 1. Pick primary movement
    const primary = pickWeightedRandom(primaryPool, recentMuscles);
    usedIds.add(primary.id);

    exercises.push({
        exerciseId: primary.id,
        exerciseName: primary.name,
        targetReps: primary.baseReps
            ? Math.round(scaleTarget(primary.baseReps, level) * difficultyModifier)
            : undefined,
        targetTime: primary.baseTime
            ? Math.round(scaleTarget(primary.baseTime, level) * difficultyModifier)
            : undefined,
        isBonus: false,
        completed: false,
    });

    // 2. Pick support movement (avoid same as primary)
    const availableSupport = supportPool.filter(e => !usedIds.has(e.id));
    const support = pickWeightedRandom(availableSupport, recentMuscles);
    usedIds.add(support.id);

    exercises.push({
        exerciseId: support.id,
        exerciseName: support.name,
        targetReps: support.baseReps
            ? Math.round(scaleTarget(support.baseReps, level) * difficultyModifier)
            : undefined,
        targetTime: support.baseTime
            ? Math.round(scaleTarget(support.baseTime, level) * difficultyModifier)
            : undefined,
        isBonus: false,
        completed: false,
    });

    // 3. Optional bonus (alternate between primary/support type)
    if (includeBonus) {
        // Use day of month to alternate
        const dayOfMonth = new Date(date).getDate();
        const bonusPool = dayOfMonth % 2 === 0
            ? primaryPool.filter(e => !usedIds.has(e.id))
            : supportPool.filter(e => !usedIds.has(e.id));

        if (bonusPool.length > 0) {
            const bonus = pickWeightedRandom(bonusPool, recentMuscles);

            exercises.push({
                exerciseId: bonus.id,
                exerciseName: bonus.name,
                targetReps: bonus.baseReps
                    ? Math.round(scaleTarget(bonus.baseReps, level) * difficultyModifier)
                    : undefined,
                targetTime: bonus.baseTime
                    ? Math.round(scaleTarget(bonus.baseTime, level) * difficultyModifier)
                    : undefined,
                isBonus: true,
                completed: false,
            });
        }
    }

    // Calculate estimated duration
    const totalSeconds = exercises.reduce(
        (sum, ex) => sum + estimateExerciseDuration(ex),
        0
    );
    const estimatedMinutes = Math.round(totalSeconds / 60);
    const clampedDuration = Math.max(3, Math.min(6, estimatedMinutes));

    return {
        id: generateId(),
        date,
        exercises,
        completed: false,
        estimatedDuration: clampedDuration,
        generatedAt: new Date().toISOString(),
    };
}

/**
 * Check if floor is complete (all non-bonus exercises done)
 */
export function isFloorComplete(floor: DailyFloor): boolean {
    return floor.exercises
        .filter(ex => !ex.isBonus)
        .every(ex => ex.completed);
}

/**
 * Mark an exercise as complete
 */
export function markExerciseComplete(
    floor: DailyFloor,
    exerciseId: string,
    actual?: { reps?: number; time?: number }
): DailyFloor {
    const exercises = floor.exercises.map(ex => {
        if (ex.exerciseId === exerciseId) {
            return {
                ...ex,
                completed: true,
                actualReps: actual?.reps,
                actualTime: actual?.time,
            };
        }
        return ex;
    });

    const floorComplete = exercises
        .filter(ex => !ex.isBonus)
        .every(ex => ex.completed);

    return {
        ...floor,
        exercises,
        completed: floorComplete,
        completedAt: floorComplete ? new Date().toISOString() : undefined,
    };
}

/**
 * Toggle exercise completion status
 */
export function toggleExerciseComplete(
    floor: DailyFloor,
    exerciseId: string
): DailyFloor {
    const exercise = floor.exercises.find(ex => ex.exerciseId === exerciseId);

    if (!exercise) {
        return floor;
    }

    if (exercise.completed) {
        // Uncomplete
        const exercises = floor.exercises.map(ex => {
            if (ex.exerciseId === exerciseId) {
                return { ...ex, completed: false, actualReps: undefined, actualTime: undefined };
            }
            return ex;
        });
        return { ...floor, exercises, completed: false, completedAt: undefined };
    } else {
        // Complete
        return markExerciseComplete(floor, exerciseId);
    }
}
