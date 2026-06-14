import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import ProductSection from "@/components/sections/ProductSection";
import Review from "@/components/sections/Review";
import Location from "@/components/sections/Location";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";


import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

export const metadata = {
  title: "Bali Limestone Supplier | Jasa & Material Bali",
  description:
    "Solusi material dan alat berat terpercaya di Bali. Menyediakan limestone, galian, dan jasa konstruksi.",
};

export const revalidate = 0; 


export default async function Home({ params }: { params: Promise<{ locale?: string }> }) {
  // Ambil locale yang sedang aktif (jika di domain utama, default ke 'en')
  const { locale = "en" } = await params;
  
  // Ambil semua pesan kamus dari folder messages/
  const messages = await getMessages();

  // 1. Tarik Data Produk dari TiDB
  const latestProducts = await prisma.produk.findMany({
    take: 6,
    orderBy: { id: "desc" },
  });

  
  const rawServices = await prisma.jasa.findMany({
    take: 4, 
    orderBy: { id: "asc" },
  });

  
  const dbServices = rawServices.map((jasa: any) => ({
    title: locale === "id" ? (jasa.namaId || jasa.nama) : jasa.nama,
    description: locale === "id" ? (jasa.deskripsiId || jasa.deskripsi) : jasa.deskripsi,
    mainImage: jasa.gambar || "/Dummy.webp",
    slug: jasa.id, 
  }));

  // Modifikasi Data Produk untuk filter bahasa Inggris / Indonesia
  const dbProducts = latestProducts.map((produk: any) => ({
    ...produk,
    nama: locale === "id" ? (produk.namaId || produk.nama) : produk.nama,
    deskripsi: locale === "id" ? (produk.deskripsiId || produk.deskripsi) : produk.deskripsi,
  }));

  return (
    // 🔹 Bungkus di dalam return agar tidak merusak export metadata di atas
    <NextIntlClientProvider messages={messages}>
      <main>
        <Navbar />
        <Hero />
        <About />
        
        {/* Lempar data yang sudah disaring bahasanya */}
        <Services services={dbServices} />
        <ProductSection products={dbProducts} />
        
        <Review /> 
        <Location />
        <Footer />
      </main>
    </NextIntlClientProvider>
  );
}