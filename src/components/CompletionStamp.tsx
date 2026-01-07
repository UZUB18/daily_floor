'use client';

import React, { useEffect, useState, useCallback } from 'react';

interface CompletionStampProps {
    show: boolean;
    streakCount: number;
    onComplete?: () => void;
}

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
 * Completion stamp animation with confetti burst and share option
 */
export function CompletionStamp({ show, streakCount, onComplete }: CompletionStampProps) {
    const [visible, setVisible] = useState(false);
    const [particles, setParticles] = useState<Particle[]>([]);
    const [showActions, setShowActions] = useState(false);
    const [copied, setCopied] = useState(false);

    // App URL for sharing
    const appUrl = typeof window !== 'undefined'
        ? window.location.origin
        : 'https://daily-floor.vercel.app';

    const shareMessage = `I just completed my Daily Floor workout!\n\n🔥 Streak: ${streakCount} day${streakCount !== 1 ? 's' : ''}\n\nJoin me: ${appUrl}`;

    useEffect(() => {
        if (show) {
            setVisible(true);
            setCopied(false);

            // Generate confetti particles
            const colors = [
                'hsl(45, 100%, 50%)',
                'hsl(262, 92%, 26%)',
                'hsl(45, 100%, 65%)',
                'hsl(0, 0%, 100%)',
            ];

            const newParticles: Particle[] = [];
            for (let i = 0; i < 30; i++) {
                newParticles.push({
                    id: i,
                    x: 50 + (Math.random() - 0.5) * 60,
                    y: 50 + (Math.random() - 0.5) * 30,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    rotation: Math.random() * 360,
                    scale: 0.5 + Math.random() * 0.5,
                    delay: Math.random() * 200,
                });
            }
            setParticles(newParticles);

            // Show action buttons after stamp animation
            const actionsTimer = setTimeout(() => {
                setShowActions(true);
            }, 800);

            return () => clearTimeout(actionsTimer);
        }
    }, [show]);

    const handleShare = useCallback(async () => {
        // Try native share first (mobile)
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Daily Floor',
                    text: shareMessage,
                });
            } catch (err) {
                // User cancelled or error - that's fine
                console.log('Share cancelled');
            }
        } else {
            // Fallback: copy to clipboard
            try {
                await navigator.clipboard.writeText(shareMessage);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        }
    }, [shareMessage]);

    const handleDismiss = useCallback(() => {
        setVisible(false);
        setShowActions(false);
        onComplete?.();
    }, [onComplete]);

    if (!visible) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={handleDismiss}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

            {/* Confetti particles */}
            {particles.map(particle => (
                <div
                    key={particle.id}
                    className="absolute w-3 h-3 rounded-sm pointer-events-none"
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
                className="relative bg-white rounded-3xl shadow-2xl p-8 text-center mx-4 max-w-sm"
                style={{
                    animation: 'stamp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), var(--glow-accent)',
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* Check circle */}
                <div className="mx-auto mb-4 w-20 h-20 bg-accent-500 rounded-full flex items-center justify-center">
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
                    {streakCount} day streak 🔥
                </p>

                {/* Action buttons */}
                {showActions && (
                    <div className="mt-6 space-y-3 animate-fadeInUp">
                        {/* Share button */}
                        <button
                            onClick={handleShare}
                            className="
                                w-full py-3 px-4
                                bg-[#1F2937] hover:bg-[#374151]
                                text-white font-medium
                                rounded-2xl
                                flex items-center justify-center gap-2
                                transition-colors
                            "
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                            {copied ? 'Copied!' : 'Share Achievement'}
                        </button>

                        {/* Dismiss button */}
                        <button
                            onClick={handleDismiss}
                            className="
                                w-full py-3 px-4
                                text-gray-500 hover:text-gray-700
                                font-medium
                                transition-colors
                            "
                        >
                            Done
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
