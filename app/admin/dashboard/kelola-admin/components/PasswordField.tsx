'use client';

import { useState } from 'react';

export default function PasswordField({ required = true, placeholder = "Minimal 6 karakter" }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        name="password"
        required={required}
        minLength={6} 
        placeholder={placeholder}
        className="w-full border px-4 py-3 rounded-lg outline-none pr-16 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500 hover:text-blue-600 transition-colors"
      >
        {showPassword ? "TUTUP" : "LIHAT"}
      </button>
    </div>
  );
}