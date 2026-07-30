// app/checkout/checkout.service.ts
import { apiClient } from "../lib/apiClient";

export interface CheckoutPayload {
  customerName: string;
  customerPhone: string;
  customerPhone2?: string;
  customerAddress: string;
  gender?: string;
  hasBaby?: boolean;
  preferredToy?: string;
  deliveryDate?: string;
  items: {
    stockId: number;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  subtotal: number;
  discountTotal: number;
  total: number;
}

export interface CheckoutResponse {
  success: boolean;
  data: any;
  message: string;
}

export const placeOrder = async (
  payload: CheckoutPayload,
): Promise<CheckoutResponse> => {
  try {
    const response = await apiClient<{
      success: boolean;
      data: any;
      message: string;
    }>("/public/orders/website", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return response;
  } catch (error: any) {
    // apiClient থেকে error হ্যান্ডেল করুন
    console.error("Order API error:", error);
    throw new Error(error.message || "অর্ডার জমা দিতে ব্যর্থ হয়েছে");
  }
};
