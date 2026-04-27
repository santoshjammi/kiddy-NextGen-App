'use client';

import Link from 'next/link';
import EnglishEngine from '../../components/english/EnglishEngine';
import AuthButton from '../../components/AuthButton';

export default function EnglishPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Nav */}
      <header className="bg-black border-b border-[#1a1a1a] sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="ps-btn ps-btn-sm ps-btn-ghost-dark">← Back</Link>
          <div className="text-center">
            <h1 className="text-[22px] font-light text-white tracking-[0.1px]">Word Builder</h1>
            <p className="text-[#6b6b6b] text-xs mt-0.5">From letters to words — grow your vocabulary</p>
          </div>
          <AuthButton />
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-[24px] p-6 md:p-10" style={{ boxShadow: 'rgba(0,0,0,0.08) 0 5px 9px 0' }}>
          <EnglishEngine />
        </div>
      </div>
    </div>
  );
}
