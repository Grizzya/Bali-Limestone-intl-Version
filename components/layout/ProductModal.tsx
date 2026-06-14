"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function ProductModal({
  product,
  onClose,
}: {
  product: any;
  onClose: () => void;
}) {
  // Ambil data locale yang diteruskan dari objek product parent
  const locale = product?.locale || "id";
  const t = useTranslations("ProductModal");

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  // Menyesuaikan dengan kolom database Prisma & Fallback Bahasa
  const displayTitle =
    locale === "id"
      ? product?.namaId || product?.nama || product?.title || "Product"
      : product?.nama || product?.title || "Product";

  const displayImage =
    product?.gambar || product?.image || "/Batukapur.jpg";

  const displayDesc =
    locale === "id"
      ? product?.deskripsiId ||
        product?.deskripsi ||
        product?.description ||
        "Full product description coming soon."
      : product?.deskripsi ||
        product?.description ||
        "Full product description will be available soon.";

  const pesanTemplate = t("waTemplate", {
    productName: displayTitle,
  });

  const linkWaDinamis = `https://wa.me/6282144358100?text=${encodeURIComponent(
    pesanTemplate
  )}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col md:flex-row overflow-hidden shadow-2xl
                   w-full max-w-[335px] h-[440px] rounded-[10px]
                   md:max-w-[934px] md:h-[596px] md:rounded-[25px] md:bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ─── VERSI MOBILE: Background Image ─── */}
        <div className="absolute inset-0 md:hidden z-0">
          <Image
            src={displayImage}
            alt={displayTitle}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* ─── VERSI DESKTOP: Gambar di Kiri 50% ─── */}
        <div className="hidden md:block relative w-1/2 h-full shrink-0 z-0">
          <Image
            src={displayImage}
            alt={displayTitle}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* ─── KONTEN TEKS & TOMBOL ─── */}
        <div className="relative z-10 flex flex-col justify-between h-full p-8 md:w-1/2 md:px-12 md:py-12">
          <div className="flex flex-col gap-4 md:gap-8 mt-6 md:mt-0">
            <h2
              className="text-white md:text-gray-900 text-4xl md:text-5xl leading-tight drop-shadow-md md:drop-shadow-none"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 800,
              }}
            >
              {displayTitle}
            </h2>

            <p
              className="text-white/90 md:text-gray-600 text-sm leading-relaxed text-justify line-clamp-5 md:line-clamp-none drop-shadow md:drop-shadow-none"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 300,
              }}
            >
              {displayDesc}
            </p>
          </div>

          {/* LINK WHATSAPP REDIRECT */}
          <a
            href={linkWaDinamis}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#ffcc00] hover:bg-yellow-500 text-black py-3 md:py-4 mt-6 transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-lg md:shadow rounded-[10px] md:rounded-xl flex items-center justify-center text-center"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              fontSize: "15px",
            }}
          >
            {t("orderNow")}
          </a>
        </div>

        {/* ─── TOMBOL CLOSE (X) ─── */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 md:top-5 md:right-5 flex items-center justify-center z-20 transition-all
                     w-8 h-8 text-white hover:text-gray-300
                     md:w-10 md:h-10 md:bg-white/80 md:hover:bg-white
                     md:rounded-full md:text-gray-600 md:hover:text-black md:shadow"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-7 h-7 md:w-6 md:h-6"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}