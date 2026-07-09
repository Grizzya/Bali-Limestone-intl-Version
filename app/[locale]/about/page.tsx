import type { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getTranslations } from "next-intl/server";

export const revalidate = 0;

// ─── GENERATE METADATA SEO ABOUT PAGE (SUDAH DIPERBARUI) ───
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isId = locale === "id";
  
  return {
    title: isId ? "Tentang Kami" : "About Us",
    description: isId
      ? "Kenali Bali Limestone — supplier material konstruksi dan alat berat terpercaya di Bali dengan pengalaman lebih dari 10 tahun dan lebih dari 1.000 proyek sukses."
      : "Learn about Bali Limestone — Bali's trusted construction material supplier with over 10 years of experience and 1,000+ successful projects across the island.",
    alternates: { canonical: `https://balilimestone.com/${locale}/about` },
    openGraph: {
      title: isId ? "Tentang Kami | Bali Limestone" : "About Bali Limestone | Trusted Construction Supplier",
      description: isId
        ? "Lebih dari 10 tahun pengalaman menyediakan material premium dan alat berat di Bali."
        : "Over 10 years of experience supplying premium limestone and construction materials across Bali.",
      url: `https://balilimestone.com/${locale}/about`,
    },
  };
}

// ─── MAIN PAGE COMPONENT ───
export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: "about",
  });

  return (
    <>
      <Navbar variant="dark" />

      <main className="min-h-screen bg-white text-gray-900 font-sans">
        {/* ABOUT SECTION */}
        <section
          className="px-6 md:px-10 pt-32 pb-20 max-w-6xl mx-auto"
          aria-labelledby="about-page-heading"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <h1
              id="about-page-heading"
              className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-none tracking-tight text-gray-900"
            >
              {t("title")}
            </h1>

            <p className="text-base leading-relaxed text-gray-600 md:pt-2">
              {t("description")}
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="bg-yellow-400 rounded-xl p-8 text-center">
              <p className="text-4xl font-extrabold text-black">1,000+</p>
              <p className="mt-2 text-black font-medium">
                {t("stats.projects")}
              </p>
            </div>

            <div className="bg-yellow-400 rounded-xl p-8 text-center">
              <p className="text-4xl font-extrabold text-black">90%</p>
              <p className="mt-2 text-black font-medium">
                {t("stats.satisfaction")}
              </p>
            </div>

            <div className="bg-yellow-400 rounded-xl p-8 text-center">
              <p className="text-4xl font-extrabold text-black">10+</p>
              <p className="mt-2 text-black font-medium">
                {t("stats.experience")}
              </p>
            </div>
          </div>
        </section>

        {/* BANNER */}
        <section
          className="relative w-full h-[420px] overflow-hidden mt-20 mb-20"
          aria-label="Bali Limestone banner"
        >
          <Image
            src="/aboutp.jpg"
            alt="Bali Limestone"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[0px_-560px]"
            quality={80}
          />

          <div className="absolute inset-0 bg-black/55 z-10" />

          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4">
            <Image
              src="/LOGOS.png"
              alt="Bali Limestone Logo"
              width={400}
              height={200}
              className="object-contain"
            />
          </div>
        </section>

        {/* WHY CHOOSE US */}
        <section
          className="px-6 md:px-10 pb-24 max-w-6xl mx-auto"
          aria-labelledby="why-us-heading"
        >
          <h2
            id="why-us-heading"
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-10 text-center"
          >
            {t("whyChoose")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t("cards.quality.title")}
              </h3>

              <p className="text-gray-500 text-sm leading-relaxed">
                {t("cards.quality.description")}
              </p>
            </div>

            <div className="border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t("cards.delivery.title")}
              </h3>

              <p className="text-gray-500 text-sm leading-relaxed">
                {t("cards.delivery.description")}
              </p>
            </div>

            <div className="border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t("cards.team.title")}
              </h3>

              <p className="text-gray-500 text-sm leading-relaxed">
                {t("cards.team.description")}
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}