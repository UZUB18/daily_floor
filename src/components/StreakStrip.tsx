'use client';

import React from 'react';
import type { StreakData } from '@/lib/types';
import { getStreakDisplay, getCalendarDays } from '@/lib/streak';

interface StreakStripProps {
    streakData: StreakData;
    daysToShow?: number;
}

/**
 * Fire icon for active streak
 */
function FireIcon({ className = '', active = false }: { className?: string; active?: boolean }) {
    return (
        <svg
            className={className}
            fill={active ? 'currentColor' : 'none'}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={active ? 0 : 1.5}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z"
            />
            {active && (
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="white"
                    opacity={0.5}
                    d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z"
                />
            )}
        </svg>
    );
}

/**
 * Streak strip showing current streak and calendar dots
 */
export function StreakStrip({ streakData, daysToShow = 7 }: StreakStripProps) {
    const { current, longest, completedToday, isActive } = getStreakDisplay(streakData);
    const calendarDays = getCalendarDays(streakData, daysToShow);

    return (
        <div className="
      bg-white
      rounded-2xl
      border border-gray-100
      shadow-sm
      p-4
    ">
            {/* Top row: streak count and longest */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <FireIcon
                        className={`w-6 h-6 ${isActive ? 'text-orange-500' : 'text-gray-300'}`}
                        active={isActive}
                    />
                    <div>
                        <span className={`
              text-2xl font-bold
              ${isActive ? 'text-gray-900' : 'text-gray-400'}
            `}>
                            {current}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">
                            day{current !== 1 ? 's' : ''}
                        </span>
                    </div>
                </div>

                <div className="text-right">
                    <span className="text-xs text-gray-400 uppercase tracking-wide">Best</span>
                    <p className="text-sm font-semibold text-gray-600">{longest} days</p>
                </div>
            </div>

            {/* Calendar dots */}
            <div className="flex items-center justify-between gap-1">
                {calendarDays.map((day, i) => {
                    const dayLabel = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }).charAt(0);

                    return (
                        <div key={day.date} className="flex flex-col items-center gap-1">
                            <span className="text-xs text-gray-400 font-medium">
                                {dayLabel}
                            </span>
                            <div
                                className={`
                  w-8 h-8
                  rounded-full
                  flex items-center justify-center
                  transition-all duration-300
                  ${day.completed
                                        ? 'bg-accent-500 shadow-sm'
                                        : day.isToday
                                            ? 'bg-primary-100 border-2 border-primary-300'
                                            : 'bg-gray-100'
                                    }
                `}
                                style={{
                                    boxShadow: day.completed ? 'var(--glow-accent)' : 'none',
                                }}
                            >
                                {day.completed ? (
                                    <svg className="w-4 h-4 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : day.isToday ? (
                                    <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                                ) : null}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Today status */}
            {!completedToday && (
                <p className="mt-3 text-center text-sm text-gray-500">
                    Complete today's floor to extend your streak
                </p>
            )}
            {completedToday && (
                <p className="mt-3 text-center text-sm text-accent-600 font-medium">
                    ✓ Floor complete • Streak secured
                </p>
            )}
        </div>
    );
}
