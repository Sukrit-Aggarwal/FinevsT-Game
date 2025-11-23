import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  accentColor?: string;
}

export const Card: React.FC<CardProps> = ({ children, title, className = '', accentColor }) => {
  return (
    <div className={`bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 ${className}`}>
      {title && (
        <div className="flex items-center mb-4 border-b-2 border-black pb-2">
          {accentColor && <div className={`w-3 h-3 ${accentColor} mr-2 border border-black`} />}
          <h3 className="text-lg font-black uppercase tracking-tight">{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
};