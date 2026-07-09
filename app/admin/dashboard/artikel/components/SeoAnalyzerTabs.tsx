'use client';

import React, { useState } from 'react';
import SeoAnalyzer from './SeoAnalyzer';

interface SeoAnalyzerTabsProps {
  judulId: string;
  kontenId: string;
  judulEn: string;
  kontenEn: string;
  defaultKeywordId?: string;
  defaultKeywordEn?: string;
}

export default function SeoAnalyzerTabs({
  judulId,
  kontenId,
  judulEn,
  kontenEn,
  defaultKeywordId = '',
  defaultKeywordEn = '',
}: SeoAnalyzerTabsProps) {
  const [activeTab, setActiveTab] = useState<'id' | 'en'>('id');
  const [scoreId, setScoreId] = useState(0);
  const [scoreEn, setScoreEn] = useState(0);

  const badge = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-700';
    if (score >= 50) return 'bg-orange-100 text-orange-700';
    return 'bg-red-100 text-red-600';
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
        <button
          type="button"
          onClick={() => setActiveTab('id')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-xs font-bold transition ${
            activeTab === 'id' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500'
          }`}
        >
          Indonesia
          <span className={`px-1.5 py-0.5 rounded text-[10px] ${badge(scoreId)}`}>{scoreId}</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('en')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-xs font-bold transition ${
            activeTab === 'en' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500'
          }`}
        >
          English
          <span className={`px-1.5 py-0.5 rounded text-[10px] ${badge(scoreEn)}`}>{scoreEn}</span>
        </button>
      </div>

      {/* Kedua analyzer tetap mounted (hanya disembunyikan via CSS),
          supaya hidden input keyword-nya tetap ikut ter-submit walau tab tidak aktif */}
      <div className={activeTab === 'id' ? 'block' : 'hidden'}>
        <SeoAnalyzer
          judul={judulId}
          konten={kontenId}
          keywordFieldName="focusKeywordId"
          label="Indonesia"
          defaultKeyword={defaultKeywordId}
          onScoreChange={setScoreId}
        />
      </div>
      <div className={activeTab === 'en' ? 'block' : 'hidden'}>
        <SeoAnalyzer
          judul={judulEn}
          konten={kontenEn}
          keywordFieldName="focusKeywordEn"
          label="English"
          defaultKeyword={defaultKeywordEn}
          onScoreChange={setScoreEn}
        />
      </div>
    </div>
  );
}
