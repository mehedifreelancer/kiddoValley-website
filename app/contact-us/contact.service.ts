// app/(public)/contact/contact.service.ts
import { apiClient } from "../lib/apiClient";
import { ContactFormPayload, ContactResponse } from "./contact.types";

// ✅ Contact form থেকে backend এর existing /email/send endpoint হিট করে
// (apiClient.ts তে base URL এ /api ইতিমধ্যে আছে)
const RECEIVER_EMAIL = "kiddovalley451@gmail.com";

export const sendContactMessage = async (
  payload: ContactFormPayload,
): Promise<ContactResponse> => {
  const { name, email, subject, message } = payload;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #8859F8; border-bottom: 2px solid #eee; padding-bottom: 10px;">
        নতুন যোগাযোগ ফর্ম বার্তা
      </h2>
      <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #555; width: 100px;">নাম:</td>
          <td style="padding: 8px 0; color: #222;">${escapeHtml(name)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #555;">ইমেইল:</td>
          <td style="padding: 8px 0; color: #222;">${escapeHtml(email)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #555;">বিষয়:</td>
          <td style="padding: 8px 0; color: #222;">${escapeHtml(subject)}</td>
        </tr>
      </table>
      <div style="margin-top: 16px; padding: 16px; background: #f7f7f7; border-radius: 8px;">
        <p style="margin: 0; white-space: pre-wrap; color: #333;">${escapeHtml(message)}</p>
      </div>
    </div>
  `;

  const text = `নাম: ${name}\nইমেইল: ${email}\nবিষয়: ${subject}\n\n${message}`;

  return apiClient<ContactResponse>("/public/email/send", {
    method: "POST",
    body: JSON.stringify({
      to: RECEIVER_EMAIL,
      subject: `[যোগাযোগ ফর্ম] ${subject}`,
      html,
      text,
    }),
  });
};

// Submitted text এ HTML markup যাতে ইমেইল ভেঙে না ফেলে
function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
