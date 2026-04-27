'use client';

import Link from 'next/link';
import AuthButton from '../../components/AuthButton';

const FREE_FEATURES = [
  '18 interactive learning games',
  'Alphabet, Numbers, Shapes & Colors',
  'Math Engine (4 operations)',
  'English Word Builder',
  'Missing Letter game',
  'Letter Fishing phonics',
  'Basic play — no sign-in required',
];

const PREMIUM_FEATURES = [
  'Full Structured Learning Path (12 steps)',
  'Carry & Borrow Grid (highest-value game)',
  'Adaptive difficulty that grows with your child',
  'Parent Dashboard with progress analytics',
  'Weak-area detection & priority recommendations',
  'Reward Engine — badges, streaks & points',
  'Session history & improvement charts',
  'Priority support',
];

export default function UpgradePage() {
  return (
    <div className="min-h-screen bg-black">

      {/* ── Header ──────────────────────────────────────────── */}
      <header className="bg-black border-b border-[#1a1a1a] sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="ps-btn ps-btn-sm ps-btn-ghost-dark">← Back</Link>
          <h1 className="text-[20px] font-light text-white">Upgrade to Premium</h1>
          <AuthButton />
        </div>
      </header>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="bg-black py-16 px-6 text-center border-b border-[#1a1a1a]">
        <div className="max-w-2xl mx-auto flex flex-col gap-6">
          <div className="text-[64px]">🚀</div>
          <h2 className="text-[36px] md:text-[48px] font-bold text-white leading-tight">
            Your child improves through<br />
            <span style={{ color: '#0070cc' }}>15 minutes of structured practice</span>
          </h2>
          <p className="text-[#6b6b6b] text-lg leading-relaxed max-w-xl mx-auto">
            Kiddy Premium is designed for parents who want to see real, measurable improvement
            — not just play time. Track progress, spot weaknesses early, and celebrate every milestone.
          </p>
        </div>
      </section>

      {/* ── Plans ─────────────────────────────────────────────── */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Free plan */}
          <div
            className="bg-white rounded-[24px] p-8 flex flex-col gap-6"
            style={{ boxShadow: 'rgba(0,0,0,0.06) 0 4px 16px 0' }}
          >
            <div>
              <p className="text-xs text-[#6b6b6b] uppercase tracking-widest mb-2">Free</p>
              <p className="text-[40px] font-bold text-gray-900">₹0<span className="text-base font-normal text-gray-400">/month</span></p>
              <p className="text-gray-500 text-sm mt-1">Always free — explore all games</p>
            </div>
            <ul className="flex flex-col gap-3 flex-1">
              {FREE_FEATURES.map(f => (
                <li key={f} className="flex items-start gap-3 text-sm text-gray-700">
                  <span className="text-green-500 font-bold mt-0.5">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/"
              className="ps-btn w-full text-center bg-[#f5f7fa] hover:bg-[#ebebeb] text-gray-700 border-0 py-3 rounded-[12px] font-semibold"
            >
              Start Playing Free
            </Link>
          </div>

          {/* Premium plan */}
          <div
            className="rounded-[24px] p-8 flex flex-col gap-6 relative overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, #003791 0%, #0070cc 100%)',
              boxShadow: 'rgba(0,112,204,0.35) 0 8px 32px 0',
            }}
          >
            {/* Badge */}
            <div className="absolute top-6 right-6 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">
              BEST VALUE
            </div>

            <div>
              <p className="text-xs text-white/60 uppercase tracking-widest mb-2">Premium</p>
              <p className="text-[40px] font-bold text-white">₹299<span className="text-base font-normal text-white/60">/month</span></p>
              <p className="text-white/70 text-sm mt-1">Cancel anytime — no lock-in</p>
            </div>
            <ul className="flex flex-col gap-3 flex-1">
              {PREMIUM_FEATURES.map(f => (
                <li key={f} className="flex items-start gap-3 text-sm text-white">
                  <span className="text-yellow-300 font-bold mt-0.5">★</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button
              className="w-full bg-white text-[#003791] font-bold py-3 rounded-[12px] hover:bg-yellow-50 transition-colors"
              onClick={() => alert('Premium billing is coming soon! You\'ll be notified when it launches.')}
            >
              Join the Waitlist →
            </button>
            <p className="text-center text-white/50 text-xs -mt-3">Billing coming soon — be first to know</p>
          </div>

        </div>
      </section>

      {/* ── Trust strip ───────────────────────────────────────── */}
      <section className="py-12 px-6 bg-[#0d0d0d] border-t border-[#1a1a1a]">
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { icon: '📊', title: 'Measurable Progress', body: 'Parents see exactly where their child is struggling and improving week over week.' },
            { icon: '🎯', title: 'Adaptive Difficulty', body: 'The system automatically adjusts challenge level to keep kids in their optimal learning zone.' },
            { icon: '🏆', title: 'Built-in Motivation', body: 'Badges, streaks, and a reward engine keep children engaged without screen-time battles.' },
          ].map(({ icon, title, body }) => (
            <div key={title} className="flex flex-col items-center gap-3">
              <div className="text-[48px]">{icon}</div>
              <h3 className="text-white font-semibold">{title}</h3>
              <p className="text-[#6b6b6b] text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ / What you get ─────────────────────────────────── */}
      <section className="py-12 px-6 border-t border-[#1a1a1a]">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-white text-2xl font-bold text-center mb-8">Common questions</h2>
          <div className="flex flex-col gap-4">
            {[
              {
                q: 'Can I try before subscribing?',
                a: 'Yes — all 18 games are free forever. Premium unlocks the structured learning path, parent analytics, and reward engine on top of the free games.',
              },
              {
                q: 'When is billing available?',
                a: 'We\'re in the final stages of setting up secure billing. Join the waitlist and you\'ll be first to access it — often with an early-adopter discount.',
              },
              {
                q: 'What age group is this for?',
                a: 'Kiddy is optimised for kindergarten to Grade 2 (ages 4–8). The adaptive difficulty means it grows with your child.',
              },
              {
                q: 'Can I use it on any device?',
                a: 'Yes — Kiddy works on phones, tablets, and desktops. Progress syncs across devices when signed in.',
              },
            ].map(({ q, a }) => (
              <div key={q} className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-[16px] p-5">
                <p className="text-white font-semibold mb-2">{q}</p>
                <p className="text-[#6b6b6b] text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer CTA ────────────────────────────────────────── */}
      <footer
        className="py-12 px-6 text-center"
        style={{ background: 'linear-gradient(180deg, #001a4d 0%, #003791 100%)' }}
      >
        <p className="text-white/70 text-sm mb-6">Start with free games. Upgrade when you see the value.</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/" className="ps-btn bg-white text-[#003791] font-bold hover:bg-yellow-50">
            Explore Free Games
          </Link>
          <Link href="/parent" className="ps-btn bg-transparent border border-white/40 text-white hover:bg-white/10">
            View Parent Dashboard
          </Link>
        </div>
      </footer>
    </div>
  );
}
