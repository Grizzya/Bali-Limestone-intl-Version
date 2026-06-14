'use client';

import { useFormStatus } from 'react-dom';

interface SubmitButtonProps {
  label: string;
  confirmMessage: string;
}

export default function SubmitButton({ label, confirmMessage }: SubmitButtonProps) {
  // useFormStatus akan mendeteksi apakah form sedang memproses data ke database
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (!confirm(confirmMessage)) {
          e.preventDefault(); // Batalkan eksekusi form jika user klik Cancel
        }
      }}
      className={`w-full font-bold py-3 rounded-lg shadow-md mt-4 transition-all ${
        pending 
          ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
          : 'bg-blue-600 text-white hover:bg-blue-700'
      }`}
    >
      {pending ? 'Menyimpan Data...' : label}
    </button>
  );
}