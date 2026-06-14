import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.jasa.deleteMany({});
  
  await prisma.jasa.createMany({
    data: [
      {
        id: 'land-cut-fill',
        nama: 'Land Cut & Fill',
        namaId: 'Cut & Fill Lahan',
        deskripsi: 'Bali Limestone provides professional Land Cut & Fill services across Bali. Using heavy excavators and bulldozers, we level and grade your land precisely for villa foundations, housing estates, resort developments, and large commercial projects.',
        deskripsiId: 'Bali Limestone menyediakan layanan Cut & Fill lahan profesional di seluruh Bali. Menggunakan excavator dan bulldozer bertenaga tinggi, kami meratakan dan membentuk lahan secara presisi untuk pondasi villa, perumahan, resort, dan proyek komersial berskala besar.',
      },
      {
        id: 'basement-excavation',
        nama: 'Basement Excavation',
        namaId: 'Galian Basement',
        deskripsi: 'Our Basement Excavation service in Bali handles deep digging for basements, underground parking, and large building foundations. Bali Limestone uses precision excavators operated by skilled professionals to ensure safe, accurate, and efficient excavation on every project.',
        deskripsiId: 'Layanan Galian Basement Bali Limestone menangani penggalian dalam untuk basement, parkir bawah tanah, dan pondasi bangunan besar di Bali. Kami menggunakan excavator presisi yang dioperasikan oleh tenaga ahli berpengalaman untuk memastikan galian yang aman, akurat, dan efisien.',
      },
      {
        id: 'land-clearing',
        nama: 'Land Clearing',
        namaId: 'Pembersihan Lahan',
        deskripsi: 'Bali Limestone offers complete Land Clearing services across Bali — removing trees, shrubs, roots, and organic debris to prepare your site for construction. Our heavy equipment and skilled operators work quickly and efficiently, ensuring your land is clean and ready on schedule.',
        deskripsiId: 'Bali Limestone menawarkan layanan pembersihan lahan lengkap di seluruh Bali — menebang pohon, semak, akar, dan material organik untuk mempersiapkan lokasi konstruksi Anda. Alat berat dan operator terampil kami bekerja cepat dan efisien, memastikan lahan bersih dan siap sesuai jadwal.',
      },
      {
        id: 'building-demolition',
        nama: 'Building Demolition',
        namaId: 'Bongkar Bangunan',
        deskripsi: 'Bali Limestone provides safe and controlled Building Demolition services in Bali. We handle the complete demolition of old structures, walls, and buildings of any size — including debris removal and full site cleanup, ready for new construction.',
        deskripsiId: 'Bali Limestone menyediakan layanan Bongkar Bangunan yang aman dan terkontrol di Bali. Kami menangani pembongkaran lengkap bangunan lama, dinding, dan struktur dari berbagai ukuran — termasuk pengangkutan puing dan pembersihan lokasi siap untuk konstruksi baru.',
      },
    ],
  });

  console.log('Data berhasil dimasukkan!');
  await prisma.$disconnect();
}

main().catch(console.error);