// API 클라이언트 설정 및 공통 함수들

// 타입 정의
export interface User {
  id: number;
  name: string;
  email: string;
  provider: string;
  phone?: string;
  address?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image_url: string;
  category: string;
  stock: number;
}

export interface CartItem {
  cart_id: number;      // 장바구니 항목 고유 ID
  product_id: number;   // 상품 ID
  name: string;         // 상품명
  price: number;        // 단가
  quantity: number;     // 수량
  image_url: string;    // 상품 이미지 URL
  stock: number;        // 재고 수량
  total_price: number;  // 총 가격 (단가 × 수량)
}

export interface AuthResponse {
  token: string;
  user?: User;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}

const API_BASE_URL = 'http://localhost:3001/api';

// API 요청을 위한 기본 설정
export const apiConfig = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
};

// 인증 토큰을 포함한 헤더 생성
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    ...apiConfig.headers,
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// API 요청 래퍼 함수
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config: RequestInit = {
    headers: getAuthHeaders(),
    ...options,
  };

  try {
    const response = await fetch(url, config);

    // 인증 실패 시 토큰만 제거하고 페이지 리디렉션은 하지 않음
    if (response.status === 401) {
      localStorage.removeItem('token');
      throw new Error('로그인이 필요합니다. 다시 로그인해주세요.');
    }

    if (response.status === 404) {
      throw new Error('요청한 리소스를 찾을 수 없습니다.');
    }

    if (response.status === 403) {
      throw new Error('접근 권한이 없습니다.');
    }

    if (response.status === 500) {
      throw new Error('서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }

    if (!response.ok) {
      let errorMessage = `요청 실패 (${response.status})`;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // JSON 파싱 실패 시 기본 메시지 사용
        errorMessage = `서버 오류가 발생했습니다. (${response.status})`;
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error) {
    // 네트워크 오류 등의 경우
    if (error instanceof TypeError) {
      throw new Error('네트워크 연결을 확인해주세요.');
    }
    
    // 이미 Error 객체인 경우 그대로 throw
    throw error;
  }
};

// GET 요청
export const apiGet = <T>(endpoint: string): Promise<T> => {
  return apiRequest<T>(endpoint, { method: 'GET' });
};

// POST 요청
export const apiPost = <T>(endpoint: string, data?: unknown): Promise<T> => {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
};

// PUT 요청
export const apiPut = <T>(endpoint: string, data?: unknown): Promise<T> => {
  return apiRequest<T>(endpoint, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
};

// DELETE 요청
export const apiDelete = <T>(endpoint: string): Promise<T> => {
  return apiRequest<T>(endpoint, { method: 'DELETE' });
};

// 특정 API 엔드포인트들
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    apiPost<AuthResponse>('/auth/login', credentials),
  
  signup: (userData: { name: string; email: string; password: string }) =>
    apiPost<ApiResponse<{ message: string }>>('/auth/signup', userData),
  
  getProfile: () => apiGet<User>('/users/me'),
  
  updateProfile: (userData: UpdateUserRequest) =>
    apiPut<ApiResponse<User>>('/users/me', userData),
};

export const productApi = {
  getAll: () => apiGet<{ products: Product[] }>('/products'),
  getById: (id: number) => apiGet<Product>(`/products/${id}`),
};

export const cartApi = {
  getItems: () => apiGet<{ items: CartItem[]; totalAmount: number }>('/cart'),
  addItem: (productId: number, quantity: number = 1) =>
    apiPost<ApiResponse<CartItem>>('/cart', { productId, quantity }),
  updateQuantity: (productId: number, quantity: number) =>
    apiPut<ApiResponse<CartItem>>(`/cart/${productId}`, { quantity }),
  removeItem: (productId: number) => apiDelete<ApiResponse<{ message: string }>>(`/cart/${productId}`),
};
