import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "BookIt | Effortless Appointments",
  description: "Next-gen appointment booking platform for professionals and customers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${outfit.variable} font-sans antialiased bg-[#020617] text-slate-200`}>
        {children}
      </body>
    </html>
  );
}
