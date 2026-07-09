'use client';

import React, { useEffect, useState } from 'react';

interface SeoAnalyzerProps {
  judul: string;
  konten: string;
  /** Nama field untuk hidden input, misal "focusKeywordId" / "focusKeywordEn" */
  keywordFieldName: string;
  /** Label kecil di header, misal "Indonesia" / "English" */
  label?: string;
  /** Nilai awal (untuk mode edit artikel) */
  defaultKeyword?: string;
  /** Opsional: kirim keyword ke parent kalau parent butuh (misal untuk badge status) */
  onKeywordChange?: (keyword: string) => void;
  /** Opsional: kirim skor ke parent (misal untuk badge status di list artikel) */
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
    let currentScore = 0;
    const checks: { text: string; passed: boolean }[] = [];

    if (!keyword.trim()) {
      setScore(0);
      onScoreChange?.(0);
      setChecklist([{ text: 'Masukkan focus keyword untuk memulai analisis SEO.', passed: false }]);
      return;
    }

    const kw = keyword.toLowerCase().trim();
    const jdl = judul.toLowerCase();
    const ktn = konten.toLowerCase();

    const kwInTitle = jdl.includes(kw);
    checks.push({
      text: kwInTitle ? 'Focus keyword ditemukan di judul.' : 'Focus keyword TIDAK ditemukan di judul.',
      passed: kwInTitle,
    });
    if (kwInTitle) currentScore += 25;

    const awalKonten = ktn.substring(0, Math.floor(ktn.length * 0.15));
    const kwInEarlyContent = awalKonten.includes(kw);
    checks.push({
      text: kwInEarlyContent ? 'Focus keyword muncul di paragraf pembuka.' : 'Focus keyword tidak ada di paragraf pembuka.',
      passed: kwInEarlyContent,
    });
    if (kwInEarlyContent) currentScore += 20;

    const jumlahKata = konten
      .replace(/<[^>]+>/g, ' ')
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
    const wordCountPassed = jumlahKata >= 300;
    checks.push({
      text: `Panjang konten: ${jumlahKata} kata. ${wordCountPassed ? '(Bagus, minimal 300 kata)' : '(Kurang, usahakan minimal 300 kata)'}`,
      passed: wordCountPassed,
    });
    if (wordCountPassed) currentScore += 25;

    const escapedKw = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const matches = ktn.match(new RegExp(escapedKw, 'g'));
    const count = matches ? matches.length : 0;
    const density = jumlahKata > 0 ? (count / jumlahKata) * 100 : 0;
    const densityPassed = density >= 0.8 && density <= 2.5;
    checks.push({
      text: `Kepadatan kata kunci: ${density.toFixed(2)}% (Ideal: 0.8% - 2.5%)`,
      passed: densityPassed,
    });
    if (densityPassed) currentScore += 15;

    const titleLengthPassed = judul.length >= 40 && judul.length <= 60;
    checks.push({
      text: `Panjang judul: ${judul.length} karakter (Ideal: 40 - 60 karakter)`,
      passed: titleLengthPassed,
    });
    if (titleLengthPassed) currentScore += 15;

    setScore(currentScore);
    setChecklist(checks);
    onScoreChange?.(currentScore);
  }, [keyword, judul, konten]);

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
        {/* Ini yang tadinya hilang: keyword ikut ter-submit ke server action */}
        <input type="hidden" name={keywordFieldName} value={keyword} />
      </div>

      <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
        <div className={`h-full transition-all duration-500 ${dapatkanWarnaSkor()}`} style={{ width: `${score}%` }} />
      </div>

      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Analisis Dasar:</h4>
        <ul className="space-y-2.5 text-xs text-gray-600">
          {checklist.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
              <span className={`flex-shrink-0 text-sm leading-none ${item.passed ? 'text-green-500' : 'text-red-400'}`}>
                {item.passed ? '✓' : 'x'}
              </span>
              <span className={item.passed ? 'text-gray-700' : 'text-gray-400 italic'}>{item.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
