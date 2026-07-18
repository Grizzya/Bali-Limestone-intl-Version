"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";

type Article = {
  id: string;
  slug: string;
  judul: string;
  judulId?: string | null;
  konten?: string | null;
  kontenId?: string | null;
  gambar?: string | null;
  createdAt: Date | string;
};

export default function ArticleSection({ articles }: { articles: Article[] }) {
  const t = useTranslations("HomeArticle");
  const locale = useLocale();

  if (!articles || articles.length === 0) return null;

  const getJudul = (a: Article) =>
    locale === "id" ? (a.judulId || a.judul) : a.judul;

  const getSnippet = (a: Article) => {
    const raw = locale === "id" ? (a.kontenId || a.konten) : a.konten;
    return raw ? raw.replace(/<[^>]*>/g, "").slice(0, 120) + "..." : "";
  };

  const formatDate = (d: Date | string) =>
    new Date(d).toLocaleDateString(locale === "id" ? "id-ID" : "en-US", {
      day: "numeric", month: "short", year: "numeric",
    });

  return (
    <div className="bg-[#ffffff]">
    <section
      className="py-16 px-6 md:px-16 rounded-t-[50px]" 
  style={{ background: "#111111" }}
  aria-labelledby="article-section-heading"
    >

      {/* HEADER */}
      <div className="mb-10">
        <p className="text-[#D4AF37] text-xs font-extrabold uppercase tracking-widest mb-2">
          {t("eyebrow")}
        </p>
        <h2
          id="article-section-heading"
          className="text-3xl md:text-4xl font-extrabold text-white"
        >
          {t("title")}
        </h2>
      </div>

      {/* GRID ARTIKEL */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/articles/${article.slug}`}
            className="group block"
          >
            {/* LIQUID GLASS CARD */}
            <div
              className="rounded-2xl overflow-hidden transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-2xl"
              style={{
                background: "rgba(255, 255, 255, 0.06)",
                backdropFilter: "blur(24px) saturate(180%)",
                WebkitBackdropFilter: "blur(24px) saturate(180%)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
              }}
            >
              {/* Gambar */}
              {article.gambar && (
                <div className="w-full relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={article.gambar}
                    alt={`${getJudul(article)} – Bali Limestone artikel`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Gradient bawah gambar */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                  {/* Top shine */}
                  <div
                    className="absolute top-0 left-0 right-0 h-px"
                    style={{
                      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)"
                    }}
                  />
                </div>
              )}

              {/* Teks — glass content area */}
              <div className="p-5">
                <time
                  dateTime={new Date(article.createdAt).toISOString()}
                  className="text-[#D4AF37] text-[11px] font-extrabold uppercase tracking-widest mb-2 block"
                >
                  {formatDate(article.createdAt)}
                </time>

                <h3 className="text-base md:text-lg font-bold text-white leading-snug mb-2 group-hover:text-[#D4AF37] transition-colors duration-300 line-clamp-2">
                  {getJudul(article)}
                </h3>

                <p className="text-white/50 text-sm leading-relaxed line-clamp-3">
                  {getSnippet(article)}
                </p>

                {/* Read more */}
                <div className="flex items-center gap-1 mt-4 text-[#D4AF37] text-xs font-bold">
                  <span>{t("readMore")}</span>
                  <svg
                    className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300"
                    fill="none" stroke="currentColor" strokeWidth={2.5}
                    viewBox="0 0 24 24" aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              {/* Bottom shine */}
              <div
                className="h-px mx-4"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)"
                }}
              />

            </div>
          </Link>
        ))}
      </div>

      {/* VIEW ALL */}
      <div className="flex justify-center md:justify-end mt-12">
        <Link
          href="/articles"
          className="border border-white/50 text-white/90 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-300 px-7 py-2.5 rounded-xl text-sm font-bold"
        >
          {t("viewAll")}
        </Link>
      </div>

    </section>
    </div>
  );

}