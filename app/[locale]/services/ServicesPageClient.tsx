"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
// 🔹 IMPORT UTAMA: Ganti "next/link" bawaan menjadi Link sakti dari i18n routing kita agar prefix /id tetap terjaga
import { Link } from "@/i18n/routing";
// 🔹 PERBAIKAN IMPORT: Hapus useLocale, ganti menjadi useTranslations sesuai petunjuk Screenshot 2026-06-09 214555.png
import { useTranslations } from "next-intl";
import Navbar from "@/components/layout/Navbar";

export default function ServicesPageClient({ initialServices }: { initialServices: any[] }) {
  const [active, setActive] = useState<number | null>(null);
  
  // 🔹 INISIALISASI TRANSLATION: Menambahkan scope kedalam berkas ServicesPage
  const t = useTranslations("ServicesPage");

  // Gunakan data dari database yang dilempar dari server component
  const services = initialServices;

  return (
    <main className="w-full bg-black">
      <Navbar />

      {/* 🔹 PERBAIKAN SEO: Menambahkan h1 sr-only statis tanpa conditional locale sesuai petunjuk gambar */}
      <h1 className="sr-only">Bali Limestone Construction Services</h1>

      {/* DESKTOP */}
      <section className="hidden md:flex h-screen">
        {services.map((service, index) => {
          const isActive = active === index;
          const noActive = active === null;

          // 🔹 PERBAIKAN PETUNJUK 1: Mengganti namaId/deskripsiId dengan mapping .title & .description langsung dari server
          const displayTitle = service.title || "Service";
          const displayDesc = service.description || "Full description coming soon.";

          return (
            <div
              key={index}
              onClick={() => setActive(isActive ? null : index)}
              className={`
                relative overflow-hidden cursor-pointer
                transition-all duration-700 ease-in-out
                border-l border-white/10
                ${noActive ? "flex-1" : isActive ? "flex-[4]" : "flex-[0.8]"}
              `}
            >
              {/* Background */}
              <div
                className="absolute inset-0 bg-cover bg-center scale-105 transition-all duration-700"
                style={{ backgroundImage: `url(${service.mainImage || service.gambar || "/Batukapur.jpg"})` }}
              />

              {/* Overlay */}
              <div
                className={`absolute inset-0 transition-all duration-700
                ${isActive || noActive ? "bg-black/45" : "bg-black/80"}`}
              />

              {/* Content */}
              <div className="relative z-10 flex flex-col justify-between h-full p-10">
                <div className="mt-36">

                  {/* Back Button */}
                  <div className={`overflow-hidden transition-all duration-500
                    ${isActive ? "max-h-20 opacity-100 mb-10" : "max-h-0 opacity-0"}`}>
                    <button
                      onClick={(e) => { e.stopPropagation(); setActive(null); }}
                      className="flex items-center gap-2 text-white/80 hover:text-yellow-400 transition"
                    >
                      <ArrowLeft size={18} />
                      {/* 🔹 SEKARANG: Menggunakan asisten teks terjemahan i18n */}
                      <span className="text-sm">{t("back")}</span>
                    </button>
                  </div>

                  {/* Title */}
                  <h1 className={`text-white font-bold leading-tight transition-all duration-700
                    ${isActive ? "text-6xl" : active !== null ? "text-4xl opacity-40" : "text-5xl"}`}>
                    {displayTitle}
                  </h1>

                  {/* Description */}
                  <div className={`overflow-hidden transition-all duration-700
                    ${isActive ? "max-h-60 opacity-100 mt-8" : "max-h-0 opacity-0"}`}>
                    <p className="text-white/80 text-sm leading-relaxed max-w-xl">
                      {displayDesc}
                    </p>
                  </div>
                </div>

                {/* Lihat Selengkapnya */}
                <div>
                  <Link
                    href={`/services/${service.slug}`}
                    onClick={(e) => e.stopPropagation()}
                    className={`flex items-center gap-3 text-white text-sm
                      transition-all duration-500
                      ${isActive || noActive ? "opacity-100" : "opacity-30 pointer-events-none"}`}
                  >
                    {/* 🔹 SEKARANG: Menggunakan kuncian kamus bahasa terjemahan */}
                    <span className="border-b border-white pb-1">
                      {t("viewDetails")}
                    </span>
                    <div className={`h-[1px] bg-white transition-all duration-700 ${isActive ? "w-28" : "w-0"}`} />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* MOBILE vertikal */}
      <section className="md:hidden flex flex-col h-screen pt-19">
        {services.map((service, index) => {
          const isActive = active === index;
          const noActive = active === null;

          // 🔹 PERBAIKAN PETUNJUK 2: Penerapan .title & .description di segmen Mobile
          const displayTitle = service.title || "Service";
          const displayDesc = service.description || "Full description coming soon.";

          return (
            <div
              key={index}
              className="relative overflow-hidden cursor-pointer border-b border-white/10 transition-all duration-500 ease-in-out"
              style={{
                flex: noActive ? 1 : isActive ? 4 : 0.5,
              }}
              onClick={() => setActive(isActive ? null : index)}
            >
              {/* Background */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-700"
                style={{ backgroundImage: `url(${service.mainImage || service.gambar || "/Batukapur.jpg"})` }}
              />

              {/* Overlay */}
              <div className={`absolute inset-0 transition-all duration-500
                ${isActive ? "bg-black/40" : "bg-black/70"}`} />

              {/* Content */}
              <div className="relative z-10 flex flex-col justify-between h-full p-6">
                <div>
                  {/* Back button */}
                  <div className={`overflow-hidden transition-all duration-500
                    ${isActive ? "max-h-10 opacity-100 mb-4" : "max-h-0 opacity-0"}`}>
                    <button
                      onClick={(e) => { e.stopPropagation(); setActive(null); }}
                      className="flex items-center gap-2 text-white/70 hover:text-yellow-400 transition text-sm"
                    >
                      <ArrowLeft size={16} />
                      <span>{t("back")}</span>
                    </button>
                  </div>

                  {/* Title */}
                  <h2 className={`text-white font-bold leading-tight transition-all duration-500
                    ${isActive ? "text-3xl text-yellow-400" : active !== null ? "text-base opacity-50" : "text-xl"}`}>
                    {displayTitle}
                  </h2>

                  {/* Description */}
                  <div className={`overflow-hidden transition-all duration-500
                    ${isActive ? "max-h-40 opacity-100 mt-4" : "max-h-0 opacity-0"}`}>
                    <p className="text-white/80 text-sm leading-relaxed">
                      {displayDesc}
                    </p>
                  </div>
                </div>

                {/* Lihat Selengkapnya */}
                <div className={`overflow-hidden transition-all duration-500
                  ${isActive ? "max-h-10 opacity-100" : "max-h-0 opacity-0"}`}>
                  <Link
                    href={`/services/${service.slug}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-3 text-white text-sm"
                  >
                    <span className="border-b border-white pb-1">
                      {t("viewDetails")}
                    </span>
                    <div className={`h-[1px] bg-white transition-all duration-700 ${isActive ? "w-16" : "w-0"}`} />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* TABLET: 2 kolom grid */}
      <section className="hidden sm:grid md:hidden grid-cols-2 min-h-screen pt-24">
        {services.map((service, index) => {
          const isActive = active === index;

          // 🔹 PERBAIKAN PETUNJUK 3: Penerapan .title & .description di segmen Tablet Grid
          const displayTitle = service.title || "Service";
          const displayDesc = service.description || "Full description coming soon.";

          return (
            <div
              key={index}
              className="relative overflow-hidden cursor-pointer border border-white/10 transition-all duration-500"
              style={{ minHeight: "240px" }}
              onClick={() => setActive(isActive ? null : index)}
            >
              {/* Background */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${service.mainImage || service.gambar || "/Batukapur.jpg"})` }}
              />

              {/* Overlay */}
              <div className={`absolute inset-0 transition-all duration-500
                ${isActive ? "bg-black/35" : "bg-black/65"}`} />

              {/* Content */}
              <div className="relative z-10 flex flex-col justify-between h-full p-6">
                <div>
                  {/* Title */}
                  <h2 className={`text-white font-bold transition-all duration-500
                    ${isActive ? "text-2xl text-yellow-400" : "text-lg"}`}>
                    {displayTitle}
                  </h2>

                  {/* Description */}
                  <div className={`overflow-hidden transition-all duration-500
                    ${isActive ? "max-h-40 opacity-100 mt-3" : "max-h-0 opacity-0"}`}>
                    <p className="text-white/80 text-xs leading-relaxed">
                      {displayDesc}
                    </p>
                  </div>
                </div>

                {/* Lihat Selengkapnya */}
                <div className={`overflow-hidden transition-all duration-500
                  ${isActive ? "max-h-10 opacity-100 mt-3" : "max-h-0 opacity-0"}`}>
                  <Link
                    href={`/services/${service.slug}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-white text-xs border-b border-white pb-1"
                  >
                    {t("viewDetails")}
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </section>

    </main>
  );
}