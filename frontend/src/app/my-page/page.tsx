import MyPageClient from '../../components/pages/MyPageClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '마이페이지 - 모두의 쇼핑몰',
  description: '회원 정보를 확인하고 관리하세요.',
};

export default function MyPage() {
  return <MyPageClient />;
} 