import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

// 🔹 JURUS PAMUNGKAS: Impor file JSON secara statis di atas menggunakan ES Modules biasa.
// Sesuaikan jalurnya: Jika folder messages sudah Tuan pindahkan ke dalam folder i18n, gunakan './messages/...'
// Jika folder messages masih di folder paling luar (root), gunakan '@/messages/...' atau '../messages/...'
import enMessages from './messages/en.json';
import idMessages from './messages/id.json';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  // Lakukan pengecekan objek langsung tanpa proses pencarian file di runtime
  const messages = locale === 'id' ? idMessages : enMessages;

  return {
    locale,
    messages
  };
});