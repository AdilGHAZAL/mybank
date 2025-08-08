import React from 'react';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
  name?: string;
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  required = false,
  disabled = false,
  className = '',
  id,
  name,
}) => {
  const baseClasses = 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200';
  const disabledClasses = disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white';
  
  return (
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      className={`${baseClasses} ${disabledClasses} ${className}`}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
