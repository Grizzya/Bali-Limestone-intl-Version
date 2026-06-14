"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

type CardProps = {
  slug: string;
  img: string;
  title: string;
};

export default function Services({ services }: { services: any[] }) {
  const t = useTranslations("Services");
  const locale = useLocale();
  const [active, setActive]       = useState<number | null>(null);
  const [current, setCurrent]     = useState(0);
  const [direction, setDirection] = useState(1);

  const safeServices = services?.length >= 4 ? services : [
    ...(services || []),
    ...Array(Math.max(0, 4 - (services?.length || 0))).fill({
      mainImage: "/Dummy.webp",
      slug: "coming-soon",
      nama: "Coming Soon",
      namaId: "Coming Soon",
    }),
  ];

  // Ambil nama sesuai locale dari database
  const getName = (service: any) =>
    locale === "id"
      ? service.namaId || service.nama || service.title
      : service.nama || service.title;

  const isLeftActive  = active === 2 || active === 3;
  const isRightActive = active === 1 || active === 4;

  const prev = () => { setDirection(-1); setCurrent((c) => (c === 0 ? safeServices.length - 1 : c - 1)); };
  const next = () => { setDirection(1);  setCurrent((c) => (c === safeServices.length - 1 ? 0 : c + 1)); };

  return (
    <div className="bg-white">
      <section className="bg-[#1a1a1a] text-white py-20 overflow-hidden rounded-t-[25px]" aria-labelledby="services-heading">
        <div className="max-w-8xl mx-auto px-12">

          {/* ── MOBILE ── */}
          <div className="lg:hidden">
            <h2 id="services-heading" className="text-4xl font-bold mb-4 leading-tight">
              {t("sectionTitle")}
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed mb-8">
              {t("sectionSubtitle")}
            </p>

            <div className="relative -mx-12 overflow-hidden">
              <div className="relative w-full h-[340px]">
                <AnimatePresence initial={false} custom={direction}>
                  <motion.div
                    key={current}
                    custom={direction}
                    variants={{
                      enter:  (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
                      center: { x: 0, opacity: 1 },
                      exit:   (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
                    }}
                    initial="enter" animate="center" exit="exit"
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <Link href={`/services/${safeServices[current].slug}`} className="block w-full h-full">
                      <img
                        src={safeServices[current].mainImage}
                        alt={`${getName(safeServices[current])} – Bali Limestone service`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        width={800}
                        height={340}
                      />
                      <div className="absolute bottom-0 left-0 w-full bg-yellow-400 text-black px-6 py-3 flex justify-between items-center">
                        <span className="font-semibold text-base">
                          {getName(safeServices[current])}
                        </span>
                        <span className="text-xl" aria-hidden="true">›</span>
                      </div>
                    </Link>
                  </motion.div>
                </AnimatePresence>

                <button onClick={(e) => { e.preventDefault(); prev(); }} aria-label="Previous service"
                  className="absolute left-0 top-0 z-10 h-full w-16 flex items-center justify-start pl-3 bg-gradient-to-r from-black/30 to-transparent text-white">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>

                <button onClick={(e) => { e.preventDefault(); next(); }} aria-label="Next service"
                  className="absolute right-0 top-0 z-10 h-full w-16 flex items-center justify-end pr-3 bg-gradient-to-l from-black/30 to-transparent text-white">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex justify-center gap-2 mt-4" role="tablist" aria-label="Service slides">
              {safeServices.map((_, i) => (
                <button key={i} role="tab" aria-selected={i === current} aria-label={`Go to service ${i + 1}`}
                  onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                  className={`h-2 rounded-full transition-all duration-300 ${i === current ? "bg-yellow-400 w-5" : "bg-white/30 w-2"}`}
                />
              ))}
            </div>
          </div>

          {/* ── DESKTOP ── */}
          <div className="hidden lg:block">
            <div className="flex flex-col lg:flex-row gap-4 h-auto lg:h-137.5">

              <motion.div layout style={{ flex: isLeftActive ? 1.5 : isRightActive ? 0.8 : 1 }} className="flex flex-col gap-4">
                <motion.div layout style={{ flex: isLeftActive ? 0.6 : 1 }} className="flex flex-col justify-center">
                  <h2 id="services-heading" className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                    {t("sectionTitle").split(" ")[0]} <br className="hidden lg:block" />
                    {t("sectionTitle").split(" ").slice(1).join(" ")}
                  </h2>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {t("sectionSubtitle")}
                  </p>
                </motion.div>

                <motion.div layout style={{ flex: isLeftActive ? 1.8 : 1 }} className="flex gap-4 min-h-50 lg:min-h-0">
                  <motion.div layout onMouseEnter={() => setActive(2)} onMouseLeave={() => setActive(null)}
                    style={{ flex: active === 2 ? 1.8 : active === 3 ? 0.6 : 1 }}
                    className="relative rounded-xl overflow-hidden w-full">
                    <Card title={getName(safeServices[1])} img={safeServices[1].mainImage} slug={safeServices[1].slug} />
                  </motion.div>
                  <motion.div layout onMouseEnter={() => setActive(3)} onMouseLeave={() => setActive(null)}
                    style={{ flex: active === 3 ? 1.8 : active === 2 ? 0.6 : 1 }}
                    className="relative rounded-xl overflow-hidden w-full">
                    <Card title={getName(safeServices[0])} img={safeServices[0].mainImage} slug={safeServices[0].slug} />
                  </motion.div>
                </motion.div>
              </motion.div>

              <motion.div layout style={{ flex: isRightActive ? 1.6 : isLeftActive ? 0.8 : 1.2 }} className="flex flex-col gap-4">
                <motion.div layout onMouseEnter={() => setActive(1)} onMouseLeave={() => setActive(null)}
                  style={{ flex: active === 1 ? 1.8 : active === 4 ? 0.6 : 1 }}
                  className="relative rounded-xl overflow-hidden w-full min-h-50 lg:min-h-0">
                  <Card title={getName(safeServices[2])} img={safeServices[2].mainImage} slug={safeServices[2].slug} />
                </motion.div>
                <motion.div layout onMouseEnter={() => setActive(4)} onMouseLeave={() => setActive(null)}
                  style={{ flex: active === 4 ? 1.8 : active === 1 ? 0.6 : 1 }}
                  className="relative rounded-xl overflow-hidden w-full min-h-50 lg:min-h-0">
                  <Card title={getName(safeServices[3])} img={safeServices[3].mainImage} slug={safeServices[3].slug} />
                </motion.div>
              </motion.div>

            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

function Card({ title, img, slug }: CardProps) {
  return (
    <Link href={`/services/${slug}`} className="block w-full h-full">
      <div className="w-full h-full relative group cursor-pointer">
        <img
          src={img}
          alt={`${title} – Bali Limestone service`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          width={600}
          height={400}
        />
        <div className="absolute bottom-0 left-0 w-full bg-[#ffcc00] text-black px-4 py-3 flex justify-between items-center transition-all duration-300">
          <span className="font-medium text-sm md:text-base">{title}</span>
          <span aria-hidden="true">›</span>
        </div>
      </div>
    </Link>
  );
}