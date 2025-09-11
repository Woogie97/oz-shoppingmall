import ProductsClient from '../../components/pages/ProductsClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '전체 상품 - 모두의 쇼핑몰',
  description: '다양한 상품을 만나보세요. 의류, 신발, 액세서리 등 모든 카테고리의 상품을 한 곳에서!',
};

export default function ProductsPage() {
  return <ProductsClient />;
} 