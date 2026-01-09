import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-fredoka",
});

export const metadata: Metadata = {
  title: "Kiddy Learning Hub - Educational Games for Kids Ages 3-6",
  description: "Interactive educational games for kindergarten children. Learn ABC letters, numbers 1-100, shapes, and colors with fun activities. Perfect for ages 3-6.",
  keywords: "educational games, kids learning, kindergarten games, ABC letters, numbers, shapes, colors, children games, preschool learning, interactive education",
  authors: [{ name: "Kiddy Learning Hub" }],
  openGraph: {
    title: "Educational Games for Kids Ages 3-6 | Kiddy Learning Hub",
    description: "Interactive learning platform with 4 educational games: ABC Letters, Numbers 1-100, Shapes, and Colors. Perfect for kindergarten children ages 3-6.",
    url: "https://kiddy-learning-hub.vercel.app",
    siteName: "Kiddy Learning Hub",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Educational Games for Kids Ages 3-6",
    description: "Interactive learning platform with ABC, Numbers, Shapes, and Colors games for kindergarten children.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fredoka.variable} antialiased font-sans`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
