"use client";

import { useEffect } from "react";
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
    <Link href={link} className="block">
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 text-center shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border-3 border-transparent hover:border-teal-400 flex flex-col justify-between min-h-[320px] overflow-hidden relative">
        <div className="text-6xl mb-6 animate-bounce-custom">{emoji}</div>
        <div className="flex-grow">
          <h2 className="text-3xl font-semibold text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text mb-3 leading-tight">
            {title}
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed flex-grow">{description}</p>
        </div>
        <div className="mb-6">
          <span className="text-sm text-gray-500 block mb-2">Learning Progress</span>
          <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-teal-400 to-sky-400 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        <button className="bg-gradient-to-r from-red-400 to-teal-400 text-white border-none py-4 px-8 rounded-full text-lg font-semibold cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg uppercase tracking-wider">
          Start Learning
        </button>
      </div>
    </Link>
  );
}

export default function Home() {
  const apps = [
    {
      emoji: '🔤',
      title: 'ABC Letters Learning',
      description: 'Master the alphabet A-Z with interactive phonics, colorful images, and engaging sounds. Perfect for letter recognition!',
      link: '/alphabet',
      progress: 100,
      total: '26/26 Letters',
    },
    {
      emoji: '🔢',
      title: 'Numbers 1-100 Fun',
      description: 'Count and learn numbers 1 to 100 with visual dots, audio pronunciation, and fun number games. Build math foundation!',
      link: '/numbers',
      progress: 0,
      total: '0/100 Numbers',
    },
    {
      emoji: '🔺',
      title: 'Shape Explorer',
      description: 'Discover 10 basic geometric shapes with animations, fun facts, and interactive learning. Develop visual skills!',
      link: '/shapes',
      progress: 0,
      total: '0/10 Shapes',
    },
    {
      emoji: '🎨',
      title: 'Color World',
      description: 'Learn 12 vibrant colors with mixing activities, real-world examples, and creative color games. Unleash creativity!',
      link: '/colors',
      progress: 0,
      total: '0/12 Colors',
    },
  ];

  useEffect(() => {
    apps.forEach((app) => {
      const progressKey = app.link.replace('/', '') + 'Progress';
      const storedProgress = localStorage.getItem(progressKey);
      if (storedProgress && progressKey !== 'alphabetProgress') {
        const progressEl = document.querySelector(`[data-link="${app.link}"] .progress-fill`);
        if (progressEl) {
          (progressEl as HTMLElement).style.width = storedProgress + '%';
        }
      }
    });
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <header className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold">Kiddy Learning Hub</h1>
            <AuthButton />
          </header>
          <p className="text-2xl md:text-3xl text-gray-800 font-semibold mb-3">
            Educational Games for Kids Ages 3-6
          </p>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Interactive learning platform with ABC letters, numbers 1-100, shapes, and colors. Perfect for kindergarten children!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {apps.map((app, index) => (
            <div key={index} data-link={app.link}>
              <AppCard
                emoji={app.emoji}
                title={app.title}
                description={app.description}
                link={app.link}
                progress={app.progress}
                total={app.total}
              />
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t-2 border-gray-100 bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">About Kiddy Learning Hub</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Educational games designed specifically for kindergarten children ages 3-6. Our interactive learning platform helps children develop essential skills in alphabet recognition, number counting, shape identification, and color learning.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Educational Features</h3>
              <ul className="text-gray-600 text-sm space-y-2">
                <li className="flex items-start gap-2"><span className="text-teal-400 font-bold">✓</span> 26 ABC Letters with Phonics</li>
                <li className="flex items-start gap-2"><span className="text-teal-400 font-bold">✓</span> Numbers 1-100 with Visual Counting</li>
                <li className="flex items-start gap-2"><span className="text-teal-400 font-bold">✓</span> 10 Basic Geometric Shapes</li>
                <li className="flex items-start gap-2"><span className="text-teal-400 font-bold">✓</span> 12 Colors with Mixing Activities</li>
                <li className="flex items-start gap-2"><span className="text-teal-400 font-bold">✓</span> 296 Professional Educational Assets</li>
                <li className="flex items-start gap-2"><span className="text-teal-400 font-bold">✓</span> Mobile & Tablet Friendly</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Perfect For</h3>
              <ul className="text-gray-600 text-sm space-y-2">
                <li className="flex items-start gap-2"><span className="text-teal-400 font-bold">✓</span> Kindergarten Preparation</li>
                <li className="flex items-start gap-2"><span className="text-teal-400 font-bold">✓</span> Homeschooling Parents</li>
                <li className="flex items-start gap-2"><span className="text-teal-400 font-bold">✓</span> Early Childhood Educators</li>
                <li className="flex items-start gap-2"><span className="text-teal-400 font-bold">✓</span> Preschool Teachers</li>
                <li className="flex items-start gap-2"><span className="text-teal-400 font-bold">✓</span> Children Ages 3-6</li>
                <li className="flex items-start gap-2"><span className="text-teal-400 font-bold">✓</span> Family Learning Time</li>
              </ul>
            </div>
          </div>
          <div className="text-center pt-6 border-t border-gray-200">
            <p className="text-gray-500 text-sm mb-4">&copy; 2025 Kiddy Learning Hub. Educational games for children. All rights reserved.</p>
            <div className="flex justify-center gap-6 flex-wrap">
              <Link href="/privacy-policy" className="text-indigo-500 hover:text-teal-400 hover:underline text-sm">Privacy Policy</Link>
              <Link href="/terms-of-service" className="text-indigo-500 hover:text-teal-400 hover:underline text-sm">Terms of Service</Link>
              <Link href="/contact" className="text-indigo-500 hover:text-teal-400 hover:underline text-sm">Contact Us</Link>
              <Link href="/about" className="text-indigo-500 hover:text-teal-400 hover:underline text-sm">About</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
