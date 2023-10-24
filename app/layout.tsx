import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Keikat etusivu",
  description: "Keikat - Vapaita keikkoja Freelancereille",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav className="bg-gray border-gray-200">
          <div className="flex flex-wrap items-center justify-between p-4 mx-auto">

            <Link href="/" className="flex items-center">Keikat</Link>

          </div>
        
        </nav>
        {children}
      </body>
    </html>
  );
}
