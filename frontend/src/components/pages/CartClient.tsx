'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Button from '../ui/Button';
import { cartApi, CartItem } from '../../lib/api';
import { formatPrice, getErrorMessage, tokenUtils } from '../../lib/helpers';

// 장바구니 클라이언트 컴포넌트
const CartClient = () => {
  // 상태 관리: 장바구니 항목들
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  // 상태 관리: 전체 주문 금액
  const [totalAmount, setTotalAmount] = useState(0);
  // 상태 관리: 로딩 상태 (API 호출 중인지 표시)
  const [loading, setLoading] = useState(true);
  // 상태 관리: 에러 메시지
  const [error, setError] = useState<string | null>(null);
  // Next.js 라우터 인스턴스
  const router = useRouter();

  // 장바구니 데이터 로드 함수 - 재사용 가능하도록 추출
  const fetchCartItems = useCallback(async () => {
    if (!tokenUtils.exists()) {
      router.push('/auth/login');
      return;
    }

    try {
      const data = await cartApi.getItems();
      setCartItems(data.items);
      setTotalAmount(data.totalAmount);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [router]);

  // 컴포넌트 마운트 시 장바구니 데이터 로드
  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  const updateQuantity = async (productId: number, newQuantity: number) => {
    if (!tokenUtils.exists()) return;

    try {
      await cartApi.updateQuantity(productId, newQuantity);
      fetchCartItems();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const removeItem = async (productId: number) => {
    if (!tokenUtils.exists()) return;

    try {
      await cartApi.removeItem(productId);
      fetchCartItems();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  // 로딩 중일 때 표시할 UI
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <p>로딩 중...</p>
      </div>
    );
  }

  // 에러 발생 시 표시할 UI
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // 메인 장바구니 페이지 렌더링
  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">장바구니</h1>
        
        {/* 장바구니가 비어있을 때 표시할 UI */}
        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg mb-4">장바구니가 비어있습니다.</p>
            <Button 
              onClick={() => router.push('/products')}
              variant="primary"
            >
              쇼핑 계속하기
            </Button>
          </div>
        ) : (
          // 장바구니에 상품이 있을 때의 레이아웃 (2열: 상품목록 + 주문요약)
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 왼쪽: 장바구니 상품 목록 (2/3 너비) */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                // 각 장바구니 항목을 카드 형태로 표시
                <div key={item.cart_id} className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center space-x-4">
                    {/* 상품 이미지 */}
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="object-cover rounded-lg"
                    />
                    
                    {/* 상품 정보 */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-gray-600">{formatPrice(item.price)}</p>
                    </div>
                    
                    {/* 수량 조절 버튼 */}
                    <div className="flex items-center space-x-2">
                      {/* 수량 감소 버튼 (최소 1개까지만) */}
                      <button 
                        onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
                      >
                        -
                      </button>
                      {/* 현재 수량 표시 */}
                      <span className="w-12 text-center">{item.quantity}</span>
                      {/* 수량 증가 버튼 (재고 한도까지만) */}
                      <button 
                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
                      >
                        +
                      </button>
                    </div>
                    
                    {/* 가격 정보 및 삭제 버튼 */}
                    <div className="text-right">
                      <p className="font-semibold">{formatPrice(item.total_price)}</p>
                      <Button
                        onClick={() => removeItem(item.product_id)}
                        variant="danger"
                        size="sm"
                      >
                        삭제
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 오른쪽: 주문 요약 (1/3 너비, 스크롤 시 고정) */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 shadow-sm sticky top-4">
                <h2 className="text-xl font-semibold mb-4">주문 요약</h2>
                <div className="space-y-2 mb-4">
                  {/* 상품 수량 표시 */}
                  <div className="flex justify-between">
                    <span>상품 수량</span>
                    <span>{cartItems.length}개</span>
                  </div>
                  {/* 총 금액 표시 */}
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>총 금액</span>
                    <span>{formatPrice(totalAmount)}</span>
                  </div>
                </div>
                {/* 주문하기 버튼 (현재는 UI만 구현) */}
                <Button variant="primary" fullWidth size="lg">
                  주문하기
                </Button>
                {/* 쇼핑 계속하기 버튼 */}
                <Button
                  onClick={() => router.push('/products')}
                  variant="secondary"
                  fullWidth
                  size="lg"
                  className="mt-3"
                >
                  쇼핑 계속하기
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartClient;
