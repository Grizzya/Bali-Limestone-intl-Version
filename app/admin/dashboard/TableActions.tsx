'use client';

import Link from 'next/link';

interface TableActionsProps {
  id: string;
  editUrl: string;
  onDelete: (formData: FormData) => Promise<void>;
}

export default function TableActions({ id, editUrl, onDelete }: TableActionsProps) {
  return (
    <div className="flex justify-end gap-2">
      
      {/* TOMBOL EDIT (Tanpa Pop-up) */}
      <Link 
        href={editUrl} 
        className="px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded text-sm font-medium hover:bg-yellow-200"
      >
        Edit
      </Link>

      {/* TOMBOL HAPUS (Tetap pakai Pop-up karena berbahaya) */}
      <form 
        action={onDelete} 
        onSubmit={(e) => {
          if (!confirm('AWAS! Apakah Anda yakin ingin MENGHAPUS data ini secara permanen?')) {
            e.preventDefault(); // Batalkan jika klik Cancel
          }
        }}
      >
        <input type="hidden" name="id" value={id} />
        <button type="submit" className="px-3 py-1.5 bg-red-100 text-red-600 rounded text-sm font-medium hover:bg-red-200 cursor-pointer">
          Hapus
        </button>
      </form>

    </div>
  );
}