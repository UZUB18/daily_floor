'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'success';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    loading?: boolean;
    children: React.ReactNode;
}

/**
 * Button component with multiple variants
 * 
 * Variants:
 * - primary: Deep violet, main CTAs
 * - secondary: Outlined, secondary actions
 * - ghost: Minimal, tertiary actions
 * - success: Teal accent for completion states
 */
export function Button({
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    loading = false,
    disabled,
    className = '',
    children,
    ...props
}: ButtonProps) {
    const baseStyles = `
    inline-flex items-center justify-center
    font-semibold
    rounded-xl
    transition-all
    duration-200
    cursor-pointer
    select-none
    disabled:opacity-50 disabled:cursor-not-allowed
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
  `;

    const variants = {
        primary: `
      bg-primary-700 text-white
      hover:bg-primary-800
      active:bg-primary-900
      focus-visible:ring-primary-500
      shadow-md hover:shadow-lg
    `,
        secondary: `
      bg-transparent text-primary-700
      border-2 border-primary-200
      hover:bg-primary-50 hover:border-primary-300
      active:bg-primary-100
      focus-visible:ring-primary-500
    `,
        ghost: `
      bg-transparent text-gray-600
      hover:bg-gray-100 hover:text-gray-900
      active:bg-gray-200
      focus-visible:ring-gray-400
    `,
        success: `
      bg-accent-500 text-white
      hover:bg-accent-600
      active:bg-accent-600
      focus-visible:ring-accent-400
      shadow-md hover:shadow-lg
    `,
    };

    const sizes = {
        sm: 'text-sm px-4 py-2 gap-1.5',
        md: 'text-base px-5 py-3 gap-2',
        lg: 'text-lg px-6 py-4 gap-2.5',
    };

    return (
        <button
            className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
            disabled={disabled || loading}
            {...props}
        >
            {loading && (
                <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
            )}
            {children}
        </button>
    );
}
