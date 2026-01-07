'use client';

import React, { useState, useMemo } from 'react';
import { Modal } from '@/components/ui/Modal';
import { EXERCISES, getExerciseById } from '@/lib/exercises';
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

const DIFFICULTY_LEVELS = [
    { id: 0, label: 'All' },
    { id: 1, label: '⭐' },
    { id: 2, label: '⭐⭐' },
    { id: 3, label: '⭐⭐⭐' },
];

/**
 * Exercise Library - Browse all exercises by type and difficulty
 */
export function ExerciseLibrary({ isOpen, onClose }: ExerciseLibraryProps) {
    const [selectedType, setSelectedType] = useState<MovementType | 'all'>('all');
    const [selectedDifficulty, setSelectedDifficulty] = useState<number>(0);
    const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

    // Filter exercises
    const filteredExercises = useMemo(() => {
        return EXERCISES.filter(ex => {
            const typeMatch = selectedType === 'all' || ex.movementType === selectedType;
            const difficultyMatch = selectedDifficulty === 0 || ex.difficultyLevel === selectedDifficulty;
            return typeMatch && difficultyMatch;
        });
    }, [selectedType, selectedDifficulty]);

    // Render difficulty stars
    const renderStars = (level: number) => {
        return '⭐'.repeat(level);
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Library Panel */}
            <div className="fixed inset-0 z-50 bg-background animate-slideUp">
                {/* Header */}
                <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-gray-100 z-10">
                    <div className="container py-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Exercise Library</h2>
                            <button
                                onClick={onClose}
                                className="p-2 -mr-2 text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Movement Type Tabs */}
                        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                            {MOVEMENT_TYPES.map(type => (
                                <button
                                    key={type.id}
                                    onClick={() => setSelectedType(type.id)}
                                    className={`
                                        px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
                                        transition-all duration-200
                                        ${selectedType === type.id
                                            ? 'bg-primary-600 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }
                                    `}
                                >
                                    {type.label}
                                </button>
                            ))}
                        </div>

                        {/* Difficulty Filter */}
                        <div className="flex gap-2 mt-3">
                            {DIFFICULTY_LEVELS.map(level => (
                                <button
                                    key={level.id}
                                    onClick={() => setSelectedDifficulty(level.id)}
                                    className={`
                                        px-3 py-1.5 rounded-lg text-sm font-medium
                                        transition-all duration-200
                                        ${selectedDifficulty === level.id
                                            ? 'bg-accent-100 text-accent-700 ring-2 ring-accent-300'
                                            : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                                        }
                                    `}
                                >
                                    {level.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Exercise Grid */}
                <div className="container py-4 pb-24 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>
                    {filteredExercises.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            No exercises found with these filters
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filteredExercises.map(exercise => (
                                <button
                                    key={exercise.id}
                                    onClick={() => setSelectedExercise(exercise)}
                                    className="
                                        w-full p-4 rounded-2xl text-left
                                        bg-white
                                        border-2 border-transparent
                                        hover:border-primary-200
                                        shadow-sm hover:shadow-lg
                                        transition-all duration-300
                                        group
                                        relative overflow-hidden
                                    "
                                    style={{
                                        background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, rgba(51, 5, 127, 0.1), rgba(51, 5, 127, 0.02)) border-box',
                                    }}
                                >
                                    {/* Hover glow effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary-50/0 via-primary-50/50 to-primary-50/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    <div className="relative flex items-center gap-4">
                                        {/* Movement Type Icon */}
                                        <div className={`
                                            w-12 h-12 rounded-xl flex items-center justify-center
                                            text-xl
                                            ${exercise.movementType === 'push' ? 'bg-blue-100 text-blue-600' : ''}
                                            ${exercise.movementType === 'pull' ? 'bg-green-100 text-green-600' : ''}
                                            ${exercise.movementType === 'squat' || exercise.movementType === 'hinge' ? 'bg-orange-100 text-orange-600' : ''}
                                            ${exercise.movementType === 'core' ? 'bg-purple-100 text-purple-600' : ''}
                                            ${exercise.movementType === 'mobility' ? 'bg-teal-100 text-teal-600' : ''}
                                        `}>
                                            {exercise.movementType === 'push' && '💪'}
                                            {exercise.movementType === 'pull' && '🔙'}
                                            {(exercise.movementType === 'squat' || exercise.movementType === 'hinge') && '🦵'}
                                            {exercise.movementType === 'core' && '🎯'}
                                            {exercise.movementType === 'mobility' && '🧘'}
                                        </div>

                                        {/* Exercise Info */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-900 text-base group-hover:text-primary-700 transition-colors">
                                                {exercise.name}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs text-gray-500 capitalize px-2 py-0.5 bg-gray-100 rounded-full">
                                                    {exercise.movementType}
                                                </span>
                                                <span className="text-sm">
                                                    {renderStars(exercise.difficultyLevel)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Arrow */}
                                        <svg className="w-5 h-5 text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </button>
                            ))}
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
                            <div className="rounded-xl overflow-hidden bg-gray-50">
                                <img
                                    src={selectedExercise.infographic}
                                    alt={`${selectedExercise.name} instructions`}
                                    className="w-full h-auto"
                                />
                            </div>
                        )}

                        {/* Goal */}
                        <div className="p-4 bg-primary-50 rounded-xl border border-primary-100">
                            <p className="text-base font-medium text-primary-800">
                                {selectedExercise.goal}
                            </p>
                        </div>

                        {/* Meta */}
                        <div className="flex gap-4 text-sm">
                            <div className="flex-1 p-3 bg-gray-50 rounded-lg">
                                <span className="block text-gray-500 text-xs mb-1">Type</span>
                                <span className="font-medium capitalize">{selectedExercise.movementType}</span>
                            </div>
                            <div className="flex-1 p-3 bg-gray-50 rounded-lg">
                                <span className="block text-gray-500 text-xs mb-1">Difficulty</span>
                                <span className="font-medium">{renderStars(selectedExercise.difficultyLevel)}</span>
                            </div>
                            <div className="flex-1 p-3 bg-gray-50 rounded-lg">
                                <span className="block text-gray-500 text-xs mb-1">Target</span>
                                <span className="font-medium">
                                    {selectedExercise.baseReps ? `${selectedExercise.baseReps} reps` : `${selectedExercise.baseTime}s`}
                                </span>
                            </div>
                        </div>

                        {/* Common Mistake */}
                        <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
                            <div className="flex gap-3">
                                <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <div>
                                    <h5 className="text-sm font-semibold text-red-800 mb-1">Common Mistake</h5>
                                    <p className="text-sm text-red-700">{selectedExercise.commonMistake}</p>
                                </div>
                            </div>
                        </div>

                        {/* Close button */}
                        <button
                            onClick={() => setSelectedExercise(null)}
                            className="w-full py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium text-gray-700 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </Modal>
            )}
        </>
    );
}
