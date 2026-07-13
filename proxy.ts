import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing'; // Pastikan merujuk ke file routing.ts milikmu

// Inisialisasi fungsi pengatur bahasa menggunakan konfigurasi routing terpusat
const intlMiddleware = createMiddleware(routing);

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
   
    '/admin/dashboard/:path*', 
    '/admin/login',
    
    '/',                 
    '/(id|en)/:path*',    
    
   
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ],
};