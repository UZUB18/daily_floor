'use client';

import React, { useEffect, useState } from 'react';

interface CompletionStampProps {
    show: boolean;
    streakCount: number;
    onComplete?: () => void;
}

/**
 * Confetti particle
 */
interface Particle {
    id: number;
    x: number;
    y: number;
    color: string;
    rotation: number;
    scale: number;
    delay: number;
}

/**
 * Completion stamp animation with confetti burst
 */
export function CompletionStamp({ show, streakCount, onComplete }: CompletionStampProps) {
    const [visible, setVisible] = useState(false);
    const [particles, setParticles] = useState<Particle[]>([]);

    useEffect(() => {
        if (show) {
            setVisible(true);

            // Generate confetti particles
            const colors = [
                'hsl(45, 100%, 50%)', // yellow accent
                'hsl(262, 92%, 26%)', // primary
                'hsl(45, 100%, 65%)', // light gold
                'hsl(0, 0%, 100%)',   // white
            ];

            const newParticles: Particle[] = [];
            for (let i = 0; i < 30; i++) {
                newParticles.push({
                    id: i,
                    x: 50 + (Math.random() - 0.5) * 60, // center-ish
                    y: 50 + (Math.random() - 0.5) * 30,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    rotation: Math.random() * 360,
                    scale: 0.5 + Math.random() * 0.5,
                    delay: Math.random() * 200,
                });
            }
            setParticles(newParticles);

            // Auto-dismiss after animation
            const timer = setTimeout(() => {
                setVisible(false);
                onComplete?.();
            }, 2500);

            return () => clearTimeout(timer);
        }
    }, [show, onComplete]);

    if (!visible) return null;

    return (
        <div className="
      fixed inset-0 z-50
      flex items-center justify-center
      pointer-events-none
    ">
            {/* Backdrop pulse */}
            <div
                className="absolute inset-0 bg-accent-500/10"
                style={{
                    animation: 'pulse-ring 0.8s ease-out forwards',
                }}
            />

            {/* Confetti particles */}
            {particles.map(particle => (
                <div
                    key={particle.id}
                    className="absolute w-3 h-3 rounded-sm"
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        backgroundColor: particle.color,
                        transform: `rotate(${particle.rotation}deg) scale(${particle.scale})`,
                        animation: `confetti-fall 1.2s ease-out ${particle.delay}ms forwards`,
                    }}
                />
            ))}

            {/* Main stamp */}
            <div
                className="
          relative
          bg-white
          rounded-3xl
          shadow-2xl
          p-8
          text-center
        "
                style={{
                    animation: 'stamp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), var(--glow-accent)',
                }}
            >
                {/* Check circle */}
                <div className="
          mx-auto mb-4
          w-20 h-20
          bg-accent-500
          rounded-full
          flex items-center justify-center
        ">
                    <svg
                        className="w-10 h-10 text-gray-900"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                            style={{
                                strokeDasharray: 24,
                                strokeDashoffset: 24,
                                animation: 'checkmark 0.4s ease-out 0.3s forwards',
                            }}
                        />
                    </svg>
                </div>

                {/* Text */}
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    Floor Complete!
                </h2>
                <p className="text-lg font-semibold text-accent-600">
                    Streak: {streakCount} day{streakCount !== 1 ? 's' : ''} 🔥
                </p>

                {/* Subtitle */}
                <p className="mt-3 text-sm text-gray-500">
                    Minimum to keep momentum
                </p>
            </div>
        </div>
    );
}
