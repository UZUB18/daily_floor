'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { getExerciseById } from '@/lib/exercises';
import { Button } from '@/components/ui/Button';

interface ExerciseModalProps {
    exerciseId: string | null;
    onClose: () => void;
}

/**
 * Exercise how-to modal with form instructions, mistakes, and variations
 */
export function ExerciseModal({ exerciseId, onClose }: ExerciseModalProps) {
    if (!exerciseId) return null;

    const exercise = getExerciseById(exerciseId);
    if (!exercise) return null;

    return (
        <Modal isOpen={!!exerciseId} onClose={onClose} title={exercise.name}>
            <div className="space-y-6">
                {/* Goal */}
                <div className="
          p-4
          bg-primary-50
          rounded-xl
          border border-primary-100
        ">
                    <p className="text-base font-medium text-primary-800">
                        {exercise.goal}
                    </p>
                </div>

                {/* Instructions - Show infographic if available, otherwise text */}
                <div>
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        How to do it
                    </h4>
                    {exercise.infographic ? (
                        <div className="rounded-xl overflow-hidden bg-gray-50">
                            <img
                                src={exercise.infographic}
                                alt={`${exercise.name} instructions`}
                                className="w-full h-auto"
                                loading="lazy"
                            />
                        </div>
                    ) : (
                        <ol className="space-y-3">
                            {exercise.instructions.map((instruction, i) => (
                                <li key={i} className="flex gap-3">
                                    <span className="
                      flex-shrink-0
                      w-6 h-6
                      bg-primary-100
                      text-primary-700
                      rounded-full
                      flex items-center justify-center
                      text-sm font-bold
                    ">
                                        {i + 1}
                                    </span>
                                    <span className="text-gray-700 leading-relaxed">
                                        {instruction}
                                    </span>
                                </li>
                            ))}
                        </ol>
                    )}
                </div>

                {/* Common Mistake */}
                <div className="
          p-4
          bg-red-50
          border border-red-100
          rounded-xl
        ">
                    <div className="flex gap-3">
                        <div className="flex-shrink-0">
                            <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div>
                            <h5 className="text-sm font-semibold text-red-800 mb-1">Common Mistake</h5>
                            <p className="text-sm text-red-700">{exercise.commonMistake}</p>
                        </div>
                    </div>
                </div>

                {/* Variations */}
                <div className="grid grid-cols-2 gap-3">
                    {exercise.easierVariant && (
                        <div className="p-3 bg-gray-50 rounded-xl">
                            <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                Easier
                            </h5>
                            <p className="text-sm text-gray-700">{exercise.easierVariant}</p>
                        </div>
                    )}
                    {exercise.harderVariant && (
                        <div className="p-3 bg-gray-50 rounded-xl">
                            <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                Harder
                            </h5>
                            <p className="text-sm text-gray-700">{exercise.harderVariant}</p>
                        </div>
                    )}
                </div>

                {/* Close button */}
                <Button variant="secondary" fullWidth onClick={onClose}>
                    Got it
                </Button>
            </div>
        </Modal>
    );
}
