import type { Metadata } from "next";
import { Poppins, Rubik_Spray_Paint } from "next/font/google";
import "./globals.css";
import RootLayoutClient from "@/components/RootLayoutClient";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});
export const metadata: Metadata = {
  title: "Second Brain",
  description: "Second Brain is a place for you to share your thoughts.",
  openGraph: {
    type: "website",
    url: "https://second-brain-beta-nine.vercel.app/",
    title: "Second Brain",
    description: "Second Brain is a place for you to share your thoughts.",
    images: [
      {
        url: "https://second-brain-beta-nine.vercel.app/brainly.png",
        width: 1200,
        height: 630,
        alt: "Second Brain",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
