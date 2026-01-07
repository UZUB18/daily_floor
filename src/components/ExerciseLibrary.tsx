'use client';

import React, { useState, useMemo } from 'react';
import { Modal } from '@/components/ui/Modal';
import { EXERCISES } from '@/lib/exercises';
import type { Exercise, MovementType } from '@/lib/types';

interface ExerciseLibraryProps {
    isOpen: boolean;
    onClose: () => void;
}

const MOVEMENT_TYPES: { id: MovementType | 'all'; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'push', label: 'Push' },
    { id: 'pull', label: 'Pull' },
    { id: 'squat', label: 'Legs' },
    { id: 'hinge', label: 'Hinge' },
    { id: 'core', label: 'Core' },
    { id: 'mobility', label: 'Mobility' },
];

// SVG icons for each movement type - clean line art style
const MovementIcon = ({ type }: { type: MovementType }) => {
    const iconClass = "w-5 h-5";

    switch (type) {
        case 'push':
            // Chest/arms pushing motion
            return (
                <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 12h12m0 0l-4-4m4 4l-4 4" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="19" cy="12" r="2" />
                </svg>
            );
        case 'pull':
            // Pulling motion
            return (
                <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M20 12H8m0 0l4-4m-4 4l4 4" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="5" cy="12" r="2" />
                </svg>
            );
        case 'squat':
        case 'hinge':
            // Leg
            return (
                <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 4v4m0 0c-2 0-4 2-4 4v4c0 1 0.5 2 2 2m2-10c2 0 4 2 4 4v4c0 1-0.5 2-2 2" strokeLinecap="round" />
                </svg>
            );
        case 'core':
            // Core/center
            return (
                <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 5v2m0 10v2m-7-7h2m10 0h2" strokeLinecap="round" />
                </svg>
            );
        case 'mobility':
            // Stretch/flow
            return (
                <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 12c2-4 6-4 8 0s6 4 8 0" strokeLinecap="round" />
                    <circle cx="12" cy="12" r="2" />
                </svg>
            );
        default:
            return null;
    }
};

// Get muscle groups as readable string
const getMuscleString = (groups: string[]): string => {
    const formatted = groups.slice(0, 2).map(g =>
        g.charAt(0).toUpperCase() + g.slice(1).replace('-', ' ')
    );
    return formatted.join(' • ');
};

// Get difficulty label
const getDifficultyLabel = (level: number): { label: string; color: string } => {
    switch (level) {
        case 1: return { label: 'Beginner', color: 'bg-green-100 text-green-700' };
        case 2: return { label: 'Intermediate', color: 'bg-amber-100 text-amber-700' };
        case 3: return { label: 'Advanced', color: 'bg-red-100 text-red-700' };
        default: return { label: 'All', color: 'bg-gray-100 text-gray-600' };
    }
};

export function ExerciseLibrary({ isOpen, onClose }: ExerciseLibraryProps) {
    const [selectedType, setSelectedType] = useState<MovementType | 'all'>('all');
    const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

    const filteredExercises = useMemo(() => {
        return EXERCISES.filter(ex =>
            selectedType === 'all' || ex.movementType === selectedType
        );
    }, [selectedType]);

    if (!isOpen) return null;

    return (
        <>
            {/* Library Panel */}
            <div className="fixed inset-0 z-50 bg-[#F9FAFB] animate-slideUp">
                {/* Header */}
                <div className="sticky top-0 bg-[#F9FAFB] z-10 pb-2">
                    <div className="container pt-6 pb-4">
                        <div className="flex items-center justify-between mb-6">
                            <h1 className="text-2xl font-bold text-[#1F2937] tracking-tight">
                                Exercise Library
                            </h1>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm hover:shadow-md transition-shadow"
                            >
                                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Unified Filter Bar */}
                        <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4">
                            {MOVEMENT_TYPES.map(type => (
                                <button
                                    key={type.id}
                                    onClick={() => setSelectedType(type.id)}
                                    className={`
                                        px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
                                        transition-all duration-200
                                        ${selectedType === type.id
                                            ? 'bg-[#1F2937] text-white'
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-white hover:shadow-sm'
                                        }
                                    `}
                                >
                                    {type.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Exercise List */}
                <div className="container pb-24 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 140px)' }}>
                    {filteredExercises.length === 0 ? (
                        <div className="text-center py-16 text-gray-400">
                            No exercises found
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredExercises.map(exercise => {
                                const difficulty = getDifficultyLabel(exercise.difficultyLevel);

                                return (
                                    <button
                                        key={exercise.id}
                                        onClick={() => setSelectedExercise(exercise)}
                                        className="
                                            w-full p-4 rounded-[20px] text-left
                                            bg-white
                                            shadow-[0_4px_20px_rgba(0,0,0,0.05)]
                                            hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]
                                            active:scale-[0.98]
                                            transition-all duration-200
                                            group
                                        "
                                    >
                                        <div className="flex items-center gap-4">
                                            {/* Icon */}
                                            <div className={`
                                                w-11 h-11 rounded-xl flex items-center justify-center
                                                ${exercise.movementType === 'push' ? 'bg-blue-50 text-blue-600' : ''}
                                                ${exercise.movementType === 'pull' ? 'bg-emerald-50 text-emerald-600' : ''}
                                                ${exercise.movementType === 'squat' || exercise.movementType === 'hinge' ? 'bg-orange-50 text-orange-600' : ''}
                                                ${exercise.movementType === 'core' ? 'bg-purple-50 text-purple-600' : ''}
                                                ${exercise.movementType === 'mobility' ? 'bg-teal-50 text-teal-600' : ''}
                                            `}>
                                                <MovementIcon type={exercise.movementType} />
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-[#1F2937] text-[15px] leading-tight">
                                                    {exercise.name}
                                                </h3>
                                                <p className="text-[13px] text-gray-400 mt-0.5">
                                                    {getMuscleString(exercise.muscleGroups)}
                                                </p>
                                            </div>

                                            {/* Rep Badge */}
                                            <div className="px-3 py-1.5 rounded-full bg-primary-50 text-primary-700 text-[13px] font-medium">
                                                {exercise.baseReps ? `${exercise.baseReps} reps` : `${exercise.baseTime}s`}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Exercise Detail Modal */}
            {selectedExercise && (
                <Modal
                    isOpen={!!selectedExercise}
                    onClose={() => setSelectedExercise(null)}
                    title={selectedExercise.name}
                >
                    <div className="space-y-4">
                        {/* Infographic */}
                        {selectedExercise.infographic && (
                            <div className="rounded-2xl overflow-hidden bg-gray-50">
                                <img
                                    src={selectedExercise.infographic}
                                    alt={`${selectedExercise.name} instructions`}
                                    className="w-full h-auto"
                                />
                            </div>
                        )}

                        {/* Goal */}
                        <div className="p-4 bg-primary-50 rounded-2xl">
                            <p className="text-[15px] font-medium text-primary-800 leading-relaxed">
                                {selectedExercise.goal}
                            </p>
                        </div>

                        {/* Meta Row */}
                        <div className="flex gap-2">
                            <div className={`px-3 py-1.5 rounded-full text-[13px] font-medium ${getDifficultyLabel(selectedExercise.difficultyLevel).color}`}>
                                {getDifficultyLabel(selectedExercise.difficultyLevel).label}
                            </div>
                            <div className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 text-[13px] font-medium capitalize">
                                {selectedExercise.movementType}
                            </div>
                        </div>

                        {/* Common Mistake */}
                        <div className="p-4 bg-red-50 rounded-2xl">
                            <p className="text-[13px] font-semibold text-red-800 mb-1">Common Mistake</p>
                            <p className="text-[14px] text-red-700 leading-relaxed">{selectedExercise.commonMistake}</p>
                        </div>

                        {/* Close */}
                        <button
                            onClick={() => setSelectedExercise(null)}
                            className="w-full py-3.5 bg-[#1F2937] hover:bg-[#374151] text-white rounded-2xl font-medium transition-colors"
                        >
                            Done
                        </button>
                    </div>
                </Modal>
            )}
        </>
    );
}
