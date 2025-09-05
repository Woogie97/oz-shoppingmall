// Next.js의 클라이언트 컴포넌트임을 명시 (브라우저에서 실행)
'use client';

// React 훅들 - 상태 관리와 생명주기 관리를 위해 사용
import { useEffect, useState } from 'react';
// Next.js 라우터 - 페이지 이동을 위해 사용
import { useRouter } from 'next/navigation';

// 장바구니 항목의 타입 정의 - TypeScript 타입 안정성 확보
interface CartItem {
  cart_id: number;      // 장바구니 항목 고유 ID
  product_id: number;   // 상품 ID
  name: string;         // 상품명
  price: number;        // 단가
  quantity: number;     // 수량
  image_url: string;    // 상품 이미지 URL
  stock: number;        // 재고 수량
  total_price: number;  // 총 가격 (단가 × 수량)
}

// 장바구니 페이지 컴포넌트
const CartPage = () => {
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

  // 컴포넌트 마운트 시 장바구니 데이터 로드
  useEffect(() => {
    fetchCartItems();
  }, []);

  /**
   * 백엔드 API에서 장바구니 데이터를 가져오는 함수
   */
  const fetchCartItems = async () => {
    // 로컬 스토리지에서 JWT 토큰 가져오기 (사용자 인증용)
    const token = localStorage.getItem('token');
    if (!token) {
      // 토큰이 없으면 로그인 페이지로 리다이렉트
      router.push('/login');
      return;
    }

    try {
      // 백엔드 장바구니 API 호출
      const res = await fetch('http://localhost:3001/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`, // JWT 토큰을 Authorization 헤더에 포함
        },
      });

      // 인증 실패 시 로그인 페이지로 리다이렉트
      if (res.status === 401) {
        localStorage.removeItem('token'); // 만료된 토큰 제거
        router.push('/login');
        return;
      }

      // API 호출 실패 시 에러 처리
      if (!res.ok) {
        throw new Error('장바구니 정보를 가져올 수 없습니다.');
      }

      // 응답 데이터 파싱 및 상태 업데이트
      const data = await res.json();
      setCartItems(data.items);           // 장바구니 항목들 설정
      setTotalAmount(data.totalAmount);   // 총 금액 설정
    } catch (err) {
      // 에러 처리 - 타입 안전성을 위한 instanceof 체크
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      // API 호출 완료 후 로딩 상태 해제
      setLoading(false);
    }
  };

  /**
   * 장바구니 항목의 수량을 변경하는 함수
   * @param {number} productId - 상품 ID
   * @param {number} newQuantity - 새로운 수량
   */
  const updateQuantity = async (productId: number, newQuantity: number) => {
    const token = localStorage.getItem('token');
    if (!token) return; // 토큰이 없으면 함수 종료

    try {
      // 백엔드 장바구니 수량 업데이트 API 호출
      const res = await fetch(`http://localhost:3001/api/cart/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: newQuantity }), // 새로운 수량 전송
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || '수량 변경에 실패했습니다.');
      }

      // 수량 변경 성공 시 장바구니 데이터 새로고침
      fetchCartItems();
    } catch (err) {
      // 에러 발생 시 사용자에게 알림
      if (err instanceof Error) {
        alert(err.message);
      }
    }
  };

  /**
   * 장바구니에서 특정 상품을 제거하는 함수
   * @param {number} productId - 제거할 상품 ID
   */
  const removeItem = async (productId: number) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      // 백엔드 장바구니 항목 삭제 API 호출
      const res = await fetch(`http://localhost:3001/api/cart/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('상품 삭제에 실패했습니다.');
      }

      // 삭제 성공 시 장바구니 데이터 새로고침
      fetchCartItems();
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      }
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
            <button 
              onClick={() => router.push('/products')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              쇼핑 계속하기
            </button>
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
                    <img 
                      src={item.image_url} 
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    
                    {/* 상품 정보 */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-gray-600">₩{item.price.toLocaleString()}</p>
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
                      <p className="font-semibold">₩{item.total_price.toLocaleString()}</p>
                      <button 
                        onClick={() => removeItem(item.product_id)}
                        className="text-red-500 text-sm hover:underline"
                      >
                        삭제
                      </button>
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
                    <span>₩{totalAmount.toLocaleString()}</span>
                  </div>
                </div>
                {/* 주문하기 버튼 (현재는 UI만 구현) */}
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold">
                  주문하기
                </button>
                {/* 쇼핑 계속하기 버튼 */}
                <button 
                  onClick={() => router.push('/products')}
                  className="w-full mt-3 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200"
                >
                  쇼핑 계속하기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// 다른 파일에서 이 컴포넌트를 import할 수 있도록 내보내기
export default CartPage; 