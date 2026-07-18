import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image"; // Menggunakan Next.js Image Optimization
import { cache } from "react"; // Menggunakan cache React untuk optimasi database
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import ReactMarkdown from "react-markdown";


export const revalidate = 0;

const WA_PATH = "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.452-.885-.77-1.482-1.72-1.655-2.018-.173-.298-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01a1.183 1.183 0 0 0-.86.4 3.613 3.613 0 0 0-1.124 2.684c0 1.56 1.149 3.067 1.309 3.265.159.198 2.228 3.398 5.4 4.707 3.172 1.31 3.172.873 3.746.823.574-.05 1.758-.718 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z";

// OPTIMASI: Fungsi penarik data tunggal yang dideduplikasi (Cuma hit ke TiDB 1x saja)
const getArtikelTerbuka = cache(async (slug: string) => {
  return prisma.artikel.findUnique({ where: { slug } });
});

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }): Promise<Metadata> {
  const { slug, locale } = await params;
  const artikel = await getArtikelTerbuka(slug); // Menggunakan fungsi ter-cache
  if (!artikel) return {};
  const judul = locale === "id" ? (artikel.judulId || artikel.judul) : artikel.judul;
  const konten = locale === "id" ? (artikel.kontenId || artikel.konten) : artikel.konten;
  return {
    title: judul,
    description: konten?.slice(0, 155) ?? "Read this article from Bali Limestone.",
    alternates: { canonical: `https://balilimestone.id/${locale}/articles/${slug}` },
    openGraph: {
      title: judul,
      description: konten?.slice(0, 155) ?? "",
      url: `https://balilimestone.id/${locale}/articles/${slug}`,
      type: "article",
      publishedTime: artikel.createdAt.toISOString(),
      images: artikel.gambar ? [{ url: artikel.gambar, alt: judul }] : [],
    },
  };
}

export default async function ArtikelDetail({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params;

  const artikel = await getArtikelTerbuka(slug); // Menggunakan fungsi ter-cache (Instant tanpa load ulang database)
  if (!artikel) return notFound();

  const judulAktif  = locale === "id" ? (artikel.judulId  || artikel.judul)  : artikel.judul;
  const kontenAktif = locale === "id" ? (artikel.kontenId || artikel.konten) : artikel.konten;

  const tanggalBikin = new Date(artikel.createdAt).toLocaleDateString(
    locale === "id" ? "id-ID" : "en-US",
    { day: "numeric", month: "long", year: "numeric" }
  );

  // JSON-LD Article schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: judulAktif,
    datePublished: artikel.createdAt.toISOString(),
    image: artikel.gambar || undefined,
    publisher: { "@type": "Organization", name: "Bali Limestone", url: "https://balilimestone.id" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar variant="dark" />

      <article className="bg-white pt-28 lg:pt-40 pb-16 lg:pb-20">
        <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-12">

          {/* HEADER */}
          <header className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-6 leading-tight">
              {judulAktif}
            </h1>
            {/* OPTIMASI: Label penunjuk waktu publikasi bilingual otomatis */}
            <p className="text-gray-400 text-[15px] leading-relaxed px-4 md:px-12">
              {locale === "id" ? "Dipublikasikan pada " : "Published on "}
              <time dateTime={artikel.createdAt.toISOString()}>{tanggalBikin}</time>
            </p>
          </header>

          {/* MAIN IMAGE (OPTIMASI: Menggunakan Next.js Image Component agar memuat ringan & responsif) */}
          <div className="w-full h-[250px] md:h-[450px] lg:h-[550px] rounded-xl overflow-hidden mb-16 shadow-sm relative">
            <Image 
              src={artikel.gambar || "/Dummy.webp"} 
              alt={judulAktif}
              fill
              priority // Menginstruksikan browser agar memuat banner utama ini lebih dulu (Bagus untuk LCP)
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
              className="object-cover" 
            />
          </div>

          {/* CONTENT GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

            {/* Konten artikel */}
            <div className="lg:col-span-8">
                <div
                className="article-content text-gray-700 text-justify"
                dangerouslySetInnerHTML={{ __html: kontenAktif ?? "" }}
              />
             </div>        

            {/* CTA sticky */}
            <div className="lg:col-span-4 self-start sticky top-28">
              <div className="bg-[#ffcc00] rounded-2xl p-7 flex flex-col gap-5">

                <div className="flex items-center gap-2 bg-black/10 rounded-full px-3 py-1 w-fit">
                  <svg viewBox="0 0 24 24" fill="#25d366" className="w-3 h-3" aria-hidden="true">
                    <path d={WA_PATH} />
                  </svg>
                  <span className="text-xs font-medium text-[#3a2e00]">
                    {locale === "id" ? "Respon Cepat" : "Fast Response"}
                  </span>
                </div>

                <div>
                  <h2 className="text-[#1a1400] text-[22px] font-semibold leading-snug">
                    {locale === "id" ? "Butuh Material atau Layanan Konstruksi?" : "Need Material or Construction Service?"}
                  </h2>
                  <p className="mt-2 text-sm text-[#3a2e00] leading-relaxed">
                    {locale === "id"
                     ? "Tim kami siap mendukung proyek Anda — material, alat berat, & pengiriman."
                     : "Our team is ready to support your project — material, alat berat, & delivery."}
                  </p>
                </div>

                <div className="h-px bg-black/15" />

                <a href="https://wa.me/628181802020" target="_blank" rel="noopener noreferrer"
                  aria-label="Contact Bali Limestone via WhatsApp"
                  className="bg-[#1a1a1a] hover:bg-black text-[#ffffff] rounded-xl px-5 py-3.5 flex items-center justify-between transition-colors duration-200">
                  <div className="flex items-center gap-3">
                    <svg viewBox="0 0 24 24" fill="#25d366" className="w-7 h-7 shrink-0" aria-hidden="true">
                      <path d={WA_PATH} />
                    </svg>
                    <div>
                      <span className="block text-[11px] text-[#ffffff] leading-none mb-1">
                        {locale === "id" ? "Hubungi via" : "Chat via"}
                      </span>
                      <span className="block text-sm font-semibold leading-none">WhatsApp</span>
                    </div>
                  </div>
                  <svg viewBox="0 0 24 24" stroke="#ffcc00" strokeWidth="2" fill="none" className="w-4 h-4 opacity-50" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </a>

              </div>
            </div>

          </div>
        </div>
      </article>

      <Footer />
    </>
  );
}