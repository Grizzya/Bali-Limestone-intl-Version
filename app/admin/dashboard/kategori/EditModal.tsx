"use client";

import { useState } from "react";

type Kategori = {
  id: string;
  nama: string;
  namaId: string | null;
};

export default function EditModal({
  kategori,
  updateAction,
}: {
  kategori: Kategori;
  updateAction: (formData: FormData) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded text-sm font-medium hover:bg-yellow-200 transition-colors"
      >
        Edit
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">
              Edit Category
            </h2>

            <form
              action={async (formData) => {
                await updateAction(formData);
                setOpen(false);
              }}
              className="flex flex-col gap-5"
            >
              <input type="hidden" name="id" value={kategori.id} />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Kategori (English)
                </label>
                <input
                  type="text"
                  name="nama"
                  defaultValue={kategori.nama}
                  required
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Kategori (Indonesia)
                </label>
                <input
                  type="text"
                  name="namaId"
                  defaultValue={kategori.namaId ?? ""}
                  required
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-all shadow-md text-sm"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-200 transition-all text-sm"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}