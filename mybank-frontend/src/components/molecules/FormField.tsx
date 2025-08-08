import React from 'react';
import Label from '../atoms/Label';
import Input from '../atoms/Input';
import Select from '../atoms/Select';

interface SelectOption {
  value: string | number;
  label: string;
}

interface FormFieldProps {
  label: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'select';
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  options?: SelectOption[]; // For select type
  id?: string;
  name?: string;
  min?: string | number;
  max?: string | number;
  step?: string | number;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  options = [],
  id,
  name,
  min,
  max,
  step,
}) => {
  const fieldId = id || name || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="mb-4">
      <Label htmlFor={fieldId} required={required}>
        {label}
      </Label>
      
      {type === 'select' ? (
        <Select
          id={fieldId}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          options={options}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
        />
      ) : (
        <Input
          id={fieldId}
          name={name}
          type={type as any}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          className={error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
        />
      )}
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FormField;
