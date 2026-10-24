import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import type { ReactNode } from "react";
import { Preloader } from "@/components/Preloader";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Golden Genetics — Laboratório",
    template: "%s · Golden Genetics",
  },
  description:
    "Laboratório fictício de divulgação científica sobre genética humana, hereditariedade e os limites dos bebês sob medida. Projeto educativo para feira de ciências.",
};

export const viewport: Viewport = {
  themeColor: "#F5F8FC",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" data-scroll-behavior="smooth" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Script id="gg-intro-boot" strategy="beforeInteractive">
          {`try{var path=location.pathname.replace(/\\/+$/,"")||"/";if(path==="/"&&sessionStorage.getItem("gg-preloader-seen")!=="1"){document.documentElement.classList.add("gg-intro");}}catch(e){}`}
        </Script>
        <a className="skip-link" href="#conteudo">
          Pular para o conteúdo
        </a>
        <SmoothScrollProvider>
          <Preloader />
          <SiteHeader />
          <main id="conteudo" className="flex-1 pt-16">
            {children}
          </main>
          <SiteFooter />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
