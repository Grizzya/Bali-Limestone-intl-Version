'use client';

import { useFormStatus } from 'react-dom';

interface SubmitButtonProps {
  label: string;
  confirmMessage?: string;
}

export default function SubmitButton({ label, confirmMessage }: SubmitButtonProps) {
  // useFormStatus otomatis mendeteksi jika Server Action form sedang memproses data
  const { pending } = useFormStatus();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Jika ada pesan konfirmasi, munculkan pop-up browser. Jika klik 'Cancel', batalkan form.
    if (confirmMessage && !window.confirm(confirmMessage)) {
      e.preventDefault();
    }
  };

  return (
    <button
      type="submit"
      disabled={pending}
      onClick={handleClick}
      className={`w-full font-bold py-3 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
        pending 
          ? 'bg-blue-400 text-gray-100 cursor-not-allowed' 
          : 'bg-blue-600 text-white hover:bg-blue-700'
      }`}
    >
      {pending ? (
        <>
          {/* SAKTI: Animasi Spinner Berputar Saat Menunggu Database TiDB & Cloudinary */}
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Menyimpan Data...
        </>
      ) : (
        label
      )}
    </button>
  );
}