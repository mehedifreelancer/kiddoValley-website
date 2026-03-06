// app/layout.tsx
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import { StoreProvider } from "./providers/StoreProvider";
import { ThemeProvider } from "./providers/ThemeProvider";

const geist = Geist({ subsets: ["latin"] });

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
    <html lang="en" suppressHydrationWarning>
      <body className={geist.className}>
        <StoreProvider>
          <ThemeProvider>
            <Header />
            {/* Elegant gradient background with logo colors as subtle accents */}
            <main className="min-h-screen bg-gradient-to-b from-cream-50 via-cream-100 to-cream-200 dark:from-dark-bg dark:via-dark-surface dark:to-dark-elevated relative">
              {/* Very subtle logo color accents in background */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-logo-red-soft dark:bg-logo-red/5 rounded-full blur-3xl opacity-20"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-logo-blue-soft dark:bg-logo-blue/5 rounded-full blur-3xl opacity-20"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-logo-purple-soft dark:bg-logo-purple/5 rounded-full blur-3xl opacity-10"></div>
              </div>
              {/* Content */}
              <div className="relative z-10">
                {children}
              </div>
            </main>
            <Footer />
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}