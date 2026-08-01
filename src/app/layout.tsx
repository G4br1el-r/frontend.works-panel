import type { Metadata, Viewport } from "next";
import { Archivo, Archivo_Black } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/landingpage/header";
import {
  SITE_APPLE_ICON,
  SITE_CATEGORY,
  SITE_DEFAULT_DESCRIPTION,
  SITE_DEFAULT_TITLE,
  SITE_FAVICON,
  SITE_KEYWORDS,
  SITE_MANIFEST,
  SITE_NAME,
  SITE_OG_IMAGE,
  SITE_URL,
} from "@/utils/constants";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
});

const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-archivo-black",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DEFAULT_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  applicationName: SITE_NAME,
  category: SITE_CATEGORY,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_DEFAULT_TITLE,
    description: SITE_DEFAULT_DESCRIPTION,
    images: [
      {
        url: SITE_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: SITE_DEFAULT_TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_DEFAULT_TITLE,
    description: SITE_DEFAULT_DESCRIPTION,
    images: [SITE_OG_IMAGE],
  },
  icons: {
    icon: SITE_FAVICON,
    shortcut: SITE_FAVICON,
    apple: SITE_APPLE_ICON,
  },
  manifest: SITE_MANIFEST,
  alternates: {
    canonical: "/",
  },
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`min-h-full scroll-smooth antialiased ${archivo.variable} ${archivoBlack.variable}`}>
      <body className="min-h-full flex flex-col bg-black font-sans">
        <Header />
        {children}
      </body>
    </html>
  );
}
