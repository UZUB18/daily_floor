/**
 * Haptic Feedback Utilities
 * 
 * Uses navigator.vibrate() for physical feedback on mobile devices.
 * Gracefully degrades on unsupported devices.
 */

/**
 * Check if vibration is supported
 */
export function supportsHaptics(): boolean {
    return typeof navigator !== 'undefined' && 'vibrate' in navigator;
}

/**
 * Light tap - for checking off exercises
 */
export function hapticTap(): void {
    if (supportsHaptics()) {
        navigator.vibrate(10);
    }
}

/**
 * Success - medium feedback for positive actions
 */
export function hapticSuccess(): void {
    if (supportsHaptics()) {
        navigator.vibrate([15, 50, 15]);
    }
}

/**
 * Heavy thud - for completing the full floor
 */
export function hapticHeavy(): void {
    if (supportsHaptics()) {
        navigator.vibrate([30, 50, 30, 50, 50]);
    }
}

/**
 * Celebration - rapid pulse for big achievements
 */
export function hapticCelebration(): void {
    if (supportsHaptics()) {
        navigator.vibrate([50, 30, 50, 30, 50, 30, 100]);
    }
}

/**
 * Error/Warning - sharp double pulse
 */
export function hapticWarning(): void {
    if (supportsHaptics()) {
        navigator.vibrate([100, 50, 100]);
    }
}
