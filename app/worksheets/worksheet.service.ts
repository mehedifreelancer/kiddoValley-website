// app/(public)/worksheets/worksheet.service.ts
import { apiClient } from "../lib/apiClient";
import type { WorksheetItem, PaginatedResponse } from "./worksheet.types";

// ✅ পাবলিক ওয়ার্কশীট লিস্ট (pagination + search সহ)
export const getPublicWorksheets = async (
  page: number = 1,
  limit: number = 20,
  search: string = "",
): Promise<PaginatedResponse<WorksheetItem>> => {
  const query = `?page=${page}&limit=${limit}${
    search ? `&search=${encodeURIComponent(search)}` : ""
  }`;

  const res = await apiClient<PaginatedResponse<WorksheetItem>>(
    `/public/worksheets${query}`,
  );

  return res;
};

// ✅ ডাউনলোড URL বানানোর হেল্পার – backend এর force-download route হিট করে
export const getWorksheetDownloadUrl = (id: number): string => {
  // apiClient.ts এর মতোই একই base ব্যবহার করা হচ্ছে (এখানে /api ইতিমধ্যে আছে)
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
  return `${API_BASE_URL}/public/worksheets/${id}/download`;
};
