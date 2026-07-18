import { prisma } from '@/lib/prisma';
import cloudinary from '@/lib/cloudinary';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import { rekamAktivitas } from '@/lib/logger';
import FormTambahArtikelWithSeo from './components/FormTambahArtikelWithSeo';

export default async function ArtikelPageAdmin({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const currentPage = Number(resolvedSearchParams.page) || 1;
  const itemsPerPage = 6;
  const skip = (currentPage - 1) * itemsPerPage;

  // 1. Ambil data asli dari TiDB
  const [daftarArtikel, totalItems] = await Promise.all([
    prisma.artikel.findMany({
      skip: skip,
      take: itemsPerPage,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        slug: true,
        judul: true,
        judulId: true,
        konten: true,
        kontenId: true,
        gambar: true,
        createdAt: true,
      }
    }),
    prisma.artikel.count(),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  // Server Action untuk Tambah Artikel
  async function tambahArtikelAction(formData: FormData) {
    'use server';
    const judul = formData.get('judul') as string;
    const konten = formData.get('konten') as string;
    const judulId = formData.get('judulId') as string;
    const kontenId = formData.get('kontenId') as string;
    const focusKeywordEn = (formData.get('focusKeywordEn') as string) || null;
    const focusKeywordId = (formData.get('focusKeywordId') as string) || null;
    const file = formData.get('gambar') as File;

    if (!judul || !judulId || !konten || !kontenId) return;

    let baseSlug = judul
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Pastikan slug unik: cek apakah sudah ada, kalau ada tambahkan suffix angka
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.artikel.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    let imageUrl = null;
    if (file && file.size > 0) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      imageUrl = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'balilimestone_artikel' },
          (error: any, result: any) => {
            if (error) reject(error);
            else resolve(result?.secure_url);
          }
        );
        uploadStream.end(buffer);
      }) as string;
    }

    try {
      await prisma.artikel.create({
        data: { slug, judul, judulId, konten, kontenId, gambar: imageUrl, focusKeywordEn, focusKeywordId },
      });
    } catch (err: any) {
     
      if (err.code === 'P2002') {
        console.warn('Slug bentrok saat create, kemungkinan double-submit. Diabaikan.');
        return;
      }
      throw err;
    }

    await rekamAktivitas('TAMBAH_ARTIKEL', `Mempublikasikan artikel baru: "${judulId}"`);
    revalidatePath('/admin/dashboard/artikel');
  }

  // Server Action untuk Hapus Artikel
  async function hapusArtikelAction(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    if (!id) return;

    const artikel = await prisma.artikel.findUnique({
      where: { id: id },
      select: { judulId: true, judul: true }
    });

    if (!artikel) return;

    await prisma.artikel.delete({ where: { id: id } });
    await rekamAktivitas('HAPUS_ARTIKEL', `Menghapus artikel: "${artikel.judulId || artikel.judul}"`);
    revalidatePath('/admin/dashboard/artikel');
  }

  return (
    <div className="p-8 max-w-7xl mx-auto text-black space-y-12">
      
      <div className="border-b pb-3">
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Manage Articles</h1>
        <p className="text-sm text-gray-500 mt-1">Tulis artikel bilingual berkualitas tinggi yang dioptimalkan untuk mesin pencari Google.</p>
      </div>

      {/* Panggil komponen Client Form + Rank Math yang dipisah */}
      <FormTambahArtikelWithSeo serverAction={tambahArtikelAction} />

      {/* BAGIAN TABEL BAWAH: DATA SEKARANG SUDAH MUNCUL KEMBALI */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col mt-12">
        <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center rounded-t-xl">
          <h2 className="text-xl font-semibold text-gray-800">Saved Articles</h2>
      
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white border-b text-sm text-gray-500 uppercase">
              <tr>
                <th className="p-4 w-24">Thumbnail</th>
                <th className="p-4">Judul Artikel</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {daftarArtikel.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    {item.gambar ? (
                      <img src={item.gambar} alt={item.judulId || item.judul} className="w-20 h-14 object-cover rounded-md border shadow-sm" />
                    ) : (
                      <div className="w-20 h-14 bg-gray-100 flex items-center justify-center text-[10px] text-gray-400 rounded-md border">Kosong</div>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-gray-800 line-clamp-1 text-base">
                      {item.judulId && item.judulId.trim() !== "" ? item.judulId : item.judul}
                    </div>
                    <div className="text-xs text-gray-400 italic line-clamp-1 mt-0.5">{item.judul} (EN)</div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/dashboard/artikel/edit/${item.id}`} className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium hover:bg-yellow-200 transition-colors">
                        Edit
                      </Link>
                      <form action={hapusArtikelAction}>
                        <input type="hidden" name="id" value={item.id} />
                        <button className="px-4 py-2 bg-red-100 text-red-600 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors">Hapus</button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {daftarArtikel.length === 0 && <tr><td colSpan={3} className="p-8 text-center text-gray-500">No articles written yet.</td></tr>}
            </tbody>
          </table>
        </div>

        {/* PAGINATION TABEL */}
        <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-xl">
          <div className="text-sm text-gray-500">
            Page <span className="font-semibold text-gray-800">{currentPage}</span> of <span className="font-semibold text-gray-800">{totalPages}</span>
          </div>
          <div className="flex gap-2">
            {currentPage > 1 ? (
              <Link href={`?page=${currentPage - 1}`} className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">&larr; Prev</Link>
            ) : (
              <button disabled className="px-3 py-2 text-sm font-medium text-gray-400 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed">&larr; Prev</button>
            )}
            {currentPage < totalPages ? (
              <Link href={`?page=${currentPage + 1}`} className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">Next &rarr;</Link>
            ) : (
              <button disabled className="px-3 py-2 text-sm font-medium text-gray-400 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed">Next &rarr;</button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}