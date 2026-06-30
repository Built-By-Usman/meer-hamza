import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productRepository, orderRepository, couponRepository, authRepository, settingsRepository } from '../../../services';
import { ProductFilters, CreateOrderInput } from '../../../services';

// --- PRODUCT HOOKS ---

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => productRepository.getCategories(),
    staleTime: 0, // Fetch dynamically from database
  });
}

export function useBanners() {
  return useQuery({
    queryKey: ['banners'],
    queryFn: () => productRepository.getBanners(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useBrands() {
  return useQuery({
    queryKey: ['brands'],
    queryFn: () => productRepository.getBrands(),
    staleTime: 1000 * 60 * 60,
  });
}

export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productRepository.getProducts(filters),
    placeholderData: (previousData) => previousData, // smooth transitions when filtering
  });
}

export function useProductBySlug(slug: string) {
  return useQuery({
    queryKey: ['product', { slug }],
    queryFn: () => productRepository.getProductBySlug(slug),
    enabled: !!slug,
  });
}

export function useProductById(id: string) {
  return useQuery({
    queryKey: ['product', { id }],
    queryFn: () => productRepository.getProductById(id),
    enabled: !!id,
  });
}

export function useRelatedProducts(productId: string, limit = 4) {
  return useQuery({
    queryKey: ['products', 'related', productId, limit],
    queryFn: () => productRepository.getRelatedProducts(productId, limit),
    enabled: !!productId,
  });
}

export function useProductReviews(productId: string) {
  return useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => productRepository.getReviews(productId),
    enabled: !!productId,
  });
}

export function useAddReview(productId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      rating,
      comment,
      userName,
      userId,
    }: {
      rating: number;
      comment: string;
      userName: string;
      userId: string;
    }) => productRepository.addReview(productId, rating, comment, userName, userId),
    onSuccess: () => {
      // Refresh reviews list and specific product rating
      queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
      queryClient.invalidateQueries({ queryKey: ['product', { id: productId }] });
      queryClient.invalidateQueries({ queryKey: ['products'] }); // invalidate list since rating changed
    },
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => productRepository.getFeaturedProducts(),
  });
}

export function useTrendingProducts() {
  return useQuery({
    queryKey: ['products', 'trending'],
    queryFn: () => productRepository.getTrendingProducts(),
  });
}

export function useNewArrivals() {
  return useQuery({
    queryKey: ['products', 'new-arrivals'],
    queryFn: () => productRepository.getNewArrivals(),
  });
}

export function useFlashSaleProducts() {
  return useQuery({
    queryKey: ['products', 'flash-sale'],
    queryFn: () => productRepository.getFlashSaleProducts(),
  });
}

export function useBestSellers() {
  return useQuery({
    queryKey: ['products', 'best-sellers'],
    queryFn: () => productRepository.getBestSellers(),
  });
}

// --- COUPON HOOKS ---

export function useValidateCoupon() {
  return useMutation({
    mutationFn: ({ code, subtotal }: { code: string; subtotal: number }) =>
      couponRepository.validateCoupon(code, subtotal),
  });
}

// --- ORDER HOOKS ---

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderInput: CreateOrderInput) => orderRepository.createOrder(orderInput),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['orders', data.userId] });
    },
  });
}

export function useUserOrders(userId: string) {
  return useQuery({
    queryKey: ['orders', userId],
    queryFn: () => orderRepository.getOrdersByUserId(userId),
    enabled: !!userId,
  });
}

export function useOrderDetails(orderId: string) {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => orderRepository.getOrderById(orderId),
    enabled: !!orderId,
  });
}

// --- AUTH HOOKS ---

export function useLogin() {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authRepository.login(email, password),
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: ({ email, password, fullName }: { email: string; password: string; fullName: string }) =>
      authRepository.register(email, password, fullName),
  });
}

// --- SETTINGS HOOKS ---

export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsRepository.getSettings(),
    staleTime: 1000 * 60 * 5,
  });
}

// --- USER ADDRESS HOOKS ---

import { apiClient } from '../../../lib/api-client';

export interface SavedAddress {
  firstName: string;
  lastName: string;
  addressLine1: string;
  city: string;
  state?: string;
  zipCode: string;
  country: string;
  phone: string;
}

export function useMyAddress(enabled: boolean) {
  return useQuery<SavedAddress | null>({
    queryKey: ['my-address'],
    queryFn: async () => {
      const data = await apiClient.get<SavedAddress>('/users/my-address');
      // If the backend returns an empty object, treat as no saved address
      if (!data || !data.firstName) return null;
      return data;
    },
    enabled,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}

export function useUpdateMyAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (address: SavedAddress) =>
      apiClient.put('/users/my-address', address),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-address'] });
    },
  });
}
