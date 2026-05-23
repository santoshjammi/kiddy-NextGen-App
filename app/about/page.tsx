'use client';

import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <header className="bg-black sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="ps-btn ps-btn-sm ps-btn-ghost-dark">← Home</Link>
          <span className="text-white font-light text-lg">About</span>
          <div className="w-24" />
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="mb-16">
          <h1 className="text-[54px] font-light text-black leading-tight tracking-[-0.1px] mb-6">
            About Kiddy Learning Hub
          </h1>
          <p className="text-[18px] text-[#6b6b6b] font-light leading-relaxed max-w-2xl">
            A structured daily learning platform for children ages 4–9 — short maths and English sessions with visible progress for parents.
          </p>
        </div>

        {/* Mission */}
        <section className="mb-16">
          <h2 className="text-[35px] font-light text-black mb-6">Our Mission</h2>
          <p className="text-[18px] text-[#1f1f1f] font-light leading-relaxed border-l-4 border-[#0070cc] pl-6 max-w-3xl">
            &quot;Your child doesn&apos;t need more random worksheets. They need the right practice, at the right time, with clear progress you can actually see. Kiddy gives children 15 minutes of focused daily learning in maths and English — and gives parents the clarity to know exactly where their child stands.&quot;
          </p>
        </section>

        {/* Values */}
        <section className="mb-16">
          <h2 className="text-[35px] font-light text-black mb-8">Our Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '👶', title: 'Child-First Design', text: 'Every decision puts children\'s needs, safety, and development first.' },
              { icon: '🔒', title: 'Privacy & Safety', text: 'We collect only what\'s needed to save your child\'s progress and power the parent dashboard. No ads, no selling data.' },
              { icon: '🌍', title: 'Accessibility for All', text: 'Quality education shouldn\'t depend on economic circumstances. Our games work on any device.' },
              { icon: '🎨', title: 'Learning Through Play', text: 'Play is a child\'s natural way of learning. Our games make education feel like adventure.' },
              { icon: '👨‍👩‍👧‍👦', title: 'Supporting Families', text: 'We support parents, caregivers, and educators in nurturing young learners.' },
            ].map((value, i) => (
              <div key={i} className="bg-white p-6 rounded-[19px]" style={{ boxShadow: 'rgba(0,0,0,0.06) 0 5px 9px 0' }}>
                <div className="text-3xl mb-3">{value.icon}</div>
                <h3 className="text-[18px] font-semibold text-black mb-2">{value.title}</h3>
                <p className="text-sm text-[#6b6b6b] leading-relaxed">{value.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Activities */}
        <section className="mb-10 bg-[#f5f7fa] rounded-[24px] p-8 md:p-12">
          <h2 className="text-[35px] font-light text-black mb-2">21 Learning Activities</h2>
          <p className="text-sm text-[#6b6b6b] mb-8">From alphabet foundations to 5-digit column arithmetic — every activity adapts to your child&apos;s level.</p>

          <h3 className="text-[16px] font-semibold text-black mb-1">Core Practice Engines</h3>
          <p className="text-xs text-[#6b6b6b] mb-4 uppercase tracking-wider">Adaptive · Multi-level · Progress-tracked</p>
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {[
              { icon: '🧮', title: 'Math Engine', desc: 'Addition, subtraction, and multiplication across 5 difficulty levels. Adapts as your child improves.' },
              { icon: '📖', title: 'English Engine', desc: '5 levels: letter blocks → CVC words → scramble → Wordle-style → sentence fill-in.' },
              { icon: '➕', title: 'Carry & Borrow', desc: 'Column arithmetic with visual carry and borrow across H/T/U columns. 5 levels.' },
              { icon: '🔤', title: 'Missing Letter', desc: 'Fill in the missing letter from CVC through 5-letter words. 3 levels.' },
              { icon: '🎣', title: 'Letter Fishing', desc: 'Drag-and-drop letter tiles with audio playback. Builds phonics and spelling. 3 levels.' },
              { icon: '🏎️', title: 'Multiplication Race', desc: 'Timed 20-second rounds with 4-choice answers. 4 difficulty bands from ×1–5 up to ×2–12.' },
              { icon: '➗', title: 'Division Splitter', desc: 'Visual group reveal with word-problem context. 4 levels from ÷2–3 to ÷2–12.' },
            ].map((g, i) => (
              <div key={i} className="bg-white p-5 rounded-[16px] flex items-start gap-3" style={{ boxShadow: 'rgba(0,0,0,0.05) 0 3px 6px 0' }}>
                <div className="text-3xl shrink-0">{g.icon}</div>
                <div>
                  <h4 className="text-[15px] font-semibold text-black mb-0.5">{g.title}</h4>
                  <p className="text-xs text-[#6b6b6b] leading-relaxed">{g.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <h3 className="text-[16px] font-semibold text-black mb-4">Exploration Activities</h3>
          <div className="flex flex-wrap gap-2">
            {['🔤 Alphabet', '🔢 Numbers 1–100', '🔺 Shapes', '🎨 Colors', '🧮 Counting',
              '🧩 Memory Match', '✍️ Spelling', '🎵 Rhyming', '🌀 Patterns', '👁️ Sight Words',
              '🦁 Animals', '📝 Sentences', '⏰ Time', '✏️ Tracing'].map((g) => (
              <span key={g} className="text-sm bg-white border border-[#e8e8e8] rounded-full px-3 py-1.5 text-[#1f1f1f]">
                {g}
              </span>
            ))}
          </div>
        </section>

        {/* For Parents */}
        <section className="mb-16">
          <h2 className="text-[35px] font-light text-black mb-8">Built for Parents</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { icon: '🗺️', title: 'Learning Path', desc: '14 structured steps from alphabet foundations through multiplication and division — a curated curriculum in the right order.' },
              { icon: '📊', title: 'Parent Dashboard', desc: 'See time spent, problems solved, weekly consistency, strengths, and areas to focus on — all in one place.' },
              { icon: '🏆', title: 'Rewards & Badges', desc: '14 achievement badges, a points system, and a daily streak counter to keep your child motivated and coming back.' },
              { icon: '💬', title: 'Community', desc: 'Share feedback or ask a question — the founder reads and replies to every post personally.' },
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-[19px] flex items-start gap-4" style={{ boxShadow: 'rgba(0,0,0,0.06) 0 5px 9px 0' }}>
                <div className="text-3xl">{item.icon}</div>
                <div>
                  <h3 className="text-[18px] font-semibold text-black mb-1">{item.title}</h3>
                  <p className="text-sm text-[#6b6b6b] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="flex justify-start flex-wrap gap-4">
          <Link href="/" className="ps-btn">Start Learning</Link>
          <Link href="/community" className="ps-btn ps-btn-ghost">Community</Link>
          <Link href="/contact" className="ps-btn ps-btn-ghost">Contact</Link>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ backgroundColor: '#003791' }} className="text-white py-10 mt-16">
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap justify-between items-center gap-4">
          <span className="font-light">Kiddy Learning Hub</span>
          <div className="flex gap-8 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
