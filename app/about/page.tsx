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
            Educational games designed specifically for kindergarten children ages 3–6.
          </p>
        </div>

        {/* Mission */}
        <section className="mb-16">
          <h2 className="text-[35px] font-light text-black mb-6">Our Mission</h2>
          <p className="text-[18px] text-[#1f1f1f] font-light leading-relaxed border-l-4 border-[#0070cc] pl-6 max-w-3xl">
            &quot;To make learning fun, accessible, and engaging for every child, regardless of their background or circumstances. Quality education should be available to all children around the world.&quot;
          </p>
        </section>

        {/* Values */}
        <section className="mb-16">
          <h2 className="text-[35px] font-light text-black mb-8">Our Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '👶', title: 'Child-First Design', text: 'Every decision puts children\'s needs, safety, and development first.' },
              { icon: '🔒', title: 'Privacy & Safety', text: 'We don\'t collect personal information. All content is carefully curated and safe.' },
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

        {/* Games */}
        <section className="mb-16 bg-[#f5f7fa] rounded-[24px] p-8 md:p-12">
          <h2 className="text-[35px] font-light text-black mb-8">Our Educational Games</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { icon: '🔤', title: 'ABC Letters', desc: 'Interactive alphabet learning with visual associations, phonics, and engaging animations.' },
              { icon: '🔢', title: 'Numbers 1–100', desc: 'Number recognition, counting, and basic math presented through fun activities.' },
              { icon: '🔺', title: 'Shape Explorer', desc: 'Geometric shape recognition, spatial awareness, and pattern recognition skills.' },
              { icon: '🎨', title: 'Color World', desc: 'Color identification and visual perception that builds creative thinking.' },
              { icon: '🧮', title: 'Math Engine', desc: 'Adaptive mathematics from single digits to 5-digit problems across 5 levels.' },
              { icon: '✍️', title: 'Word Builder', desc: 'Vocabulary from sight words to Wordle-style 5-letter challenges across 4 levels.' },
            ].map((game, i) => (
              <div key={i} className="bg-white p-6 rounded-[19px] flex items-start gap-4" style={{ boxShadow: 'rgba(0,0,0,0.06) 0 5px 9px 0' }}>
                <div className="text-4xl">{game.icon}</div>
                <div>
                  <h3 className="text-[18px] font-semibold text-black mb-1">{game.title}</h3>
                  <p className="text-sm text-[#6b6b6b] leading-relaxed">{game.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="flex justify-start gap-4">
          <Link href="/" className="ps-btn">Start Learning</Link>
          <Link href="/contact" className="ps-btn ps-btn-ghost">Contact Us</Link>
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
