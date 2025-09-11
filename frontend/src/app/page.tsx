import Link from 'next/link';

export default function Home() {
  return (
    <main className="bg-slate-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-extrabold mb-6">모두의 쇼핑몰</h1>
          <p className="text-xl mb-8">최고의 품질과 합리적인 가격으로 만나는 특별한 쇼핑 경험</p>
          <Link href="/products" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            지금 쇼핑하기
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">왜 모두의 쇼핑몰일까요?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-400">품질 보장</h3>
              <p className="text-gray-600">엄선된 고품질 상품만을 제공합니다</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-400">합리적 가격</h3>
              <p className="text-gray-600">최상의 가성비를 제공합니다</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-400">빠른 배송</h3>
              <p className="text-gray-600">신속하고 안전한 배송 서비스</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">빠른 메뉴</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <Link
          href="/products"
          className="group rounded-lg border border-transparent px-6 py-5 transition-colors bg-white shadow-subtle hover:border-gray-300 hover:bg-gray-100"
        >
          <h2 className={`mb-3 text-2xl font-semibold text-gray-900`}>
            상품 목록{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm text-gray-600`}>
            멋진 상품들을 둘러보세요.
          </p>
        </Link>
        <Link
          href="/auth/login"
          className="group rounded-lg border border-transparent px-6 py-5 transition-colors bg-white shadow-subtle hover:border-gray-300 hover:bg-gray-100"
        >
          <h2 className={`mb-3 text-2xl font-semibold text-gray-900`}>
            로그인{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm text-gray-600`}>
            계정에 접근하여 주문을 관리하세요.
          </p>
        </Link>
        <Link
          href="/my-page"
          className="group rounded-lg border border-transparent px-6 py-5 transition-colors bg-white shadow-subtle hover:border-gray-300 hover:bg-gray-100"
        >
          <h2 className={`mb-3 text-2xl font-semibold text-gray-900`}>
            마이페이지{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm text-gray-600`}>
            내 프로필을 확인하고 수정하세요.
          </p>
        </Link>
      </div>
        </div>
      </section>
    </main>
  );
}
