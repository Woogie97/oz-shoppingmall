'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../ui/Button';
import { authApi, User } from '../../lib/api';
import { tokenUtils, getErrorMessage } from '../../lib/helpers';

// 마이페이지 클라이언트 컴포넌트
const MyPageClient = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      if (!tokenUtils.exists()) {
        router.push('/auth/login');
        return;
      }

      try {
        const data = await authApi.getProfile();
        setUser(data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = () => {
    tokenUtils.remove();
    router.push('/auth/login');
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
        <Button 
            onClick={handleLogout}
            variant="danger"
            fullWidth
            size="lg"
            className="mt-6"
        >
            로그아웃
        </Button>
      </div>
    </div>
  );
};

export default MyPageClient;
