import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Task 2 Diamond – Premium Digital Cards",
    template: "%s | Task 2 Diamond",
  },
  description: "Buy and sell premium digital cards – Visa, Mastercard, RuPay. Fast delivery, secure transactions, trusted by thousands.",
  keywords: "digital cards, prepaid cards, Visa, Mastercard, RuPay, buy cards online",
  authors: [{ name: "Task 2 Team" }],
  openGraph: {
    title: "Task 2 Diamond – Premium Digital Cards",
    description: "Secure your digital card today. Instant delivery, 24/7 support.",
    url: "https://task2diamond.com",
    siteName: "Task 2 Diamond",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Task 2 Diamond – Premium Digital Cards",
    description: "Buy digital cards with ease. Visa, Mastercard, RuPay available.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}