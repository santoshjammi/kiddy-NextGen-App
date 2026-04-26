'use client';

import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Header Section */}
        <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 md:p-12 text-center">
          <h1 className="text-4xl md:text-5xl font-fredoka mb-4">ℹ️ About Kiddy Learning Hub</h1>
          <nav className="text-indigo-100 flex justify-center items-center gap-2">
            <Link href="/" className="hover:text-white transition-colors">🏠 Home</Link>
            <span className="opacity-50">→</span>
            <span>About Us</span>
          </nav>
        </header>

        <div className="p-6 md:p-12 space-y-16">
          {/* Mission Section */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">🎯</span>
              <h2 className="text-3xl font-bold text-gray-800">Our Mission</h2>
            </div>
            <p className="text-xl text-gray-700 leading-relaxed italic border-l-4 border-indigo-500 pl-6">
              &quot;To make learning fun, accessible, and engaging for every child, regardless of their background or circumstances. We believe that quality education should be available to all children around the world.&quot;
            </p>
          </section>

          {/* Story Section */}
          <section className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <span className="text-3xl">📖</span> Our Story
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Kiddy Learning Hub was born from a simple observation: children learn best when they&apos;re having fun. Our team of educators and developers came together with a shared vision of creating educational games that don&apos;t feel like work, but like play.
                </p>
                <p>
                  We noticed that many educational resources were either expensive, overly complex, or not engaging enough for young learners. So we set out to create something different - games that are:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2"><span className="text-green-500">✅</span> <strong className="text-gray-800">Genuinely Fun:</strong> Kids want to play, not just learn</li>
                  <li className="flex items-center gap-2"><span className="text-green-500">✅</span> <strong className="text-gray-800">Educationally Sound:</strong> Based on proven learning principles</li>
                  <li className="flex items-center gap-2"><span className="text-green-500">✅</span> <strong className="text-gray-800">Universally Accessible:</strong> Available to anyone with internet access</li>
                </ul>
              </div>
            </div>
            <div className="bg-indigo-50 rounded-3xl p-8 text-center">
                <div className="text-8xl mb-4">🎓</div>
                <p className="text-indigo-800 font-medium">Empowering the next generation of learners through digital play.</p>
            </div>
          </section>

          {/* Values Section */}
          <section>
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">💝 Our Values</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: '👶', title: 'Child-First Design', text: 'Every decision we make puts children\'s needs, safety, and development first. Our games are designed by understanding how young minds learn and grow.' },
                { icon: '🔒', title: 'Privacy & Safety', text: 'We take children\'s privacy seriously. We don\'t collect personal information, and all our content is carefully curated to be safe and appropriate.' },
                { icon: '🌍', title: 'Accessibility for All', text: 'Quality education shouldn\'t depend on economic circumstances. Our games are designed to work on any device, anywhere in the world.' },
                { icon: '🎨', title: 'Learning Through Play', text: 'We believe that play is a child\'s natural way of learning. Our games make education feel like an adventure, not a chore.' },
                { icon: '👨‍👩‍👧‍👦', title: 'Supporting Families', text: 'We\'re here to support parents, caregivers, and educators in nurturing young learners. Our tools complement, not replace, human connection.' },
              ].map((value, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="text-3xl mb-3">{value.icon}</div>
                  <h3 className="font-bold text-gray-800 mb-2">{value.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{value.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Games Section */}
          <section className="bg-gray-50 rounded-3xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">🎮 Our Educational Games</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { icon: '🔤', title: 'ABC Letters', desc: 'Interactive alphabet learning with visual associations, phonics, and engaging animations.' },
                { icon: '🔢', title: 'Numbers 1-100', desc: 'Number recognition, counting, and basic math concepts presented through fun activities.' },
                { icon: '🔺', title: 'Shapes & Patterns', desc: 'Geometric shape recognition, spatial awareness, and pattern recognition skills.' },
                { icon: '🌈', title: 'Colors & Art', desc: 'Color identification, mixing, and creative expression that builds visual perception.' },
              ].map((game, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-sm flex items-start gap-4">
                  <div className="text-4xl">{game.icon}</div>
                  <div>
                    <h3 className="font-bold text-gray-800">{game.title}</h3>
                    <p className="text-sm text-gray-600">{game.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Team Section */}
          <section>
            <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">👥 Our Expert Team</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: 'Dr. Sarah Mitchell', role: 'Lead Educational Designer', expertise: 'PhD in Early Childhood Education' },
                { name: 'Prof. Michael Chen', role: 'Child Development Specialist', expertise: 'MS in Child Psychology' },
                { name: 'Lisa Rodriguez', role: 'Educational Technology Expert', expertise: 'MS in Educational Technology' },
              ].map((member, i) => (
                <div key={i} className="text-center">
                  <div className="w-24 h-24 bg-indigo-100 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">👤</div>
                  <h3 className="font-bold text-gray-800">{member.name}</h3>
                  <p className="text-sm text-indigo-600 font-medium mb-2">{member.role}</p>
                  <p className="text-xs text-gray-500">{member.expertise}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="bg-gray-50 p-8 text-center border-t">
          <div className="flex flex-wrap justify-center gap-6 mb-6 text-sm font-medium text-gray-600">
            <Link href="/" className="hover:text-indigo-600">🏠 Home</Link>
            <Link href="/contact" className="hover:text-indigo-600">📧 Contact</Link>
            <Link href="/privacy-policy" className="hover:text-indigo-600">🔒 Privacy</Link>
            <Link href="/terms-of-service" className="hover:text-indigo-600">📋 Terms</Link>
          </div>
          <p className="text-gray-400 text-xs">
            &copy; 2025 Kiddy Learning Hub. Dedicated to making learning fun for every child.
          </p>
        </footer>
      </div>
    </div>
  );
}
