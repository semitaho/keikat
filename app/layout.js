import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Navigation } from "./components/layout/navigation";
import Head from "next/head";

export default function RootLayout({ children }) {
  return (
    <html lang="fi">
      <body className="bg-blue-100 font-['system-ui']">
        <header className="header font-mono">
          <Navigation />
        </header>
        {children}
        <footer className="bg-blue-400 text-white text-center py-4">
          <p>&copy; 2023 Taho Ohjelmistopalvelut Oy</p>
        </footer>
      </body>
    </html>
  );
}
