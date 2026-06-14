import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';

// Inisialisasi fungsi pengatur bahasa dari next-intl
const intlMiddleware = createMiddleware({
  locales: ['en', 'id'],
  defaultLocale: 'en',
  localePrefix: 'as-needed' 
});

// 🔹 PERBAIKAN UTAMA: Menggunakan 'export default function proxy' agar dibaca sempurna oleh Next 16
export default function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // ─── 1. AMANKAN JALUR ADMIN TERLEBIH DAHULU ───
  const isDashboardRoute = path.startsWith('/admin/dashboard');
  const isLoggedIn = !!request.cookies.get('admin_session')?.value;

  if (isDashboardRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  if (path === '/admin/login' && isLoggedIn) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  // Jika rute admin biasa, biarkan lolos tanpa dicek bahasanya oleh next-intl
  if (path.startsWith('/admin')) {
    return NextResponse.next();
  }

  // ─── 2. PROSES BAHASA UNTUK RUTE UMUM ───
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Target Satpam Admin Tuan
    '/admin/dashboard/:path*', 
    '/admin/login',
    
    // Target next-intl untuk menyaring bahasa
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ],
};