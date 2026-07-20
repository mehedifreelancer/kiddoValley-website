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
