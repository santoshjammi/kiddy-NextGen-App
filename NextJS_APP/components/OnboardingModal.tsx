'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const STORAGE_KEY = 'kiddy_onboarded_v1';

const TRACKS = [
  {
    icon: '📊',
    title: 'Progress that updates in real time',
    body: 'Every game session updates your child\'s mastery score automatically. No manual entry.',
  },
  {
    icon: '🔍',
    title: 'Pinpoint weak areas',
    body: 'The dashboard records every wrong answer and tells you which concepts need more practice.',
  },
  {
    icon: '📋',
    title: 'A daily plan — not a pile of worksheets',
    body: 'Premium builds a 20-minute daily plan from your child\'s actual gaps. Start with the free trial.',
  },
];

interface OnboardingModalProps {
  /** Called when the user dismisses the modal */
  onDismiss?: () => void;
}

export default function OnboardingModal({ onDismiss }: OnboardingModalProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only run on the client after mount
    try {
      const seen = localStorage.getItem(STORAGE_KEY);
      if (!seen) setVisible(true);
    } catch {
      // localStorage blocked (private mode etc.) — silently skip
    }
  }, []);

  function dismiss() {
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // ignore
    }
    setVisible(false);
    onDismiss?.();
  }

  if (!visible) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.72)' }}
      onClick={dismiss}
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to Kiddy Parent Dashboard"
    >
      {/* Panel — stop click propagation so clicking inside doesn't close */}
      <div
        className="bg-white rounded-[24px] w-full max-w-md p-8 flex flex-col gap-6 relative"
        style={{ boxShadow: 'rgba(0,0,0,0.25) 0 20px 60px 0' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 text-[#6b6b6b] hover:text-black text-xl leading-none"
          aria-label="Close"
        >
          ×
        </button>

        {/* Header */}
        <div className="text-center">
          <div className="text-[48px] mb-3">👋</div>
          <h2 className="text-[22px] font-bold text-black leading-snug">
            Here&apos;s what your dashboard tracks
          </h2>
          <p className="text-[#6b6b6b] text-sm mt-2">
            Play one game with your child and this data appears automatically.
          </p>
        </div>

        {/* Feature list */}
        <div className="flex flex-col gap-4">
          {TRACKS.map(({ icon, title, body }) => (
            <div key={title} className="flex gap-3 items-start">
              <span className="text-2xl mt-0.5 flex-shrink-0">{icon}</span>
              <div>
                <p className="text-sm font-semibold text-black leading-snug">{title}</p>
                <p className="text-xs text-[#6b6b6b] mt-0.5 leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3 pt-2">
          <Link
            href="/"
            onClick={dismiss}
            className="block w-full text-center bg-[#0070cc] text-white font-bold py-3 rounded-full text-sm hover:bg-[#0060bb] transition-colors"
          >
            Start a game now →
          </Link>
          <button
            onClick={dismiss}
            className="text-sm text-[#6b6b6b] hover:text-black transition-colors"
          >
            I&apos;ll explore on my own
          </button>
        </div>

        {/* Trust footer */}
        <p className="text-center text-xs text-[#aaa]">
          🔒 No ads · No data sold · Free for every child
        </p>
      </div>
    </div>
  );
}
