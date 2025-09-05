// Next.js의 클라이언트 컴포넌트임을 명시
'use client';

// React 훅 - 상태 관리와 사이드 이펙트 처리
import { useEffect, useState } from 'react';
// Next.js Link 컴포넌트 - 클라이언트 사이드 네비게이션
import Link from 'next/link';
// Next.js 라우터 - 프로그래밍 방식의 페이지 이동
import { useRouter } from 'next/navigation';

// 상품 정보의 타입 정의 - TypeScript 타입 안정성
interface Product {
  id: number;           // 상품 고유 ID
  name: string;         // 상품명
  description: string;  // 상품 설명
  price: number;        // 가격
  image_url: string;    // 상품 이미지 URL
  stock: number;        // 재고 수량
  category: string;     // 카테고리 (clothing, shoes, accessories 등)
}

// 상품 목록 페이지 컴포넌트
const ProductsPage = () => {
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
        // 백엔드 상품 목록 API 호출 (인증 불필요한 퍼블릭 API)
        const res = await fetch('http://localhost:3001/api/products');
        if (!res.ok) {
          throw new Error('상품 정보를 가져올 수 없습니다.');
        }
        
        // 응답 데이터 파싱 및 상태 업데이트
        const data = await res.json();
        setProducts(data.products); // 상품 목록 설정
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

    fetchProducts();
  }, []); // 빈 의존성 배열 - 컴포넌트 마운트 시 한 번만 실행

  /**
   * 장바구니에 상품을 추가하는 함수
   * @param {number} productId - 추가할 상품의 ID
   */
  const addToCart = async (productId: number) => {
    // 로컬 스토리지에서 JWT 토큰 확인 (로그인 여부 체크)
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      // 백엔드 장바구니 추가 API 호출
      const res = await fetch('http://localhost:3001/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // JWT 토큰 인증
        },
        body: JSON.stringify({ 
          productId, 
          quantity: 1  // 기본 수량 1개로 설정
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || '장바구니 추가에 실패했습니다.');
      }

      // 성공 시 사용자에게 알림
      alert('장바구니에 추가되었습니다!');
    } catch (err) {
      // 에러 발생 시 사용자에게 알림
      if (err instanceof Error) {
        alert(err.message);
      }
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
        
        {/* 상품 그리드 레이아웃 - 반응형 디자인 (1~4열) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            // 각 상품을 카드 형태로 표시
            <div key={product.id} className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden transition-transform transform hover:-translate-y-1 hover:shadow-lg">
              {/* 상품 이미지 */}
              <img src={product.image_url} alt={product.name} className="w-full h-56 object-cover" />
              
              {/* 상품 정보 섹션 */}
              <div className="p-5">
                {/* 카테고리 태그 */}
                <div className="mb-2">
                  <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                    {/* 카테고리 영어 → 한글 변환 */}
                    {product.category === 'clothing' ? '의류' : 
                     product.category === 'shoes' ? '신발' : 
                     product.category === 'accessories' ? '액세서리' : '기타'}
                  </span>
                </div>
                
                {/* 상품명 */}
                <h2 className="text-xl font-semibold mb-2 text-gray-900">{product.name}</h2>
                
                {/* 상품 설명 */}
                <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                
                {/* 가격 (한국 원화 형식으로 표시) */}
                <p className="text-gray-900 mb-4 font-bold text-lg">₩{product.price.toLocaleString()}</p>
                
                {/* 재고 정보 */}
                <p className="text-gray-500 text-sm mb-4">재고: {product.stock}개</p>
                
                {/* 장바구니 추가 버튼 */}
                <button 
                  onClick={() => addToCart(product.id)}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  disabled={product.stock === 0} // 재고가 0이면 버튼 비활성화
                >
                  {/* 재고 상태에 따른 버튼 텍스트 변경 */}
                  {product.stock === 0 ? '품절' : '장바구니에 담기'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 다른 파일에서 이 컴포넌트를 import할 수 있도록 내보내기
export default ProductsPage; 