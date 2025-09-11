'use client';

import { useEffect, useState } from 'react';
import ProductCard from '../ui/ProductCard';
import { productApi, cartApi, Product } from '../../lib/api';
import { getErrorMessage, tokenUtils } from '../../lib/helpers';

// 상품 목록 클라이언트 컴포넌트
const ProductsClient = () => {
  // 상태 관리: 상품 목록 배열
  const [products, setProducts] = useState<Product[]>([]);
  // 상태 관리: 로딩 상태 (API 호출 중인지 표시)
  const [loading, setLoading] = useState(true);
  // 상태 관리: 에러 메시지
  const [error, setError] = useState<string | null>(null);

  // 컴포넌트 마운트 시 상품 데이터 로드
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productApi.getAll();
        setProducts(data.products);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = async (productId: number) => {
    if (!tokenUtils.exists()) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      await cartApi.addItem(productId, 1);
      alert('장바구니에 추가되었습니다!');
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  // 로딩 중일 때 표시할 UI
  if (loading) {
    return <div className="text-center mt-10">로딩 중...</div>;
  }

  // 에러 발생 시 표시할 UI
  if (error) {
    return <div className="text-center mt-10 text-red-500">오류: {error}</div>;
  }

  // 메인 상품 목록 페이지 렌더링
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-10 text-center text-gray-800">전체 상품</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={addToCart}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsClient;
