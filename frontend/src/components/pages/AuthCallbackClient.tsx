'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// 인증 콜백 클라이언트 컴포넌트
const AuthCallbackClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      localStorage.setItem('token', token);
      // Redirect to a protected route or homepage
      router.push('/');
    } else {
      // Handle error: No token found
      // Redirect to login page with an error message
      router.push('/auth/login?error=authentication_failed');
    }
    // The dependency array is empty because we want this to run only once when the component mounts.
    // The router and searchParams objects are stable.
  }, [router, searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>인증 처리 중...</p>
    </div>
  );
};

export default AuthCallbackClient;
