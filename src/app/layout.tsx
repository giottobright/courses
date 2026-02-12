import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import MemberstackProvider from "@/components/MemberstackProvider";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Learnify - Real Skills for Real Life",
  description: "Master everyday skills with short, practical courses. Learn what matters, when you need it.",
  keywords: ["online courses", "life skills", "practical learning", "short courses"],
  authors: [{ name: "Learnify Team" }],
  creator: "Learnify",
  publisher: "Learnify",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://learnify.com",
    title: "Learnify - Real Skills for Real Life",
    description: "Master everyday skills with short, practical courses",
    siteName: "Learnify",
  },
  twitter: {
    card: "summary_large_image",
    title: "Learnify - Real Skills for Real Life",
    description: "Master everyday skills with short, practical courses",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#b4a0d8" />
      </head>
      <body className={`${inter.className} antialiased bg-neutral-cream`}>
        <MemberstackProvider />
        {children}
      </body>
    </html>
  );
}
