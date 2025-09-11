// 장바구니 관련 상태 관리 (Zustand 도입 예정)
// TODO: Zustand 라이브러리 설치 후 구현 예정

export interface CartItem {
  cart_id: number;
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
  stock: number;
  total_price: number;
}

export interface CartState {
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
  loading: boolean;
  error: string | null;
}

export interface CartActions {
  fetchCart: () => Promise<void>;
  addItem: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  clearCart: () => void;
  clearError: () => void;
}

// Zustand 도입 시 다음과 같은 구조로 구현 예정:
/*
import { create } from 'zustand';
import { cartApi } from '../lib/api';

interface CartStore extends CartState, CartActions {}

export const useCartStore = create<CartStore>((set, get) => ({
  // Initial state
  items: [],
  totalAmount: 0,
  totalItems: 0,
  loading: false,
  error: null,

  // Actions
  fetchCart: async () => {
    set({ loading: true, error: null });
    try {
      const { items, totalAmount } = await cartApi.getItems();
      const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
      set({ 
        items, 
        totalAmount, 
        totalItems, 
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch cart', 
        loading: false 
      });
    }
  },

  addItem: async (productId: number, quantity = 1) => {
    set({ loading: true, error: null });
    try {
      await cartApi.addItem(productId, quantity);
      await get().fetchCart(); // 장바구니 새로고침
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add item', 
        loading: false 
      });
    }
  },

  updateQuantity: async (productId: number, quantity: number) => {
    set({ loading: true, error: null });
    try {
      await cartApi.updateQuantity(productId, quantity);
      await get().fetchCart(); // 장바구니 새로고침
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update quantity', 
        loading: false 
      });
    }
  },

  removeItem: async (productId: number) => {
    set({ loading: true, error: null });
    try {
      await cartApi.removeItem(productId);
      await get().fetchCart(); // 장바구니 새로고침
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to remove item', 
        loading: false 
      });
    }
  },

  clearCart: () => {
    set({ 
      items: [], 
      totalAmount: 0, 
      totalItems: 0, 
      error: null 
    });
  },

  clearError: () => set({ error: null }),
}));
*/
