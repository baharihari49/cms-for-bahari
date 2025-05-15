import type { Metadata } from "next";
import { Roboto, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";
import { ClientLayout } from "./clientLayout";
import { Toaster } from "@/components/ui/sonner"

// Konfigurasi font Roboto
const roboto = Roboto({
  variable: "--font-roboto",
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
});

// Konfigurasi font Roboto Mono
const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

// Metadata yang lebih deskriptif
export const metadata: Metadata = {
  title: "Content Management System | Admin Dashboard",
  description: "A comprehensive dashboard to manage your website content, portfolio, experience, tech stack, and testimonials.",
  keywords: "CMS, dashboard, portfolio, content management, admin",
  authors: [{ name: "Bahari", url: "https://github.com/bahari" }],
  creator: "Bahari",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        style={{
          fontFamily: 'Roboto'
        }}
        className={`${roboto.variable} ${robotoMono.variable} font-sans antialiased`}
      >
          <AuthProvider>
            <ClientLayout>{children}</ClientLayout>
            <Toaster />
          </AuthProvider>
      </body>
    </html>
  );
}