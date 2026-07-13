import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./../globals.css"; // Sesuaikan path mundurnya karena sekarang file berada di dalam subfolder [locale]
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// GANTI export const metadata statis kamu menjadi fungsi dinamis ini:
export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params.locale;
  const baseUrl = "https://balilimestone.id";

  return {
    title: {
      default: "Bali Limestone – Premium Limestone Supplier & Heavy Equipment in Bali",
      template: "%s | Bali Limestone",
    },
    description:
      "Bali Limestone is Bali's trusted supplier of limestone, fill soil, foundation stones, and sand. We also provide heavy equipment rental and dump truck delivery across Bali, Indonesia.",
    keywords: [
      "limestone Bali", "limestone supplier Bali", "construction material Bali",
      "heavy equipment rental Bali", "dump truck Bali", "batu limestone Bali",
      "sewa alat berat Bali", "material konstruksi Bali", "tanah urug Bali", "batu pondasi Bali"
    ],
    metadataBase: new URL(baseUrl),
    icons: {
      icon: "/icon.png",
      shortcut: "/icon.png",
      apple: "/icon.png",
    },
    // SOLUSI UTAMA: Mengatur tag alternatif bahasa dan canonical agar Googlebot mengenali rute /id
    alternates: { 
      canonical: `${baseUrl}/${locale}`,
      languages: {
        'id-ID': `${baseUrl}/id`,
        'en-US': `${baseUrl}/en`,
        'x-default': `${baseUrl}/en`,
      }
    },
    openGraph: {
      type: "website",
      locale: locale === 'id' ? 'id_ID' : 'en_US',
      url: `${baseUrl}/${locale}`,
      siteName: "Bali Limestone",
      title: "Bali Limestone – Premium Limestone Supplier & Heavy Equipment in Bali",
      description: "Trusted supplier of limestone, construction materials, and heavy equipment rental in Bali, Indonesia.",
      images: [{ url: "/hero.jpg", width: 1200, height: 630, alt: "Bali Limestone – Construction Materials and Heavy Equipment" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Bali Limestone – Premium Limestone Supplier in Bali",
      description: "Trusted supplier of limestone, construction materials, and heavy equipment rental in Bali, Indonesia.",
      images: ["/hero.jpg"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}