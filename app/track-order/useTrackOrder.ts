// app/track-order/useTrackOrder.ts
import { useQuery } from "@tanstack/react-query";
import {
  searchOrders,
  trackConsignment,
  Order,
  TrackResponse,
} from "./trackOrder.service";

// অর্ডার সার্চের জন্য হুক
export const useSearchOrders = (phone: string, enabled: boolean = false) => {
  return useQuery<Order[], Error>({
    queryKey: ["orders", phone],
    queryFn: () => searchOrders(phone),
    enabled: enabled && phone.length >= 11,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
};

// ট্র্যাকিং ডেটার জন্য হুক
export const useTrackConsignment = (
  phone: string,
  consignmentId: string,
  enabled: boolean = false,
) => {
  return useQuery<TrackResponse, Error>({
    queryKey: ["track", consignmentId, phone],
    queryFn: () => trackConsignment(phone, consignmentId),
    enabled: enabled && !!consignmentId && phone.length >= 11,
    retry: 1,
    staleTime: 30 * 1000, // 30 seconds – tracking updates often
  });
};
