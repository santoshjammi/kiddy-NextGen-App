'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { doc, getDoc } from 'firebase/firestore';
import { useFirebase } from '../../components/FirebaseProvider';
import AuthButton from '../../components/AuthButton';
import type { SubjectProgress } from '../../components/useSubjectProgress';

// ── Subject metadata ──────────────────────────────────────────────
const SUBJECTS: {
  key: string;
  label: string;
  emoji: string;
  route: string;
  color: string;
}[] = [
  { key: 'carry-borrow', label: 'Carry & Borrow',  emoji: '📊', route: '/carry-borrow', color: '#0070cc' },
  { key: 'mathematics',  label: 'Math Engine',      emoji: '🧮', route: '/math',         color: '#7c3aed' },
  { key: 'english',      label: 'Word Builder',     emoji: '📝', route: '/english',      color: '#0891b2' },
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
  const { db, user, loading: authLoading } = useFirebase();
  const [progressMap, setProgressMap] = useState<Record<string, SubjectProgress>>({});
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setDataLoading(false); return; }

    Promise.all(
      SUBJECTS.map(s =>
        getDoc(doc(db, 'users', user.uid, 'progress', s.key))
          .then(snap => snap.exists() ? (snap.data() as SubjectProgress) : defaultProgress(s.key))
          .catch(() => defaultProgress(s.key))
      )
    ).then(results => {
      const map: Record<string, SubjectProgress> = {};
      SUBJECTS.forEach((s, i) => { map[s.key] = results[i]; });
      setProgressMap(map);
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
  const recommendedKey = weakKeys[0] ?? lowestKey;
  const recommendedSubject = SUBJECTS.find(s => s.key === recommendedKey)!;
  const recommendedProgress = progressMap[recommendedKey] ?? defaultProgress(recommendedKey);
  const recommendation =
    uniqueStruggles.length > 0
      ? `Work on "${formatStruggle(uniqueStruggles[0])}" in ${allStruggles.find(s => s.tag === uniqueStruggles[0])?.subject}`
      : strengthKeys.length === SUBJECTS.length
      ? 'Excellent progress! Advance to the next level in any subject'
      : `Build mastery in ${recommendedSubject.label} — currently at Level ${recommendedProgress.difficulty_level}`;

  return (
    <div className="min-h-screen bg-[#f5f7fa]">

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
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col gap-8">

        {/* ── Summary strip ───────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Problems Solved', value: totalProblems.toLocaleString(), icon: '✅' },
            { label: 'Areas Needing Practice', value: uniqueStruggles.length.toString(), icon: '⚠️' },
            { label: 'Subjects Tracked',  value: SUBJECTS.length.toString(), icon: '📚' },
          ].map(stat => (
            <div
              key={stat.label}
              className="bg-white rounded-[16px] p-5 text-center"
              style={{ boxShadow: 'rgba(0,0,0,0.06) 0 3px 8px 0' }}
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-4xl font-bold text-black mb-1">{stat.value}</div>
              <div className="text-[#6b6b6b] text-xs">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* ── Recommended today — CTA ──────────────────────── */}
        <div className="bg-[#0070cc] rounded-[20px] p-6 md:p-8 text-white flex flex-col md:flex-row md:items-center gap-5">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🎯</span>
              <h2 className="text-[22px] font-semibold">Recommended Today</h2>
            </div>
            <p className="text-white/80 text-sm leading-relaxed">{recommendation}</p>
          </div>
          <Link
            href={recommendedSubject.route}
            className="inline-block bg-white text-[#0070cc] font-semibold px-8 py-3 rounded-full text-sm hover:bg-blue-50 transition-colors whitespace-nowrap"
          >
            Start Practice →
          </Link>
        </div>

        {/* ── Subject progress cards ───────────────────────── */}
        <div>
          <h2 className="text-[24px] font-light text-black mb-5">Subject Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    {started && (
                      <span>Last: {formatDate(p.last_played)}</span>
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

        {/* ── Weak areas — CONVERSION TRIGGER ─────────────── */}
        <div
          className="bg-white rounded-[20px] p-6"
          style={{ boxShadow: 'rgba(0,0,0,0.06) 0 3px 8px 0' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">⚠️</span>
            <div>
              <h2 className="text-[20px] font-semibold text-black">Needs Practice</h2>
              <p className="text-[#6b6b6b] text-xs">Areas where your child made mistakes recently</p>
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
              <h2 className="text-[20px] font-semibold text-black">Strengths</h2>
              <p className="text-[#6b6b6b] text-xs">Subjects with 70%+ mastery</p>
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

        {/* ── Footer note ──────────────────────────────────── */}
        <div className="bg-[#0d0d0d] rounded-[16px] p-6 text-center">
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
