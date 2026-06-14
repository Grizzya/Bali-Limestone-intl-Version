'use server';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { rekamAktivitas } from '@/lib/logger';
import { cookies } from 'next/headers';

// FUNGSI BANTUAN UNTUK CEK APAKAH USER SUPERADMIN
async function checkIsSuperAdmin() {
  const adminId = (await cookies()).get('admin_session')?.value;
  if (!adminId) return false;
  const currentUser = await prisma.admin.findUnique({ where: { id: adminId } });
  return currentUser?.role === 'SUPERADMIN';
}

export async function tambahAdmin(formData: FormData) {
  // BENTENG PERTAHANAN
  const isSuperAdmin = await checkIsSuperAdmin();
  if (!isSuperAdmin) return; 

  const nama = formData.get('nama') as string;
  const username = formData.get('username') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const role = formData.get('role') as string;

  if (!nama || !username || !email || !password) return;

  const hashedPassword = bcrypt.hashSync(password, 10);

  await prisma.admin.create({
    data: { nama, username, email, password: hashedPassword, role, isActive: true },
  });

  await rekamAktivitas('TAMBAH_ADMIN', `Mendaftarkan admin baru: ${nama} (${username}) sebagai ${role}`);

  revalidatePath('/admin/dashboard/kelola-admin');
  redirect('/admin/dashboard/kelola-admin');
}

export async function toggleStatusAdmin(formData: FormData) {
  
  const isSuperAdmin = await checkIsSuperAdmin();
  if (!isSuperAdmin) return; 

  const id = formData.get('id') as string;

  const admin = await prisma.admin.findUnique({ where: { id } });
  if (!admin) return;

  const statusBaru = !admin.isActive;

  await prisma.admin.update({
    where: { id },
    data: { isActive: statusBaru },
  });

  const teksAksi = statusBaru ? 'MENGAKTIFKAN' : 'MENONAKTIFKAN';
  await rekamAktivitas('UBAH_STATUS_AKUN', `${teksAksi} akun admin: ${admin.nama} (@${admin.username})`);

  revalidatePath('/admin/dashboard/kelola-admin');
}