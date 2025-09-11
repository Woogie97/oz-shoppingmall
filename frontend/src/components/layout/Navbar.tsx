'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { tokenUtils } from '../../lib/helpers';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLoggedIn(tokenUtils.exists());
  }, []);

  const handleLogout = () => {
    tokenUtils.remove();
    setIsLoggedIn(false);
    router.push('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 로고 */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              모두의 쇼핑몰
            </Link>
          </div>

          {/* 중앙 메뉴 */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link href="/products" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                전체상품
              </Link>
              <Link href="/products?category=clothing" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                의류
              </Link>
              <Link href="/products?category=shoes" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                신발
              </Link>
              <Link href="/products?category=accessories" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                액세서리
              </Link>
            </div>
          </div>

          {/* 우측 메뉴 */}
          <div className="flex items-center space-x-4">
            {/* 검색 아이콘 */}
            <button className="text-gray-600 hover:text-gray-900">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* 장바구니 아이콘 */}
            <Link href="/cart" className="text-gray-600 hover:text-gray-900 relative">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 11-4 0v-6m4 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">0</span>
            </Link>

            {/* 로그인/로그아웃 */}
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <Link href="/my-page" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                  마이페이지
                </Link>
                <button 
                  onClick={handleLogout}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-200"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/auth/login" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                  로그인
                </Link>
                <Link href="/auth/signup" className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-blue-700">
                  회원가입
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 