import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { SmoothScrollProvider } from "@/components/motion/SmoothScrollProvider";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ADINN Unipole Advertising | Rise Above the Noise",
  description:
    "Premium unipole outdoor advertising across high-impact roads, junctions, highways and commercial destinations, engineered and installed by ADINN Advertising Services Ltd.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-brand-white text-brand-black">
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
