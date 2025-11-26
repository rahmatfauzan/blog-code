import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { cn } from "@/lib/utils"; 

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono", 
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "CodeBox - Developer Documentation Platform",
    template: "%s | CodeBox",
  },
  description:
    "Platform untuk menyimpan, berbagi, dan menemukan snippet kode berkualitas. Simpan kodingan Anda di satu tempat.",
  keywords: ["code", "snippet", "developer", "documentation", "gist", "nextjs"],
  authors: [{ name: "Rahmat Fauzan" }],
  creator: "CodeBox Team",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://codebox.com",
    title: "CodeBox - Share Code at the Speed of Thought",
    description: "Platform manajemen snippet kode untuk developer modern.",
    siteName: "CodeBox",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          geistSans.variable,
          geistMono.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
