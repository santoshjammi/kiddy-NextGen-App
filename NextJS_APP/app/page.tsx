"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AuthButton from "../components/AuthButton";

interface AppCardProps {
  emoji: string;
  title: string;
  description: string;
  link: string;
  progress: number;
  total: string;
}

function AppCard({ emoji, title, description, link, progress, total }: AppCardProps) {
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
            <span className="text-xs text-[#6b6b6b] font-medium">{total}</span>
            <span className="text-xs text-[#0070cc] font-semibold">{progress}%</span>
          </div>
          <div className="ps-progress-track mb-5">
            <div className="ps-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="ps-btn ps-btn-sm w-full justify-center">
            Start Learning
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const [progressData, setProgressData] = useState({
    alphabet: 0,
    numbers: 0,
    shapes: 0,
    colors: 0,
  });

  useEffect(() => {
    const readCount = (key: string) => {
      try {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved).length : 0;
      } catch { return 0; }
    };
    setProgressData({
      alphabet: Math.round((readCount('kiddyHub_alphabetCompleted') / 26) * 100),
      numbers: Math.round((readCount('kiddyHub_numbersCompleted') / 100) * 100),
      shapes: Math.round((readCount('kiddyHub_shapesCompleted') / 9) * 100),
      colors: Math.round((readCount('kiddyHub_colorsCompleted') / 12) * 100),
    });
  }, []);

  const apps = [
    {
      emoji: '🔤',
      title: 'ABC Letters Learning',
      description: 'Master the alphabet A-Z with interactive phonics, colorful images, and engaging sounds. Perfect for letter recognition!',
      link: '/alphabet',
      progress: progressData.alphabet,
      total: `${Math.round(progressData.alphabet * 26 / 100)}/26 Letters`,
    },
    {
      emoji: '🔢',
      title: 'Numbers 1-100 Fun',
      description: 'Count and learn numbers 1 to 100 with visual dots, audio pronunciation, and fun number games. Build math foundation!',
      link: '/numbers',
      progress: progressData.numbers,
      total: `${Math.round(progressData.numbers)}/100 Numbers`,
    },
    {
      emoji: '🔺',
      title: 'Shape Explorer',
      description: 'Discover 9 basic geometric shapes with animations, fun facts, and interactive learning. Develop visual skills!',
      link: '/shapes',
      progress: progressData.shapes,
      total: `${Math.round(progressData.shapes * 9 / 100)}/9 Shapes`,
    },
    {
      emoji: '🎨',
      title: 'Color World',
      description: 'Learn 12 vibrant colors with real-world examples and creative color games. Unleash creativity!',
      link: '/colors',
      progress: progressData.colors,
      total: `${Math.round(progressData.colors * 12 / 100)}/12 Colors`,
    },
    {
      emoji: '🧮',
      title: 'Math Engine',
      description: 'Adaptive mathematics from single digits to 5-digit problems. Visual blocks, column grids, and word problems — levels up as you master each stage!',
      link: '/math',
      progress: 0,
      total: 'Levels 1–5',
    },
    {
      emoji: '✍️',
      title: 'Word Builder',
      description: 'Grow your vocabulary from 2-letter sight words to 5-letter Wordle challenges. Letter blocks, missing vowels, scrambles, and more!',
      link: '/english',
      progress: 0,
      total: 'Levels 1–4',
    },
  ];

  return (
    <div className="min-h-screen bg-white">

      {/* ── Masthead ─────────────────────────────────────────── */}
      <header className="bg-black sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">📚</span>
            <span className="text-white font-light text-lg tracking-wide">Kiddy Learning Hub</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/about" className="text-[#cccccc] text-sm font-medium hover:text-[#1883fd] transition-colors">About</Link>
            <Link href="/contact" className="text-[#cccccc] text-sm font-medium hover:text-[#1883fd] transition-colors">Contact</Link>
          </nav>
          <AuthButton />
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="bg-black py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-[40px] md:text-[54px] font-light text-white leading-tight tracking-[-0.1px] mb-6">
            Educational Games for Kids Ages 3–6
          </h1>
          <p className="text-[#6b6b6b] text-xl font-light max-w-2xl mx-auto mb-10 leading-relaxed">
            Interactive learning with ABC letters, numbers 1–100, shapes, colors, adaptive math, and word-building. Free for every child.
          </p>
          <a href="#games" className="ps-btn text-[1.125rem] px-10 py-4">
            Explore Games
          </a>
        </div>
      </section>

      {/* ── Games Grid ───────────────────────────────────────── */}
      <section id="games" className="bg-[#f5f7fa] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-[35px] font-light text-black mb-12 leading-snug">
            Choose Your Adventure
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {apps.map((app, index) => (
              <AppCard key={index} {...app} />
            ))}
          </div>

          {/* Info strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-t border-[#f3f3f3]">
            <div>
              <h3 className="text-[18px] font-semibold text-black mb-3">About</h3>
              <p className="text-[#6b6b6b] text-sm leading-relaxed">
                Educational games designed for kindergarten children ages 3–6.
                Learn alphabet, counting, shapes, colors, math, and vocabulary — all in one place.
              </p>
            </div>
            <div>
              <h3 className="text-[18px] font-semibold text-black mb-3">Features</h3>
              <ul className="text-[#6b6b6b] text-sm space-y-1.5">
                <li>26 ABC Letters with phonics</li>
                <li>Numbers 1–100 with visual counting</li>
                <li>9 geometric shapes with fun facts</li>
                <li>12 colors with real-world examples</li>
                <li>Adaptive Math Engine — 5 levels</li>
                <li>Word Builder — 4 levels</li>
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

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer style={{ backgroundColor: '#003791' }} className="text-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="font-light text-lg mb-3">Kiddy Learning Hub</p>
          <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Free educational games for children ages 3–6
          </p>
          <div className="flex justify-center gap-8 flex-wrap text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
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
