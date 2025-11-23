import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '',
  ...props 
}) => {
  const baseStyle = "font-bold border-2 border-black px-6 py-3 text-sm tracking-wider uppercase transition-all active:translate-y-1 active:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-[#1E3A8A] text-white hover:bg-[#172554]", // Deep Blue
    secondary: "bg-white text-black hover:bg-gray-50",
    danger: "bg-[#DC2626] text-white hover:bg-[#991B1B]", // Signal Red
    success: "bg-[#16A34A] text-white hover:bg-[#15803d]" // Dollar Green
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};