import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;

const WA_PATH = "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.452-.885-.77-1.482-1.72-1.655-2.018-.173-.298-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01a1.183 1.183 0 0 0-.86.4 3.613 3.613 0 0 0-1.124 2.684c0 1.56 1.149 3.067 1.309 3.265.159.198 2.228 3.398 5.4 4.707 3.172 1.31 3.172.873 3.746.823.574-.05 1.758-.718 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z";

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }): Promise<Metadata> {
  const { slug, locale } = await params;
  const service = await prisma.jasa.findUnique({ where: { id: slug } });
  if (!service) return {};
  const name = locale === "id" ? (service.namaId || service.nama) : service.nama;
  const desc = locale === "id" ? (service.deskripsiId || service.deskripsi) : service.deskripsi;
  return {
    title: name,
    description: `${desc?.slice(0, 155) ?? "Professional construction service by Bali Limestone in Bali, Indonesia."}`,
    alternates: { canonical: `https://balilimestone.com/${locale}/services/${slug}` },
    openGraph: {
      title: `${name} | Bali Limestone`,
      description: desc ?? "",
      url: `https://balilimestone.com/${locale}/services/${slug}`,
      images: service.gambar ? [{ url: service.gambar, alt: name }] : [],
    },
  };
}

export default async function ServiceDetail({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params;

  const [service, t] = await Promise.all([
    prisma.jasa.findUnique({ where: { id: slug } }),
    getTranslations({ locale, namespace: "ServiceDetail" }),
  ]);

  if (!service) return notFound();

  const name = locale === "id" ? (service.namaId || service.nama) : service.nama;
  const desc = locale === "id" ? (service.deskripsiId || service.deskripsi) : service.deskripsi;
  const gallery: string[] = [];
  if (service.gambar2) gallery.push(service.gambar2);
  if (service.gambar3) gallery.push(service.gambar3);

  return (
    <>
      <Navbar variant="dark" />

      <section className="bg-white pt-28 lg:pt-40 pb-16 lg:pb-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12">

          {/* HEADER */}
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">{name}</h1>
            <p className="text-gray-400 text-[15px] leading-relaxed px-4 md:px-12">
              {t("subtitle")}
            </p>
          </div>

          {/* MAIN IMAGE */}
          <div className="w-full h-[220px] md:h-[450px] lg:h-[500px] rounded-xl overflow-hidden mb-20">
            <img
              src={service.gambar || "/Dummy.webp"}
              alt={`${name} – Bali Limestone construction service in Bali`}
              className="w-full h-full object-cover"
              loading="lazy"
              width={1200}
              height={500}
            />
          </div>

          {/* CONTENT GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

            {/* Description */}
            <div className="lg:col-span-8">
              <h2 className="text-[28px] font-bold text-black mb-4">{t("descriptionTitle")}</h2>
              <p className="text-gray-600 text-[16px] leading-relaxed mb-10 text-justify">{desc}</p>

              {gallery.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {gallery.map((img, index) => (
                    <div key={index} className="w-full h-[200px] md:h-[250px] overflow-hidden rounded-lg">
                      <img
                        src={img}
                        alt={`${name} – project gallery image ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        width={600}
                        height={250}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="lg:col-span-4 self-start sticky top-28">
              <div className="bg-[#ffcc00] rounded-2xl p-7 flex flex-col gap-5">

                <div className="flex items-center gap-2 bg-black/10 rounded-full px-3 py-1 w-fit">
                  <svg viewBox="0 0 24 24" fill="#25d366" className="w-3 h-3" aria-hidden="true">
                    <path d={WA_PATH} />
                  </svg>
                  <span className="text-xs font-medium text-[#3a2e00]">{t("ctaBadge")}</span>
                </div>

                <div>
                  <h3 className="text-[#1a1400] text-[22px] font-semibold leading-snug">
                    {t("ctaTitle")}
                  </h3>
                  <p className="mt-2 text-sm text-[#3a2e00] leading-relaxed">
                    {t("ctaSubtitle")}
                  </p>
                </div>

                <div className="h-px bg-black/15" />

                <a
                  href="https://wa.me/628181802020"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Contact Bali Limestone via WhatsApp"
                  className="bg-[#1a1a1a] hover:bg-black text-[#ffcc00] rounded-xl px-5 py-3.5 flex items-center justify-between transition-colors duration-200"
                >
                  <div className="flex items-center gap-3">
                    <svg viewBox="0 0 24 24" fill="#25d366" className="w-7 h-7 shrink-0" aria-hidden="true">
                      <path d={WA_PATH} />
                    </svg>
                    <div>
                      <span className="block text-[11px] text-[#ffcc0099] leading-none mb-1">
                        {t("ctaBtnLabel")}
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
      </section>

      <Footer />
    </>
  );
}