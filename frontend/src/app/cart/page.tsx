import CartClient from '../../components/pages/CartClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '장바구니 - 모두의 쇼핑몰',
  description: '선택하신 상품들을 확인하고 주문해보세요.',
};

export default function CartPage() {
  return <CartClient />;
} 