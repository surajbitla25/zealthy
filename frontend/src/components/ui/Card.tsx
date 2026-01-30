import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  title,
  hover = false 
}) => {
  return (
    <div className={`
      bg-white rounded-2xl shadow-soft p-8
      ${hover ? 'hover-lift cursor-pointer' : ''}
      ${className}
    `}>
      {title && (
        <h3 className="text-2xl font-bold mb-6 text-text-primary border-b-2 border-mint-50 pb-3">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};
