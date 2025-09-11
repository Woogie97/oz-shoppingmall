// 재사용 가능한 에러 표시 컴포넌트

import React from 'react';
import Button from './Button';

interface ErrorDisplayProps {
  title?: string;
  message: string;
  showRetry?: boolean;
  onRetry?: () => void;
  showLogin?: boolean;
  onLogin?: () => void;
  showHome?: boolean;
  onHome?: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  title = '오류가 발생했습니다',
  message,
  showRetry = false,
  onRetry,
  showLogin = false,
  onLogin,
  showHome = false,
  onHome,
}) => {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <div className="text-center max-w-md w-full">
        <div className="p-6 bg-white rounded-lg shadow-sm border">
          <svg 
            className="mx-auto h-12 w-12 text-red-500 mb-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" 
            />
          </svg>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600 mb-6 whitespace-pre-line">{message}</p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {showRetry && onRetry && (
              <Button onClick={onRetry} variant="secondary">
                다시 시도
              </Button>
            )}
            {showLogin && onLogin && (
              <Button onClick={onLogin} variant="primary">
                로그인하기
              </Button>
            )}
            {showHome && onHome && (
              <Button onClick={onHome} variant="secondary">
                홈으로 가기
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay; 