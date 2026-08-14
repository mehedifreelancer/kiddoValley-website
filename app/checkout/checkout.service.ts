// app/checkout/checkout.service.ts
import { apiClient } from "../lib/apiClient";

export type LocationType = "inside_dhaka" | "suburbs" | "outside_dhaka";

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
  location: LocationType;
  deliveryCharge: number;
}

export interface CheckoutResponse {
  success: boolean;
  data: any;
  message: string;
}

export interface DetectLocationResponse {
  success: boolean;
  data: { locationType: LocationType };
  message: string;
}

export interface DeliveryChargeResult {
  baseCharge: number;
  weightCharge: number;
  codCharge: number;
  discountApplied: number;
  discountPercent: number;
  totalCharge: number;
}

export interface DeliveryChargeResponse {
  success: boolean;
  data: DeliveryChargeResult;
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

export const detectLocationFromAddress = async (
  address: string,
): Promise<LocationType> => {
  try {
    const response = await apiClient<DetectLocationResponse>(
      "/public/ai/detect-location",
      {
        method: "POST",
        body: JSON.stringify({ address }),
      },
    );
    return response.data.locationType;
  } catch (error: any) {
    // apiClient থেকে error হ্যান্ডেল করুন
    console.error("Location detect API error:", error);
    throw new Error(error.message || "লোকেশন ডিটেক্ট করতে ব্যর্থ হয়েছে");
  }
};

export const calculateDeliveryCharge = async (payload: {
  location: LocationType;
  weight: number;
  productPrice: number;
  isCod: boolean;
}): Promise<DeliveryChargeResult> => {
  try {
    const response = await apiClient<DeliveryChargeResponse>(
      "/public/delivery/calculate",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );
    return response.data;
  } catch (error: any) {
    // apiClient থেকে error হ্যান্ডেল করুন
    console.error("Delivery charge API error:", error);
    throw new Error(error.message || "ডেলিভারি চার্জ হিসাব করতে ব্যর্থ হয়েছে");
  }
};
