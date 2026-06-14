import { prisma } from '@/lib/prisma';
import cloudinary from '@/lib/cloudinary';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { rekamAktivitas } from '@/lib/logger';
// Jalur mundur 3 kali yang tepat mengarah ke komponen global di dashboard
import SubmitButton from '../../../artikel/components/SubmitButton';
// Jalur mundur 2 kali mengarah ke folder komponen lokal artikel
import InputGambarArtikel from '../../components/InputGambarArtikel';

export default async function EditArtikelPage({ params }: { params: Promise<{ id: string }> }) {
  const artikelId = (await params).id;

  const artikel = await prisma.artikel.findUnique({
    where: { id: artikelId },
    select: {
      id: true,
      judul: true,
      judulId: true,
      konten: true,
      kontenId: true,
      gambar: true,
    }
  });

  if (!artikel) return <div className="p-8 text-center text-black">Article Not Found.</div>;

  async function updateArtikel(formData: FormData) {
    'use server';
    const judul = formData.get('judul') as string;
    const konten = formData.get('konten') as string;
    
    const judulId = formData.get('judulId') as string;
    const kontenId = formData.get('kontenId') as string;
    
    const file = formData.get('gambar') as File;

    if (!judul || !judulId || !konten || !kontenId) return;

    // --- GENERATE URL (SLUG) BARU YANG BERSIH TANPA ANGKA ---
    const slugBaru = judul
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Buang karakter aneh
      .replace(/[\s_-]+/g, '-') // Ganti spasi jadi tanda hubung (-)
      .replace(/^-+|-+$/g, ''); // Bersihkan ujung-ujung teks

    let imageUrl = artikel?.gambar;

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

    // Eksekusi pembaruan ke DB TiDB (Kolom slug sekarang ikut diperbarui)
    await prisma.artikel.update({
      where: { id: artikelId },
      data: { 
        slug: slugBaru, // 🔹 URL sekarang otomatis ikut berubah mengikuti judul EN yang baru!
        judul, 
        judulId, 
        konten, 
        kontenId, 
        gambar: imageUrl 
      },
    });

    await rekamAktivitas('EDIT_ARTIKEL', `Mengubah isi & URL artikel: "${judulId}" (${judul})`);
    revalidatePath('/admin/dashboard/artikel');
    
    // Sinkronisasi juga halaman user agar perubahannya instan terpancar
    revalidatePath('/[locale]/artikel', 'layout'); 
    
    redirect('/admin/dashboard/artikel');
  }

  return (
    <div className="p-8 max-w-5xl mx-auto text-black">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/dashboard/artikel" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-colors">
          &larr; Kembali
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">Edit Artikel</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <form action={updateArtikel} className="flex flex-col gap-6">
          
          {/* BARIS JUDUL BILINGUAL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Judul Artikel (English)</label>
              <input type="text" name="judul" defaultValue={artikel.judul} required 
                className="w-full border border-gray-300 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Judul Artikel (Indonesia)</label>
              <input type="text" name="judulId" defaultValue={artikel.judulId || artikel.judul} required 
                className="w-full border border-gray-300 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50" />
            </div>
          </div>

          {/* BARIS KONTEN */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Konten Artikel (English)</label>
            <textarea name="konten" defaultValue={artikel.konten} required 
              className="w-full border border-gray-300 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 h-80 resize-y font-sans leading-relaxed" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Konten Artikel (Indonesia)</label>
            <textarea name="kontenId" defaultValue={artikel.kontenId || artikel.konten} required 
              className="w-full border border-gray-300 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 h-80 resize-y font-sans leading-relaxed" />
          </div>

          {/* BARIS MEDIA COVER ARTIKEL */}
          <div className="border-t pt-6">
            {artikel.gambar && (
              <div className="mb-4 bg-gray-50 p-3 rounded-lg border border-dashed inline-block">
                <span className="block text-xs text-gray-400 mb-1.5">Cover saat ini:</span>
                <img src={artikel.gambar} className="w-44 h-28 object-cover rounded-lg border shadow-sm" alt="Current Cover" />
              </div>
            )}
            
            {/* Menyisipkan properti isEdit={true} agar form input gambar tidak wajib diisi */}
            <InputGambarArtikel isEdit={true} />
            <p className="text-xs text-gray-400 mt-1.5">*Pilih berkas baru hanya jika Anda ingin mengubah gambar cover saat ini.</p>
          </div>

          <div className="border-t pt-4 flex justify-end">
            <div className="w-full md:w-64">
              <SubmitButton 
                label="Simpan Perubahan" 
                confirmMessage="Apakah Anda yakin ingin MENYIMPAN PERUBAHAN data ini?" 
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}