// app/track-order/trackOrder.schema.ts
import { z } from "zod";

export const phoneSchema = z
  .string()
  .min(11, "ফোন নম্বর কমপক্ষে ১১ ডিজিট হতে হবে")
  .max(14, "ফোন নম্বর সর্বোচ্চ ১৪ ডিজিট হতে পারে")
  .regex(/^01\d{9}$/, "সঠিক ফোন নম্বর দিন (০১XXXXXXXXX)");
