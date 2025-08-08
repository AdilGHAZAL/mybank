import React from 'react';
import Header from '../organisms/Header';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className="mb-8">
            {title && (
              <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            )}
            {subtitle && (
              <p className="mt-2 text-lg text-gray-600">{subtitle}</p>
            )}
          </div>
        )}
        
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
