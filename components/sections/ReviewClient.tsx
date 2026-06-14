"use client";

import { motion, useMotionValue, useAnimationFrame } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export default function ReviewClient({
  initialReviews,
}: {
  initialReviews: any[];
}) {
  const [width, setWidth] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const t = useTranslations("review");

  const measureRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  const reviews = initialReviews ?? [];

  // Duplikasi array jika datanya terlalu sedikit agar slider tidak putus di tengah jalan
  const safeReviews =
    reviews.length > 0 && reviews.length < 4
      ? [...reviews, ...reviews, ...reviews]
      : reviews;

  useEffect(() => {
    if (measureRef.current) {
      setWidth(measureRef.current.scrollWidth);
    }
  }, [safeReviews]);

  // Auto Slide
  useAnimationFrame((t, delta) => {
    let currentX = x.get();

    if (currentX <= -width) {
      x.set(0);
      currentX = 0;
    }

    if (!isHovered && !isDragging && width > 0) {
      const moveBy = 0.7 * (delta / 16);
      x.set(currentX - moveBy);
    }
  });

  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="w-full mx-auto">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16 px-5">
          <h2 className="text-3xl md:text-5xl font-semibold text-black mb-4 md:mb-6 leading-tight">
            {t("title")}
          </h2>

          <p className="text-gray-500 text-sm md:text-[16px] leading-relaxed">
            {t("description")}
          </p>
        </div>

        {/* SLIDER */}
        {safeReviews.length > 0 && (
          <div
            className="overflow-hidden cursor-grab active:cursor-grabbing"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <motion.div
              style={{ x }}
              drag="x"
              dragConstraints={{ right: 0, left: -width }}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={() => setIsDragging(false)}
              className="flex w-max"
            >
              {/* SET 1 */}
              <div
                ref={measureRef}
                className="flex gap-4 md:gap-6 pr-4 md:pr-6 shrink-0 px-4 md:px-0"
              >
                {safeReviews.map((item, idx) => (
                  <TestimonialCard
                    key={`set1-${item.id}-${idx}`}
                    item={item}
                  />
                ))}
              </div>

              {/* SET 2 */}
              <div className="flex gap-4 md:gap-6 pr-4 md:pr-6 shrink-0 px-4 md:px-0">
                {safeReviews.map((item, idx) => (
                  <TestimonialCard
                    key={`set2-${item.id}-${idx}`}
                    item={item}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}

function TestimonialCard({ item }: { item: any }) {
  return (
    <div className="w-[280px] sm:w-[320px] md:w-[400px] bg-[#fafafa] rounded-2xl p-5 md:p-8 flex flex-col justify-between shrink-0 border border-gray-100 transition-all duration-300 hover:border-gray-300">
      <div className="flex justify-between items-start mb-5 md:mb-6 gap-3">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-200 rounded-full border border-gray-200 shadow-sm shrink-0 flex items-center justify-center font-bold text-gray-500">
            {item.nama.charAt(0).toUpperCase()}
          </div>

          <div>
            <h4 className="text-base md:text-lg font-medium text-black">
              {item.nama}
            </h4>
            <p className="text-xs md:text-sm text-gray-400">{item.peran}</p>
          </div>
        </div>

        <div className="flex gap-1 shrink-0">
          {[...Array(5)].map((_, index) => (
            <svg
              key={index}
              className={`w-4 h-4 md:w-5 md:h-5 ${
                index < item.rating ? "text-[#ffcc00]" : "text-gray-300"
              }`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          ))}
        </div>
      </div>

      <p className="text-gray-600 text-sm md:text-[15px] leading-relaxed text-justify">
        "{item.pesan}"
      </p>
    </div>
  );
}