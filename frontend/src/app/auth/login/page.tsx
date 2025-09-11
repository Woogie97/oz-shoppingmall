import Link from 'next/link';
import LoginForm from '../../../components/forms/LoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '로그인 - 모두의 쇼핑몰',
  description: '모두의 쇼핑몰에 로그인하여 더 많은 서비스를 이용해보세요.',
};

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold text-center text-gray-800">로그인</h1>
        
        <LoginForm />
        
        <p className="text-sm text-center text-gray-600">
          계정이 없으신가요?{' '}
          <Link href="/auth/signup" className="text-blue-600 hover:underline">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
} 