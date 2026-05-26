import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";

import Providers from "./providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Work Assignment",
  description: "Frontend CRUD Users Management Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`
        ${geistSans.variable}
        ${geistMono.variable}
        h-full
        scroll-smooth
      `}
>
      <body
        className="
          min-h-screen
          bg-blue-50
          text-gray-900
          antialiased
          font-sans
        "
      >
       
        <Providers>
          {children}
        </Providers>

       
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              borderRadius: "16px",
              padding: "14px",
              fontSize: "14px",
            },
          }}
        />
      </body>
    </html>
  );
}
