import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ChatWidget from "@/components/shared/ChatWidget";
import { AuthProvider } from "@/components/shared/AuthProvider";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "ShopPilot AI - AI-Powered E-Commerce Assistant",
  description: "ShopPilot AI is a premium e-commerce platform offering smart agentic recommendations and a site-wide conversational shopping assistant powered by Claude.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background font-sans">
        <AuthProvider>
          <Navbar />
          {children}
          <Footer />
          <ChatWidget />
        </AuthProvider>
      </body>
    </html>
  );
}
