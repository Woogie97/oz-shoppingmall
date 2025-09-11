// 로그인 폼 컴포넌트

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../ui/Button';
import { authApi } from '../../lib/api';
import { tokenUtils, validation, getErrorMessage } from '../../lib/helpers';

interface LoginFormProps {
  onSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // 클라이언트 측 검증
    if (!validation.email(email)) {
      setError('올바른 이메일을 입력해주세요.');
      setLoading(false);
      return;
    }

    if (!validation.required(password)) {
      setError('비밀번호를 입력해주세요.');
      setLoading(false);
      return;
    }

    try {
      const { token } = await authApi.login({ email, password });
      tokenUtils.set(token);
      
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/');
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3001/api/auth/google';
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleLogin} className="space-y-6">
        {error && (
          <div className="p-3 text-red-500 bg-red-50 border border-red-200 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            이메일
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-400"
            placeholder="이메일을 입력해주세요"
            required
          />
        </div>
        
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            비밀번호
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-400"
            placeholder="비밀번호를 입력해주세요"
            required
          />
        </div>
        
        <Button
          type="submit"
          fullWidth
          disabled={loading}
        >
          {loading ? '로그인 중...' : '로그인'}
        </Button>
      </form>
      
      <div className="relative mt-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">또는</span>
        </div>
      </div>
      
      <Button
        onClick={handleGoogleLogin}
        variant="outline"
        fullWidth
        className="mt-4"
      >
        구글로 로그인
      </Button>
    </div>
  );
};

export default LoginForm;
