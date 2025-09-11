import Link from 'next/link';
import SignupForm from '../../components/forms/SignupForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '회원가입 - 모두의 쇼핑몰',
  description: '모두의 쇼핑몰에 가입하고 다양한 혜택을 누려보세요.',
};

export default function SignupPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold text-center text-gray-800">회원가입</h1>
        
        <SignupForm />
        
        <p className="text-sm text-center text-gray-600">
          이미 계정이 있으신가요?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
} 