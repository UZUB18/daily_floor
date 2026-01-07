// ============================================
// DAILY FLOOR - TYPE DEFINITIONS
// ============================================

/**
 * Movement pattern categories for exercise classification
 */
export type MovementType =
    | 'push'
    | 'pull'
    | 'squat'
    | 'hinge'
    | 'core'
    | 'mobility';

/**
 * Muscle groups for tracking and rotation
 */
export type MuscleGroup =
    | 'chest'
    | 'shoulders'
    | 'triceps'
    | 'back'
    | 'biceps'
    | 'quads'
    | 'hamstrings'
    | 'glutes'
    | 'core'
    | 'hip-flexors'
    | 'calves';

/**
 * Physical constraints/limitations
 */
export type Constraint =
    | 'wrist'
    | 'knee'
    | 'shoulder'
    | 'lower-back'
    | 'neck';

/**
 * Available equipment levels
 */
export type EquipmentLevel = 'none' | 'minimal' | 'full';

/**
 * Difficulty perception options
 */
export type DifficultyFeedback = 'easier' | 'same' | 'harder';

/**
 * Energy level options
 */
export type EnergyLevel = 'low' | 'ok' | 'high';

/**
 * Soreness status
 */
export type SorenessLevel = 'sore' | 'normal';

/**
 * Time preference in minutes
 */
export type TimePreference = 2 | 5 | 8;

// ============================================
// CORE ENTITIES
// ============================================

/**
 * User profile and preferences
 */
export interface UserProfile {
    id: string;
    level: number; // 1-10
    timePreference: TimePreference;
    equipment: EquipmentLevel;
    constraints: Constraint[];
    createdAt: string;
    updatedAt: string;
}

/**
 * Exercise definition from the exercise database
 */
export interface Exercise {
    id: string;
    name: string;
    movementType: MovementType;
    muscleGroups: MuscleGroup[];
    isPrimary: boolean; // Can be used as primary movement
    isSupport: boolean; // Can be used as support movement

    // Targets (one or the other)
    baseReps?: number;
    baseTime?: number; // in seconds

    // Guidance
    goal: string; // 1-line goal
    instructions: string[]; // 3-step form bullets
    commonMistake: string;

    // Variations
    easierVariant?: string;
    harderVariant?: string;

    // Constraints
    contraindications: Constraint[];

    // Difficulty scaling
    difficultyLevel: number; // 1-5

    // Visual guide
    infographic?: string; // Path to infographic image
}

/**
 * An exercise as it appears in a daily floor
 */
export interface FloorExercise {
    exerciseId: string;
    exerciseName: string;

    // Target (scaled from base)
    targetReps?: number;
    targetTime?: number; // seconds

    // Status
    isBonus: boolean;
    completed: boolean;

    // Actual performance (optional)
    actualReps?: number;
    actualTime?: number;
}

/**
 * Daily floor workout
 */
export interface DailyFloor {
    id: string;
    date: string; // ISO date (YYYY-MM-DD)
    exercises: FloorExercise[];

    // Status
    completed: boolean;
    completedAt?: string; // ISO datetime

    // Metadata
    estimatedDuration: number; // minutes
    generatedAt: string; // ISO datetime
}

/**
 * User feedback after a workout or for adjustment
 */
export interface Feedback {
    id: string;
    date: string; // ISO date
    difficulty: DifficultyFeedback;
    soreness?: SorenessLevel;
    energy?: EnergyLevel;
    timeAvailable?: TimePreference;
    createdAt: string;
}

/**
 * Streak tracking data
 */
export interface StreakData {
    current: number;
    longest: number;
    graceDaysUsed: number;
    lastCompletedDate?: string; // ISO date
    completionCalendar: Record<string, boolean>; // ISO date -> completed
}

// ============================================
// APP STATE
// ============================================

/**
 * Complete app state for storage
 */
export interface AppState {
    userProfile: UserProfile | null;
    streak: StreakData;
    floors: DailyFloor[];
    feedback: Feedback[];
    onboardingComplete: boolean;
    lastSyncedAt?: string;
}

/**
 * Default initial state
 */
export const DEFAULT_APP_STATE: AppState = {
    userProfile: null,
    streak: {
        current: 0,
        longest: 0,
        graceDaysUsed: 0,
        completionCalendar: {},
    },
    floors: [],
    feedback: [],
    onboardingComplete: false,
};

// ============================================
// UTILITY TYPES
// ============================================

/**
 * Floor generation options
 */
export interface FloorGenerationOptions {
    date: string;
    includeBonus: boolean;
}

/**
 * Adjustment result
 */
export interface AdjustmentResult {
    floor: DailyFloor;
    changes: string[]; // Human-readable list of changes made
}
