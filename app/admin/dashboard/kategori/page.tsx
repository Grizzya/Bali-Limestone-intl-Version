  import { prisma } from '@/lib/prisma';
  import { revalidatePath } from 'next/cache';
  import Link from 'next/link';
  import { rekamAktivitas } from '@/lib/logger';
  import EditModal from './EditModal';

  export default async function KategoriPage({
    searchParams,
  }: {
    searchParams: Promise<{ page?: string }>;
  }) {
    // Logika Pagination
    const resolvedSearchParams = await searchParams;
    const currentPage = Number(resolvedSearchParams.page) || 1;
    const itemsPerPage = 5;
    const skip = (currentPage - 1) * itemsPerPage;

    // 1. Ambil data Kategori dari TiDB dengan menyertakan field namaId (Indonesia)
    const [daftarKategori, totalItems] = await Promise.all([
      prisma.kategori.findMany({
        skip: skip,
        take: itemsPerPage,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          nama: true,   // English
          namaId: true, // Indonesia
        }
      }),
      prisma.kategori.count(),
    ]);

    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

    // Fungsi Add Category Bilingual
    async function tambahKategori(formData: FormData) {
      'use server';
      const nama = formData.get('nama') as string;     // Input English
      const namaId = formData.get('namaId') as string; // Input Indonesia
      
      if (!nama || !namaId) return;

      // Simpan kedua bahasa ke database TiDB
      await prisma.kategori.create({
        data: { 
          nama,
          namaId 
        },
      });

      await rekamAktivitas('TAMBAH_KATEGORI', `Menambahkan kategori baru: "${namaId}" (${nama} EN)`);
      revalidatePath('/admin/dashboard/kategori');
    }

    // Fungsi Hapus Kategori dengan Pengaman Relasi Produk
    async function hapusKategori(formData: FormData) {
      'use server';
      const id = formData.get('id') as string;
      if (!id) return;

      // 1. Cek apakah masih ada produk yang nyangkut di kategori ini
      const jumlahProduk = await prisma.produk.count({
        where: { kategoriId: id }
      });

      // 2. Jika masih ada produk, hentikan proses penghapusan
      if (jumlahProduk > 0) {
        console.error(`Gagal menghapus: Masih ada ${jumlahProduk} produk di kategori ini.`);
        return; 
      }

      // 3. Jika kosong, ambil nama untuk log, lalu hapus dengan aman
      const kategori = await prisma.kategori.findUnique({ where: { id: id } });
      if (!kategori) return;

      await prisma.kategori.delete({ where: { id: id } });
      
      // Logger aktivitas hapus berhasil dipasangkan
      await rekamAktivitas('HAPUS_KATEGORI', `Menghapus kategori: "${kategori.namaId || kategori.nama}"`);

      revalidatePath('/admin/dashboard/kategori');
    }

    async function updateKategori(formData: FormData) {
        'use server';
        const id = formData.get('id') as string;
        const nama = formData.get('nama') as string;
        const namaId = formData.get('namaId') as string;

        if (!id || !nama || !namaId) return;

        await prisma.kategori.update({
          where: { id },
          data: { nama, namaId },
        });

        await rekamAktivitas('EDIT_KATEGORI', `Mengubah kategori menjadi: "${namaId}" (${nama} EN)`);
        revalidatePath('/admin/dashboard/kategori');
      }

    return (
      <div className="p-8 max-w-5xl mx-auto text-black">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Manage Categories</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* FORM TAMBAH KATEGORI BILINGUAL */}
          <div className="md:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Add Category</h2>
            <form action={tambahKategori} className="flex flex-col gap-5">
              
              {/* INPUT BAHASA ENGLISH */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kategori (English)</label>
                <input 
                  type="text" 
                  name="nama" 
                  placeholder="Contoh: Andesit Stone" 
                  required 
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                />
              </div>

              {/* INPUT BAHASA INDONESIA */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kategori (Indonesia)</label>
                <input 
                  type="text" 
                  name="namaId" 
                  placeholder="Contoh: Batu Andesit" 
                  required 
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                />
              </div>
              
              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-all shadow-md mt-2 text-sm">
                Simpan Kategori
              </button>
            </form>
          </div>

          {/* TABEL DAFTAR KATEGORI */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
              <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center rounded-t-xl">
                <h2 className="text-xl font-semibold text-gray-800">Saved Categories</h2>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
                  Total: {totalItems} Data
                </span>
              </div>
              
              <div className="overflow-x-auto flex-grow">
                <table className="w-full text-left">
                  <thead className="bg-white border-b text-sm text-gray-500 uppercase">
                    <tr>
                      <th className="p-4 font-semibold">Nama Kategori</th>
                      <th className="p-4 font-semibold text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {daftarKategori.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          {/* Menampilkan bahasa Indonesia sebagai teks utama, dan bahasa Inggris di bawahnya */}
                          <div className="font-semibold text-gray-800 text-base">
                            {item.namaId || item.nama}
                          </div>
                          <div className="text-xs text-gray-400 italic mt-0.5">
                            {item.nama} (English)
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <EditModal kategori={item} updateAction={updateKategori} />
                            <form action={hapusKategori}>
                              <input type="hidden" name="id" value={item.id} />
                              <button type="submit" className="px-3 py-1.5 bg-red-100 text-red-600 rounded text-sm font-medium hover:bg-red-200 transition-colors">
                                Hapus
                              </button>
                            </form>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {daftarKategori.length === 0 && (
                      <tr>
                        <td colSpan={2} className="p-8 text-center text-gray-500">No categories yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* NAVIGASI PAGINATION */}
              <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-xl">
                <div className="text-sm text-gray-500">
                  Page <span className="font-semibold text-gray-800">{currentPage}</span> of <span className="font-semibold text-gray-800">{totalPages}</span>
                </div>
                <div className="flex gap-2">
                  {currentPage > 1 ? (
                    <Link href={`?page=${currentPage - 1}`} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                      &larr; Prev
                    </Link>
                  ) : (
                    <button disabled className="px-4 py-2 text-sm font-medium text-gray-400 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed">
                      &larr; Prev
                    </button>
                  )}

                  {currentPage < totalPages ? (
                    <Link href={`?page=${currentPage + 1}`} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                      Next &rarr;
                    </Link>
                  ) : (
                    <button disabled className="px-4 py-2 text-sm font-medium text-gray-400 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed">
                      Next &rarr;
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }