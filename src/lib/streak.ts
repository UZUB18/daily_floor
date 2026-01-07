import type { StreakData, DailyFloor } from './types';

/**
 * STREAK TRACKING
 * 
 * A streak is earned only if the user completes 100% of the floor (not the bonus).
 * Tracks current streak, longest streak, and completion calendar.
 */

/**
 * Get date string for today
 */
function getToday(): string {
    return new Date().toISOString().split('T')[0];
}

/**
 * Get date string for yesterday
 */
function getYesterday(): string {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date.toISOString().split('T')[0];
}

/**
 * Check if two dates are consecutive
 */
function areConsecutiveDays(date1: string, date2: string): boolean {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffMs = Math.abs(d2.getTime() - d1.getTime());
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    return diffDays === 1;
}

/**
 * Calculate streak from completion calendar
 */
export function calculateStreak(streakData: StreakData): StreakData {
    const today = getToday();
    const yesterday = getYesterday();
    const { completionCalendar, longest, graceDaysUsed } = streakData;

    // Check if today or yesterday is completed
    const completedToday = completionCalendar[today] === true;
    const completedYesterday = completionCalendar[yesterday] === true;

    // If neither today nor yesterday is complete, streak could be broken
    if (!completedToday && !completedYesterday) {
        // Check if last completion was yesterday or before
        const lastDate = streakData.lastCompletedDate;
        if (lastDate && lastDate < yesterday) {
            // Streak is broken
            return {
                ...streakData,
                current: 0,
            };
        }
        // Still today, streak continues if yesterday was completed
        return streakData;
    }

    // Count consecutive days backwards from most recent completion
    const startDate = completedToday ? today : yesterday;
    let consecutiveDays = 1;
    let checkDate = new Date(startDate);

    while (true) {
        checkDate.setDate(checkDate.getDate() - 1);
        const checkStr = checkDate.toISOString().split('T')[0];

        if (completionCalendar[checkStr]) {
            consecutiveDays++;
        } else {
            break;
        }

        // Safety limit
        if (consecutiveDays > 365) break;
    }

    const newLongest = Math.max(longest, consecutiveDays);

    return {
        ...streakData,
        current: consecutiveDays,
        longest: newLongest,
        lastCompletedDate: completedToday ? today : streakData.lastCompletedDate,
    };
}

/**
 * Mark a floor as complete and update streak
 */
export function markFloorCompleteAndUpdateStreak(
    floor: DailyFloor,
    currentStreak: StreakData
): StreakData {
    if (!floor.completed) {
        return currentStreak;
    }

    const date = floor.date;

    // Update completion calendar
    const newCalendar = {
        ...currentStreak.completionCalendar,
        [date]: true,
    };

    // Clean up old calendar entries (keep last 90 days)
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 90);
    const cutoffStr = cutoffDate.toISOString().split('T')[0];

    const cleanedCalendar: Record<string, boolean> = {};
    for (const [dateKey, value] of Object.entries(newCalendar)) {
        if (dateKey >= cutoffStr) {
            cleanedCalendar[dateKey] = value;
        }
    }

    // Calculate new streak
    const updatedStreak: StreakData = {
        ...currentStreak,
        completionCalendar: cleanedCalendar,
        lastCompletedDate: date,
    };

    return calculateStreak(updatedStreak);
}

/**
 * Get streak display info
 */
export function getStreakDisplay(streakData: StreakData): {
    current: number;
    longest: number;
    completedToday: boolean;
    isActive: boolean;
} {
    const today = getToday();
    const completedToday = streakData.completionCalendar[today] === true;

    // Streak is "active" if completed today or yesterday
    const yesterday = getYesterday();
    const completedYesterday = streakData.completionCalendar[yesterday] === true;
    const isActive = completedToday || (completedYesterday && streakData.current > 0);

    return {
        current: streakData.current,
        longest: streakData.longest,
        completedToday,
        isActive,
    };
}

/**
 * Get last N days for calendar display
 */
export function getCalendarDays(
    streakData: StreakData,
    days: number = 7
): { date: string; completed: boolean; isToday: boolean }[] {
    const today = getToday();
    const result: { date: string; completed: boolean; isToday: boolean }[] = [];

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        result.push({
            date: dateStr,
            completed: streakData.completionCalendar[dateStr] === true,
            isToday: dateStr === today,
        });
    }

    return result;
}

/**
 * Get monthly grid for history view
 */
export function getMonthlyGrid(
    streakData: StreakData,
    monthOffset: number = 0
): { date: string; completed: boolean; inMonth: boolean }[][] {
    const now = new Date();
    now.setMonth(now.getMonth() - monthOffset);

    const year = now.getFullYear();
    const month = now.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const weeks: { date: string; completed: boolean; inMonth: boolean }[][] = [];
    let currentWeek: { date: string; completed: boolean; inMonth: boolean }[] = [];

    // Fill in days before the 1st
    const firstDayOfWeek = firstDay.getDay();
    for (let i = 0; i < firstDayOfWeek; i++) {
        const date = new Date(firstDay);
        date.setDate(date.getDate() - (firstDayOfWeek - i));
        const dateStr = date.toISOString().split('T')[0];
        currentWeek.push({
            date: dateStr,
            completed: streakData.completionCalendar[dateStr] === true,
            inMonth: false,
        });
    }

    // Fill in the days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const date = new Date(year, month, day);
        const dateStr = date.toISOString().split('T')[0];

        currentWeek.push({
            date: dateStr,
            completed: streakData.completionCalendar[dateStr] === true,
            inMonth: true,
        });

        if (currentWeek.length === 7) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
    }

    // Fill in remaining days
    if (currentWeek.length > 0) {
        while (currentWeek.length < 7) {
            const lastDate = new Date(currentWeek[currentWeek.length - 1].date);
            lastDate.setDate(lastDate.getDate() + 1);
            const dateStr = lastDate.toISOString().split('T')[0];
            currentWeek.push({
                date: dateStr,
                completed: streakData.completionCalendar[dateStr] === true,
                inMonth: false,
            });
        }
        weeks.push(currentWeek);
    }

    return weeks;
}
