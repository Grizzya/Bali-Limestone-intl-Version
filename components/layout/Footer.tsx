"use client";


import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="bg-[#1a1a1a] pt-16 md:pt-24 pb-10 md:pb-12" aria-label="Site footer">
      <div className="w-full max-w-8xl mx-auto px-6 sm:px-8 md:px-12">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">

          {/* Logo */}
         <div className="lg:col-span-4 flex justify-center lg:justify-start items-center lg:items-start overflow-hidden">
          <img
            src="/LOGOS.png"
            alt="Bali Limestone – Construction Material Supplier in Bali"
            className="object-contain object-center"
            style={{
              width: "240px",
              height: "240px",
              position: "relative",
              left: "0px",        
              top: "0px",
            }}
           
            loading="lazy"
            width={240}
            height={240}
          />
        </div>

          <div className="lg:col-span-8 flex flex-col sm:flex-row justify-center lg:justify-center items-center sm:items-start gap-12 sm:gap-20 lg:gap-[150px] text-center sm:text-left">

            {/* Explore */}
            <nav aria-label="Footer navigation">
              <h3 className="text-white text-[20px] md:text-[22px] font-medium mb-6 md:mb-8">
                {t("explore")}
              </h3>

              <ul className="flex flex-col gap-4 md:gap-5">
                {[
                  { label: t("home"), href: "/" },
                  { label: t("about"), href: "/about" },
                  { label: t("services"), href: "/services" },
                  { label: t("products"), href: "/product" },
                ].map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-gray-400 hover:text-white transition-colors text-[15px] md:text-[16px] font-light"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Contact */}
            <div>
              <h3 className="text-white text-[20px] md:text-[22px] font-medium mb-6 md:mb-8">
                {t("contact")}
              </h3>

              <address className="flex flex-col gap-4 md:gap-5 not-italic">
                <a
                  href="mailto:balilimestone@gmail.com"
                  className="text-gray-400 hover:text-white transition-colors text-[15px] md:text-[16px] font-light break-all"
                >
                  balilimestone@gmail.com
                </a>

                <a
                  href="tel:+628181802020"
                  className="text-gray-400 hover:text-white transition-colors text-[15px] md:text-[16px] font-light"
                >
                  +62 818-1802-020
                </a>
              </address>
            </div>

          </div>
        </div>

        {/* SOCIAL */}
        <div className="flex items-center justify-between w-full mt-28">
          <div className="h-[1px] bg-gray-600 flex-1" aria-hidden="true" />

          <div className="flex items-center gap-8 px-8">

            <a
              href="#"
              aria-label="Bali Limestone on Facebook"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-[26px] h-[26px]" aria-hidden="true">
                <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z"/>
              </svg>
            </a>

            <a
              href="https://wa.me/628181802020"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Bali Limestone on WhatsApp"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-[26px] h-[26px]" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.452-.885-.77-1.482-1.72-1.655-2.018-.173-.298-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01a1.183 1.183 0 0 0-.86.4 3.613 3.613 0 0 0-1.124 2.684c0 1.56 1.149 3.067 1.309 3.265.159.198 2.228 3.398 5.4 4.707 3.172 1.31 3.172.873 3.746.823.574-.05 1.758-.718 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
            </a>

            <a
              href="#"
              aria-label="Bali Limestone on Instagram"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-[26px] h-[26px]" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
              </svg>
            </a>

          </div>

          <div className="h-[1px] bg-gray-600 flex-1" aria-hidden="true" />
        </div>

      </div>
    </footer>
  );
}