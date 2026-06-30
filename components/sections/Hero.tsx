import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Hero() {
  const t = useTranslations("Hero");

  return (
    <section className="relative h-screen min-h-150 text-white" aria-label="Hero">

      <Image
        src="/heros1.jpg"
        alt="Heavy equipment and limestone materials at a Bali Limestone construction site"
        fill
        className="object-cover object-center"
        priority
        sizes="100vw"
        quality={85}
      />

      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />

      <div className="relative z-10 h-full flex items-end md:items-center">
        <div className="w-full max-w-8xl mx-auto px-6 md:px-10 lg:px-12 pb-16 md:pb-0 pt-0 md:pt-24">

          <h1 className="
            text-[1.75rem] leading-tight font-extrabold
            sm:text-3xl
            md:text-4xl md:max-w-lg
            lg:text-5xl lg:max-w-2xl
          ">
            {t("title")}
          </h1>

          <p className="
            mt-4 text-sm text-gray-200 leading-relaxed
            max-w-xs
            md:text-base md:max-w-md
            lg:max-w-xl
          ">
            {t("subtitle")}
          </p>

          <Link
            href="https://wa.me/628181802020"
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-block mt-8 bg-yellow-400 text-black font-semibold rounded-lg
              px-7 py-3 text-sm
              md:mt-10 md:px-8 md:py-3 md:text-base
              lg:mt-14
              hover:opacity-90 transition
            "
            aria-label="Contact Bali Limestone via WhatsApp"
          >
            {t("cta")}
          </Link>

        </div>
      </div>
    </section>
  );
}