'use client';

import React from 'react';

interface CheckboxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    className?: string;
}

/**
 * Animated checkbox with smooth check animation
 * Uses teal accent for completion state
 */
export function Checkbox({
    checked,
    onChange,
    label,
    size = 'md',
    disabled = false,
    className = '',
}: CheckboxProps) {
    const sizes = {
        sm: { box: 'w-5 h-5', icon: 'w-3 h-3' },
        md: { box: 'w-7 h-7', icon: 'w-4 h-4' },
        lg: { box: 'w-9 h-9', icon: 'w-5 h-5' },
    };

    return (
        <label
            className={`
        inline-flex items-center gap-3 cursor-pointer
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
        >
            <button
                type="button"
                role="checkbox"
                aria-checked={checked}
                disabled={disabled}
                onClick={() => !disabled && onChange(!checked)}
                className={`
          ${sizes[size].box}
          rounded-lg
          border-2
          flex items-center justify-center
          transition-all duration-200
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
          ${checked
                        ? 'bg-accent-500 border-accent-500 shadow-sm'
                        : 'bg-white border-gray-300 hover:border-gray-400'
                    }
        `}
                style={{
                    boxShadow: checked ? 'var(--glow-accent)' : 'none',
                }}
            >
                <svg
                    className={`
            ${sizes[size].icon}
            text-gray-900
            transition-all duration-200
            ${checked ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}
          `}
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
                            strokeDashoffset: checked ? 0 : 24,
                            transition: 'stroke-dashoffset 0.3s ease-out',
                        }}
                    />
                </svg>
            </button>
            {label && (
                <span className={`
          text-base font-medium
          transition-colors duration-200
          ${checked ? 'text-gray-400 line-through' : 'text-gray-900'}
        `}>
                    {label}
                </span>
            )}
        </label>
    );
}
