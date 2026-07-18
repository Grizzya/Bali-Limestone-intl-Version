import { useTranslations } from "next-intl";

export default function FindUs() {
  const t = useTranslations("location");

  return (
    <div className="bg-[#000000]">
     <section className="py-12 md:py-20 bg-white rounded-t-[50px]" aria-label="Our location">
      <div className="w-full max-w-8xl mx-auto px-4 md:px-8 lg:px-12">
        
        {/* Tinggi dipertahankan di md:h-[421px] sesuai request Anda */}
        <div className="relative rounded-[24px] md:rounded-[40px] w-full h-[300px] md:h-[421px] overflow-hidden shadow-sm">

          <iframe
            src="https://maps.google.com/maps?q=Jl.+Raya+Dalung+No.83,+Badung,+Bali&t=&z=16&ie=UTF8&iwloc=&output=embed"
            loading="lazy"
            title="Bali Limestone office location on Google Maps"
            className="absolute z-0 border-0"
            style={{
              width: "calc(110% + 20px)",
              height: "calc(110% + 120px)",
              top: "-100px",
              left: "-10px",
            }}
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />

          <div
            className="absolute inset-0 bg-black/60 z-10 pointer-events-none"
            aria-hidden="true"
          />

          <div className="absolute top-8 left-6 md:top-14 md:left-16 lg:top-20 lg:left-24 text-white z-20">
            <h2 className="text-3xl md:text-4xl lg:text-[48px] font-semibold mb-3 md:mb-6">
              {t("title")}
            </h2>

            <address className="text-gray-200 text-base md:text-[18px] lg:text-[20px] leading-relaxed max-w-[280px] md:max-w-sm font-light not-italic">
              Jl. Raya Dalung No.83, Dalung,
              <br />
              Kec. Kuta Utara, Kabupaten Badung,
              <br />
              Bali 80351
            </address>
          </div>

          <a
            href="https://maps.google.com/maps?q=Jl.+Raya+Dalung+No.83,+Dalung,+Kec.+Kuta+Utara,+Kabupaten+Badung,+Bali+80351"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open Bali Limestone location in Google Maps"
            className="absolute bottom-6 right-6 md:bottom-10 md:right-10 px-5 py-2.5 md:px-6 md:py-3 bg-white text-black text-sm md:text-[15px] font-semibold rounded-full shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2 z-20 group"
          >
            {t("button")}

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
              />
            </svg>
          </a>

        </div>
      </div>
    </section>
    </div>
  );
}