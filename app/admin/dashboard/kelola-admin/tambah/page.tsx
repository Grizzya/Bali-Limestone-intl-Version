import Link from 'next/link';
import { tambahAdmin } from '../actions';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import PasswordField from '../components/PasswordField'; 

export default async function TambahAdminPage() {
  const adminId = (await cookies()).get('admin_session')?.value;
  if (!adminId) redirect('/admin/login');

  const currentUser = await prisma.admin.findUnique({ where: { id: adminId } });
  if (currentUser?.role !== 'SUPERADMIN') {
    redirect('/admin/dashboard'); 
  }

  return (
    <div className="p-8 max-w-2xl mx-auto text-black">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/dashboard/kelola-admin" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-300">
          &larr; Kembali
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">Add New Admin</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <form action={tambahAdmin} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <input type="text" name="nama" required placeholder="Enter full name" className="w-full border px-4 py-3 rounded-lg outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input type="text" name="username" required placeholder="Contoh: Admin_pertama" className="w-full border px-4 py-3 rounded-lg outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" name="email" required placeholder="admin@balilimestone.id" className="w-full border px-4 py-3 rounded-lg outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password Awal</label>
            <PasswordField required={true} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role Tingkat Akses</label>
            <select name="role" className="w-full border px-4 py-3 rounded-lg outline-none bg-white">
              <option value="ADMIN">ADMIN (Manage Catalog Content)</option>
              <option value="SUPERADMIN">SUPERADMIN (Content + Manage Team)</option>
            </select>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-lg shadow-md hover:bg-blue-700 mt-4 cursor-pointer">
            Daftarkan Akun Admin
          </button>
        </form>
      </div>
    </div>
  );
}