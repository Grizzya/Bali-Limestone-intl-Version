import { useTranslations } from "next-intl";

export default function About() {
  const t = useTranslations("About");

  return (
    <section className="bg-white py-16 md:py-20" aria-labelledby="about-heading">
      <div className="max-w-8xl mx-auto px-6 md:px-10 lg:px-12">

        <div className="grid md:grid-cols-12 gap-4 md:gap-0 items-start mb-10 md:mb-16 lg:mb-25">
          <h2
            id="about-heading"
            className="md:col-span-3 text-black text-[28px] md:text-[32px] lg:text-[36px] font-semibold"
          >
            {t("title")}
          </h2>
          <p className="md:col-span-9 text-gray-600 text-[16px] md:text-[18px] lg:text-[20px] leading-relaxed">
            {t("description")}
          </p>
        </div>

      </div>

      {/* Mobile */}
      <div className="relative md:hidden w-full h-[320px]">
        <img
          src="/drone1.jpg"
          alt="Bali Limestone construction project in Bali, Indonesia"
          className="w-full h-full object-cover"
          loading="lazy"
          width={800}
          height={320}
        />
        <div className="absolute inset-0 flex flex-col justify-center items-end gap-3">
          {[
            { value: t("stat1Value"), label: t("stat1Label") },
            { value: t("stat2Value"), label: t("stat2Label") },
            { value: t("stat3Value"), label: t("stat3Label") },
          ].map((stat, i) => (
            <div key={i} className="bg-yellow-400 rounded-l-xl px-5 flex items-center" style={{ width: "187px", height: "53px" }}>
              <div>
                <p className="text-black font-bold text-xl leading-tight">{stat.value}</p>
                <p className="text-black text-xs">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:block max-w-8xl mx-auto px-10 lg:px-12">
        <div className="grid md:grid-cols-3 gap-8 md:items-stretch">
          <div className="md:col-span-2 min-w-0 relative overflow-hidden rounded-2xl">
            <img
              src="/drone1.jpg"
              alt="Bali Limestone team and construction equipment in Bali"
              className="w-full h-full object-cover"
              loading="lazy"
              width={800}
              height={600}
            />
          </div>
          <div className="flex flex-col gap-5">
            {[
              { value: t("stat1Value"), label: t("stat1Label") },
              { value: t("stat2Value"), label: t("stat2Label") },
              { value: t("stat3Value"), label: t("stat3Label") },
            ].map((stat, i) => (
              <div key={i} className="bg-yellow-400 rounded-xl p-6 flex flex-col justify-center flex-1">
                <p className="text-black font-bold text-3xl">{stat.value}</p>
                <p className="text-black">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}