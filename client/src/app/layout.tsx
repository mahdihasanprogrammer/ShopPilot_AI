import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import ConditionalShell from "@/components/shared/ConditionalShell";
import ChatWidget from "@/components/shared/ChatWidget";
import { ThemeProvider } from "@/context/ThemeContext";
import { Toaster } from "sonner";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "ShopPilot AI - AI-Powered E-Commerce Assistant",
  description: "ShopPilot AI is a premium e-commerce platform offering smart agentic recommendations and a site-wide conversational shopping assistant powered by Gemini 3.5 Flash.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('shoppilot-theme');
                  var supportDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (saved === 'dark' || (!saved && supportDark) || (saved === 'system' && supportDark)) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.setAttribute('data-theme', 'dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.setAttribute('data-theme', 'light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background font-sans text-body transition-colors duration-250">
        <ThemeProvider>
          <ConditionalShell>
            {children}
          </ConditionalShell>
          <ChatWidget />
          <Toaster richColors position="top-right" closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
