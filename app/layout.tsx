// app/layout.tsx
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import "./css/button.css";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import { GlobalProvider } from "./contexts/GlobalContext";
import Modal from "./components/shared/Modal";
import CartSidebar from "./components/common/CartSidebar";

export const metadata: Metadata = {
  title: "KiddoValley - Books for Kids",
  description: "Magical books for young readers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body>
        <GlobalProvider>
          <Header />
          <main className="relative min-h-screen overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-cream-50 via-cream-100 to-cream-200 dark:from-dark-bg dark:via-dark-surface dark:to-dark-elevated">
              {/* Center splash */}
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
            <div className="relative  mx-auto w-full">{children}</div>
          </main>
          <Footer />

          {/* Modal is ALWAYS here - just invisible until opened */}
          <Modal title="" size="md" />
           <CartSidebar />
        </GlobalProvider>
      </body>
    </html>
  );
}
