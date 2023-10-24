import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Navigation } from "./components/layout/navigation";
import Head from "next/head";

export default function RootLayout({
  children,
}) {
  return (
    <html lang="fi">
      <body className="bg-[#e6f7ff] font-['system-ui']">
        <header className="header font-mono">
          <Navigation />
        </header>
        {children}
      </body>
    </html>
  );
}
