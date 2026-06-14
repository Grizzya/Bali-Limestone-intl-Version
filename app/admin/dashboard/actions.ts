'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { rekamAktivitas } from '@/lib/logger';
import { prisma } from '@/lib/prisma';

export async function handleLogout() {
  // 1. Ambil ID Admin sebelum cookie-nya dihancurkan
  const adminId = (await cookies()).get('admin_session')?.value;
  
  if (adminId) {
    const admin = await prisma.admin.findUnique({ where: { id: adminId } });
    if (admin) {
      // 2. Catat aktivitas LOGOUT
     await rekamAktivitas('LOGOUT', `${admin.nama} signed out of the system.`);
    }
  }

  // 3. Hapus tiket sesi (cookie)
  (await cookies()).delete('admin_session');
  
  // 4. Tendang kembali ke halaman login
  redirect('/admin/login');
}