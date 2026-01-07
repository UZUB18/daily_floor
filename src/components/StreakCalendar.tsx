'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import type { StreakData } from '@/lib/types';
import { getStreakDisplay, getMonthlyGrid } from '@/lib/streak';

interface StreakCalendarProps {
    streakData: StreakData;
}

interface DayNode {
    date: string;
    status: 'completed' | 'missed' | 'frozen' | 'future';
    isToday: boolean;
    dayOfMonth: number;
    dayLabel: string;
}

/**
 * Get centered week days (3 before today, today, 3 after)
 */
function getWeekDays(streakData: StreakData): DayNode[] {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const result: DayNode[] = [];

    for (let i = -3; i <= 3; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        const isFuture = dateStr > todayStr;
        const completed = streakData.completionCalendar[dateStr] === true;

        let status: DayNode['status'];
        if (isFuture) {
            status = 'future';
        } else if (completed) {
            status = 'completed';
        } else {
            status = 'missed';
        }

        result.push({
            date: dateStr,
            status,
            isToday: dateStr === todayStr,
            dayOfMonth: date.getDate(),
            dayLabel: date.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0),
        });
    }

    return result;
}

/**
 * Fire icon
 */
function FireIcon({ active }: { active: boolean }) {
    return (
        <svg
            className={`w-7 h-7 ${active ? 'text-orange-500' : 'text-gray-300'}`}
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
                    fill="white"
                    opacity={0.4}
                    d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z"
                />
            )}
        </svg>
    );
}

/**
 * Modern Streak Calendar with connected line visualization
 */
export function StreakCalendar({ streakData }: StreakCalendarProps) {
    const [expanded, setExpanded] = useState(false);
    const { current, longest, completedToday, isActive } = getStreakDisplay(streakData);
    const weekDays = useMemo(() => getWeekDays(streakData), [streakData]);
    const monthGrid = useMemo(() => getMonthlyGrid(streakData), [streakData]);

    // SVG dimensions
    const daySize = 36;
    const gap = 8;
    const totalWidth = 7 * daySize + 6 * gap;
    const svgHeight = daySize + 40; // Extra space for labels

    // Calculate path for connecting line
    const getLinePath = () => {
        const points: { x: number; y: number; status: string }[] = [];

        weekDays.forEach((day, i) => {
            const x = i * (daySize + gap) + daySize / 2;
            const y = 20 + daySize / 2;
            points.push({ x, y, status: day.status });
        });

        return points;
    };

    const linePoints = getLinePath();

    return (
        <div
            className="bg-white rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.05)] overflow-hidden cursor-pointer"
            onClick={() => setExpanded(!expanded)}
        >
            {/* Collapsed: Heads-Up Display */}
            <div className="p-5">
                {/* Top row: streak count and best */}
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                        <FireIcon active={isActive} />
                        <div className="flex items-baseline gap-1">
                            <span className={`text-3xl font-bold tracking-tight ${isActive ? 'text-[#1F2937]' : 'text-gray-400'}`}>
                                {current}
                            </span>
                            <span className="text-gray-500 text-sm font-medium">
                                day{current !== 1 ? 's' : ''}
                            </span>
                        </div>
                    </div>

                    <div className="text-right">
                        <span className="text-[11px] text-gray-400 uppercase tracking-wider font-medium">Best</span>
                        <p className="text-sm font-semibold text-gray-600">{longest} days</p>
                    </div>
                </div>

                {/* Week view with SVG connecting line */}
                <div className="relative">
                    <svg width={totalWidth} height={svgHeight} className="mx-auto block">
                        {/* Connecting line segments */}
                        {linePoints.map((point, i) => {
                            if (i === 0) return null;
                            const prev = linePoints[i - 1];
                            const curr = point;

                            // Determine line style based on status
                            const isCompleted = prev.status === 'completed' && curr.status === 'completed';
                            const isFuture = curr.status === 'future';
                            const hasMissed = prev.status === 'missed' || curr.status === 'missed';

                            if (hasMissed && !isFuture) {
                                // Gap for missed - no line
                                return null;
                            }

                            return (
                                <line
                                    key={i}
                                    x1={prev.x}
                                    y1={prev.y}
                                    x2={curr.x}
                                    y2={curr.y}
                                    stroke={isFuture ? '#E5E7EB' : '#F59E0B'}
                                    strokeWidth={isFuture ? 2 : 3}
                                    strokeDasharray={isFuture ? '4 4' : 'none'}
                                    strokeLinecap="round"
                                    className="transition-all duration-300"
                                />
                            );
                        })}

                        {/* Day circles */}
                        {weekDays.map((day, i) => {
                            const x = i * (daySize + gap) + daySize / 2;
                            const y = 20 + daySize / 2;

                            return (
                                <g key={day.date}>
                                    {/* Day label */}
                                    <text
                                        x={x}
                                        y={10}
                                        textAnchor="middle"
                                        className="fill-gray-400 text-[11px] font-medium"
                                    >
                                        {day.dayLabel}
                                    </text>

                                    {/* Circle background */}
                                    <circle
                                        cx={x}
                                        cy={y}
                                        r={daySize / 2 - 2}
                                        fill={
                                            day.status === 'completed' ? '#F59E0B' :
                                                day.status === 'frozen' ? '#60A5FA' :
                                                    day.isToday ? '#F3F4F6' :
                                                        day.status === 'future' ? '#FAFAFA' :
                                                            '#F9FAFB'
                                        }
                                        stroke={day.isToday && day.status !== 'completed' ? '#D1D5DB' : 'none'}
                                        strokeWidth={2}
                                        strokeDasharray={day.isToday && day.status !== 'completed' ? '3 3' : 'none'}
                                        className="transition-all duration-300"
                                    />

                                    {/* Checkmark for completed */}
                                    {day.status === 'completed' && (
                                        <path
                                            d={`M${x - 5} ${y} L${x - 1} ${y + 4} L${x + 6} ${y - 4}`}
                                            stroke="#1F2937"
                                            strokeWidth={2.5}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            fill="none"
                                        />
                                    )}

                                    {/* Dot for today (not completed) */}
                                    {day.isToday && day.status !== 'completed' && (
                                        <circle cx={x} cy={y} r={4} fill="#9CA3AF" />
                                    )}
                                </g>
                            );
                        })}
                    </svg>
                </div>

                {/* Status message */}
                <p className={`mt-4 text-center text-[13px] font-medium ${completedToday ? 'text-amber-600' : 'text-gray-400'
                    }`}>
                    {completedToday
                        ? '✓ Floor complete • Streak secured'
                        : 'Complete today to extend your streak'
                    }
                </p>
            </div>

            {/* Expanded: Month View */}
            {expanded && (
                <div className="border-t border-gray-100 p-5 animate-fadeInUp">
                    {/* Month header */}
                    <div className="text-center mb-4">
                        <h3 className="text-sm font-semibold text-gray-700">
                            {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </h3>
                    </div>

                    {/* Weekday headers */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                            <div key={i} className="text-center text-[11px] font-medium text-gray-400">
                                {d}
                            </div>
                        ))}
                    </div>

                    {/* Month grid */}
                    <div className="space-y-1">
                        {monthGrid.map((week, weekIdx) => (
                            <div key={weekIdx} className="grid grid-cols-7 gap-1">
                                {week.map((day, dayIdx) => {
                                    const today = new Date().toISOString().split('T')[0];
                                    const isToday = day.date === today;
                                    const isFuture = day.date > today;

                                    return (
                                        <div
                                            key={day.date}
                                            className={`
                                                aspect-square rounded-lg flex items-center justify-center
                                                text-[12px] font-medium transition-all
                                                ${!day.inMonth ? 'text-gray-300' : ''}
                                                ${day.completed ? 'bg-amber-400 text-gray-900' : ''}
                                                ${isToday && !day.completed ? 'bg-gray-200 text-gray-700' : ''}
                                                ${!day.completed && !isToday && day.inMonth && !isFuture ? 'text-gray-400' : ''}
                                                ${isFuture && day.inMonth ? 'text-gray-300' : ''}
                                            `}
                                        >
                                            {new Date(day.date).getDate()}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>

                    {/* Tap to close hint */}
                    <p className="mt-4 text-center text-[11px] text-gray-400">
                        Tap to close
                    </p>
                </div>
            )}
        </div>
    );
}
