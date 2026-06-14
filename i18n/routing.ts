import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['en', 'id'],
  defaultLocale: 'en',
  localePrefix: 'as-needed' 
});

// Mengekspor Link, redirect, dll agar bisa dipakai di Navbar
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);