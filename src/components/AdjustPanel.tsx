'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import type { Feedback } from '@/lib/types';

interface AdjustPanelProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (feedback: Omit<Feedback, 'id' | 'date' | 'createdAt'>) => void;
}

/**
 * Icons for serious/professional aesthetic
 */
const ChevronDownIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
);

const ChevronUpIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
    </svg>
);

const CheckIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

const AlertIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
);

const MinusIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
    </svg>
);

const BatteryLowIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <rect x="2" y="7" width="18" height="10" rx="2" />
        <path d="M22 11v2" />
        <rect x="4" y="9" width="4" height="6" fill="currentColor" opacity="0.4" />
    </svg>
);

const BatteryMedIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <rect x="2" y="7" width="18" height="10" rx="2" />
        <path d="M22 11v2" />
        <rect x="4" y="9" width="8" height="6" fill="currentColor" opacity="0.6" />
    </svg>
);

const BatteryFullIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <rect x="2" y="7" width="18" height="10" rx="2" />
        <path d="M22 11v2" />
        <rect x="4" y="9" width="14" height="6" fill="currentColor" />
    </svg>
);

/**
 * Adjustment panel - serious/professional aesthetic
 */
export function AdjustPanel({ isOpen, onClose, onSubmit }: AdjustPanelProps) {
    const [difficulty, setDifficulty] = React.useState<'easier' | 'same' | 'harder'>('same');
    const [soreness, setSoreness] = React.useState<'sore' | 'normal' | undefined>(undefined);
    const [energy, setEnergy] = React.useState<'low' | 'ok' | 'high' | undefined>(undefined);

    const handleSubmit = () => {
        onSubmit({
            difficulty,
            soreness,
            energy,
        });
        onClose();
        // Reset for next time
        setDifficulty('same');
        setSoreness(undefined);
        setEnergy(undefined);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Adjust Intensity">
            <div className="space-y-6">
                {/* Difficulty */}
                <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">
                        Perceived difficulty
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                        {/* Reduce */}
                        <button
                            onClick={() => setDifficulty('easier')}
                            className={`
                p-3 rounded-xl text-center
                border-2 transition-all
                ${difficulty === 'easier'
                                    ? 'bg-gray-900 border-gray-900 text-white'
                                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                                }
              `}
                        >
                            <div className="flex justify-center mb-1.5">
                                <ChevronDownIcon />
                            </div>
                            <span className="text-sm font-medium">Reduce</span>
                        </button>

                        {/* Maintain */}
                        <button
                            onClick={() => setDifficulty('same')}
                            className={`
                p-3 rounded-xl text-center
                border-2 transition-all
                ${difficulty === 'same'
                                    ? 'bg-gray-900 border-gray-900 text-white'
                                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                                }
              `}
                        >
                            <div className="flex justify-center mb-1.5">
                                <MinusIcon />
                            </div>
                            <span className="text-sm font-medium">Maintain</span>
                        </button>

                        {/* Increase */}
                        <button
                            onClick={() => setDifficulty('harder')}
                            className={`
                p-3 rounded-xl text-center
                border-2 transition-all
                ${difficulty === 'harder'
                                    ? 'bg-gray-900 border-gray-900 text-white'
                                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                                }
              `}
                        >
                            <div className="flex justify-center mb-1.5">
                                <ChevronUpIcon />
                            </div>
                            <span className="text-sm font-medium">Increase</span>
                        </button>
                    </div>
                </div>

                {/* Soreness (only if harder or same) */}
                {difficulty !== 'easier' && (
                    <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">
                            Physical state <span className="font-normal text-gray-400">(optional)</span>
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => setSoreness(soreness === 'sore' ? undefined : 'sore')}
                                className={`
                  p-3 rounded-xl text-center
                  border-2 transition-all
                  ${soreness === 'sore'
                                        ? 'bg-gray-900 border-gray-900 text-white'
                                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                                    }
                `}
                            >
                                <div className="flex justify-center mb-1.5">
                                    <AlertIcon />
                                </div>
                                <span className="text-sm font-medium">Sore</span>
                            </button>

                            <button
                                onClick={() => setSoreness(soreness === 'normal' ? undefined : 'normal')}
                                className={`
                  p-3 rounded-xl text-center
                  border-2 transition-all
                  ${soreness === 'normal'
                                        ? 'bg-gray-900 border-gray-900 text-white'
                                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                                    }
                `}
                            >
                                <div className="flex justify-center mb-1.5">
                                    <CheckIcon />
                                </div>
                                <span className="text-sm font-medium">Recovered</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Energy */}
                <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">
                        Energy level <span className="font-normal text-gray-400">(optional)</span>
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                        <button
                            onClick={() => setEnergy(energy === 'low' ? undefined : 'low')}
                            className={`
                p-3 rounded-xl text-center
                border-2 transition-all
                ${energy === 'low'
                                    ? 'bg-gray-900 border-gray-900 text-white'
                                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                                }
              `}
                        >
                            <div className="flex justify-center mb-1.5">
                                <BatteryLowIcon />
                            </div>
                            <span className="text-sm font-medium">Low</span>
                        </button>

                        <button
                            onClick={() => setEnergy(energy === 'ok' ? undefined : 'ok')}
                            className={`
                p-3 rounded-xl text-center
                border-2 transition-all
                ${energy === 'ok'
                                    ? 'bg-gray-900 border-gray-900 text-white'
                                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                                }
              `}
                        >
                            <div className="flex justify-center mb-1.5">
                                <BatteryMedIcon />
                            </div>
                            <span className="text-sm font-medium">Moderate</span>
                        </button>

                        <button
                            onClick={() => setEnergy(energy === 'high' ? undefined : 'high')}
                            className={`
                p-3 rounded-xl text-center
                border-2 transition-all
                ${energy === 'high'
                                    ? 'bg-gray-900 border-gray-900 text-white'
                                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                                }
              `}
                        >
                            <div className="flex justify-center mb-1.5">
                                <BatteryFullIcon />
                            </div>
                            <span className="text-sm font-medium">High</span>
                        </button>
                    </div>
                </div>

                {/* Preview message */}
                <div className="p-3 bg-gray-50 rounded-xl text-sm text-gray-600 border border-gray-100">
                    {difficulty === 'easier' && (
                        <p>Next session will be <span className="font-semibold">+15% intensity</span></p>
                    )}
                    {difficulty === 'same' && (
                        <p>Next session intensity will remain <span className="font-semibold">unchanged</span></p>
                    )}
                    {difficulty === 'harder' && soreness === 'sore' && (
                        <p>Exercises will be <span className="font-semibold">substituted</span> and intensity reduced</p>
                    )}
                    {difficulty === 'harder' && soreness !== 'sore' && (
                        <p>Next session will be <span className="font-semibold">-15% intensity</span></p>
                    )}
                </div>

                {/* Submit button */}
                <Button
                    variant="primary"
                    fullWidth
                    onClick={handleSubmit}
                >
                    Confirm
                </Button>
            </div>
        </Modal>
    );
}
