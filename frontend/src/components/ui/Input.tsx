// 재사용 가능한 Input 컴포넌트

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

const Input: React.FC<InputProps> = ({ 
  error, 
  label, 
  className = '', 
  ...props 
}) => {
  const baseClasses = 'w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors';
  const errorClasses = error 
    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
    : 'border-gray-300';
  
  return (
    <div>
      {label && (
        <label className="block mb-2 text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        className={`${baseClasses} ${errorClasses} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input; 