import type { Metadata } from "next"; 
import { prisma } from "@/lib/prisma";
import ProductPageClient from "./ProductPageClient";

// Memastikan data selalu fresh setiap halaman dibuka (tidak tercache statis)
export const revalidate = 0;

// ─── GENERATE METADATA SEO BILINGUAL ───
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isId = locale === "id";
  
  return {
    title: isId ? "Katalog Produk Material" : "Construction Material Products",
    description: isId
      ? "Temukan produk material konstruksi premium Bali Limestone — batu limestone, tanah urug, batu pondasi, pasir, dan material pilihan lainnya untuk proyek Anda di Bali."
      : "Browse Bali Limestone's premium construction materials — limestone, fill soil, foundation stones, sand, and more. Quality materials delivered across Bali.",
    alternates: { canonical: `https://balilimestone.id/${locale}/product` },
    openGraph: {
      title: isId ? "Katalog Produk | Bali Limestone" : "Construction Materials | Bali Limestone",
      description: isId
        ? "Material konstruksi premium tersedia untuk proyek residensial dan komersial di seluruh Bali."
        : "Premium construction materials for residential and commercial projects across Bali.",
      url: `https://balilimestone.id/${locale}/product`,
    },
  };
}

// ─── MAIN PAGE COMPONENT ───
export default async function ProductPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale;

  
  const productsFromDb = await prisma.produk.findMany({
    include: {
      kategori: true, 
    },
    orderBy: {
      id: "desc", 
    },
  });

 
  const categoriesFromDb = await prisma.kategori.findMany({
    orderBy: {
      nama: "asc",
    },
  });

  
  const serializedProducts = productsFromDb.map((p) => {
    const namaProduk = locale === "id" ? (p.namaId || p.nama) : p.nama;
    const deskripsiProduk = locale === "id" ? (p.deskripsiId || p.deskripsi) : p.deskripsi;
    
    
    const namaKategori = p.kategori 
      ? (locale === "id" ? (p.kategori.namaId || p.kategori.nama) : p.kategori.nama)
      : locale === "id" ? "Tanpa Kategori" : "Uncategorized";

    return {
      id: p.id,
      nama: namaProduk,
      deskripsi: deskripsiProduk,
      gambar: p.gambar,
      category: namaKategori, 
    };
  });

  
  const labelSemuaProduk = locale === "id" ? "Semua Produk" : "All Products";
  const categories = [
    labelSemuaProduk, 
    ...categoriesFromDb.map((cat) => (locale === "id" ? (cat.namaId || cat.nama) : cat.nama))
  ];

  return (
    <ProductPageClient 
      initialProducts={serializedProducts} 
      categories={categories} 
    />
  );
}