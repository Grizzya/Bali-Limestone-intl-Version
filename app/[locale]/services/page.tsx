import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import ServicesPageClient from "./ServicesPageClient";
import { getLocale } from "next-intl/server";

export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isId = locale === "id";

  return {
    title: isId ? "Layanan Kami" : "Our Services",
    description: isId
      ? "Bali Limestone menyediakan layanan Land Cut & Fill, Galian Basement, Land Clearing, dan Bongkar Bangunan di seluruh Bali."
      : "Bali Limestone provides Land Cut & Fill, Basement Excavation, Land Clearing, and Building Demolition services across Bali, Indonesia.",
    alternates: {
      canonical: `https://balilimestone.com/${locale}/services`,
    },
    openGraph: {
      title: isId
        ? "Layanan Konstruksi | Bali Limestone"
        : "Construction Services | Bali Limestone",
      description: isId
        ? "Bali Limestone menyediakan layanan konstruksi profesional untuk proyek skala menengah hingga besar di seluruh Bali."
        : "Professional construction services for medium to large-scale projects across Bali, Indonesia.",
      url: `https://balilimestone.com/${locale}/services`,
    },
  };
}

export default async function ServicesPage() {
  await getLocale();

  const services = await prisma.jasa.findMany({
    orderBy: {
      createdAt: "asc",
    },
  });

  const formattedServices = services.map((jasa) => ({
    id: jasa.id,
    slug: jasa.id,
    nama: jasa.nama,
    namaId: jasa.namaId,
    deskripsi: jasa.deskripsi,
    deskripsiId: jasa.deskripsiId,
    gambar: jasa.gambar || "/Dummy.webp",
    mainImage: jasa.gambar || "/Dummy.webp",
  }));

  return (
    <ServicesPageClient
      initialServices={formattedServices}
    />
  );
}