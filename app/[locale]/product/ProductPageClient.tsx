"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/layout/ProductCard";
import ProductModal from "@/components/layout/ProductModal";

type ProductPageClientProps = {
  initialProducts: any[];
  categories: string[];
};

export default function ProductPageClient({ initialProducts, categories }: ProductPageClientProps) {
  const t = useTranslations("ProductPage");
  const [activeCategory, setActiveCategory] = useState(categories[0] ?? "All Products");
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [showFilter, setShowFilter] = useState(false);

  // Fungsi filter pencarian dan kategori berbasis data dinamis database
  const filtered = useMemo(() => {
    return initialProducts.filter((p) => {
      const matchCategory =
        activeCategory === categories[0] || p.category === activeCategory;
      const matchSearch = p.nama.toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [activeCategory, search, initialProducts]);

  return (
    <>
      <Navbar variant="dark" />

      <main
        className="min-h-screen text-gray-900 pt-0 md:pt-32"
        style={{
          fontFamily: "'Inter', sans-serif",
          background: "linear-gradient(135deg, #f0f4ff 0%, #fef9ec 50%, #f0fdf4 100%)",
        }}
      >
        {/* Banner */}
        <section className="mt-[100px] md:mt-0 md:mx-10 md:rounded-3xl overflow-hidden relative h-58 md:h-90">
          <Image
            src="/ZURRRRRRRR.png"
            alt="Selling"
            fill
            className="object-cover object-center"
            priority
          />
        </section>

        {/* ── MOBILE Search & Filter Icon ── */}
        <section className="md:hidden mx-4 mt-6 flex items-center gap-3">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center justify-center w-11 h-11 rounded-lg bg-white/70 border border-gray-200 shrink-0"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="6" y1="12" x2="18" y2="12"/>
              <line x1="9" y1="18" x2="15" y2="18"/>
            </svg>
          </button>
          <div className="relative flex-1">
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-200 bg-white/70 rounded-lg pl-4 pr-10 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            />
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
          </div>
        </section>

        {/* Mobile filter dropdown */}
        {showFilter && (
          <div className="md:hidden mx-4 mt-2 rounded-2xl p-4 bg-white/80 border border-gray-200 shadow-sm">
           <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
            {t("category")}
            </p>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat: string) => (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setShowFilter(false); }}
                  className={`text-sm px-4 py-2 rounded-xl transition-all duration-200 ${
                    activeCategory === cat
                      ? "bg-yellow-400 text-black font-bold"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* DESKTOP Search */}
        <section className="hidden md:flex mx-10 mt-8 items-center justify-between gap-4 flex-wrap">
          <div className="relative">
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64 border border-gray-200 bg-white/70 rounded-lg pl-4 pr-10 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            />
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
          </div>
          <span className="bg-yellow-400 text-gray-900 text-sm font-semibold px-5 py-2 rounded-lg">
            {activeCategory}
          </span>
        </section>

        {/* DESKTOP Main Grid */}
        <section className="hidden md:flex mx-10 mt-8 pb-20 gap-6 items-start">
          <aside
            className="w-56 shrink-0 rounded-3xl p-5 sticky top-28"
            style={{
              background: "rgba(255, 255, 255, 0.25)",
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
              border: "1px solid rgba(255, 255, 255, 0.45)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.6)",
            }}
          >
           <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">{t("category")}</p>
            <ul className="flex flex-col gap-2">
              {categories.map((cat: string) => (
                <li key={cat}>
                  <button
                    onClick={() => setActiveCategory(cat)}
                    className={`w-full text-left text-sm px-4 py-3 rounded-2xl transition-all duration-200 ${
                      activeCategory === cat
                        ? "bg-yellow-400 text-black font-bold shadow"
                        : "text-gray-500 hover:bg-white/40"
                    }`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <div className="flex-1">
            {filtered.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filtered.map((product: any) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    aspectRatio="aspect-[410/550]"
                    onClick={() => setSelectedProduct(product)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
                {t("noProducts")}
              </div>
            )}
          </div>
        </section>

        {/* ── MOBILE: Grid 2 kolom ── */}
        <section className="md:hidden mx-4 mt-6 pb-20">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {filtered.map((product: any) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  aspectRatio="aspect-[410/550]"
                  onClick={() => setSelectedProduct(product)}
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
              {t("noProducts")}
            </div>
          )}
        </section>

      </main>

      <Footer />

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
}