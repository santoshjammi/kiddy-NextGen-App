'use client';

import Link from 'next/link';
import { useFirebase } from '../../components/FirebaseProvider';
import { useSubjectProgress } from '../../components/useSubjectProgress';
import { useRewards } from '../../components/useRewards';
import AuthButton from '../../components/AuthButton';

// ── Learning path config ──────────────────────────────────────────

interface PathStep {
  id: string;
  emoji: string;
  label: string;
  description: string;
  route: string;
  subject: string;
  unlockLevel: number; // subject must be at this level to unlock
}

const PATH: PathStep[] = [
  { id: 's1',  emoji: '1️⃣',  label: '1-Digit Math',        description: 'Counting, addition + subtraction with visual blocks',   route: '/math',                subject: 'mathematics',    unlockLevel: 1 },
  { id: 's2',  emoji: '📝',  label: 'ABC & Letters',        description: 'Alphabet recognition, phonics, letter sounds',           route: '/alphabet',            subject: 'alphabet',       unlockLevel: 1 },
  { id: 's3',  emoji: '🎨',  label: 'Colors & Shapes',      description: '12 colors and 9 geometric shapes with fun facts',        route: '/colors',              subject: 'colors',         unlockLevel: 1 },
  { id: 's4',  emoji: '📦',  label: 'Carry & Borrow',       description: 'Column addition with carry — the core math skill',       route: '/carry-borrow',        subject: 'carry-borrow',   unlockLevel: 1 },
  { id: 's5',  emoji: '🔤',  label: '2–3 Letter Words',     description: 'Sight words, missing letters, basic spelling',           route: '/english',             subject: 'english',        unlockLevel: 1 },
  { id: 's6',  emoji: '🧩',  label: 'Patterns & Logic',     description: 'Complete emoji sequences — develop logical thinking',    route: '/patterns',            subject: 'patterns',       unlockLevel: 1 },
  { id: 's7',  emoji: '🔢',  label: '2-Digit Math',         description: 'Addition + subtraction up to 99 with column layout',     route: '/math',                subject: 'mathematics',    unlockLevel: 2 },
  { id: 's8',  emoji: '🔡',  label: '4–5 Letter Spelling',  description: 'Spell Builder — arrange letters to form words',          route: '/spelling',            subject: 'spelling',       unlockLevel: 1 },
  { id: 's9',  emoji: '🕐',  label: 'Telling Time',         description: 'Read an analog clock and match the digital time',       route: '/time',                subject: 'time',           unlockLevel: 1 },
  { id: 's10', emoji: '⚡',  label: '3-Digit Carry',        description: 'Advanced column math — carry over two columns',          route: '/carry-borrow',        subject: 'carry-borrow',   unlockLevel: 4 },
  { id: 's11', emoji: '🏎️', label: 'Multiplication Race',  description: 'Beat the clock on ×tables — from ×2 up to ×12',         route: '/multiplication-race', subject: 'multiplication', unlockLevel: 1 },
  { id: 's12', emoji: '➗',  label: 'Division Splitter',    description: 'Share items equally into groups — visual division',      route: '/division-splitter',   subject: 'division',       unlockLevel: 1 },
  { id: 's13', emoji: '📖',  label: 'Simple Sentences',     description: 'Arrange scrambled words to build correct sentences',     route: '/sentences',           subject: 'sentences',      unlockLevel: 1 },
  { id: 's14', emoji: '🧮',  label: 'Advanced Math',        description: 'Times tables and multi-digit arithmetic — Level 4+',    route: '/math',                subject: 'mathematics',    unlockLevel: 4 },
];

const LEVEL_LABELS: Record<number, string> = {
  1: 'Beginner', 2: 'Elementary', 3: 'Intermediate', 4: 'Advanced', 5: 'Master',
};

function useMultiProgress() {
  const cb = useSubjectProgress('carry-borrow');
  const math = useSubjectProgress('mathematics');
  const eng = useSubjectProgress('english');
  const mult = useSubjectProgress('multiplication');
  const div = useSubjectProgress('division');
  return {
    'carry-borrow': cb.progress,
    mathematics: math.progress,
    english: eng.progress,
    multiplication: mult.progress,
    division: div.progress,
  };
}

export default function LearningPathPage() {
  const { user, loading: authLoading, isPremium } = useFirebase();
  const multiProgress = useMultiProgress();
  const { rewards } = useRewards();

  if (!authLoading && !user) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6 px-6">
        <div className="bg-white rounded-[24px] p-10 max-w-md w-full text-center"
             style={{ boxShadow: 'rgba(0,0,0,0.08) 0 5px 9px 0' }}>
          <div className="text-5xl mb-5">🗺️</div>
          <h2 className="text-[28px] font-light text-black mb-3">Learning Path</h2>
          <p className="text-[#6b6b6b] text-sm leading-relaxed mb-6">
            Sign in to track your learning journey through all 12 milestone steps — from counting to multiplication.
          </p>
          <AuthButton />
          <Link href="/" className="block mt-4 text-sm text-[#6b6b6b] hover:text-[#0070cc] transition-colors">
            ← Back to games
          </Link>
        </div>
      </div>
    );
  }

  // Hard premium gate — learning path is a premium feature
  if (!authLoading && user && !isPremium) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6 px-6">
        <div
          className="bg-white rounded-[24px] p-10 max-w-md w-full text-center"
          style={{ boxShadow: 'rgba(0,0,0,0.08) 0 5px 9px 0' }}
        >
          <div className="text-5xl mb-5">⭐</div>
          <h2 className="text-[28px] font-light text-black mb-3">Premium Feature</h2>
          <p className="text-[#6b6b6b] text-sm leading-relaxed mb-6">
            The structured Learning Path is a Premium feature. It guides your child through
            12 milestones — from counting to multiplication — with a saved, personalised route.
          </p>
          <Link href="/upgrade" className="ps-btn block text-center mb-3">
            Upgrade to Premium →
          </Link>
          <Link href="/" className="block mt-2 text-sm text-[#6b6b6b] hover:text-[#0070cc] transition-colors">
            ← Back to games
          </Link>
        </div>
      </div>
    );
  }

  // Determine which steps are completed/in-progress
  const getStepState = (step: PathStep): 'done' | 'active' | 'locked' => {
    const prog = multiProgress[step.subject as keyof typeof multiProgress];
    if (!prog) {
      // subjects without tracked progress (alphabet, colors, etc.) — always unlocked
      return 'active';
    }
    if (prog.difficulty_level > step.unlockLevel) return 'done';
    if (prog.difficulty_level === step.unlockLevel) return 'active';
    return 'locked';
  };

  const completedCount = PATH.filter(s => getStepState(s) === 'done').length;
  const progressPct = Math.round((completedCount / PATH.length) * 100);

  return (
    <div className="min-h-screen bg-[#f5f7fa]">

      {/* ── Header ──────────────────────────────────────────── */}
      <header className="bg-black sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="ps-btn ps-btn-sm ps-btn-ghost-dark">← Back</Link>
          <div className="text-center">
            <h1 className="text-[20px] font-light text-white">Learning Path</h1>
            <p className="text-[#6b6b6b] text-xs mt-0.5">{completedCount}/{PATH.length} milestones</p>
          </div>
          <AuthButton />
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-10 flex flex-col gap-6">

        {/* ── Premium gate banner (soft) ───────────────── */}
        {!isPremium && (
          <div
            className="rounded-[20px] p-5 flex flex-col md:flex-row items-center gap-4 text-white"
            style={{ background: 'linear-gradient(135deg, #003791 0%, #0070cc 100%)' }}
          >
            <div className="text-4xl">⭐</div>
            <div className="flex-1 text-center md:text-left">
              <p className="font-semibold text-base">Premium Feature Preview</p>
              <p className="text-white/70 text-sm mt-0.5">
                The full Structured Learning Path — adaptive difficulty, parent analytics, and reward tracking — is a Premium feature. You&apos;re seeing a preview.
              </p>
            </div>
            <Link
              href="/upgrade"
              className="flex-shrink-0 bg-white text-[#003791] font-bold px-5 py-2.5 rounded-full text-sm hover:bg-yellow-50 transition-colors whitespace-nowrap"
            >
              Upgrade →
            </Link>
          </div>
        )}

        {/* ── Overall progress bar ─────────────────────────── */}
        <div className="bg-white rounded-[20px] p-6" style={{ boxShadow: 'rgba(0,0,0,0.06) 0 3px 8px 0' }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-[22px] font-light text-black">Your Progress</h2>
              <p className="text-[#6b6b6b] text-sm">{completedCount} of {PATH.length} milestones completed</p>
            </div>
            <div className="text-right">
              <div className="text-[32px] font-bold text-[#0070cc]">{progressPct}%</div>
              <Link href="/rewards" className="text-xs text-[#6b6b6b] hover:text-[#0070cc]">
                🏆 {rewards.points} pts
              </Link>
            </div>
          </div>
          <div className="h-3 bg-[#f0f0f0] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0070cc] rounded-full transition-all duration-700"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* ── Path steps ───────────────────────────────────── */}
        <div className="flex flex-col gap-3 relative">
          {/* Vertical connector line */}
          <div className="absolute left-[27px] top-8 bottom-4 w-[2px] bg-[#e0e0e0] -z-0" />

          {PATH.map((step, i) => {
            const state = getStepState(step);
            return (
              <div key={step.id} className="flex items-start gap-5 relative z-10">
                {/* Step indicator */}
                <div className={`
                  flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center text-2xl
                  border-2 transition-all
                  ${state === 'done'   ? 'bg-[#0070cc] border-[#0070cc] shadow-[0_0_0_4px_rgba(0,112,204,0.15)]' : ''}
                  ${state === 'active' ? 'bg-white border-[#0070cc] shadow-[0_0_0_4px_rgba(0,112,204,0.1)]' : ''}
                  ${state === 'locked' ? 'bg-[#f0f0f0] border-[#ddd] opacity-50' : ''}
                `}>
                  {state === 'done' ? '✅' : step.emoji}
                </div>

                {/* Content card */}
                <div className={`
                  flex-1 bg-white rounded-[16px] p-5
                  ${state === 'locked' ? 'opacity-50' : ''}
                `} style={{ boxShadow: 'rgba(0,0,0,0.05) 0 2px 6px 0' }}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-[#6b6b6b] uppercase tracking-wider">Step {i + 1}</span>
                        {state === 'done' && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Completed</span>
                        )}
                        {state === 'locked' && (
                          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">🔒 Locked</span>
                        )}
                      </div>
                      <h3 className="font-semibold text-black text-base">{step.label}</h3>
                      <p className="text-[#6b6b6b] text-sm mt-0.5 leading-relaxed">{step.description}</p>

                      {/* Show mastery score if tracked */}
                      {multiProgress[step.subject as keyof typeof multiProgress] && (
                        <div className="mt-2 flex items-center gap-2">
                          <div className="flex-1 max-w-[120px] h-1.5 bg-[#f0f0f0] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#0070cc] rounded-full"
                              style={{ width: `${multiProgress[step.subject as keyof typeof multiProgress]?.mastery_score ?? 0}%` }}
                            />
                          </div>
                          <span className="text-xs text-[#6b6b6b]">
                            {LEVEL_LABELS[multiProgress[step.subject as keyof typeof multiProgress]?.difficulty_level ?? 1]}
                          </span>
                        </div>
                      )}
                    </div>

                    {state !== 'locked' && (
                      <Link
                        href={step.route}
                        className={`
                          flex-shrink-0 text-sm font-semibold px-4 py-2 rounded-full transition-colors whitespace-nowrap
                          ${state === 'done' ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-[#0070cc] text-white hover:bg-[#005ea6]'}
                        `}
                      >
                        {state === 'done' ? 'Review' : 'Start →'}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Completion message ───────────────────────────── */}
        {completedCount === PATH.length && (
          <div className="bg-[#0070cc] rounded-[20px] p-8 text-white text-center">
            <div className="text-5xl mb-4">🎓</div>
            <h2 className="text-2xl font-semibold mb-2">Learning Path Complete!</h2>
            <p className="text-white/70 text-sm mb-5">
              Outstanding work! Your child has completed all 12 milestones.
              Continue practicing to strengthen mastery and maintain your streak.
            </p>
            <Link href="/parent" className="inline-block bg-white text-[#0070cc] font-semibold px-8 py-3 rounded-full text-sm hover:bg-blue-50 transition-colors">
              View Full Report →
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
