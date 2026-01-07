/**
 * Push Notification Utilities
 * 
 * Local notifications for streak reminders.
 * Works when app is open/backgrounded on mobile PWA.
 */

// Store timeout IDs to prevent duplicate scheduling
let morningTimeoutId: ReturnType<typeof setTimeout> | null = null;
let eveningTimeoutId: ReturnType<typeof setTimeout> | null = null;

/**
 * Check if notifications are supported
 */
export function supportsNotifications(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
}

/**
 * Request notification permission
 */
export async function requestNotificationPermission(): Promise<boolean> {
    if (!supportsNotifications()) return false;

    if (Notification.permission === 'granted') return true;
    if (Notification.permission === 'denied') return false;

    const result = await Notification.requestPermission();
    return result === 'granted';
}

/**
 * Check if we have permission
 */
export function hasNotificationPermission(): boolean {
    return supportsNotifications() && Notification.permission === 'granted';
}

/**
 * Show a notification
 */
export function showNotification(title: string, options?: NotificationOptions): void {
    if (!hasNotificationPermission()) return;

    try {
        new Notification(title, {
            icon: '/icon-192x192.png',
            badge: '/icon-192x192.png',
            ...options,
        });
    } catch (e) {
        console.log('Notification failed:', e);
    }
}

/**
 * Show morning pump-up notification
 */
export function showMorningNotification(): void {
    showNotification('🌅 Your Daily Floor is Ready!', {
        body: 'Start your day strong. Just 5 minutes to keep momentum.',
        tag: 'morning-floor',
    });
}

/**
 * Show evening streak warning
 */
export function showEveningReminder(): void {
    showNotification('⚠️ Don\'t Break Your Streak!', {
        body: '2 hours left to complete your floor.',
        tag: 'streak-warning',
    });
}

/**
 * Schedule morning notification for 9am
 */
export function scheduleMorningNotification(): void {
    if (!hasNotificationPermission()) return;

    // Clear existing
    if (morningTimeoutId) {
        clearTimeout(morningTimeoutId);
    }

    const now = new Date();
    const morning = new Date();
    morning.setHours(9, 0, 0, 0);

    // If already past 9am, schedule for tomorrow
    if (now >= morning) {
        morning.setDate(morning.getDate() + 1);
    }

    const msUntilMorning = morning.getTime() - now.getTime();

    morningTimeoutId = setTimeout(() => {
        showMorningNotification();
        // Reschedule for next day
        scheduleMorningNotification();
    }, msUntilMorning);

    console.log(`Morning notification scheduled for ${morning.toLocaleString()}`);
}

/**
 * Schedule evening reminder for 10pm
 */
export function scheduleEveningReminder(floorCompleted: boolean): void {
    if (!hasNotificationPermission()) return;

    // Don't schedule if already completed
    if (floorCompleted) {
        if (eveningTimeoutId) {
            clearTimeout(eveningTimeoutId);
            eveningTimeoutId = null;
        }
        return;
    }

    // Clear existing
    if (eveningTimeoutId) {
        clearTimeout(eveningTimeoutId);
    }

    const now = new Date();
    const evening = new Date();
    evening.setHours(22, 0, 0, 0); // 10pm

    // Only schedule if it's before 10pm today
    if (now >= evening) {
        return; // Too late
    }

    const msUntilEvening = evening.getTime() - now.getTime();

    eveningTimeoutId = setTimeout(() => {
        showEveningReminder();
    }, msUntilEvening);

    console.log(`Evening reminder scheduled for ${evening.toLocaleString()}`);
}

/**
 * Cancel all scheduled notifications
 */
export function cancelAllScheduledNotifications(): void {
    if (morningTimeoutId) {
        clearTimeout(morningTimeoutId);
        morningTimeoutId = null;
    }
    if (eveningTimeoutId) {
        clearTimeout(eveningTimeoutId);
        eveningTimeoutId = null;
    }
}

/**
 * Initialize notifications on app load
 */
export async function initializeNotifications(floorCompleted: boolean): Promise<void> {
    const hasPermission = await requestNotificationPermission();

    if (hasPermission) {
        scheduleMorningNotification();
        scheduleEveningReminder(floorCompleted);
    }
}
