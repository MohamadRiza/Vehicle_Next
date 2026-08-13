import { Inter } from "next/font/google";
import "./globals.css";
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
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className}`}>
          <Header />

          <main className="min-h-screen">{children}</main>
          <Toaster richColors/>

          <footer className="bg-blue-50 py-12">
            <div className="container mx-auto px-4 text-center text-gray-600">
              <p>
                Developed with precision by{" "}
                <a
                  href="https://nexasoft.site"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-blue-600 hover:underline"
                >
                  Nexasoft
                </a>
              </p>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
