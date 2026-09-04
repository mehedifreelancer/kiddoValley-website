// app/(public)/contact/contact.types.ts

export interface ContactFormPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message?: string;
  error?: string;
}
