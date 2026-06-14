import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function LogAktivitasPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const currentPage = Number(resolvedSearchParams.page) || 1;
  const itemsPerPage = 10; // Menampilkan 10 log per halaman
  const skip = (currentPage - 1) * itemsPerPage;

  // Mengambil data log beserta total datanya
  // Catatan: Pastikan nama model di Prisma-mu adalah 'logAktivitas'
  const [daftarLog, totalItems] = await Promise.all([
    prisma.logAktivitas.findMany({
      skip: skip,
      take: itemsPerPage,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.logAktivitas.count(),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  return (
    <div className="p-8 max-w-6xl mx-auto text-black">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Log Aktivitas Sistem</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
        <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center rounded-t-xl">
          <h2 className="text-xl font-semibold text-gray-800">Riwayat Aktivitas Admin</h2>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
            Total: {totalItems} Aktivitas
          </span>
        </div>
        
        <div className="overflow-x-auto flex-grow">
          <table className="w-full text-left">
            <thead className="bg-white border-b text-sm text-gray-500 uppercase">
              <tr>
                <th className="p-4 w-48">Waktu</th>
                <th className="p-4 w-48">Aksi</th>
                <th className="p-4">Detail Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {daftarLog.map((log) => {
                // Format tanggal dan jam agar mudah dibaca
                const waktu = new Date(log.createdAt).toLocaleString('id-ID', {
                  day: '2-digit', month: 'short', year: 'numeric',
                  hour: '2-digit', minute: '2-digit'
                });

                return (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-sm text-gray-500">{waktu}</td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-md border border-gray-200">
                        {log.aksi}
                      </span>
                    </td>
                    <td className="p-4 text-gray-800 text-sm">{log.detail}</td>
                  </tr>
                );
              })}
              {daftarLog.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-gray-500">
                    No activity history recorded.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* NAVIGASI PAGINATION */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-xl">
            <div className="text-sm text-gray-500">
              Page <span className="font-semibold text-gray-800">{currentPage}</span> of <span className="font-semibold text-gray-800">{totalPages}</span>
            </div>
            <div className="flex gap-2">
              {currentPage > 1 ? (
                <Link href={`?page=${currentPage - 1}`} className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                  &larr; Prev
                </Link>
              ) : (
                <button disabled className="px-3 py-2 text-sm font-medium text-gray-400 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed">
                  &larr; Prev
                </button>
              )}

              {/* Looping Nomor Halaman */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Link
                  key={page}
                  href={`?page=${page}`}
                  className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                    currentPage === page
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </Link>
              ))}

              {currentPage < totalPages ? (
                <Link href={`?page=${currentPage + 1}`} className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                  Next &rarr;
                </Link>
              ) : (
                <button disabled className="px-3 py-2 text-sm font-medium text-gray-400 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed">
                  Next &rarr;
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}