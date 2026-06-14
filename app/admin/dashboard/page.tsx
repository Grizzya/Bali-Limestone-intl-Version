import { prisma } from '@/lib/prisma';
import { Package, Wrench, Tags, FileText } from 'lucide-react';
import Link from 'next/link';

export default async function DashboardHomePage() {
  // Mengambil total jumlah data dari semua tabel secara bersamaan (Layanan/Jasa TETAP DIHITUNG dari DB)
  const [totalProduk, totalJasa, totalKategori, totalArtikel] = await Promise.all([
    prisma.produk.count(),
    prisma.jasa.count(),
    prisma.kategori.count(),
    prisma.artikel.count(),
  ]);

  return (
    <div className="p-8 max-w-6xl mx-auto text-black">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Selamat Datang di Admin Panel</h1>
        <p className="text-gray-500 mt-2 text-lg">Ringkasan data bisnis Bali Limestone saat ini.</p>
      </div>

      {/* GRID KARTU STATISTIK (Desain & Bentuk 100% Utuh) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Kartu Produk */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
            <Package size={32} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Products</p>
            <h3 className="text-3xl font-bold text-gray-800">{totalProduk}</h3>
          </div>
        </div>

        {/* Kartu Jasa (TETAP MENAMPILKAN DATA DARI TIDB) */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="p-4 bg-green-50 text-green-600 rounded-xl">
            <Wrench size={32} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Jasa</p>
            <h3 className="text-3xl font-bold text-gray-800">{totalJasa}</h3>
          </div>
        </div>

        {/* Kartu Kategori */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="p-4 bg-yellow-50 text-yellow-600 rounded-xl">
            <Tags size={32} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Kategori</p>
            <h3 className="text-3xl font-bold text-gray-800">{totalKategori}</h3>
          </div>
        </div>

        {/* Kartu Artikel */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="p-4 bg-purple-50 text-purple-600 rounded-xl">
            <FileText size={32} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Artikel Blog</p>
            <h3 className="text-3xl font-bold text-gray-800">{totalArtikel}</h3>
          </div>
        </div>

      </div>

      {/* QUICK ACTIONS (AKSI CEPAT) */}
      <div className="mt-10 bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-3">FAST ACTION</h2>
        <div className="flex flex-wrap gap-4">
          <Link href="/admin/dashboard/produk" className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all shadow-sm">
            + Add New Product
          </Link>
          <Link href="/admin/dashboard/artikel" className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all">
            Tulis Artikel Blog
          </Link>
        </div>
      </div>
      
    </div>
  );
}