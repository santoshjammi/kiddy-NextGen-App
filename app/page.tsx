"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AuthButton from "../components/AuthButton";
import { useGameCompletion } from "../components/useGameCompletion";
import { MilestoneCelebration } from "../components/MilestoneCelebration";

interface AppCardProps {
  emoji: string;
  title: string;
  description: string;
  link: string;
  completed: number;
  total: number;
  percentage: number;
}

function AppCard({ emoji, title, description, link, completed, total, percentage }: AppCardProps) {
  return (
    <Link href={link} className="block group">
      <div
        className="bg-white rounded-[24px] p-8 flex flex-col justify-between min-h-[280px] overflow-hidden
                   transition-transform duration-200 group-hover:scale-[1.02]"
        style={{ boxShadow: 'rgba(0,0,0,0.08) 0 5px 9px 0' }}
      >
        <div>
          <div className="text-4xl mb-4">{emoji}</div>
          <h2 className="text-[22px] font-light text-black leading-snug tracking-[0.1px] mb-2">
            {title}
          </h2>
          <p className="text-[#6b6b6b] text-sm leading-relaxed">{description}</p>
        </div>
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-[#6b6b6b] font-medium">{completed}/{total}</span>
            <span className={`text-xs font-semibold ${
              percentage >= 100 ? 'text-green-600' : percentage >= 50 ? 'text-[#0070cc]' : 'text-[#6b6b6b]'
            }`}>{percentage}%</span>
          </div>
          <div className="ps-progress-track mb-5">
            <div
              className="ps-progress-fill"
              style={{
                width: `${percentage}%`,
                background: percentage >= 100
                  ? 'linear-gradient(90deg, #22c55e, #16a34a)'
                  : percentage >= 50
                  ? 'linear-gradient(90deg, #0070cc, #1eaedb)'
                  : undefined
              }}
            />
          </div>
          <div className="ps-btn ps-btn-sm w-full justify-center">
            {percentage >= 100 ? '🔄 Review' : 'Start Learning'}
          </div>
        </div>
      </div>
    </Link>
  );
}

interface NewGameCardProps {
  emoji: string;
  title: string;
  description: string;
  link: string;
  badge: string;
  completed: number;
  total: number;
  percentage: number;
}

function NewGameCard({ emoji, title, description, link, badge, completed, total, percentage }: NewGameCardProps) {
  return (
    <Link href={link} className="block group">
      <div
        className="bg-white rounded-[24px] p-7 flex flex-col justify-between min-h-[220px] overflow-hidden
                   transition-transform duration-200 group-hover:scale-[1.02]"
        style={{ boxShadow: 'rgba(0,0,0,0.08) 0 5px 9px 0' }}
      >
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-4xl">{emoji}</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider bg-[#f0f7ff] text-[#0070cc] px-2.5 py-1 rounded-full">
              {badge}
            </span>
          </div>
          <h2 className="text-[20px] font-light text-black leading-snug tracking-[0.1px] mb-2">
            {title}
          </h2>
          <p className="text-[#6b6b6b] text-sm leading-relaxed">{description}</p>
        </div>
        <div className="mt-5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-[#6b6b6b] font-medium">{completed}/{total}</span>
            <span className={`text-xs font-semibold ${
              percentage >= 100 ? 'text-green-600' : 'text-[#6b6b6b]'
            }`}>{percentage}%</span>
          </div>
          <div className="ps-progress-track mb-3">
            <div
              className="ps-progress-fill"
              style={{
                width: `${percentage}%`,
                background: percentage >= 100 ? 'linear-gradient(90deg, #22c55e, #16a34a)' : undefined,
              }}
            />
          </div>
          <div className="ps-btn ps-btn-sm w-full justify-center">
            {percentage >= 100 ? '🔄 Review' : 'Play Now'}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const { getProgress, getActiveMilestones, dismissMilestone } = useGameCompletion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const p = (id: string) => mounted ? getProgress(id) : { completedLevels: 0, totalLevels: 0, percentage: 0 };
  const c = (id: string) => p(id).completedLevels;
  const t = (id: string) => p(id).totalLevels;
  const pc = (id: string) => p(id).percentage;

  const apps = [
    {
      emoji: '🔤',
      title: 'ABC Letters Learning',
      description: 'Master the alphabet A-Z with interactive phonics, colorful images, and engaging sounds. Perfect for letter recognition!',
      link: '/alphabet',
      completed: c('alphabet'),
      total: t('alphabet'),
      percentage: pc('alphabet'),
    },
    {
      emoji: '🔢',
      title: 'Numbers 1-200 Fun',
      description: 'Count and learn numbers 1 to 200 with visual dots, audio pronunciation, and fun number games. Build math foundation!',
      link: '/numbers',
      completed: c('numbers'),
      total: t('numbers'),
      percentage: pc('numbers'),
    },
    {
      emoji: '🔺',
      title: 'Shape Explorer',
      description: 'Discover 9 basic geometric shapes with animations, fun facts, and interactive learning. Develop visual skills!',
      link: '/shapes',
      completed: c('shapes'),
      total: t('shapes'),
      percentage: pc('shapes'),
    },
    {
      emoji: '🎨',
      title: 'Color World',
      description: 'Learn 12 vibrant colors with real-world examples and creative color games. Unleash creativity!',
      link: '/colors',
      completed: c('colors'),
      total: t('colors'),
      percentage: pc('colors'),
    },
    {
      emoji: '🧮',
      title: 'Math Engine',
      description: 'Adaptive mathematics from single digits to 5-digit problems. Visual blocks, column grids, and word problems — levels up as you master each stage!',
      link: '/math',
      completed: c('math'),
      total: t('math'),
      percentage: pc('math'),
    },
    {
      emoji: '✍️',
      title: 'Word Builder',
      description: 'Grow your vocabulary from 2-letter sight words to 5-letter Wordle challenges. Letter blocks, missing vowels, scrambles, and more!',
      link: '/english',
      completed: c('english'),
      total: t('english'),
      percentage: pc('english'),
    },
    {
      emoji: '📊',
      title: 'Carry & Borrow Grid',
      description: 'Master column addition with carry and subtraction with borrow — the #1 math skill parents instantly understand. 5 progression levels!',
      link: '/carry-borrow',
      completed: c('carry-borrow'),
      total: t('carry-borrow'),
      percentage: pc('carry-borrow'),
    },
  ];

  const newGames = [
    {
      emoji: '🦕',
      title: 'Dino Treasure Hunt India',
      description: 'Travel across India with Dino to discover magical treasure stickers hidden in every state!',
      link: '/dino-treasure-hunt',
      badge: 'Adventure',
      completed: c('dino-treasure-hunt'),
      total: t('dino-treasure-hunt'),
      percentage: pc('dino-treasure-hunt'),
    },
    {
      emoji: '🎨',
      title: 'Kiddy Paint',
      description: 'Draw, color, and create anything you imagine with brushes, colors, and fill tools!',
      link: '/paint',
      badge: 'Creative',
      completed: c('paint'),
      total: t('paint'),
      percentage: pc('paint'),
    },
    {
      emoji: '🃏',
      title: 'Memory Match',
      description: 'Flip cards and find matching emoji pairs. Train your memory with this classic concentration game!',
      link: '/memory-match',
      badge: 'Memory',
      completed: c('memory-match'),
      total: t('memory-match'),
      percentage: pc('memory-match'),
    },
    {
      emoji: '🔡',
      title: 'Spelling Builder',
      description: 'See a picture, click the shuffled letters in the right order to spell the word. 15 words to master!',
      link: '/spelling',
      badge: 'Spelling',
      completed: c('spelling'),
      total: t('spelling'),
      percentage: pc('spelling'),
    },
    {
      emoji: '🎵',
      title: 'Rhyming Words',
      description: 'Which word rhymes? Pick the correct rhyme from three choices. 15 fun rhyming pairs!',
      link: '/rhyming',
      badge: 'Language',
      completed: c('rhyming'),
      total: t('rhyming'),
      percentage: pc('rhyming'),
    },
    {
      emoji: '🧩',
      title: 'Pattern Recognition',
      description: 'Complete the emoji pattern — what comes next? Develop logical thinking with 15 patterns!',
      link: '/patterns',
      badge: 'Logic',
      completed: c('patterns'),
      total: t('patterns'),
      percentage: pc('patterns'),
    },
    {
      emoji: '📖',
      title: 'Sight Words',
      description: 'Flash card practice for 90+ high-frequency Dolch words. Track which words you know!',
      link: '/sight-words',
      badge: 'Reading',
      completed: c('sight-words'),
      total: t('sight-words'),
      percentage: pc('sight-words'),
    },
    {
      emoji: '🔢',
      title: 'Counting Puzzle',
      description: 'Count the objects on screen and tap the correct number. With streak tracking and animations!',
      link: '/counting',
      badge: 'Math',
      completed: c('counting'),
      total: t('counting'),
      percentage: pc('counting'),
    },
    {
      emoji: '🦁',
      title: 'Animal Sounds',
      description: 'Hear the animal sound and pick the right animal. Covers 12 animals with speech audio!',
      link: '/animals',
      badge: 'Science',
      completed: c('animals'),
      total: t('animals'),
      percentage: pc('animals'),
    },
    {
      emoji: '📝',
      title: 'Simple Sentences',
      description: 'Arrange scrambled word tiles to build correct sentences. 15 beginner sentences!',
      link: '/sentences',
      badge: 'Language',
      completed: c('sentences'),
      total: t('sentences'),
      percentage: pc('sentences'),
    },
    {
      emoji: '🕐',
      title: 'Telling Time',
      description: 'Read the analog clock face and pick the correct digital time from four choices!',
      link: '/time',
      badge: 'Math',
      completed: c('time'),
      total: t('time'),
      percentage: pc('time'),
    },
    {
      emoji: '✏️',
      title: 'Tracing & Handwriting',
      description: 'Trace all 26 letters A–Z on an interactive canvas with letter guides beneath your pen!',
      link: '/tracing',
      badge: 'Writing',
      completed: c('tracing'),
      total: t('tracing'),
      percentage: pc('tracing'),
    },
    {
      emoji: '🔠',
      title: 'Missing Letter',
      description: 'Look at the picture — C _ T. Pick the missing letter to complete the word! 3 difficulty levels.',
      link: '/missing-letter',
      badge: 'Phonics',
      completed: c('missing-letter'),
      total: t('missing-letter'),
      percentage: pc('missing-letter'),
    },
    {
      emoji: '🎣',
      title: 'Letter Fishing',
      description: 'Hear the letter sound, then drag the matching tile to the hook. Trains phonics through audio!',
      link: '/letter-fishing',
      badge: 'Phonics',
      completed: c('letter-fishing'),
      total: t('letter-fishing'),
      percentage: pc('letter-fishing'),
    },
    {
      emoji: '🏎️',
      title: 'Multiplication Race',
      description: 'Beat the clock! Answer ×tables as fast as you can. 5 difficulty levels up to ×12.',
      link: '/multiplication-race',
      badge: 'Math',
      completed: c('multiplication-race'),
      total: t('multiplication-race'),
      percentage: pc('multiplication-race'),
    },
    {
      emoji: '➗',
      title: 'Division Splitter',
      description: 'Share items equally into groups. Visual group reveal — from ÷2 up to ÷12.',
      link: '/division-splitter',
      badge: 'Math',
      completed: c('division-splitter'),
      total: t('division-splitter'),
      percentage: pc('division-splitter'),
    },
  ];

  const activeMilestones = getActiveMilestones();

  return (
    <div className="min-h-screen bg-white">

      {activeMilestones.map((m, i) => (
        <MilestoneCelebration
          key={`${m.game}_${m.percentage}_${i}`}
          game={m.game}
          percentage={m.percentage}
          onDismiss={() => dismissMilestone(m.game, m.percentage)}
        />
      ))}

      {/* ── Masthead ─────────────────────────────────────────── */}
      <header className="bg-black sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">📚</span>
            <span className="text-white font-light text-lg tracking-wide">Kiddy Learning Hub</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/learning-path" className="text-[#cccccc] text-sm font-medium hover:text-[#1883fd] transition-colors">Learning Path</Link>
            <Link href="/rewards" className="text-[#cccccc] text-sm font-medium hover:text-[#1883fd] transition-colors">Rewards</Link>
            <Link href="/community" className="text-[#cccccc] text-sm font-medium hover:text-[#1883fd] transition-colors">Community</Link>
            <Link href="/parent" className="text-[#cccccc] text-sm font-medium hover:text-[#1883fd] transition-colors">Dashboard</Link>
            <Link href="/upgrade" className="text-[#0070cc] text-sm font-semibold hover:text-[#1883fd] transition-colors">⭐ Upgrade</Link>
            <Link href="/about" className="text-[#cccccc] text-sm font-medium hover:text-[#1883fd] transition-colors">About</Link>
          </nav>
          <AuthButton />
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="bg-black py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-[40px] md:text-[54px] font-light text-white leading-tight tracking-[-0.1px] mb-6">
            Give your child a head start —<br className="hidden md:block" /> before school begins
          </h1>
          <p className="text-[#6b6b6b] text-xl font-light max-w-2xl mx-auto mb-10 leading-relaxed">
            Structured learning in math, reading and writing for children aged 3–6. Built around what kids need before school — and how they actually learn it. Free for every child.
          </p>
          <a href="#games" className="ps-btn text-[1.125rem] px-10 py-4">
            Start Learning Free →
          </a>
        </div>
      </section>

      {/* ── Trust strip ──────────────────────────────────────── */}
      <div className="bg-[#0a0a0a] border-y border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-center gap-x-10 gap-y-2">
          {[
            { icon: '🔒', text: 'No ads. Ever.' },
            { icon: '🙅', text: 'No personal data sold' },
            { icon: '👶', text: 'Designed for ages 3–6' },
            { icon: '✅', text: 'Free for every child' },
          ].map(({ icon, text }) => (
            <span key={text} className="text-[#6b6b6b] text-sm flex items-center gap-1.5">
              <span>{icon}</span>{text}
            </span>
          ))}
        </div>
      </div>

      {/* ── Games Grid ───────────────────────────────────────── */}
      <section id="games" className="bg-[#f5f7fa] py-20">
        <div className="max-w-7xl mx-auto px-6">

          <h2 className="text-[35px] font-light text-black mb-3 leading-snug">
            Core Learning
          </h2>
          <p className="text-[#6b6b6b] text-base mb-10">Foundational games covering letters, numbers, shapes, colors, math and vocabulary.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {apps.map((app, index) => (
              <AppCard key={index} {...app} />
            ))}
          </div>

          <h2 className="text-[35px] font-light text-black mb-3 leading-snug">
            New Games
          </h2>
          <p className="text-[#6b6b6b] text-base mb-10">Fresh challenges — spelling, memory, rhyming, patterns, sentences, time and more!</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
            {newGames.map((game, index) => (
              <NewGameCard key={index} {...game} />
            ))}
          </div>

          {/* Info strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-t border-[#f3f3f3]">
            <div>
              <h3 className="text-[18px] font-semibold text-black mb-3">About</h3>
              <p className="text-[#6b6b6b] text-sm leading-relaxed">
                Educational games designed for kindergarten children ages 3–6.
                Learn alphabet, counting, shapes, colors, math, vocabulary and more — all in one place.
              </p>
            </div>
            <div>
              <h3 className="text-[18px] font-semibold text-black mb-3">Features</h3>
              <ul className="text-[#6b6b6b] text-sm space-y-1.5">
                <li>26 ABC Letters with phonics</li>
                <li>Numbers 1–200 with visual counting</li>
                <li>9 geometric shapes with fun facts</li>
                <li>12 colors with real-world examples</li>
                <li>Adaptive Math Engine — 5 levels</li>
                <li>Word Builder — 4 levels</li>
                <li>Memory Match, Spelling, Rhyming</li>
                <li>Patterns, Sentences, Telling Time</li>
                <li>Sight Words, Counting, Tracing</li>
              </ul>
            </div>
            <div>
              <h3 className="text-[18px] font-semibold text-black mb-3">Perfect For</h3>
              <ul className="text-[#6b6b6b] text-sm space-y-1.5">
                <li>Kindergarten preparation</li>
                <li>Homeschooling parents</li>
                <li>Early childhood educators</li>
                <li>Preschool teachers</li>
                <li>Children ages 3–6</li>
                <li>Family learning time</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Parent Dashboard promo ──────────────────────────── */}
      <section className="bg-black py-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-[30px] font-light text-white mb-3">Track Your Child&apos;s Progress</h2>
            <p className="text-[#6b6b6b] text-base max-w-xl leading-relaxed">
              Sign in to unlock the Parent Dashboard — see mastery levels, weak areas that need practice,
              and daily recommendations. Your child improves through 15 minutes of structured daily sessions.
            </p>
          </div>
          <Link href="/parent" className="ps-btn text-base px-8 py-4 whitespace-nowrap flex-shrink-0">
            View Dashboard →
          </Link>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer style={{ backgroundColor: '#003791' }} className="text-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="font-light text-lg mb-3">Kiddy Learning Hub</p>
          <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Free educational games for children ages 3–6
          </p>
          <div className="flex justify-center gap-8 flex-wrap text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/learning-path" className="hover:text-white transition-colors">Learning Path</Link>
            <Link href="/rewards" className="hover:text-white transition-colors">Rewards</Link>
            <Link href="/parent" className="hover:text-white transition-colors">Dashboard</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
          <p className="text-xs mt-8" style={{ color: 'rgba(255,255,255,0.4)' }}>
            &copy; {new Date().getFullYear()} Kiddy Learning Hub. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}