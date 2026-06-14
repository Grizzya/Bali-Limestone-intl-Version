"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

type NavbarProps = {
  variant?: "light" | "dark";
};

export default function Navbar({ variant = "light" }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const t = useTranslations("Navbar");

  const isDark = variant === "dark";
  const textColor  = isDark ? "text-black" : "text-white";
  const borderColor = isDark ? "border-black/30" : "border-white/30";

  const navLinks = [
    { key: "home",     href: "/" as const },
    { key: "about",    href: "/about" as const },
    { key: "services", href: "/services" as const },
    { key: "product",  href: "/product" as const },
  ];

  return (
    <header className={`absolute top-0 left-0 w-full z-50 ${textColor}`}>

      {/* TOP BAR */}
      <div className="w-full px-6 md:px-10 lg:px-12 py-5 flex justify-between items-center">

        <Link href="/" aria-label="Bali Limestone – Home">
          <span className="block font-bold text-base lg:text-lg tracking-widest">BALI LIMESTONE</span>
        </Link>

        <nav className="hidden md:flex gap-8 lg:gap-12 text-sm" aria-label="Main navigation">
          {navLinks.map((item) => (
            <Link key={item.key} href={item.href} className="hover:text-yellow-400 transition-colors">
              {t(item.key)}
            </Link>
          ))}
        </nav>

        {/* CTA → WhatsApp link, not plain button */}
        <a
          href="https://wa.me/628181802020"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contact Bali Limestone via WhatsApp"
          className="hidden md:block bg-yellow-400 text-black px-5 py-2 lg:px-6 rounded-lg font-semibold text-sm hover:opacity-90 transition"
        >
          {t("contact")}
        </a>

        {/* HAMBURGER */}
        <button
          className="md:hidden relative w-8 h-8 flex items-center justify-center"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <span className={`absolute w-6 h-[1.5px] bg-current rounded-full transition-all duration-300 ${menuOpen ? "rotate-45" : "-translate-y-2"}`} />
          <span className={`absolute w-6 h-[1.5px] bg-current rounded-full transition-all duration-300 ${menuOpen ? "opacity-0" : "opacity-100"}`} />
          <span className={`absolute w-6 h-[1.5px] bg-current rounded-full transition-all duration-300 ${menuOpen ? "-rotate-45" : "translate-y-2"}`} />
        </button>
      </div>

      {/* DIVIDER */}
      <div className="w-full px-6 md:px-10 lg:px-12">
        <div className={`border-t ${borderColor}`} />
      </div>

      {/* MOBILE MENU */}
      <div
        id="mobile-menu"
        className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${menuOpen ? "max-h-[500px] opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-3"}`}
        aria-hidden={!menuOpen}
      >
        <nav className="bg-black/85 backdrop-blur-md flex flex-col px-6 py-5 gap-1" aria-label="Mobile navigation">
          {navLinks.map((item) => (
            <Link key={item.key} href={item.href} onClick={() => setMenuOpen(false)}
              className="text-white text-sm py-3 border-b border-white/10 hover:text-yellow-400 transition-all duration-300">
              {t(item.key)}
            </Link>
          ))}
          <a
            href="https://wa.me/628181802020"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 bg-yellow-400 text-black py-3 rounded-xl font-semibold text-sm w-full text-center hover:opacity-90 transition-all duration-300"
          >
            {t("contact")}
          </a>
        </nav>
      </div>

    </header>
  );
}
