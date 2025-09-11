import AuthCallbackClient from '../../../components/pages/AuthCallbackClient';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: '인증 처리 중 - 모두의 쇼핑몰',
  description: '로그인 인증을 처리하고 있습니다.',
};

// 인증 콜백 페이지 (서버 컴포넌트)
export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <p>인증 처리 중...</p>
      </div>
    }>
      <AuthCallbackClient />
    </Suspense>
  );
}