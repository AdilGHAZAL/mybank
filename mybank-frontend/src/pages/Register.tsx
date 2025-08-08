import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register, RegisterRequest } from '../services/api';
import Button from '../components/atoms/Button';
import FormField from '../components/molecules/FormField';
import Card from '../components/molecules/Card';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterRequest>({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof RegisterRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await register(formData);
      navigate('/'); // Redirect to dashboard after successful registration
    } catch (error: any) {
      console.error('Registration failed:', error);
      
      if (error.response?.data?.error) {
        setErrors({ general: error.response.data.error });
      } else if (error.response?.data?.errors) {
        // Handle validation errors from backend
        const backendErrors: Record<string, string> = {};
        error.response.data.errors.forEach((err: string) => {
          backendErrors.general = err;
        });
        setErrors(backendErrors);
      } else {
        setErrors({ general: 'Registration failed. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">MyBank</h1>
          <h2 className="mt-6 text-2xl font-semibold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in here
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card padding="lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="text-sm text-red-600">{errors.general}</div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <FormField
                label="First Name"
                type="text"
                value={formData.firstName}
                onChange={(value) => handleInputChange('firstName', value)}
                error={errors.firstName}
                required
                placeholder="Enter your first name"
              />

              <FormField
                label="Last Name"
                type="text"
                value={formData.lastName}
                onChange={(value) => handleInputChange('lastName', value)}
                error={errors.lastName}
                required
                placeholder="Enter your last name"
              />
            </div>

            <FormField
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(value) => handleInputChange('email', value)}
              error={errors.email}
              required
              placeholder="Enter your email address"
            />

            <FormField
              label="Password"
              type="password"
              value={formData.password}
              onChange={(value) => handleInputChange('password', value)}
              error={errors.password}
              required
              placeholder="Create a password (min. 6 characters)"
            />

            <FormField
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(value) => {
                setConfirmPassword(value);
                if (errors.confirmPassword) {
                  setErrors(prev => ({ ...prev, confirmPassword: '' }));
                }
              }}
              error={errors.confirmPassword}
              required
              placeholder="Confirm your password"
            />

            <div className="pt-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  By creating an account, you agree to our terms of service
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Register;
