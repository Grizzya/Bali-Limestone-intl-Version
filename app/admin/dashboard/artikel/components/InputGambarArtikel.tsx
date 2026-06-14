'use client';

interface InputGambarArtikelProps {
  isEdit?: boolean; 
}

export default function InputGambarArtikel({ isEdit = false }: InputGambarArtikelProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {isEdit ? 'Replace Cover Image (Optional – Max 5 MB)' : 'Article Cover Image (Max 5 MB)'}
      </label>
      <input 
        type="file" 
        name="gambar" 
        accept="image/*" 
       
        required={!isEdit} 
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && file.size > 5 * 1024 * 1024) {
            alert(`Ukuran file "${file.name}" terlalu besar (${(file.size / (1024 * 1024)).toFixed(2)} MB). Maksimal ukuran file yang diizinkan adalah 5 MB.`);
            e.target.value = ""; 
          }
        }}
        className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm bg-white file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 outline-none cursor-pointer" 
      />
    </div>
  );
}