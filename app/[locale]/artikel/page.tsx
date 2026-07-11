import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import type { Prisma } from "@prisma/client";

export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isId = locale === "id";
  return {
    title: isId ? "Blog & Inspirasi" : "Blog & Inspiration",
    description: isId
      ? "Tips konstruksi, inspirasi desain, dan berita terbaru dari Bali Limestone – supplier material bangunan terpercaya di Bali."
      : "Construction tips, design inspiration, and the latest news from Bali Limestone – Bali's trusted construction material supplier.",
    alternates: { canonical: `https://balilimestone.com/${locale}/artikel` },
    openGraph: {
      title: isId ? "Blog & Inspirasi | Bali Limestone" : "Blog & Inspiration | Bali Limestone",
      url: `https://balilimestone.com/${locale}/artikel`,
    },
  };
}

export default async function ArtikelUserPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const locale = (await params).locale;
  const resolvedSearchParams = await searchParams;

  const currentPage = Number(resolvedSearchParams.page) || 1;
  
  // Mengubah jumlah item menjadi 5 agar lebih ringan dan grid halaman 1 simetris (1 hero + 4 sisa)
  const itemsPerPage = 5;
  const skip = (currentPage - 1) * itemsPerPage;

  // Mengambil data secara sekuensial untuk menghemat pool koneksi TiDB serverless
  const semuaArtikel = await prisma.artikel.findMany({
    skip,
    take: itemsPerPage,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      slug: true,
      judul: true,
      judulId: true,
      konten: true,
      kontenId: true,
      gambar: true,
      createdAt: true,
    },
  });

  const totalItems = await prisma.artikel.count();
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  if (semuaArtikel.length === 0) {
    return (
      <>
        <Navbar variant="dark" />
        <main className="py-20 text-center text-gray-500">No articles published yet.</main>
        <Footer />
      </>
    );
  }

  const artikelUtama  = semuaArtikel[0];
  type ArtikelItem = typeof semuaArtikel[number];
  const artikelSisa: ArtikelItem[] = semuaArtikel.slice(1);
  
  // Membagi 4 artikel sisa: 2 di kolom kiri, 2 di kolom kanan (Top News)
  const artikelListKiri = artikelSisa.filter((_, i) => i % 2 === 0);
  const artikelTopNewsKanan = artikelSisa.filter((_, i) => i % 2 !== 0);

  const getJudul  = (item: typeof artikelUtama) => locale === "id" ? (item.judulId  || item.judul)  : item.judul;
  const getKonten = (item: typeof artikelUtama) => {
    const html = locale === "id" ? (item.kontenId || item.konten) : item.konten;
    return html
      ?.replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " ")
      .trim();
  };

  const formatTanggal = (date: Date) =>
    new Date(date).toLocaleDateString(locale === "id" ? "id-ID" : "en-US", {
      day: "numeric", month: "long", year: "numeric",
    });

  return (
    <div className="min-h-screen bg-white text-black flex flex-col justify-between font-sans">
      <Navbar variant="dark" />

      <main className="max-w-8xl mx-auto px-4 md:px-10 py-12 flex-grow w-full space-y-12">

        {/* HEADER */}
        <div className="space-y-10">
          <span className="inline-block bg-amber-100 text-yellow-400 text-xs font-semibold px-2.5 py-1 rounded">
            News
          </span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 max-w-2xl leading-tight">
            Latest Updates &amp; Construction Insights from Bali Limestone
          </h1>
        </div>

        {/* SUBHEADER */}
        <div className="border-b border-gray-200 pb-2 flex justify-between items-center">
          <span className="text-sm font-bold text-gray-800 border-b-2 border-black pb-2">
            Latest Articles {currentPage > 1 && `– Page ${currentPage}`}
          </span>
          <div className="hidden md:flex items-center gap-1">
            <input type="text" placeholder="Search articles..." className="border border-gray-200 text-xs px-3 py-1.5 rounded outline-none w-48 bg-gray-50" />
            <button className="bg-yellow-400 text-black text-xs font-semibold px-3 py-1.5 rounded hover:bg-yellow-500 transition-colors">Search</button>
          </div>
        </div>

        {/* HERO ARTICLE */}
        {currentPage === 1 && (
          <Link href={`/${locale}/artikel/${artikelUtama.slug}`} className="group block relative rounded-xl overflow-hidden shadow-lg border">
            <div className="relative h-[550px] w-full bg-gray-900">
              {artikelUtama.gambar && (
                <img src={artikelUtama.gambar} alt={getJudul(artikelUtama)}
                  className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500"
                  loading="lazy" width={1200} height={550} />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" aria-hidden="true" />
              <div className="absolute bottom-0 inset-x-0 p-8 md:p-12 space-y-4 max-w-3xl">
                <h2 className="text-2xl md:text-4xl font-bold text-white leading-snug drop-shadow-sm">
                  {getJudul(artikelUtama)}
                </h2>
                <p className="text-gray-200 text-sm md:text-base line-clamp-2 leading-relaxed opacity-90 font-light">
                  {getKonten(artikelUtama)}
                </p>
                <div className="inline-flex items-center gap-2 bg-yellow-400 text-black font-bold text-xs px-5 py-3 rounded hover:bg-yellow-500 transition-colors mt-2 shadow-md">
                  Read Full Article &rarr;
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-4">

          <div className={`${currentPage === 1 ? "lg:col-span-2" : "lg:col-span-3"} space-y-6 divide-y divide-gray-100`}>
            {(currentPage === 1 ? artikelListKiri : semuaArtikel).map((item, idx) => (
              <Link key={item.id} href={`/${locale}/artikel/${item.slug}`}
                className={`group flex flex-col-reverse md:flex-row gap-8 rounded-xl p-4 transition-all duration-300 hover:bg-gray-50 border border-transparent hover:border-gray-100 hover:shadow-sm ${idx > 0 ? "mt-6 pt-6" : ""}`}
              >
                <div className="flex-1 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                      <time dateTime={new Date(item.createdAt).toISOString()}>{formatTanggal(item.createdAt)}</time>
                      <span className="text-gray-200" aria-hidden="true">|</span>
                      <span className="text-yellow-400 font-semibold uppercase text-[10px]">News</span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-yellow-400 transition-colors line-clamp-2 leading-snug">
                      {getJudul(item)}
                    </h2>
                    <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed font-light">{getKonten(item)}</p>
                  </div>
                </div>
                <div className="w-full md:w-72 h-48 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden border shadow-sm">
                  {item.gambar && (
                    <img src={item.gambar} alt={getJudul(item)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy" width={288} height={192} />
                  )}
                </div>
              </Link>
            ))}
          </div>

          {currentPage === 1 && (
            <aside className="space-y-6" aria-label="Top News">
              {artikelTopNewsKanan.map((item) => (
                <Link key={item.id} href={`/${locale}/artikel/${item.slug}`}
                  className="group block space-y-4 rounded-xl p-4 transition-all duration-300 hover:bg-gray-50 border border-transparent hover:border-gray-100 hover:shadow-sm">
                  <div className="w-full h-56 bg-gray-100 rounded-xl overflow-hidden border shadow-sm">
                    {item.gambar && (
                      <img src={item.gambar} alt={getJudul(item)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy" width={400} height={224} />
                    )}
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase text-yellow-400 tracking-wider block">Top News</span>
                    <h2 className="text-base font-bold text-gray-900 group-hover:text-yellow-400 transition-colors line-clamp-2 leading-snug">
                      {getJudul(item)}
                    </h2>
                    <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed font-light">{getKonten(item)}</p>
                  </div>
                </Link>
              ))}
            </aside>
          )}

        </div>

        {/* PAGINATION */}
        <nav className="border-t border-gray-200 pt-8 flex items-center justify-between" aria-label="Pagination">
          <p className="text-xs text-gray-400">
            Page <strong className="text-black">{currentPage}</strong> of <strong className="text-black">{totalPages}</strong>
          </p>
          <div className="flex gap-2">
            {currentPage > 1 ? (
              <Link href={`?page=${currentPage - 1}`} className="px-4 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all shadow-sm">
                &larr; Previous
              </Link>
            ) : (
              <button disabled className="px-4 py-2 text-xs font-bold text-gray-300 bg-gray-50 border border-gray-200 rounded-lg cursor-not-allowed">&larr; Previous</button>
            )}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Link key={page} href={`?page=${page}`} aria-current={currentPage === page ? "page" : undefined}
                className={`px-3.5 py-2 text-xs font-bold rounded-lg border transition-all ${currentPage === page ? "bg-yellow-400 text-black border-yellow-400 shadow-sm" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`}>
                {page}
              </Link>
            ))}
            {currentPage < totalPages ? (
              <Link href={`?page=${currentPage + 1}`} className="px-4 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all shadow-sm">
                Next &rarr;
              </Link>
            ) : (
              <button disabled className="px-4 py-2 text-xs font-bold text-gray-300 bg-gray-50 border border-gray-200 rounded-lg cursor-not-allowed">Next &rarr;</button>
            )}
          </div>
        </nav>

      </main>

      <Footer />
    </div>
  );
}