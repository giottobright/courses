import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  variant?: 'white' | 'colored';
  colorScheme?: 'purple' | 'yellow' | 'orange' | 'pink' | 'gray' | 'black';
  hover?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'white',
  colorScheme = 'purple',
  hover = true,
  className = '',
  onClick,
}) => {
  const colorClasses = {
    purple: 'bg-primary-purple',
    yellow: 'bg-accent-yellow',
    orange: 'bg-accent-orange',
    pink: 'bg-accent-pink',
    gray: 'bg-gray-200',
    black: 'bg-neutral-dark text-white',
  };

  const baseClass = variant === 'white' ? 'card' : 'card-colored';
  const colorClass = variant === 'colored' ? colorClasses[colorScheme] : '';
  const hoverClass = hover ? 'cursor-pointer' : '';

  return (
    <motion.div
      whileHover={hover ? { y: -8, scale: 1.02 } : {}}
      transition={{ duration: 0.3 }}
      className={`${baseClass} ${colorClass} ${hoverClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};
