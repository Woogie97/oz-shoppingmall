'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Button from '../ui/Button';
import { formatPrice, tokenUtils } from '../../lib/helpers';
import { useCartStore } from '../../store/cartStore';

// 장바구니 클라이언트 컴포넌트
const CartClient = () => {
  const router = useRouter();
  
  // 카트 스토어 사용
  const { 
    items: cartItems, 
    totalAmount, 
    loading, 
    error, 
    fetchCart, 
    updateQuantity, 
    removeItem,
    clearError
  } = useCartStore();

  // 컴포넌트 마운트 시 장바구니 데이터 로드
  useEffect(() => {
    if (!tokenUtils.exists()) {
      router.push('/login');
      return;
    }
    
    fetchCart();
  }, [fetchCart, router]);

  const handleUpdateQuantity = async (productId: number, newQuantity: number) => {
    if (!tokenUtils.exists()) return;
    
    if (newQuantity <= 0) {
      await handleRemoveItem(productId);
      return;
    }

    await updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = async (productId: number) => {
    if (!tokenUtils.exists()) return;

    if (confirm('이 상품을 장바구니에서 제거하시겠습니까?')) {
      await removeItem(productId);
    }
  };

  // 에러가 있으면 표시하고 자동으로 클리어
  useEffect(() => {
    if (error) {
      alert(error);
      clearError();
    }
  }, [error, clearError]);

  // 로딩 중일 때 표시할 UI
  if (loading) {
    return (
      <div className="bg-slate-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mt-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2">장바구니를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  // 장바구니가 비어있을 때 표시할 UI
  if (cartItems.length === 0) {
    return (
      <div className="bg-slate-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-10 text-center text-gray-800">장바구니</h1>
          <div className="text-center mt-10">
            <div className="bg-white rounded-lg shadow-sm p-8 max-w-md mx-auto">
              <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 11-4 0v-6m4 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">장바구니가 비어있습니다</h2>
              <p className="text-gray-600 mb-6">상품을 담아보세요!</p>
              <Button onClick={() => router.push('/products')} variant="primary">
                쇼핑 계속하기
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 메인 장바구니 페이지 렌더링
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-10 text-center text-gray-800">장바구니</h1>
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* 장바구니 항목들 */}
          <div className="divide-y divide-gray-200">
            {cartItems.map((item) => (
              <div key={item.cart_id} className="p-6 flex items-center space-x-4">
                {/* 상품 이미지 */}
                <div className="flex-shrink-0">
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                </div>
                
                {/* 상품 정보 */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-gray-600">{formatPrice(item.price)}</p>
                </div>
                
                {/* 수량 조절 버튼들 */}
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => handleUpdateQuantity(item.product_id, item.quantity - 1)}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                    disabled={loading}
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-medium">{item.quantity}</span>
                  <button 
                    onClick={() => handleUpdateQuantity(item.product_id, item.quantity + 1)}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                    disabled={loading || item.quantity >= item.stock}
                  >
                    +
                  </button>
                </div>
                
                {/* 소계 */}
                <div className="text-lg font-semibold text-gray-900 min-w-[100px] text-right">
                  {formatPrice(item.total_price)}
                </div>
                
                {/* 삭제 버튼 */}
                <button 
                  onClick={() => handleRemoveItem(item.product_id)}
                  className="text-red-500 hover:text-red-700 transition-colors p-2"
                  disabled={loading}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          
          {/* 총 금액 및 주문 버튼 */}
          <div className="bg-gray-50 px-6 py-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-semibold text-gray-900">총 주문금액</span>
              <span className="text-2xl font-bold text-blue-600">{formatPrice(totalAmount)}</span>
            </div>
            
            <div className="flex space-x-4">
              <Button 
                onClick={() => router.push('/products')} 
                variant="secondary" 
                className="flex-1"
              >
                쇼핑 계속하기
              </Button>
              <Button 
                onClick={() => router.push('/checkout')} 
                variant="primary" 
                className="flex-1"
              >
                주문하기
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartClient;
