// app/checkout/checkout.schema.ts
import { z } from "zod";

export const checkoutSchema = z.object({
  name: z.string().trim().min(2, "নাম কমপক্ষে ২ অক্ষর হতে হবে"),
  phone: z
    .string()
    .trim()
    .regex(
      /^\d{11,13}$/,
      "ফোন নম্বর শুধুমাত্র ১১-১৩ ডিজিটের হতে পারে (শুধু সংখ্যা)",
    ),
  address: z.string().trim().min(5, "ঠিকানা কমপক্ষে ৫ অক্ষর হতে হবে"),
});
