'use client';

import Link from 'next/link';
import AuthButton from '../../components/AuthButton';
import { useRewards, ALL_BADGES } from '../../components/useRewards';
import { useFirebase } from '../../components/FirebaseProvider';

function ProgressRing({ pct, size = 56 }: { pct: number; size?: number }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f0f0f0" strokeWidth="6" />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke="#0070cc" strokeWidth="6"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.6s ease' }}
      />
    </svg>
  );
}

export default function RewardsPage() {
  const { user, loading: authLoading } = useFirebase();
  const { rewards, loading } = useRewards();

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#0070cc] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6 px-6">
        <div className="bg-white rounded-[24px] p-10 max-w-md w-full text-center"
             style={{ boxShadow: 'rgba(0,0,0,0.08) 0 5px 9px 0' }}>
          <div className="text-5xl mb-5">🏆</div>
          <h2 className="text-[28px] font-light text-black mb-3">Rewards & Badges</h2>
          <p className="text-[#6b6b6b] text-sm leading-relaxed mb-6">
            Sign in to earn points, unlock badges, and build your learning streak!
          </p>
          <AuthButton />
          <Link href="/" className="block mt-4 text-sm text-[#6b6b6b] hover:text-[#0070cc] transition-colors">
            ← Back to games
          </Link>
        </div>
      </div>
    );
  }

  const earnedIds = new Set(rewards.badges.map(b => b.id));
  const earned = rewards.badges;
  const locked = ALL_BADGES.filter(b => !earnedIds.has(b.id));
  const pctBadges = Math.round((earned.length / ALL_BADGES.length) * 100);

  return (
    <div className="min-h-screen bg-[#f5f7fa]">

      {/* ── Header ──────────────────────────────────────────── */}
      <header className="bg-black sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="ps-btn ps-btn-sm ps-btn-ghost-dark">← Back</Link>
          <div className="text-center">
            <h1 className="text-[20px] font-light text-white">Rewards</h1>
            <p className="text-[#6b6b6b] text-xs mt-0.5">Points · Badges · Streaks</p>
          </div>
          <AuthButton />
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10 flex flex-col gap-8">

        {/* ── Points + Streak + Badges overview ───────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-[20px] p-6 text-center"
               style={{ boxShadow: 'rgba(0,0,0,0.06) 0 3px 8px 0' }}>
            <div className="text-5xl font-bold text-[#0070cc] mb-2">{rewards.points.toLocaleString()}</div>
            <div className="text-[#6b6b6b] text-sm">Total Points</div>
            <div className="text-xs text-[#aaa] mt-1">+10 per correct · +100 per badge · +50 per level-up</div>
          </div>
          <div className="bg-white rounded-[20px] p-6 text-center"
               style={{ boxShadow: 'rgba(0,0,0,0.06) 0 3px 8px 0' }}>
            <div className="flex justify-center mb-2">
              <div className="relative w-14 h-14 flex items-center justify-center">
                <ProgressRing pct={pctBadges} size={56} />
                <span className="absolute text-sm font-bold text-[#0070cc]">{pctBadges}%</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-black">{earned.length} / {ALL_BADGES.length}</div>
            <div className="text-[#6b6b6b] text-sm">Badges Earned</div>
          </div>
          <div className="bg-white rounded-[20px] p-6 text-center"
               style={{ boxShadow: 'rgba(0,0,0,0.06) 0 3px 8px 0' }}>
            <div className="text-5xl font-bold text-orange-500 mb-2">
              {rewards.streakDays > 0 ? '🔥' : '💤'} {rewards.streakDays}
            </div>
            <div className="text-[#6b6b6b] text-sm">Day Streak</div>
            <div className="text-xs text-[#aaa] mt-1">
              {rewards.lastSessionDate
                ? `Last practice: ${new Date(rewards.lastSessionDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                : 'Practice today to start your streak!'}
            </div>
          </div>
        </div>

        {/* ── Earned badges ───────────────────────────────── */}
        {earned.length > 0 && (
          <div>
            <h2 className="text-[22px] font-light text-black mb-5">🏆 Earned Badges</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {earned.map(badge => (
                <div
                  key={badge.id}
                  className="bg-white rounded-[16px] p-5 text-center border-2 border-[#0070cc]/20"
                  style={{ boxShadow: 'rgba(0,112,204,0.1) 0 4px 12px 0' }}
                >
                  <div className="text-4xl mb-2">{badge.emoji}</div>
                  <div className="font-semibold text-black text-sm mb-1">{badge.name}</div>
                  <div className="text-[#6b6b6b] text-xs leading-tight">{badge.description}</div>
                  <div className="text-[10px] text-[#aaa] mt-2">
                    {new Date(badge.earnedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Locked badges ───────────────────────────────── */}
        <div>
          <h2 className="text-[22px] font-light text-black mb-5">
            🔒 {earned.length === 0 ? 'All Badges' : 'Locked Badges'}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {locked.map(badge => (
              <div
                key={badge.id}
                className="bg-white rounded-[16px] p-5 text-center opacity-50"
                style={{ boxShadow: 'rgba(0,0,0,0.04) 0 2px 6px 0' }}
              >
                <div className="text-4xl mb-2 grayscale">{badge.emoji}</div>
                <div className="font-semibold text-black text-sm mb-1">{badge.name}</div>
                <div className="text-[#6b6b6b] text-xs leading-tight">{badge.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── How to earn CTA ─────────────────────────────── */}
        <div className="bg-[#0070cc] rounded-[20px] p-6 text-white text-center">
          <p className="text-lg font-semibold mb-2">Keep practicing to earn more badges!</p>
          <p className="text-white/70 text-sm mb-5">
            Every correct answer earns 10 points. Level up for bonus points. Practice daily to build your streak.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/carry-borrow" className="bg-white text-[#0070cc] font-semibold px-6 py-2.5 rounded-full text-sm hover:bg-blue-50 transition-colors">
              Carry & Borrow →
            </Link>
            <Link href="/math" className="bg-white/20 text-white font-semibold px-6 py-2.5 rounded-full text-sm hover:bg-white/30 transition-colors">
              Math Engine →
            </Link>
            <Link href="/english" className="bg-white/20 text-white font-semibold px-6 py-2.5 rounded-full text-sm hover:bg-white/30 transition-colors">
              Word Builder →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
