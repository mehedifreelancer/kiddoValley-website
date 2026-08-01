// app/track-order/trackOrder.service.ts
import { apiClient } from "../lib/apiClient";

export interface Order {
  id: number;
  invoiceNo: string;
  total: number;
  orderStatus: string; // new, confirmed, cancelled
  pathaoConsignmentId: string | null;
  createdAt: string;
  customerName: string;
  customerAddress: string;
}

export interface TimelineStep {
  label: string;
  completed: boolean;
  timestamp?: string;
}

export interface TrackResponse {
  order: Order;
  timeline: TimelineStep[];
  statusData: any;
}

// ✅ ফোন দিয়ে অর্ডার খোঁজ
// app/track-order/trackOrder.service.ts
export const searchOrders = async (phone: string): Promise<Order[]> => {
  const res = await apiClient<{ success: boolean; data: Order[] }>(
    `/public/order-tracking/search?phone=${encodeURIComponent(phone)}`,
  );
  return res.data; // খালি অ্যারে পেলেও কাজ করবে
};

// ✅ কনসাইনমেন্ট ট্র্যাক করুন
export const trackConsignment = async (
  phone: string,
  consignmentId: string,
): Promise<TrackResponse> => {
  const res = await apiClient<{
    success: boolean;
    data: TrackResponse;
  }>("/public/order-tracking/track", {
    method: "POST",
    body: JSON.stringify({ phone, consignmentId }),
  });
  return res.data;
};

// ✅ (ঐচ্ছিক) অ্যাডমিন সিঙ্ক – পরে ব্যবহার করতে পারেন
export const syncOrderStatuses = async (orderIds: number[]): Promise<any> => {
  return apiClient("/admin/order-tracking/sync", {
    method: "POST",
    body: JSON.stringify({ orderIds }),
  });
};
