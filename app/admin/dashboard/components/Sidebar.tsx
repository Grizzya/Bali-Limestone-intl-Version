'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { handleLogout } from '../actions';
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  FileText, 
  LogOut,
  Users, 
  History,
  Menu,
  X
} from 'lucide-react'; 

export default function Sidebar({ isSuperAdmin }: { isSuperAdmin: boolean }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false); // State untuk menu mobile

  // Otomatis tutup sidebar HP saat pindah halaman
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // 🔹 JASA SUDAH DICABUT: Baris 'Kelola Jasa' telah dihapus dari array menu utama
  const menuItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Manage Products', href: '/admin/dashboard/produk', icon: <Package size={20} /> },
    { name: 'Manage Categories', href: '/admin/dashboard/kategori', icon: <Tags size={20} /> },
    { name: 'Manage Articles', href: '/admin/dashboard/artikel', icon: <FileText size={20} /> },
    { name: 'Manage Testimonials', href: '/admin/dashboard/testimoni', icon: <FileText size={20} /> },
  ];

  if (isSuperAdmin) {
    menuItems.push(
      { name: 'Manage Admins', href: '/admin/dashboard/kelola-admin', icon: <Users size={20} /> },
      { name: 'Log Aktivitas', href: '/admin/dashboard/log-aktivitas', icon: <History size={20} /> }
    );
  }

  return (
    <>
      {/* 1. HEADER MOBILE (Hanya muncul di HP) */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-40 flex items-center justify-between px-5 shadow-sm">
        <h2 className="text-lg font-bold text-blue-700 tracking-tight flex items-center gap-2">
          Bali Limestone <span className="text-gray-500 text-[10px] px-1.5 py-0.5 rounded bg-gray-100 uppercase border border-gray-200">Admin</span>
        </h2>
        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* 2. OVERLAY GELAP (Muncul di HP saat menu dibuka) */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 3. SIDEBAR ASLI */}
      <aside 
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col z-50 transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0
        `}
      >
        <div className="p-6 md:mt-9 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-blue-700 tracking-tight hidden md:block">
            Bali Limestone <span className="text-gray-400 text-xs block font-normal uppercase mt-1">Admin Panel</span>
          </h2>
          <h2 className="text-lg font-bold text-blue-700 tracking-tight md:hidden">
            Menu
          </h2>
          <button className="md:hidden text-gray-400 hover:text-gray-700" onClick={() => setIsOpen(false)}>
             <X size={24} />
          </button>
        </div>

        <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            // Perbaikan logika agar Dashboard tidak selalu menyala
            const isActive = item.href === '/admin/dashboard' 
              ? pathname === item.href 
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
              
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* TOMBOL LOGOUT */}
        <div className="p-4 border-t border-gray-100 mt-auto">
          <button 
            onClick={async () => {
              if (confirm('Apakah Anda yakin ingin keluar?')) {
                await handleLogout();
              }
            }}
            type="button" 
            className="flex items-center gap-3 w-full px-4 py-3 text-red-600 font-medium hover:bg-red-50 rounded-lg transition-all cursor-pointer"
          >
            <LogOut size={20} />
            Keluar
          </button>
        </div>
      </aside>
    </>
  );
}