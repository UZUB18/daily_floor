'use client';

import React from 'react';
import type { FloorExercise } from '@/lib/types';
import { getExerciseById } from '@/lib/exercises';
import { Checkbox } from '@/components/ui/Checkbox';

interface ExerciseCardProps {
    exercise: FloorExercise;
    onToggleComplete: (exerciseId: string) => void;
    onShowHowTo: (exerciseId: string) => void;
    index: number;
}

/**
 * Exercise-specific icons (simple, clean line art)
 */
const EXERCISE_ICONS: Record<string, React.ReactNode> = {
    // Push exercises
    'push-ups-standard': (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 18h16M6 14l2-4m10 4l-2-4M8 10h8" />
            <circle cx="12" cy="6" r="2" />
        </svg>
    ),
    'push-ups-incline': (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 20h4v-6l8-4v-2" />
            <circle cx="18" cy="6" r="2" />
        </svg>
    ),
    'pike-push-ups': (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 20l6-12M10 8l8 12M10 8v-2" />
            <circle cx="10" cy="4" r="2" />
        </svg>
    ),

    // Pull exercises
    'supermans': (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 14h4l2-2h6l2 2h4" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 14l-3 3M17 14l3 3" />
            <circle cx="12" cy="10" r="2" />
        </svg>
    ),
    'prone-y-raises': (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v4M8 12l-4-6M16 12l4-6M8 12h8" />
            <circle cx="12" cy="10" r="2" />
        </svg>
    ),

    // Squat/Lower
    'bodyweight-squats': (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <circle cx="12" cy="4" r="2" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v4M8 10h8M8 10l-2 6h2l1 4M16 10l2 6h-2l-1 4" />
        </svg>
    ),
    'glute-bridges': (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 18h3l2-6 6 0 2 6h3" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l3-4 3 4" />
            <circle cx="12" cy="6" r="1.5" />
        </svg>
    ),
    'reverse-lunges': (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <circle cx="12" cy="3" r="2" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v3M10 8l-2 6-2 6M14 8l3 4v8" />
        </svg>
    ),

    // Core exercises
    'plank': (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 14h16M6 14v4M18 14v4M6 14l2-4h8l2 4" />
            <circle cx="4" cy="10" r="1.5" />
        </svg>
    ),
    'dead-bugs': (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <ellipse cx="12" cy="12" rx="4" ry="2" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12l-4-4M16 12l4-4M8 12l-4 4M16 12l4 4" />
            <circle cx="12" cy="12" r="1" fill="currentColor" />
        </svg>
    ),
    'bird-dogs': (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 16v4M14 16v4M6 16h8M6 16l-3-6M14 16l6-6" />
            <circle cx="5" cy="8" r="2" />
        </svg>
    ),
    'hollow-hold': (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16c2-4 6-6 8-6s6 2 8 6" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l-1-4M20 16l1-4" />
            <circle cx="12" cy="8" r="2" />
        </svg>
    ),
    'mountain-climbers': (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 18l4-6 4 3 4-5 4 3" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 18l2-2M20 13l-2 2" />
            <circle cx="6" cy="10" r="1.5" />
        </svg>
    ),

    // Mobility exercises
    'cat-cow': (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 12c2-4 6-4 8-2s6 2 8-2" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 14c2 3 6 3 8 1s6-1 8 2" strokeDasharray="2 2" />
            <circle cx="4" cy="12" r="1" fill="currentColor" />
        </svg>
    ),
    'hip-circles': (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <circle cx="12" cy="14" r="5" strokeDasharray="3 2" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9V4M12 4l-2 2M12 4l2 2" />
            <circle cx="12" cy="4" r="1.5" />
        </svg>
    ),
    'worlds-greatest-stretch': (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 20l4-8M10 12l8 0M18 12v-6" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 8l4-4" />
            <circle cx="6" cy="10" r="2" />
        </svg>
    ),
    'thoracic-rotations': (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16h8M12 16v-4" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12l-4-4M16 12l4-4" />
            <circle cx="12" cy="8" r="2" />
            <path strokeLinecap="round" d="M6 8c0-2 3-4 6-4s6 2 6 4" strokeDasharray="2 2" />
        </svg>
    ),
};

/**
 * Fallback icons by movement type
 */
const MOVEMENT_FALLBACK_ICONS: Record<string, React.ReactNode> = {
    push: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 18h16M8 14l4-8 4 8" />
            <circle cx="12" cy="4" r="2" />
        </svg>
    ),
    pull: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 10h16M8 10l4 8 4-8" />
            <circle cx="12" cy="18" r="2" />
        </svg>
    ),
    squat: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <circle cx="12" cy="4" r="2" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v4M8 10l-1 5 1 5M16 10l1 5-1 5" />
        </svg>
    ),
    hinge: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <circle cx="8" cy="6" r="2" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 8l8 6M8 8v8M16 14v6" />
        </svg>
    ),
    core: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <ellipse cx="12" cy="12" rx="6" ry="3" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v-5M12 15v5M6 12H2M18 12h4" />
        </svg>
    ),
    mobility: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <circle cx="12" cy="12" r="6" strokeDasharray="3 2" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12M6 12h12" />
        </svg>
    ),
};

/**
 * Get icon for exercise - specific icon or fallback to movement type
 */
function getExerciseIcon(exerciseId: string, movementType: string): React.ReactNode {
    return EXERCISE_ICONS[exerciseId] || MOVEMENT_FALLBACK_ICONS[movementType] || MOVEMENT_FALLBACK_ICONS['core'];
}

/**
 * Format target display
 */
function formatTarget(exercise: FloorExercise): string {
    if (exercise.targetReps) {
        return `${exercise.targetReps} reps`;
    }
    if (exercise.targetTime) {
        return `${exercise.targetTime}s`;
    }
    return '';
}

/**
 * Exercise card for the Today screen
 */
export function ExerciseCard({
    exercise,
    onToggleComplete,
    onShowHowTo,
    index,
}: ExerciseCardProps) {
    const exerciseData = getExerciseById(exercise.exerciseId);
    const movementType = exerciseData?.movementType || 'core';
    const icon = getExerciseIcon(exercise.exerciseId, movementType);

    return (
        <div
            className={`
        relative
        bg-white
        rounded-2xl
        border border-gray-100
        p-4
        transition-all duration-300
        ${exercise.completed
                    ? 'bg-accent-50 border-accent-200'
                    : 'hover:border-gray-200 hover:shadow-sm'
                }
      `}
            style={{
                animationDelay: `${index * 60}ms`,
            }}
        >
            {/* Bonus badge */}
            {exercise.isBonus && (
                <span className="
          absolute -top-2 -right-2
          px-2 py-0.5
          text-xs font-semibold
          bg-primary-100 text-primary-700
          rounded-full
        ">
                    Bonus
                </span>
            )}

            <div className="flex items-center gap-4">
                {/* Checkbox */}
                <Checkbox
                    checked={exercise.completed}
                    onChange={() => onToggleComplete(exercise.exerciseId)}
                    size="lg"
                />

                {/* Icon */}
                <div className={`
          flex-shrink-0
          w-11 h-11
          flex items-center justify-center
          rounded-xl
          ${exercise.completed
                        ? 'bg-accent-100 text-accent-600'
                        : 'bg-gray-100 text-gray-600'
                    }
        `}>
                    {icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <h3 className={`
            text-base font-semibold
            transition-all duration-200
            ${exercise.completed ? 'text-gray-400 line-through' : 'text-gray-900'}
          `}>
                        {exercise.exerciseName}
                    </h3>
                    <p className={`
            text-sm font-medium
            ${exercise.completed ? 'text-gray-300' : 'text-primary-600'}
          `}>
                        {formatTarget(exercise)}
                    </p>
                </div>

                {/* How-to button */}
                <button
                    onClick={() => onShowHowTo(exercise.exerciseId)}
                    className="
            flex-shrink-0
            px-3 py-1.5
            text-xs font-semibold
            text-gray-500 hover:text-primary-600
            bg-gray-50 hover:bg-primary-50
            rounded-lg
            transition-colors
          "
                >
                    How
                </button>
            </div>
        </div>
    );
}
