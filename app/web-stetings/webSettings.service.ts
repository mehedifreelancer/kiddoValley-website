// app/services/webSettings.service.ts
import { apiClient } from "../lib/apiClient";

export interface SocialLinks {
  facebook: string;
  instagram: string;
  youtube: string;
  website: string;
}

export interface WebSettings {
  logoUrl: string | null;
  socialLinks: SocialLinks;
  footerText: string;
}
// যদি `apiClient` সার্ভার-সাইডে কাজ করে, তাহলে এই ফাংশন ব্যবহার করুন
export const getPublicWebSettings = async (): Promise<WebSettings> => {
  const res = await apiClient<{ success: boolean; data: WebSettings }>(
    "/public/web-settings",
  );
  console.log("xxxx", res);
  return res.data;
};
