// 상품 카드 컴포넌트

import React from 'react';
import Image from 'next/image';
import Button from './Button';
import { formatPrice, translateCategory } from '../../lib/helpers';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock: number;
  category: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const isOutOfStock = product.stock === 0;

  return (
    <div className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden transition-transform transform hover:-translate-y-1 hover:shadow-lg">
      {/* 상품 이미지 */}
      <Image
        src={product.image_url}
        alt={product.name}
        width={300}
        height={224}
        className="w-full h-56 object-cover"
      />
      
      {/* 상품 정보 섹션 */}
      <div className="p-5">
        {/* 카테고리 태그 */}
        <div className="mb-2">
          <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
            {translateCategory(product.category)}
          </span>
        </div>
        
        {/* 상품명 */}
        <h2 className="text-xl font-semibold mb-2 text-gray-900">{product.name}</h2>
        
        {/* 상품 설명 */}
        <p className="text-gray-600 text-sm mb-3">{product.description}</p>
        
        {/* 가격 */}
        <p className="text-gray-900 mb-4 font-bold text-lg">{formatPrice(product.price)}</p>
        
        {/* 재고 정보 */}
        <p className="text-gray-500 text-sm mb-4">재고: {product.stock}개</p>
        
        {/* 장바구니 추가 버튼 */}
        <Button
          onClick={() => onAddToCart(product.id)}
          disabled={isOutOfStock}
          variant={isOutOfStock ? 'secondary' : 'primary'}
          fullWidth
        >
          {isOutOfStock ? '품절' : '장바구니에 담기'}
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
