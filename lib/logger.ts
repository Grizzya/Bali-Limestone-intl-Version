import { prisma } from './prisma';
import { cookies } from 'next/headers';

export async function rekamAktivitas(aksi: string, detail: string) {
  try {
    const adminId = (await cookies()).get('admin_session')?.value;
    
    // Jika tidak ada session (misal saat mengakses dashboard tanpa login), abaikan
    if (!adminId) return;

    await prisma.logAktivitas.create({
      data: {
        adminId,
        aksi,
        detail,
      },
    });
  } catch (error) {
    console.error('Gagal mencatat log aktivitas:', error);
  }
}