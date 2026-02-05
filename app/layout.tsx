import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Providers } from "./providers";

const nunito = Nunito({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "QuizPerileri - Modern Quiz Platformu",
  description: "Türkiye'nin en enerjik ve modern quiz sitesi. Bilgini test et, eğlen ve öğren.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${nunito.variable} antialiased text-foreground font-sans overflow-x-hidden`}
      >
        <Providers>
          <Navbar />
          <div className="pt-20 min-h-screen">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
