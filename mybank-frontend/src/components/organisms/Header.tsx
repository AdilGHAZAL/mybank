import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../atoms/Button';
import { getCurrentUser, logout, isAuthenticated, User } from '../../services/api';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const authenticated = isAuthenticated();
        setIsUserAuthenticated(authenticated);
        if (authenticated) {
          const user = getCurrentUser();
          setCurrentUser(user);
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('Error checking auth status in Header:', error);
        setIsUserAuthenticated(false);
        setCurrentUser(null);
      }
    };

    checkAuthStatus();
    // Listen for storage changes (login/logout in other tabs)
    window.addEventListener('storage', checkAuthStatus);
    return () => window.removeEventListener('storage', checkAuthStatus);
  }, []);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: '📊' },
    { name: 'Operations', href: '/operations', icon: '💳' },
    { name: 'Categories', href: '/categories', icon: '📁' },
    { name: 'Analytics', href: '/analytics', icon: '📈' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">💰</span>
              </div>
              <span className="text-xl font-bold text-gray-900">MyBank</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive(item.href)
                    ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isUserAuthenticated ? (
              <>
                <Link to="/create-operation">
                  <Button variant="primary" size="sm">
                    + Add Operation
                  </Button>
                </Link>
                <div className="flex items-center space-x-3">
                  <div className="text-sm text-gray-700">
                    Welcome, <span className="font-medium">{currentUser?.firstName}</span>
                  </div>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => {
                      try {
                        logout();
                        setCurrentUser(null);
                        setIsUserAuthenticated(false);
                        navigate('/login');
                      } catch (error) {
                        console.error('Error during logout:', error);
                        // Force navigation to login even if logout fails
                        navigate('/login');
                      }
                    }}
                  >
                    Logout
                  </Button>
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-700">
                      {currentUser?.firstName?.charAt(0) || '👤'}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/register">
                  <Button variant="secondary" size="sm">
                    Sign Up
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="primary" size="sm">
                    Login
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200">
        <nav className="px-4 py-2 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                isActive(item.href)
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
          {/* Mobile Login Link */}
          <Link
            to="/login"
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
              isActive('/login')
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <span>🔐</span>
            <span>Login</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
