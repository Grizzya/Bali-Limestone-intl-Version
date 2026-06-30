import { prisma } from '@/lib/prisma';
import cloudinary from '@/lib/cloudinary';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import TableActions from '../TableActions'; 
import { rekamAktivitas } from '@/lib/logger';

// 1. Tambahkan searchParams untuk menangkap angka halaman dari URL
export default async function ProdukPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  // 2. Logika Pagination
  const resolvedSearchParams = await searchParams;
  const currentPage = Number(resolvedSearchParams.page) || 1;
  const itemsPerPage = 5; // Batas data per halaman
  const skip = (currentPage - 1) * itemsPerPage;

  const daftarKategori = await prisma.kategori.findMany();
  
  // 3. Ambil data produk SECUKUPNYA (5 data per halaman) & Hitung total semua data
  const [daftarProduk, totalItems] = await Promise.all([
    prisma.produk.findMany({
      skip: skip,
      take: itemsPerPage,
      include: { kategori: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.produk.count(), // Menghitung total seluruh produk di database
  ]);

  // 4. Hitung total halaman
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  async function tambahProduk(formData: FormData) {
    'use server';
    // Kolom nama & deskripsi utama (dialokasikan untuk Bahasa Inggris di frontend /en)
    const nama = formData.get('nama') as string;
    const deskripsi = formData.get('deskripsi') as string;
    
    // 🔹 TAMBAHAN BARU: Kolom terjemahan Bahasa Indonesia (/id)
    const namaId = formData.get('namaId') as string;
    const deskripsiId = formData.get('deskripsiId') as string;
    
    const kategoriId = formData.get('kategoriId') as string;
    const file = formData.get('gambar') as File;

    if (!nama || !namaId || !kategoriId) return;

    let imageUrl = null;
    if (file && file.size > 0) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      imageUrl = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'balilimestone_produk' },
          (error: any, result: any) => {
            if (error) reject(error);
            else resolve(result?.secure_url);
          }
        );
        uploadStream.end(buffer);
      }) as string;
    }

    // 1. Simpan data ke database TiDB (Tanpa properti harga)
    await prisma.produk.create({
      data: { 
        nama, 
        namaId, 
        deskripsi, 
        deskripsiId, 
        kategoriId, 
        gambar: imageUrl 
      },
    });

    // 2. Sisipkan log aktivitas
    await rekamAktivitas('TAMBAH_PRODUK', `Menambahkan produk baru: ${namaId} (${nama})`);

    // 3. Refresh halaman agar data baru muncul
    revalidatePath('/admin/dashboard/produk');
  }

  async function hapusProduk(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;

    if (!id) return;

    try {
      // 1. AMBIL NAMA PRODUKNYA DULU SEBELUM DIHAPUS
      const produk = await prisma.produk.findUnique({
        where: { id: id },
        select: { nama: true, namaId: true }
      });

      if (!produk) return;

      // 2. Baru jalankan perintah hapus dari database
      await prisma.produk.delete({
        where: { id: id },
      });

      // 3. Sisipkan log aktivitas hapus
      await rekamAktivitas('HAPUS_PRODUK', `Menghapus produk: "${produk.namaId || produk.nama}" secara permanen`);

      // 4. Refresh halaman
      revalidatePath('/admin/dashboard/produk');

    } catch (error) {
      console.error('Gagal menghapus produk:', error);
    }
  }

  return (
    <div className="p-8 max-w-6xl mx-auto text-black">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Manage Products</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* KOLOM KIRI: FORM TAMBAH (Kini dengan Input Multi-bahasa & Tanpa Harga) */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit">
          <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Add New Product</h2>
          <form action={tambahProduk} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name (English)</label>
              <input type="text" name="nama" placeholder="Contoh: White Limestone" required className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            
            {/* 🔹 INPUT BARU: Nama Bahasa Indonesia */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name (Indonesian)</label>
              <input type="text" name="namaId" placeholder="Contoh: Batu Kapur Putih" required className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <select name="kategoriId" required className="w-full border border-gray-300 px-4 py-2.5 rounded-lg outline-none bg-white">
                <option value="">-- Pilih Kategori --</option>
                {daftarKategori.map((kat) => (
                  <option key={kat.id} value={kat.id}>{kat.nama}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (English)</label>
              <textarea name="deskripsi" placeholder="Product details in English..." required className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none" />
            </div>

            {/* 🔹 INPUT BARU: Deskripsi Bahasa Indonesia */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (Indonesian)</label>
              <textarea name="deskripsiId" placeholder="Detail produk dalam Bahasa Indonesia..." required className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none" />
            </div>
            
            {/* 🔹 INPUT UPLOAD GAMBAR */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
              <input
                type="file"
                name="gambar"
                accept="image/*"
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 file:text-sm"
              />
            </div>

            {/* 🔹 TOMBOL SIMPAN */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-all shadow-md mt-2 text-sm"
            >
              Simpan Produk
            </button>

            
          </form>
        </div>

        {/* KOLOM KANAN: TABEL DAFTAR PRODUK (Tanpa Kolom Harga) */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
              <h2 className="text-xl font-semibold text-gray-800">Saved Products</h2>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
                Total: {totalItems} Data
              </span>
            </div>
            
            <div className="overflow-x-auto flex-grow">
              <table className="w-full text-left">
                <thead className="bg-white border-b text-sm text-gray-500 uppercase">
                  <tr>
                    <th className="p-4 font-semibold">Gambar</th>
                    <th className="p-4 font-semibold">Product Name</th>
                    <th className="p-4 font-semibold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {daftarProduk.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 w-24">
                        {item.gambar ? (
                          <img src={item.gambar} className="w-16 h-16 object-cover rounded-lg border shadow-sm" />
                        ) : (
                          <div className="w-16 h-16 bg-gray-100 flex items-center justify-center text-xs text-gray-400 rounded-lg border">Kosong</div>
                        )}
                      </td>
                      <td className="p-4">
                        {/* Menampilkan dua bahasa sekaligus di baris admin agar Tuan mudah memantau */}
                        <div className="font-semibold text-gray-800">{item.namaId || item.nama}</div>
                        <div className="text-xs text-gray-400 italic mb-1">{item.nama} (EN)</div>
                        <div className="text-xs text-gray-500">Kategori: {item.kategori.nama}</div>
                      </td>
                      <td className="p-4 text-right">
                        <TableActions 
                          id={item.id} 
                          editUrl={`/admin/dashboard/produk/edit/${item.id}`} 
                          onDelete={hapusProduk} 
                        />
                      </td>
                    </tr>
                  ))}
                  {daftarProduk.length === 0 && (
                    <tr><td colSpan={3} className="p-8 text-center text-gray-500">No data on this page.</td></tr>
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
                {/* Tombol Sebelumnya */}
                {currentPage > 1 ? (
                  <Link href={`?page=${currentPage - 1}`} className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                    &larr; Prev
                  </Link>
                ) : (
                  <button disabled className="px-3 py-2 text-sm font-medium text-gray-400 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed">
                    &larr; Prev
                  </button>
                )}

                {/* Looping Angka Halaman */}
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

                {/* Tombol Selanjutnya */}
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

          </div>
        </div>
      </div>
    </div>
  );
}