// modules/product/product.service.ts

import { apiClient } from "../lib/apiClient";

export interface Product {
  id: number;
  name: string;
  slug: string;
  categoryId: number;
  category: { id: number; name: string; slug: string };
  description: string | null;
  videoUrl: string | null;
  images: { imgUrl: string }[];
  weight: number;
  isForceOrder: boolean;
  forceOrderPriority: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  success: boolean;
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const getPublicProducts = async (
  page: number = 1,
  limit: number = 12,
  search: string = "",
  category?: string,
  forceOrder?: boolean,
): Promise<ProductsResponse> => {
  let url = `/public/products?page=${page}&limit=${limit}`;
  if (search) url += `&search=${encodeURIComponent(search)}`;
  if (category) url += `&category=${encodeURIComponent(category)}`;
  if (forceOrder) url += `&forceOrder=true`;
  return apiClient<ProductsResponse>(url);
};

// app/products/product.service.ts
export const getProductBySlug = async (slug: string): Promise<Product> => {
  const url = `/public/product/${slug}`;
  const response = await apiClient<{ success: boolean; data: Product }>(url);
  return response.data;
};
// Add this function
export const getRelatedProducts = async (
  productId: number,
): Promise<Product[]> => {
  const response = await apiClient<{ success: boolean; data: Product[] }>(
    `/public/products/related/${productId}`,
  );
  return response.data;
};
