'use client';

import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    shadow?: 'none' | 'sm' | 'md' | 'lg';
    onClick?: () => void;
    interactive?: boolean;
}

/**
 * Card component with subtle shadows and optional interactivity
 */
export function Card({
    children,
    className = '',
    padding = 'md',
    shadow = 'sm',
    onClick,
    interactive = false,
}: CardProps) {
    const paddingStyles = {
        none: '',
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
    };

    const shadowStyles = {
        none: '',
        sm: 'shadow-sm',
        md: 'shadow-md',
        lg: 'shadow-lg',
    };

    const interactiveStyles = interactive || onClick
        ? 'cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm'
        : '';

    const Component = onClick ? 'button' : 'div';

    return (
        <Component
            className={`
        bg-white
        rounded-2xl
        border border-gray-100
        ${paddingStyles[padding]}
        ${shadowStyles[shadow]}
        ${interactiveStyles}
        ${className}
      `}
            onClick={onClick}
            type={onClick ? 'button' : undefined}
        >
            {children}
        </Component>
    );
}
