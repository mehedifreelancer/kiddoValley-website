import type { Metadata } from "next";
import "./globals.css";
import "./css/button.css";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import { GlobalProvider } from "./contexts/GlobalContext";
import Modal from "./components/shared/Modal";
import CartSidebar from "./components/common/CartSidebar";
import { Providers } from "./providers";
import { getPublicWebSettings } from "./web-stetings/webSettings.service";

export const metadata: Metadata = {
  title: "KiddoValley - Books for Kids",
  description: "Magical books for young readers",
};

// Web Settings টাইপ (ঐচ্ছিক, কিন্তু ভালো)
interface WebSettings {
  logoUrl: string | null;
  socialLinks: {
    facebook: string;
    instagram: string;
    youtube: string;
    website: string;
  };
  footerText: string;
}

// ফ্যালব্যাক ডেটা
const fallbackSettings: WebSettings = {
  logoUrl: null,
  socialLinks: {
    facebook: "",
    instagram: "",
    youtube: "",
    website: "",
  },
  footerText: "© Kiddo Valley. All rights reserved.",
};

export default async function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal?: React.ReactNode;
}) {
  // সার্ভার-সাইডে ডেটা ফেচ (শুধু একবার)
  let settings = fallbackSettings;
  try {
    settings = await getPublicWebSettings();
    console.log(settings);
  } catch (error) {
    console.error("Failed to fetch web settings:", error);
    // fallback ইতিমধ্যে সেট আছে
  }

  return (
    <html suppressHydrationWarning>
      <body>
        <Providers>
          <GlobalProvider>
            <Header
              logoUrl={settings.logoUrl}
              socialLinks={settings.socialLinks}
            />
            <main className="relative min-h-screen overflow-hidden">
              {/* Background – অপরিবর্তিত */}
              <div className="absolute inset-0 bg-gradient-to-b from-cream-50 via-cream-100 to-cream-200 dark:from-dark-bg dark:via-dark-surface dark:to-dark-elevated">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div
                    className="w-[800px] h-[800px] rounded-full blur-3xl"
                    style={{
                      background: `radial-gradient(circle at center, 
                        #D51B26 0%,
                        #8859F8 20%,
                        #1C08A9 40%,
                        #36A43D 60%,
                        #8859F8 70%,
                        transparent 85%
                      )`,
                      opacity: 0.25,
                    }}
                  />
                  <div
                    className="absolute w-[400px] h-[400px] rounded-full blur-2xl"
                    style={{
                      background: `radial-gradient(circle at center, 
                        #D51B26 0%,
                        #8859F8 30%,
                        #1C08A9 50%,
                        transparent 80%
                      )`,
                      opacity: 0.2,
                    }}
                  />
                  <div
                    className="absolute w-[1100px] h-[1100px] rounded-full blur-[100px]"
                    style={{
                      background: `radial-gradient(circle at center, 
                        #36A43D 0%,
                        #1C08A9 20%,
                        #8859F8 40%,
                        #D51B26 60%,
                        transparent 80%
                      )`,
                      opacity: 0.15,
                    }}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cream-50/30 to-cream-200/30 dark:via-dark-bg/30 dark:to-dark-surface/30 pointer-events-none"></div>
              </div>
              <div className="relative mx-auto w-full">{children}</div>
            </main>
            <Footer
              footerText={settings.footerText}
              socialLinks={settings.socialLinks}
              logoUrl={settings.logoUrl}
            />
            {modal}
            <CartSidebar />
          </GlobalProvider>
        </Providers>
      </body>
    </html>
  );
}
