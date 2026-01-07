import type { AppState, UserProfile, DailyFloor, Feedback, StreakData } from './types';
import { DEFAULT_APP_STATE } from './types';

const STORAGE_KEY = 'daily-floor-app';

/**
 * Load app state from localStorage
 */
export function loadAppState(): AppState {
    if (typeof window === 'undefined') {
        return DEFAULT_APP_STATE;
    }

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            return DEFAULT_APP_STATE;
        }

        const parsed = JSON.parse(stored) as AppState;
        // Ensure all required properties exist (migration safety)
        return {
            ...DEFAULT_APP_STATE,
            ...parsed,
        };
    } catch (error) {
        console.error('Failed to load app state:', error);
        return DEFAULT_APP_STATE;
    }
}

/**
 * Save app state to localStorage
 */
export function saveAppState(state: AppState): void {
    if (typeof window === 'undefined') {
        return;
    }

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
        console.error('Failed to save app state:', error);
    }
}

/**
 * Update a specific part of the app state
 */
export function updateAppState(
    updater: (state: AppState) => Partial<AppState>
): AppState {
    const currentState = loadAppState();
    const updates = updater(currentState);
    const newState = { ...currentState, ...updates };
    saveAppState(newState);
    return newState;
}

// ============================================
// CONVENIENCE FUNCTIONS
// ============================================

/**
 * Get or create user profile
 */
export function getUserProfile(): UserProfile | null {
    const state = loadAppState();
    return state.userProfile;
}

/**
 * Save user profile
 */
export function saveUserProfile(profile: UserProfile): void {
    updateAppState(() => ({
        userProfile: profile,
        onboardingComplete: true,
    }));
}

/**
 * Get today's floor if it exists
 */
export function getTodaysFloor(): DailyFloor | null {
    const state = loadAppState();
    const today = new Date().toISOString().split('T')[0];
    return state.floors.find(f => f.date === today) || null;
}

/**
 * Save a daily floor
 */
export function saveDailyFloor(floor: DailyFloor): void {
    updateAppState((state) => {
        // Replace existing floor for same date or add new
        const existingIndex = state.floors.findIndex(f => f.date === floor.date);
        const floors = [...state.floors];

        if (existingIndex >= 0) {
            floors[existingIndex] = floor;
        } else {
            floors.push(floor);
        }

        // Keep only last 90 days of floors
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - 90);
        const cutoffStr = cutoffDate.toISOString().split('T')[0];

        return {
            floors: floors.filter(f => f.date >= cutoffStr),
        };
    });
}

/**
 * Get recent floors (last N days)
 */
export function getRecentFloors(days: number = 7): DailyFloor[] {
    const state = loadAppState();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const cutoffStr = cutoffDate.toISOString().split('T')[0];

    return state.floors
        .filter(f => f.date >= cutoffStr)
        .sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * Get streak data
 */
export function getStreakData(): StreakData {
    const state = loadAppState();
    return state.streak;
}

/**
 * Update streak data
 */
export function saveStreakData(streak: StreakData): void {
    updateAppState(() => ({ streak }));
}

/**
 * Save feedback
 */
export function saveFeedback(feedback: Feedback): void {
    updateAppState((state) => {
        const existingIndex = state.feedback.findIndex(f => f.date === feedback.date);
        const feedbackList = [...state.feedback];

        if (existingIndex >= 0) {
            feedbackList[existingIndex] = feedback;
        } else {
            feedbackList.push(feedback);
        }

        // Keep only last 30 days of feedback
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - 30);
        const cutoffStr = cutoffDate.toISOString().split('T')[0];

        return {
            feedback: feedbackList.filter(f => f.date >= cutoffStr),
        };
    });
}

/**
 * Get recent feedback (last N days)
 */
export function getRecentFeedback(days: number = 7): Feedback[] {
    const state = loadAppState();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const cutoffStr = cutoffDate.toISOString().split('T')[0];

    return state.feedback
        .filter(f => f.date >= cutoffStr)
        .sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * Check if onboarding is complete
 */
export function isOnboardingComplete(): boolean {
    const state = loadAppState();
    return state.onboardingComplete;
}

/**
 * Clear all data (for testing/reset)
 */
export function clearAllData(): void {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
    }
}
