// 공용 유틸리티 함수들

// 숫자를 한국 원화 형식으로 포맷
export const formatPrice = (price: number): string => {
  return `₩${price.toLocaleString()}`;
};

// 토큰 관련 유틸리티
export const tokenUtils = {
  get: () => localStorage.getItem('token'),
  set: (token: string) => localStorage.setItem('token', token),
  remove: () => localStorage.removeItem('token'),
  exists: () => !!localStorage.getItem('token'),
};

// 카테고리 한글 변환
export const translateCategory = (category: string): string => {
  const categoryMap: Record<string, string> = {
    clothing: '의류',
    shoes: '신발',
    accessories: '액세서리',
  };
  return categoryMap[category] || '기타';
};

// 에러 메시지 처리
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return '알 수 없는 오류가 발생했습니다.';
};

// 폼 검증 함수들
export const validation = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  password: (password: string): boolean => {
    return password.length >= 6;
  },
  
  required: (value: string): boolean => {
    return value.trim().length > 0;
  },
};

// 로딩 상태와 에러 상태를 위한 타입들
export interface LoadingState {
  loading: boolean;
  error: string | null;
}

export const createInitialLoadingState = (): LoadingState => ({
  loading: false,
  error: null,
});

// URL 쿼리 파라미터 유틸리티
export const queryParams = {
  get: (key: string): string | null => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get(key);
    }
    return null;
  },
  
  set: (key: string, value: string) => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set(key, value);
      window.history.pushState({}, '', url.toString());
    }
  },
};

// 디바운스 함수
export const debounce = <T extends (...args: unknown[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};
