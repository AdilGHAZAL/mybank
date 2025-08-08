import React from 'react';

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'tel';
  placeholder?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
  name?: string;
  min?: string | number;
  max?: string | number;
  step?: string | number;
}

const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  className = '',
  id,
  name,
  min,
  max,
  step,
}) => {
  const baseClasses = 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200';
  const disabledClasses = disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white';
  
  return (
    <input
      type={type}
      id={id}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      min={min}
      max={max}
      step={step}
      className={`${baseClasses} ${disabledClasses} ${className}`}
    />
  );
};

export default Input;
