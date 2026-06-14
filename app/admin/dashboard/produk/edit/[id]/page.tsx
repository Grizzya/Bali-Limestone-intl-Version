import { prisma } from '@/lib/prisma';
import cloudinary from '@/lib/cloudinary';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import SubmitButton from '../../../SubmitButton'; 
import { rekamAktivitas } from '@/lib/logger';

export default async function EditProdukPage({ params }: { params: Promise<{ id: string }> }) {
  const productId = (await params).id;

  const produk = await prisma.produk.findUnique({
    where: { id: productId },
  });

  if (!produk) return <div className="p-8 text-center text-black">Product Not Found.</div>;

  const daftarKategori = await prisma.kategori.findMany();

  async function updateProduk(formData: FormData) {
    'use server';
    
    const nama = formData.get('nama') as string;
    const deskripsi = formData.get('deskripsi') as string;
    
    
    const namaId = formData.get('namaId') as string;
    const deskripsiId = formData.get('deskripsiId') as string;
    
    const kategoriId = formData.get('kategoriId') as string;
    const file = formData.get('gambar') as File;

    if (!nama || !namaId || !kategoriId) return;

    let imageUrl = produk?.gambar;

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

   
    await prisma.produk.update({
      where: { id: productId },
      data: { 
        nama, 
        namaId, 
        deskripsi, 
        deskripsiId, 
        kategoriId, 
        gambar: imageUrl 
      },
    });

    // 2. Kirim catatan ke Log Aktivitas admin
    await rekamAktivitas('EDIT_PRODUK', `Mengubah data produk: "${namaId}" (${nama})`);

    revalidatePath('/admin/dashboard/produk');
    redirect('/admin/dashboard/produk'); 
  }

  return (
    <div className="p-8 max-w-3xl mx-auto text-black">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/dashboard/produk" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors">
          &larr; Kembali
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">Edit Product</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <form action={updateProduk} className="flex flex-col gap-6">
          
          {/* INPUT: Nama English */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name (English)</label>
            <input type="text" name="nama" defaultValue={produk.nama} required className="w-full border border-gray-300 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          {/* 🔹 INPUT BARU: Nama Indonesia (Mengisi field namaId) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name (Indonesian)</label>
            <input type="text" name="namaId" defaultValue={produk.namaId || produk.nama} required className="w-full border border-gray-300 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
            <select name="kategoriId" defaultValue={produk.kategoriId} required className="w-full border border-gray-300 px-4 py-3 rounded-lg outline-none bg-white">
              {daftarKategori.map((kat) => (
                <option key={kat.id} value={kat.id}>{kat.nama}</option>
              ))}
            </select>
          </div>

          {/* INPUT: Deskripsi English */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (English)</label>
            <textarea name="deskripsi" defaultValue={produk.deskripsi} required className="w-full border border-gray-300 px-4 py-3 rounded-lg outline-none h-28 resize-none focus:ring-2 focus:ring-blue-500" />
          </div>

          {/* INPUT BARU: Deskripsi Indonesia (Mengisi field deskripsiId) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (Indonesian)</label>
            <textarea name="deskripsiId" defaultValue={produk.deskripsiId || produk.deskripsi} required className="w-full border border-gray-300 px-4 py-3 rounded-lg outline-none h-28 resize-none focus:ring-2 focus:ring-blue-500" />
          </div>

          {/* PENGGANTI IMAGEPREVIEW: Menggunakan Input File HTML Standar Mandiri */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Replace Product Image (Optional)</label>
            {produk.gambar && (
              <div className="mb-3">
                <span className="block text-xs text-gray-400 mb-1">Gambar saat ini:</span>
                <img src={produk.gambar} className="w-24 h-24 object-cover rounded-lg border shadow-sm" alt="Current" />
              </div>
            )}
            <input 
              type="file" 
              name="gambar" 
              accept="image/*" 
              className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm bg-white file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 outline-none cursor-pointer" 
            />
          </div>

          <SubmitButton 
            label="Simpan Perubahan" 
            confirmMessage="Apakah Anda yakin ingin MENYIMPAN PERUBAHAN data ini?" 
          />
        </form>
      </div>
    </div>
  );
}