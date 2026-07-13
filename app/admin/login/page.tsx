import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const isError = resolvedSearchParams.error === '1';

  async function handleLogin(formData: FormData) {
    'use server';
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    if (!username || !password) {
      redirect('/admin/login?error=1');
    }

    let isSuccess = false;

    try {
      const admin = await prisma.admin.findUnique({
        where: { username: username },
      });

      // CEK STATUS AKTIF DI SINI (admin.isActive)
      if (admin && admin.isActive && bcrypt.compareSync(password, admin.password)) {
        
        await prisma.logAktivitas.create({
          data: {
            adminId: admin.id,
            aksi: 'LOGIN',
            detail: `${admin.nama} berhasil masuk ke dalam sistem.`,
          },
        });

        (await cookies()).set('admin_session', admin.id, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/',
        });

        isSuccess = true; 
      }
    } catch (error) {
      console.error('Login error:', error);
    }

    if (isSuccess) {
      redirect('/admin/dashboard');
    } else {
      redirect('/admin/login?error=1');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-6 text-black">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Login</h1>
          <p className="text-sm text-gray-500 mt-2">Bali Limestone Management System</p>
        </div>

        {isError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl font-medium text-sm text-center">
            ❌ Username/Password salah atau akun dinonaktifkan!
          </div>
        )}

        <form action={handleLogin} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Username</label>
            <input 
              type="text" 
              name="username" 
              placeholder="Enter username" 
              required 
              className="w-full border border-gray-300 px-4 py-3 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm" 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
            <input 
              type="password" 
              name="password" 
              placeholder="Enter password" 
              required 
              className="w-full border border-gray-300 px-4 py-3 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm" 
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 shadow-md hover:shadow-lg active:scale-[0.98] transition-all text-sm mt-2 cursor-pointer"
          >
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
}