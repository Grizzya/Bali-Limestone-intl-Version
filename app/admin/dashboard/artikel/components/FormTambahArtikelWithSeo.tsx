'use client';

import React, { useState } from 'react';
import InputGambarArtikel from './InputGambarArtikel';
import SeoAnalyzer from './SeoAnalyzer';

interface FormProps {
  serverAction: (formData: FormData) => Promise<void>;
}

export default function FormTambahArtikelWithSeo({ serverAction }: FormProps) {
  const [judulEn, setJudulEn] = useState('');
  const [kontenEn, setKontenEn] = useState('');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
      
      
      <div className="lg:col-span-8 bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <form action={serverAction} className="flex flex-col gap-6">
          
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Judul Artikel (English)</label>
              <input 
                type="text" 
                name="judul" 
                value={judulEn}
                onChange={(e) => setJudulEn(e.target.value)}
                placeholder="Contoh: Benefits of Limestone for Modern Architecture..." 
                required 
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50/50 text-sm" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Judul Artikel (Indonesia)</label>
              <input 
                type="text" 
                name="judulId" 
                placeholder="Contoh: Manfaat Batu Kapur untuk Arsitektur Modern..." 
                required 
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50/50 text-sm" 
              />
            </div>
          </div>

          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Conten Artikel (English)</label>
              <textarea 
                name="konten" 
                value={kontenEn}
                onChange={(e) => setKontenEn(e.target.value)}
                placeholder="Write your long-form article content here in English..." 
                required 
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-60 resize-y font-sans text-sm leading-relaxed" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Konten Artikel (Indonesia)</label>
              <textarea 
                name="kontenId" 
                placeholder="Tulis isi konten artikel lengkap Anda di sini dalam Bahasa Indonesia..." 
                required 
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-60 resize-y font-sans text-sm leading-relaxed" 
              />
            </div>
          </div>

          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end border-t pt-6">
            <div className="md:col-span-2">
              <InputGambarArtikel />
            </div>
            <div>
              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-all shadow-md text-sm">
                Publish Artikel
              </button>
            </div>
          </div>

        </form>
      </div>

     
      <div className="lg:col-span-4 sticky top-28 z-10 self-start w-full">
        <SeoAnalyzer judul={judulEn} konten={kontenEn} />
      </div>

    </div>
  );
}