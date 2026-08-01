// services/cart.service.ts

import { apiClient } from "../lib/apiClient";

// ===== টাইপ =====
export interface StockCheckResponse {
  stockId: number;
  available: boolean;
  currentQty: number;
  productName: string;
  message: string;
}

export interface BulkStockCheckItem {
  stockId: number;
  quantity: number;
}

export interface BulkStockCheckResult {
  stockId: number;
  available: boolean;
  currentQty: number;
  productName: string;
  message: string;
}

// ===== ১. সিঙ্গেল স্টক চেক =====
/**
 * Check stock availability for a single item (before adding to cart)
 * @param stockId - Stock ID to check
 * @param quantity - Desired quantity (default 1)
 * @returns StockCheckResponse
 */
export const checkSingleStock = async (
  stockId: number,
  quantity: number = 1,
): Promise<StockCheckResponse> => {
  const response = await apiClient<{
    success: boolean;
    data: StockCheckResponse;
  }>(`/public/stock/check-single?stockId=${stockId}&quantity=${quantity}`);
  return response.data;
};

// ===== ২. বাল্ক স্টক চেক =====
/**
 * Check stock availability for multiple items (before checkout)
 * @param items - Array of { stockId, quantity }
 * @returns Array of BulkStockCheckResult
 */
export const checkBulkStock = async (
  items: BulkStockCheckItem[],
): Promise<BulkStockCheckResult[]> => {
  const response = await apiClient<{
    success: boolean;
    data: BulkStockCheckResult[];
  }>("/public/stock/check-bulk", {
    method: "POST",
    body: JSON.stringify({ items }),
  });
  return response.data;
};
