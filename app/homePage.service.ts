// modules/hero-slider/heroSlider.service.ts
import {
  HeroSlider,
  HeroSliderFormData,
  PaginatedResponse,
} from "./heroSlider.types";
import { apiClient } from "./lib/apiClient";

// Admin – with pagination & search
export const getHeroSliders = async (
  page: number = 1,
  limit: number = 10,
  search: string = "",
): Promise<PaginatedResponse<HeroSlider>> => {
  let url = `/admin/hero-sliders?page=${page}&limit=${limit}`;
  if (search) url += `&search=${encodeURIComponent(search)}`;
  return apiClient<PaginatedResponse<HeroSlider>>(url);
};

export const createHeroSlider = async (
  data: HeroSliderFormData,
): Promise<HeroSlider> => {
  return apiClient<{ success: boolean; data: HeroSlider }>(
    "/admin/hero-sliders",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  ).then((res) => res.data);
};

export const updateHeroSlider = async (
  id: number,
  data: Partial<HeroSliderFormData>,
): Promise<HeroSlider> => {
  return apiClient<{ success: boolean; data: HeroSlider }>(
    `/admin/hero-sliders/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    },
  ).then((res) => res.data);
};

export const deleteHeroSlider = async (id: number): Promise<void> => {
  await apiClient(`/admin/hero-sliders/${id}`, { method: "DELETE" });
};

export const reorderHeroSliders = async (
  ids: number[],
): Promise<HeroSlider[]> => {
  return apiClient<{ success: boolean; data: HeroSlider[] }>(
    "/admin/hero-sliders/reorder",
    {
      method: "POST",
      body: JSON.stringify({ ids }),
    },
  ).then((res) => res.data);
};

export const uploadHeroImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);
  const result = await apiClient<{ success: boolean; data: { url: string } }>(
    "/admin/hero-sliders/upload",
    {
      method: "POST",
      body: formData,
    },
  );
  return result.data.url;
};

// Public – get active hero sliders
export const getPublicHeroSliders = async (): Promise<HeroSlider[]> => {
  const res = await apiClient<{ success: boolean; data: HeroSlider[] }>(
    "/public/hero-sliders",
  );
  return res.data;
};
// services/layoutSettings.ts
export const getPublicGridSettings = async () => {
  const res = await apiClient<{
    success: boolean;
    data: { gridClasses?: string };
  }>("/public/web-settings/layout-settings"); // ✅ "web-settings" যোগ করুন
  return (
    res.data?.gridClasses ||
    "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1 sm:gap-2 lg:gap-3 xl:gap-4" // ডিফল্ট গ্রিড ক্লাস
  );
};
