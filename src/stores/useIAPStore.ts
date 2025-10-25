import {create} from 'zustand';
import {IAPProduct} from '../types';

interface IAPState {
  products: IAPProduct[];
  isPro: boolean;
  isLoading: boolean;
  error: string | null;

  loadProducts: () => Promise<void>;
  purchaseProduct: (productId: string) => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
  setProStatus: (isPro: boolean) => void;
}

const MOCK_PRODUCTS: IAPProduct[] = [
  {
    productId: 'com.mindmaps.pro.monthly',
    price: '$2.99',
    currency: 'USD',
    title: 'MindMaps+ Pro Monthly',
    description: 'Unlimited maps, premium templates, and advanced features',
    type: 'subscription',
  },
  {
    productId: 'com.mindmaps.pro.yearly',
    price: '$29.99',
    currency: 'USD',
    title: 'MindMaps+ Pro Yearly',
    description: 'Best value! Save 17% with annual subscription',
    type: 'subscription',
  },
  {
    productId: 'com.mindmaps.pro.lifetime',
    price: '$49.99',
    currency: 'USD',
    title: 'MindMaps+ Pro Lifetime',
    description: 'One-time purchase, lifetime access to all features',
    type: 'non-consumable',
  },
];

export const useIAPStore = create<IAPState>((set) => ({
  products: [],
  isPro: false,
  isLoading: false,
  error: null,

  loadProducts: async () => {
    set({isLoading: true, error: null});

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      set({products: MOCK_PRODUCTS, isLoading: false});
    } catch (error) {
      set({error: 'Failed to load products', isLoading: false});
    }
  },

  purchaseProduct: async (productId: string) => {
    set({isLoading: true, error: null});

    try {
      // Simulate purchase
      await new Promise(resolve => setTimeout(resolve, 2000));
      set({isPro: true, isLoading: false});
      return true;
    } catch (error) {
      set({error: 'Purchase failed', isLoading: false});
      return false;
    }
  },

  restorePurchases: async () => {
    set({isLoading: true, error: null});

    try {
      // Simulate restore
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Check if user had previous purchases
      const hadPurchase = false; // Mock check
      set({isPro: hadPurchase, isLoading: false});
      return hadPurchase;
    } catch (error) {
      set({error: 'Restore failed', isLoading: false});
      return false;
    }
  },

  setProStatus: (isPro: boolean) => {
    set({isPro});
  },
}));
