import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { toggleStatusAdmin } from './actions';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function KelolaAdminPage() {
  // 1. CEK ROLE USER YANG SEDANG LOGIN
  const adminId = (await cookies()).get('admin_session')?.value;
  if (!adminId) redirect('/admin/login');

  const currentUser = await prisma.admin.findUnique({ where: { id: adminId } });
  if (currentUser?.role !== 'SUPERADMIN') {
    redirect('/admin/dashboard'); // Tendang kembali ke dashboard jika bukan superadmin
  }

  // 2. Ambil data daftar admin
  const daftarAdmin = await prisma.admin.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="p-8 text-black">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Manage Admins</h1>
          <p className="text-sm text-gray-500 mt-1">Team members with access to Bali Limestone admin</p>
        </div>
        <Link href="/admin/dashboard/kelola-admin/tambah" className="px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all text-sm shadow-sm">
          + Add Admin
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm font-semibold">
              <th className="p-4">Nama Lengkap</th>
              <th className="p-4">Username</th>
              <th className="p-4">Role</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
            {daftarAdmin.map((adm) => (
              <tr key={adm.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 font-medium text-gray-900">{adm.nama}</td>
                <td className="p-4">@{adm.username}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${adm.role === 'SUPERADMIN' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'}`}>
                    {adm.role}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${adm.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {adm.isActive ? 'Aktif' : 'Nonaktif'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <form action={toggleStatusAdmin}>
                    <input type="hidden" name="id" value={adm.id} />
                    {/* Cegah superadmin menonaktifkan dirinya sendiri */}
                    {currentUser.id !== adm.id && (
                      <button type="submit" className={`font-medium cursor-pointer ${adm.isActive ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}`}>
                        {adm.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                      </button>
                    )}
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}