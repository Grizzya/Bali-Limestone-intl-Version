import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { rekamAktivitas } from '@/lib/logger'; // Sesuaikan jika ada fungsi log

export default async function TestimoniPage() {
  const daftarTestimoni = await prisma.testimoni.findMany({
    orderBy: { createdAt: 'desc' },
  });

  async function tambahTestimoni(formData: FormData) {
    'use server';
    const nama = formData.get('nama') as string;
    const peran = formData.get('peran') as string;
    const pesan = formData.get('pesan') as string;
    const ratingInput = formData.get('rating') as string;
    const rating = parseInt(ratingInput) || 5;

    if (!nama || !pesan) return;

    await prisma.testimoni.create({
      data: { nama, peran, pesan, rating },
    });
    
    await rekamAktivitas('TAMBAH_TESTIMONI', `Menambahkan testimoni dari: "${nama}"`);
    revalidatePath('/admin/dashboard/testimoni');
    revalidatePath('/'); // Refresh beranda juga
  }

  async function hapusTestimoni(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    if (!id) return;

    await prisma.testimoni.delete({ where: { id } });
    await rekamAktivitas('HAPUS_TESTIMONI', `Menghapus data testimoni`);
    revalidatePath('/admin/dashboard/testimoni');
    revalidatePath('/');
  }

  return (
    <div className="p-8 max-w-6xl mx-auto text-black">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Manage Customer Testimonials</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* FORM TAMBAH */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit">
          <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Add Testimonial</h2>
          <form action={tambahTestimoni} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pelanggan</label>
              <input type="text" name="nama" required className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-yellow-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status / Peran</label>
              <input type="text" name="peran" placeholder="Misal: Kontraktor, Customer" required className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-yellow-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bintang (Rating)</label>
              <select name="rating" className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-yellow-400">
                <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                <option value="4">⭐⭐⭐⭐ (4)</option>
                <option value="3">⭐⭐⭐ (3)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea name="pesan" required className="w-full border p-2.5 rounded-lg outline-none h-28 resize-none focus:ring-2 focus:ring-yellow-400" />
            </div>
            <button type="submit" className="w-full bg-[#ffcc00] text-black font-bold py-3 rounded-lg hover:bg-yellow-500 transition-all shadow-md mt-2">
              Simpan Ulasan
            </button>
          </form>
        </div>

        {/* TABEL DAFTAR */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full">
            <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center rounded-t-xl">
              <h2 className="text-xl font-semibold text-gray-800">Testimonial List</h2>
            </div>
            <div className="overflow-x-auto p-4">
              <div className="flex flex-col gap-4">
                {daftarTestimoni.map((item) => (
                  <div key={item.id} className="border p-4 rounded-lg flex justify-between items-start hover:shadow-md transition-shadow bg-gray-50">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg">{item.nama}</h3>
                        <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">{item.peran}</span>
                      </div>
                      <p className="text-yellow-500 text-sm mb-2">{"★".repeat(item.rating)}{"☆".repeat(5 - item.rating)}</p>
                      <p className="text-sm text-gray-600 italic">"{item.pesan}"</p>
                    </div>
                    <form action={hapusTestimoni}>
                      <input type="hidden" name="id" value={item.id} />
                      <button className="px-3 py-1 bg-red-100 text-red-600 rounded text-xs font-bold hover:bg-red-200 transition-colors">Hapus</button>
                    </form>
                  </div>
                ))}
                {daftarTestimoni.length === 0 && <p className="text-center text-gray-500 p-4">No testimonials saved yet.</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}