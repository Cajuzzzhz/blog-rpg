import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import LoginButton from "@/components/LoginButton";
import "./globals.css";

// Configurando as fontes
const inter = Inter({ subsets:["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets:["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Não se esqueçam de mim",
  description: "aqui dentro você jamais será esquecido",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${playfair.variable} font-sans min-h-screen flex flex-col`}>
        
        {/* CABEÇALHO DO SITE (Vibe Blog WordPress 2016) */}
        <header className="w-full bg-white border-t-4 border-b border-gray-200 py-10 px-6 md:px-12 text-center relative shadow-sm">
          <div className="absolute right-6 md:right-12 top-1/2 transform -translate-y-1/2 z-10">
            <LoginButton />
          </div>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-[#c9302c] tracking-tight mb-2">
            Não se esqueçam de mim
          </h1>
          <p className="font-inter text-sm md:text-base text-gray-500 italic">
            aqui dentro você jamais será esquecido
          </p>
        </header>

        {/* CONTEÚDO PRINCIPAL */}
        <main className="flex-1 w-full max-w-3xl mx-auto p-4 md:p-8">
          {children}
        </main>

        {/* RODAPÉ */}
        <footer className="w-full bg-white border-t border-gray-200 py-8 text-center text-sm text-gray-500 mt-auto">
          <p>© 2016 Não se esqueçam de mim.</p>
        </footer>

      </body>
    </html>
  );
}