import { getTranslations, getLocale } from "next-intl/server";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: {
      default: t("title"),
      template: "%s | Bali Limestone",
    },
    description: t("description"),
    keywords: t("keywords").split(", "),
    metadataBase: new URL("https://balilimestone.id"),
    icons: {
      icon: "/iconw.png",
      shortcut: "/iconw.png",
      apple: "/iconw.png",
    },
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: locale === "id" ? "id_ID" : "en_US",
      url: "https://balilimestone.id",
      siteName: "Bali Limestone",
      title: t("ogTitle"),
      description: t("ogDescription"),
      images: [
        {
          url: "/hero.jpg",
          width: 1200,
          height: 630,
          alt: "Bali Limestone – Construction Materials and Heavy Equipment",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("twitterTitle"),
      description: t("twitterDescription"),
      images: ["/hero.jpg"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
  };
}

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
