'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  name: string;
  email: string;
  provider: string;
}

const MyPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const res = await fetch('http://localhost:3001/api/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          localStorage.removeItem('token');
          router.push('/login');
          return;
        }

        if (!res.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await res.json();
        setUser(data);
      } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-slate-50"><p>로딩 중...</p></div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen bg-slate-50"><p className="text-red-500">오류: {error}</p></div>;
  }

  if (!user) {
    // Redirecting, so no need to render anything here.
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold text-center text-gray-800">마이페이지</h1>
        <div className="space-y-4 pt-4">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-600">이름:</span> 
            <span className="text-gray-800">{user.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-600">이메일:</span> 
            <span className="text-gray-800">{user.email || '제공되지 않음'}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-600">로그인 방식:</span> 
            <span className="text-gray-800 capitalize">{user.provider}</span>
          </div>
        </div>
        <button 
            onClick={handleLogout}
            className="w-full mt-6 py-2.5 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
        >
            로그아웃
        </button>
      </div>
    </div>
  );
};

export default MyPage; 