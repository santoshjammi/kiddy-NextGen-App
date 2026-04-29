'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { useFirebase } from '../../components/FirebaseProvider';
import AuthButton from '../../components/AuthButton';
import type { SubjectProgress } from '../../components/useSubjectProgress';
import { useRewards } from '../../components/useRewards';
import { getWeakAreaRoute } from '../../components/useWeakAreaRoute';
import OnboardingModal from '../../components/OnboardingModal';

interface SessionStats {
  todayMinutes: number;
  weekMinutes: number;
  weekDays: number;
}

// ── Subject metadata ──────────────────────────────────────────────
const SUBJECTS: {
  key: string;
  label: string;
  emoji: string;
  route: string;
  color: string;
}[] = [
  { key: 'carry-borrow',    label: 'Carry & Borrow',      emoji: '📊', route: '/carry-borrow',        color: '#0070cc' },
  { key: 'mathematics',     label: 'Math Engine',          emoji: '🧮', route: '/math',                color: '#7c3aed' },
  { key: 'english',         label: 'Word Builder',         emoji: '📝', route: '/english',             color: '#0891b2' },
  { key: 'multiplication',  label: 'Multiplication Race',  emoji: '🏎️', route: '/multiplication-race', color: '#f59e0b' },
  { key: 'division',        label: 'Division Splitter',    emoji: '➗', route: '/division-splitter',   color: '#7c3aed' },
];

const LEVEL_LABELS: Record<number, string> = {
  1: 'Beginner', 2: 'Elementary', 3: 'Intermediate', 4: 'Advanced', 5: 'Master',
};

function defaultProgress(subject: string): SubjectProgress {
  return {
    subject,
    current_topic: '',
    difficulty_level: 1,
    mastery_score: 0,
    total_problems_solved: 0,
    recent_struggles: [],
    last_played: '',
  };
}

function formatStruggle(tag: string): string {
  return tag
    .replace(/_/g, ' ')
    .replace(/level \d+ /i, '')
    .replace(/\b\w/g, c => c.toUpperCase());
}

function formatDate(iso: string): string {
  if (!iso) return 'Not started';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ── Main component ────────────────────────────────────────────────
export default function ParentDashboard() {
  const { db, user, loading: authLoading, isPremium, isTrial, trialDaysLeft } = useFirebase();
  const [progressMap, setProgressMap] = useState<Record<string, SubjectProgress>>({});
  const [dataLoading, setDataLoading] = useState(true);
  const [sessionStats, setSessionStats] = useState<SessionStats>({ todayMinutes: 0, weekMinutes: 0, weekDays: 0 });

  const { rewards } = useRewards();
  const [dataLoadedAt, setDataLoadedAt] = useState<Date | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setDataLoading(false); return; }

    const today = new Date().toISOString().slice(0, 10);
    const sevenDaysAgo = (() => {
      const d = new Date();
      d.setDate(d.getDate() - 7);
      return d.toISOString().slice(0, 10);
    })();

    Promise.all([
      // Subject progress docs
      Promise.all(
        SUBJECTS.map(s =>
          getDoc(doc(db, 'users', user.uid, 'progress', s.key))
            .then(snap => snap.exists() ? (snap.data() as SubjectProgress) : defaultProgress(s.key))
            .catch(() => defaultProgress(s.key))
        )
      ),
      // Sessions for last 7 days
      getDocs(query(
        collection(db, 'users', user.uid, 'sessions'),
        where('date', '>=', sevenDaysAgo)
      )).catch(() => null),
    ]).then(([results, sessSnap]) => {
      const map: Record<string, SubjectProgress> = {};
      SUBJECTS.forEach((s, i) => { map[s.key] = results[i]; });
      setProgressMap(map);

      // Compute session stats
      let todayMins = 0, weekMins = 0;
      const uniqueDates = new Set<string>();
      if (sessSnap) {
        sessSnap.forEach(s => {
          const d = s.data() as { date: string; durationMinutes: number };
          const mins = d.durationMinutes || 0;
          weekMins += mins;
          uniqueDates.add(d.date);
          if (d.date === today) todayMins += mins;
        });
      }
      setSessionStats({ todayMinutes: todayMins, weekMinutes: weekMins, weekDays: uniqueDates.size });
      setDataLoadedAt(new Date());
      setDataLoading(false);
    });
  }, [user, authLoading, db]);

  // ── Not signed in ──────────────────────────────────────────────
  if (!authLoading && !user) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6 px-6">
        <div className="bg-white rounded-[24px] p-10 max-w-md w-full text-center"
             style={{ boxShadow: 'rgba(0,0,0,0.08) 0 5px 9px 0' }}>
          <div className="text-5xl mb-5">📊</div>
          <h2 className="text-[28px] font-light text-black mb-3">Parent Dashboard</h2>
          <p className="text-[#6b6b6b] text-sm leading-relaxed mb-6">
            Sign in to see your child&apos;s progress, weak areas, strengths, and
            personalized daily practice recommendations.
          </p>
          <AuthButton />
          <Link href="/" className="block mt-4 text-sm text-[#6b6b6b] hover:text-[#0070cc] transition-colors">
            ← Back to games
          </Link>
        </div>
      </div>
    );
  }

  // ── Loading ────────────────────────────────────────────────────
  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#0070cc] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ── Aggregate insights ─────────────────────────────────────────
  let totalProblems = 0;
  const allStruggles: { tag: string; subject: string }[] = [];
  const strengthKeys: string[] = [];
  const weakKeys: string[] = [];
  let lowestKey = SUBJECTS[0].key;
  let lowestMastery = 101;
  let mostRecentDate = '';

  for (const { key } of SUBJECTS) {
    const p = progressMap[key] ?? defaultProgress(key);
    totalProblems += p.total_problems_solved;
    p.recent_struggles.forEach(tag => allStruggles.push({ tag, subject: SUBJECTS.find(s => s.key === key)!.label }));
    if (p.mastery_score >= 70) strengthKeys.push(key);
    if (p.mastery_score < 40 && p.total_problems_solved > 0) weakKeys.push(key);
    if (p.mastery_score < lowestMastery && p.total_problems_solved > 0) {
      lowestMastery = p.mastery_score;
      lowestKey = key;
    }
    if (p.last_played && p.last_played > mostRecentDate) {
      mostRecentDate = p.last_played;
    }
  }

  const uniqueStruggles = [...new Set(allStruggles.map(s => s.tag))];

  // Adaptive routing — find the best remediation route from struggle tags
  const weakAreaRec = getWeakAreaRoute(uniqueStruggles);
  const adaptiveRoute = weakAreaRec.route;
  const adaptiveLabel = weakAreaRec.label;
  const adaptiveEmoji = weakAreaRec.emoji;

  const recommendedKey = weakKeys[0] ?? lowestKey;
  const recommendedSubject = SUBJECTS.find(s => s.key === recommendedKey)!;
  const recommendedProgress = progressMap[recommendedKey] ?? defaultProgress(recommendedKey);
  const recommendation =
    uniqueStruggles.length > 0
      ? `Your child is having difficulty with ${formatStruggle(uniqueStruggles[0])}. Practice ${adaptiveLabel} to improve.`
      : strengthKeys.length === SUBJECTS.length
      ? 'Excellent progress! Advance to the next level in any subject'
      : `Build mastery in ${recommendedSubject.label} — currently at Level ${recommendedProgress.difficulty_level}`;

  // Today's Learning Plan — 3 subjects ordered by lowest mastery
  const planItems = [...SUBJECTS]
    .map(s => ({ ...s, mastery: (progressMap[s.key] ?? defaultProgress(s.key)).mastery_score }))
    .sort((a, b) => a.mastery - b.mastery)
    .slice(0, 3);
  const PLAN_DURATIONS = [10, 5, 5];

  return (
    <div className="min-h-screen bg-[#f5f7fa]">      <OnboardingModal />
      {/* ── Header ──────────────────────────────────────────── */}
      <header className="bg-black sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="ps-btn ps-btn-sm ps-btn-ghost-dark">← Home</Link>
          <div className="text-center">
            <h1 className="text-[20px] font-light text-white">Parent Dashboard</h1>
            <p className="text-[#6b6b6b] text-xs mt-0.5">
              Progress for {user?.displayName ?? user?.email ?? 'your learner'}
            </p>
          </div>
          <AuthButton />
        </div>
        {isTrial && (
          <div className="bg-[#0070cc]/20 border-t border-[#0070cc]/30 text-center py-2 px-6">
            <p className="text-[#60a5fa] text-xs font-semibold">
              🎉 Trial active — <span className="font-bold">{trialDaysLeft} day{trialDaysLeft !== 1 ? 's' : ''}</span> remaining ·{' '}
              <Link href="/upgrade" className="underline hover:text-white">Upgrade to Premium</Link>
            </p>
          </div>
        )}
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col gap-8">

        {/* ── First-session prompt (no data yet) ──────────── */}
        {totalProblems === 0 && sessionStats.weekMinutes === 0 && (
          <div className="bg-[#0070cc] rounded-[20px] p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-5">
            <div className="flex-1">
              <p className="text-white/70 text-xs uppercase tracking-wider mb-2">Welcome — let&apos;s get started</p>
              <h2 className="text-white text-xl font-semibold mb-2">Your dashboard is ready</h2>
              <p className="text-white/80 text-sm leading-relaxed">
                Start a 10-minute session with any game below. Your first progress report will appear here automatically.
              </p>
            </div>
            <Link
              href="/"
              className="inline-block bg-white text-[#0070cc] font-bold px-7 py-3 rounded-full text-sm hover:bg-blue-50 transition-colors whitespace-nowrap flex-shrink-0"
            >
              Pick a game →
            </Link>
          </div>
        )}

        {/* ── Summary strip ───────────────────────────────── */}
        <div className="flex items-center justify-between mb-[-16px]">
          <p className="text-[#6b6b6b] text-xs">
            {dataLoadedAt
              ? `Updated ${dataLoadedAt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} today`
              : 'Loading…'}
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {[
            { label: 'Questions Answered', value: totalProblems.toLocaleString(), icon: '✅' },
            { label: "Today's Practice", value: `${sessionStats.todayMinutes} min`, icon: '⏱️' },
            { label: 'Days Active', value: `${sessionStats.weekDays}/7`, icon: '📅' },
            { label: 'Week’s Practice', value: `${sessionStats.weekMinutes} min`, icon: '🕐' },
            { label: 'Streak', value: rewards.streakDays.toString(), icon: '🔥' },
          ].map(stat => (
            <div
              key={stat.label}
              className="bg-white rounded-[16px] p-5 text-center"
              style={{ boxShadow: 'rgba(0,0,0,0.06) 0 3px 8px 0' }}
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold text-black mb-1">{stat.value}</div>
              <div className="text-[#6b6b6b] text-xs leading-tight">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* ── Weekly Progress Story ─────────────────────── */}
        <div
          className="bg-white rounded-[20px] p-6"
          style={{ boxShadow: 'rgba(0,0,0,0.06) 0 3px 8px 0' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">📖</span>
            <h2 className="text-[20px] font-semibold text-black">This Week&apos;s Story</h2>
          </div>
          <div className="flex flex-col gap-2.5">
            <p className="text-[#333] text-sm leading-relaxed">
              {sessionStats.weekMinutes > 0
                ? `Your child practiced ${sessionStats.weekMinutes} minute${sessionStats.weekMinutes !== 1 ? 's' : ''} across ${sessionStats.weekDays} day${sessionStats.weekDays !== 1 ? 's' : ''} this week.`
                : 'No practice sessions logged this week yet. Start a 10-minute session today!'}
            </p>
            {strengthKeys.length > 0 && (
              <p className="text-green-700 text-sm">
                ✅ Showing strong mastery in: <span className="font-semibold">{strengthKeys.map(k => SUBJECTS.find(s => s.key === k)!.label).join(', ')}</span>
              </p>
            )}
            {uniqueStruggles.length > 0 && (
              <p className="text-orange-700 text-sm">
                📌 <span className="font-semibold">{formatStruggle(uniqueStruggles[0])}</span> needs review.
                {uniqueStruggles.length > 1 ? ` ${uniqueStruggles.length - 1} more area${uniqueStruggles.length > 2 ? 's' : ''} flagged.` : ''}
              </p>
            )}
            {totalProblems > 0 && (
              <p className="text-[#6b6b6b] text-sm">
                {totalProblems.toLocaleString()} total problems solved since joining.
              </p>
            )}
          </div>
        </div>

        {/* ── Recommended today — CTA (PREMIUM GATED) ──────────────────────── */}        <div className="relative">
          <div className={`bg-[#0070cc] rounded-[20px] p-6 md:p-8 text-white flex flex-col md:flex-row md:items-center gap-5 ${!isPremium ? 'blur-[3px] pointer-events-none select-none' : ''}`}>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{uniqueStruggles.length > 0 ? adaptiveEmoji : '🎯'}</span>
                <h2 className="text-[22px] font-semibold">What to Practise Today</h2>
              </div>
              <p className="text-white/80 text-sm leading-relaxed">{recommendation}</p>
            </div>
            <Link
              href={uniqueStruggles.length > 0 ? adaptiveRoute : recommendedSubject.route}
              className="inline-block bg-white text-[#0070cc] font-semibold px-8 py-3 rounded-full text-sm hover:bg-blue-50 transition-colors whitespace-nowrap"
            >
              Start Practice →
            </Link>
          </div>
          {!isPremium && (
            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-[20px] bg-[#003791]/80">
              <span className="text-3xl mb-2">⭐</span>
              <p className="font-semibold text-white text-sm mb-1">Premium Feature</p>
              <p className="text-white/70 text-xs mb-4 text-center px-6">See exactly what your child should practise today — upgrade to unlock</p>
              <Link href="/upgrade" className="bg-white text-[#003791] font-bold px-5 py-2 rounded-full text-sm hover:bg-yellow-50 transition-colors">
                Upgrade →
              </Link>
            </div>
          )}
        </div>

        {/* ── Subject progress cards ───────────────────────── */}
        <div>
          <h2 className="text-[24px] font-light text-black mb-5">Learning Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SUBJECTS.map(({ key, label, emoji, route, color }) => {
              const p = progressMap[key] ?? defaultProgress(key);
              const started = p.total_problems_solved > 0;
              return (
                <div
                  key={key}
                  className="bg-white rounded-[20px] p-6"
                  style={{ boxShadow: 'rgba(0,0,0,0.06) 0 3px 8px 0' }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{emoji}</span>
                    <div>
                      <h3 className="font-semibold text-black text-sm leading-tight">{label}</h3>
                      <p className="text-[#6b6b6b] text-xs">
                        {started ? `Level ${p.difficulty_level} — ${LEVEL_LABELS[p.difficulty_level]}` : 'Not started'}
                      </p>
                    </div>
                  </div>

                  {/* Mastery bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-[#6b6b6b]">Mastery</span>
                      <span className="font-bold" style={{ color }}>{p.mastery_score}%</span>
                    </div>
                    <div className="h-2 bg-[#f5f7fa] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${p.mastery_score}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#6b6b6b]">
                    <span>{p.total_problems_solved} problems</span>
                    {started ? (
                      <span title="Last session date">Last: {formatDate(p.last_played)}</span>
                    ) : (
                      <span className="text-[#0070cc]">Not started</span>
                    )}
                  </div>

                  <Link
                    href={route}
                    className="mt-4 block text-center text-sm font-semibold py-2 rounded-full transition-colors"
                    style={{ backgroundColor: `${color}15`, color }}
                  >
                    {started ? 'Continue →' : 'Start →'}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Weak areas — CONVERSION TRIGGER (PREMIUM GATED) ─────────────── */}
        <div className="relative">
          <div
            className={`bg-white rounded-[20px] p-6 ${!isPremium ? 'blur-[3px] pointer-events-none select-none' : ''}`}
            style={{ boxShadow: 'rgba(0,0,0,0.06) 0 3px 8px 0' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">⚠️</span>
              <div>
                <h2 className="text-[20px] font-semibold text-black">Where to Focus</h2>
                <p className="text-[#6b6b6b] text-xs">Concepts your child got wrong — ranked by frequency</p>
              </div>
            </div>

            {uniqueStruggles.length === 0 ? (
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-[12px]">
                <span className="text-2xl">🌟</span>
                <p className="text-green-700 text-sm">
                  No struggle areas recorded yet — keep practicing daily to track weak spots!
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <p className="text-[#444] text-sm leading-relaxed">
                  Your child is having difficulty with{' '}
                  <span className="font-semibold text-black">{formatStruggle(uniqueStruggles[0])}</span>.
                  Daily guided practice helps build confidence and speed in this area.
                </p>
                <div className="flex flex-wrap gap-2">
                  {uniqueStruggles.map(tag => {
                    const subjectLabel = allStruggles.find(s => s.tag === tag)?.subject ?? '';
                    return (
                      <span
                        key={tag}
                        className="bg-red-50 text-red-700 border border-red-200 px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5"
                      >
                        ⚡ {formatStruggle(tag)}
                        <span className="text-red-400 text-xs">({subjectLabel})</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          {!isPremium && (
            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-[20px] bg-white/90">
              <span className="text-4xl mb-2">🔍</span>
              <p className="font-semibold text-black text-sm mb-1">Pinpoint What&apos;s Holding Them Back</p>
              <p className="text-[#6b6b6b] text-xs mb-4 text-center px-6 max-w-xs">
                Identify the exact concepts your child keeps getting wrong — and get a daily plan to fix them
              </p>
              <Link href="/upgrade" className="bg-[#0070cc] text-white font-bold px-5 py-2 rounded-full text-sm hover:bg-[#0060bb] transition-colors">
                Unlock Analysis →
              </Link>
            </div>
          )}
        </div>

        {/* ── Today's Learning Plan — PREMIUM GATED ─────── */}
        <div className="relative">
          <div
            className={`rounded-[20px] p-6 text-white ${!isPremium ? 'blur-[3px] pointer-events-none select-none' : ''}`}
            style={{ background: 'linear-gradient(135deg, #001a4d 0%, #003791 100%)', boxShadow: 'rgba(0,112,204,0.2) 0 8px 24px 0' }}
          >
            <div className="flex items-center gap-2 mb-5">
              <span className="text-2xl">📋</span>
              <div>
                <h2 className="text-[20px] font-semibold">Today&apos;s Learning Plan</h2>
                <p className="text-white/60 text-xs">Personalised 20-minute practice plan</p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {planItems.map((subject, i) => (
                <Link
                  key={subject.key}
                  href={subject.route}
                  className="flex items-center justify-between bg-white/10 hover:bg-white/20 transition-colors rounded-[12px] px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{subject.emoji}</span>
                    <span className="text-sm font-medium">{subject.label}</span>
                  </div>
                  <span className="text-white/70 text-xs font-semibold">{PLAN_DURATIONS[i]} min →</span>
                </Link>
              ))}
            </div>
          </div>
          {!isPremium && (
            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-[20px] bg-[#001a4d]/85">
              <span className="text-4xl mb-2">📋</span>
              <p className="font-semibold text-white text-sm mb-1">Your Child&apos;s Daily Study Plan</p>
              <p className="text-white/70 text-xs mb-4 text-center px-6 max-w-xs">
                A structured 20-minute daily plan built from your child&apos;s actual gaps — no guesswork
              </p>
              <Link href="/upgrade" className="bg-white text-[#003791] font-bold px-5 py-2 rounded-full text-sm hover:bg-yellow-50 transition-colors">
                Unlock Plan →
              </Link>
            </div>
          )}
        </div>

        {/* ── Strength areas ───────────────────────────────── */}
        <div
          className="bg-white rounded-[20px] p-6"
          style={{ boxShadow: 'rgba(0,0,0,0.06) 0 3px 8px 0' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">✅</span>
            <div>
              <h2 className="text-[20px] font-semibold text-black">What They&apos;ve Mastered</h2>
              <p className="text-[#6b6b6b] text-xs">Subjects with 70%+ mastery — celebrate these wins</p>
            </div>
          </div>

          {strengthKeys.length === 0 ? (
            <p className="text-[#6b6b6b] text-sm">
              Strength areas appear here once mastery reaches 70% in a subject.
              Consistent daily practice is the fastest path!
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {strengthKeys.map(key => {
                const s = SUBJECTS.find(s => s.key === key)!;
                return (
                  <span
                    key={key}
                    className="bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5"
                  >
                    🌟 {s.emoji} {s.label}
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Rewards summary ─────────────────────────────── */}
        <div
          className="bg-white rounded-[20px] p-6"
          style={{ boxShadow: 'rgba(0,0,0,0.06) 0 3px 8px 0' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏆</span>
              <div>
                <h2 className="text-[20px] font-semibold text-black">Rewards</h2>
                <p className="text-[#6b6b6b] text-xs">Points, badges, and daily streak</p>
              </div>
            </div>
            <Link href="/rewards" className="text-sm text-[#0070cc] hover:underline font-medium">
              View all badges →
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-[#f5f7fa] rounded-[12px]">
              <div className="text-2xl font-bold text-[#0070cc]">{rewards.points.toLocaleString()}</div>
              <div className="text-xs text-[#6b6b6b] mt-0.5">Points</div>
            </div>
            <div className="text-center p-3 bg-[#f5f7fa] rounded-[12px]">
              <div className="text-2xl font-bold text-black">{rewards.badges.length}</div>
              <div className="text-xs text-[#6b6b6b] mt-0.5">Badges</div>
            </div>
            <div className="text-center p-3 bg-[#f5f7fa] rounded-[12px]">
              <div className="text-2xl font-bold text-orange-500">{rewards.streakDays}</div>
              <div className="text-xs text-[#6b6b6b] mt-0.5">{rewards.streakDays === 1 ? 'Day' : 'Days'} Streak</div>
            </div>
          </div>
          {rewards.badges.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {rewards.badges.slice(0, 6).map(b => (
                <span key={b.id} className="text-xl" title={b.name}>{b.emoji}</span>
              ))}
              {rewards.badges.length > 6 && (
                <span className="text-xs text-[#6b6b6b] self-center">+{rewards.badges.length - 6} more</span>
              )}
            </div>
          )}
        </div>

        {/* ── Footer note ───────────────────────────────────────────── */}
        <div className="bg-[#0d0d0d] rounded-[16px] p-6 text-center">
          <div className="flex justify-center gap-4 mb-4 flex-wrap">
            <Link href="/learning-path" className="text-sm text-[#0070cc] hover:underline font-medium">
              🗺️ View Learning Path
            </Link>
            <Link href="/rewards" className="text-sm text-[#0070cc] hover:underline font-medium">
              🏆 View All Badges
            </Link>
          </div>
          <p className="text-white font-light text-sm mb-1">
            📅 15 minutes of daily practice makes a measurable difference
          </p>
          <p className="text-[#6b6b6b] text-xs">
            Progress updates automatically after each practice session.
            Weak areas clear when mastery improves.
          </p>
        </div>

      </div>
    </div>
  );
}
