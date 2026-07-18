'use client';

import React, { useEffect, useState } from 'react';
// @ts-ignore - 
import { Paper, SEOAssessor } from 'yoastseo';

interface SeoAnalyzerProps {
  judul: string;
  konten: string;
  keywordFieldName: string;
  label?: string;
  defaultKeyword?: string;
  onKeywordChange?: (keyword: string) => void;
  onScoreChange?: (score: number) => void;
}

export default function SeoAnalyzer({
  judul,
  konten,
  keywordFieldName,
  label,
  defaultKeyword = '',
  onKeywordChange,
  onScoreChange,
}: SeoAnalyzerProps) {
  const [keyword, setKeyword] = useState(defaultKeyword);
  const [score, setScore] = useState(0);
  const [checklist, setChecklist] = useState<{ text: string; passed: boolean }[]>([]);

  useEffect(() => {
    if (!keyword.trim()) {
      setScore(0);
      onScoreChange?.(0);
      setChecklist([{ text: 'Masukkan focus keyword untuk memulai analisis SEO.', passed: false }]);
      return;
    }

    
    const paper = new Paper(konten, {
      keyword: keyword,
      title: judul,
      titleWidth: judul.length * 8, 
      description: '', 
      locale: label === 'Indonesia' ? 'id_ID' : 'en_US', 
    });

    
    const assessor = new SEOAssessor();
    assessor.assess(paper);
    
    const results = assessor.getValidResults();

    let totalYoastScore = 0;
    const newChecklist: { text: string; passed: boolean }[] = [];

    results.forEach((result: any) => {
      
      const isPassed = result.score >= 7;
      totalYoastScore += result.score;

      // Pesan Yoast sering kali mengandung tag HTML (seperti <a> atau <strong>)
      // Kita bersihkan agar rapi di UI Anda
      const cleanText = result.text.replace(/<[^>]+>/g, '');

      newChecklist.push({
        text: cleanText,
        passed: isPassed,
      });
    });

    // 4. Konversi skor Yoast (skala 1-9) ke skor persentase (0-100) untuk UI Anda
    const maxPossibleScore = results.length * 9;
    const finalScore = maxPossibleScore > 0 ? Math.round((totalYoastScore / maxPossibleScore) * 100) : 0;

    setScore(finalScore);
    setChecklist(newChecklist);
    onScoreChange?.(finalScore);

  }, [keyword, judul, konten, label, onScoreChange]);

  const dapatkanWarnaSkor = () => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 50) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between border-b pb-3">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          SEO Analyzer {label && <span className="text-xs font-medium text-gray-400">({label})</span>}
        </h3>
        <div className={`text-white font-extrabold px-3 py-1.5 rounded-lg text-sm shadow-sm ${dapatkanWarnaSkor()}`}>
          Skor: {score}/100
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider">
          Fokus Kata Kunci (Focus Keyword) {label && `- ${label}`}
        </label>
        <input
          type="text"
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
            onKeywordChange?.(e.target.value);
          }}
          placeholder="Contoh: batu alam bali, bali limestone"
          className="w-full border border-gray-300 px-4 py-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-50"
        />
        <input type="hidden" name={keywordFieldName} value={keyword} />
      </div>

      <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
        <div className={`h-full transition-all duration-500 ${dapatkanWarnaSkor()}`} style={{ width: `${score}%` }} />
      </div>

      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Analisis Dasar:</h4>
        <ul className="space-y-2.5 text-xs text-gray-600 h-64 overflow-y-auto pr-2 scrollbar-thin">
          {checklist.length > 0 ? (
            checklist.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 leading-relaxed border-b border-gray-50 pb-2 last:border-0">
                <span className={`flex-shrink-0 text-sm leading-none ${item.passed ? 'text-green-500' : 'text-red-400'}`}>
                  {item.passed ? '✓' : 'x'}
                </span>
                <span className={item.passed ? 'text-gray-700' : 'text-gray-400 italic'}>{item.text}</span>
              </li>
            ))
          ) : (
            <li className="text-gray-400 italic">Analisis akan muncul di sini...</li>
          )}
        </ul>
      </div>
    </div>
  );
}