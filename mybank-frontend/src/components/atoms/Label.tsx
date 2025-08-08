import React from 'react';

interface LabelProps {
  children: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
  className?: string;
}

const Label: React.FC<LabelProps> = ({
  children,
  htmlFor,
  required = false,
  className = '',
}) => {
  const baseClasses = 'block text-sm font-medium text-gray-700 mb-1';
  
  return (
    <label
      htmlFor={htmlFor}
      className={`${baseClasses} ${className}`}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
};

export default Label;
