"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

import ProductCard from "@/components/layout/ProductCard";
import ProductModal from "@/components/layout/ProductModal";
import { useTranslations } from "next-intl";
// import { products } from "@/src/data/products";

export default function ProductSection({ products }: { products: any[] }) {
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const t = useTranslations("HomeProduct");
  //  DETEKSI LAYAR 
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3); 

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleCards(1); 
      } else {
        setVisibleCards(3); 
      }
    };

    handleResize(); 
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, products.length - visibleCards);

  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [visibleCards, currentIndex, maxIndex]);

  //  FUNGSI GESER 
  const slideRight = () => {
    if (currentIndex < maxIndex) setCurrentIndex((prev) => prev + 1);
  };

  const slideLeft = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  return (
    
    <section className="bg-[#1a1a1a]">
      
      <div className="bg-white rounded-t-[30px] py-16 px-6 md:px-16 overflow-hidden">
        
        {/*  HEADER  */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-800">
            {t("title")}
          </h2>

          {/*  NAVIGASI PANAH */}
          <div className="hidden md:flex gap-3">
            <button
              onClick={slideLeft}
              disabled={currentIndex === 0}
              className={`w-10 h-10 rounded-lg shadow flex items-center justify-center transition-all duration-300
                ${
                  currentIndex === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white hover:scale-105 active:scale-95 text-black hover:bg-gray-50"
                }`}
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={slideRight}
              disabled={currentIndex >= maxIndex}
              className={`w-10 h-10 rounded-lg shadow flex items-center justify-center transition-all duration-300
                ${
                  currentIndex >= maxIndex
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white hover:scale-105 active:scale-95 text-black hover:bg-gray-50"
                }`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/*  SLIDER AREA  */}
        <div className="relative overflow-hidden rounded-[20px]">
          
          {/*  NAVIGASI  MOBILE  */}
          <div className="absolute top-1/2 -translate-y-1/2 left-2 right-2 flex justify-between z-10 md:hidden pointer-events-none">
            <button
              onClick={slideLeft}
              disabled={currentIndex === 0}
              className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-all pointer-events-auto
                ${
                  currentIndex === 0
                    ? "bg-black/10 text-white/40 cursor-not-allowed" 
                    : "bg-black/40 text-white hover:bg-black/60 active:scale-95 shadow-lg" 
                }`}
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={slideRight}
              disabled={currentIndex >= maxIndex}
              className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-all pointer-events-auto
                ${
                  currentIndex >= maxIndex
                    ? "bg-black/10 text-white/40 cursor-not-allowed"
                    : "bg-black/40 text-white hover:bg-black/60 active:scale-95 shadow-lg"
                }`}
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/*  TRACK KARTU  */}
          <div
            className="flex gap-6 transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(calc(-${currentIndex} * (100% / ${visibleCards} + 1.5rem / ${visibleCards})))`,
            }}
          >
            {products.map((item) => (
              <div
                key={item.id}
                className="min-w-full md:min-w-[calc(33.333%-1rem)] flex-shrink-0"
              >
                <ProductCard
                  product={item}
                  aspectRatio="aspect-[410/500]"
                  onClick={() => setSelectedProduct(item)}
                />
              </div>
            ))}
          </div>
        </div>

        {/*  BOTTOM BUTTON  */}
        <div className="flex justify-end mt-10">
          <Link
            href="/product"
            className="bg-[#ffcc00] hover:bg-yellow-500 transition px-8 py-3 rounded-xl font-medium text-black inline-block shadow-sm"
          >
            {t("viewAll")}
          </Link>
        </div>

      </div> 

      {/*  MODAL  */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
}