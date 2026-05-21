import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { FirebaseProvider } from "../components/FirebaseProvider";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Educational Games for Kids Ages 3-6 | Kiddy Learning Hub",
  description: "Interactive educational games for kindergarten children. Learn ABC letters, numbers 1-100, shapes, and colors with fun activities. Perfect for ages 3-6.",
  keywords: "educational games, kids learning, kindergarten games, ABC letters, numbers, shapes, colors, children games, preschool learning, interactive education",
  openGraph: {
    title: "Educational Games for Kids Ages 3-6 | Kiddy Learning Hub",
    description: "Interactive learning platform with 4 educational games: ABC Letters, Numbers 1-100, Shapes, and Colors. Perfect for kindergarten children ages 3-6.",
    url: "https://kiddy.countrysnews.com",
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
      <head>
        {/* Establish early connections to Firebase endpoints */}
        <link rel="preconnect" href="https://firestore.googleapis.com" />
        <link rel="preconnect" href="https://identitytoolkit.googleapis.com" />
        <link rel="preconnect" href="https://securetoken.googleapis.com" />
        <link rel="dns-prefetch" href="https://kiddy-7badf.firebaseapp.com" />
      </head>
      <body className={`${inter.variable} font-inter antialiased`}>
        <FirebaseProvider>
          {children}
        </FirebaseProvider>
      </body>
    </html>
  );
}
