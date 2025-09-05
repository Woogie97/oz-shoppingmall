'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const AuthCallbackPage = () => {
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
      router.push('/login?error=authentication_failed');
    }
    // The dependency array is empty because we want this to run only once when the component mounts.
    // The router and searchParams objects are stable.
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Authenticating, please wait...</p>
    </div>
  );
};

export default AuthCallbackPage; 