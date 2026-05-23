'use client';

import Link from 'next/link';

export default function ContactPage() {
  const contactMethods = [
    {
      title: 'General Inquiries',
      email: 'countrysnews@gmail.com',
      responseTime: 'Within 24 hours',
      bestFor: 'General questions, feedback, suggestions'
    },
    {
      title: 'Technical Support',
      email: 'countrysnews@gmail.com',
      responseTime: 'Within 12 hours',
      bestFor: 'Game issues, browser problems, technical difficulties'
    },
    {
      title: 'Privacy & Account Deletion',
      email: 'countrysnews@gmail.com',
      responseTime: 'Within 48 hours',
      bestFor: 'Privacy concerns, data questions, account deletion requests'
    },
  ];

  const faqs = [
    {
      q: 'How do I access the activities?',
      a: 'Most activities are free and playable instantly — no sign-in needed to explore. Sign in with your Google account to save progress, earn rewards, and unlock the full Learning Path with a Premium plan.'
    },
    {
      q: 'Is my child\'s progress saved?',
      a: 'When you\'re signed in, progress is saved securely to your account in the cloud via Firebase. This powers the Parent Dashboard and keeps difficulty adaptive across devices.'
    },
    {
      q: 'Do the activities work on tablets and phones?',
      a: 'Yes — all activities are designed for computers, tablets, and smartphones with touch controls optimised for each device.'
    },
    {
      q: 'What ages are the activities suitable for?',
      a: 'Kiddy is designed for children ages 4\u20139, covering pre-school foundations through early primary school maths and English. Each activity has multiple difficulty levels that adapt as your child improves.'
    },
    {
      q: 'What does the Premium plan include?',
      a: 'Premium (\u20b9299/month) unlocks the full 14-step Learning Path, the \u201cRecommended Today\u201d and \u201cNeeds Practice\u201d sections on the Parent Dashboard, and priority access to new content.'
    },
    {
      q: 'How can I give feedback?',
      a: 'The fastest way is the Community page — the founder reads and replies to every post. You can also email us at countrysnews@gmail.com.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <header className="bg-black sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="ps-btn ps-btn-sm ps-btn-ghost-dark">← Home</Link>
          <span className="text-white font-light text-lg">Contact</span>
          <div className="w-24" />
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="mb-10">
          <h1 className="text-[54px] font-light text-black leading-tight tracking-[-0.1px] mb-6">
            Contact Us
          </h1>
          <p className="text-[18px] text-[#6b6b6b] font-light leading-relaxed max-w-2xl">
            Have a question or feedback? The quickest way to reach us is the Community page — the founder reads every post and replies directly.
          </p>
        </div>

        {/* Community pointer */}
        <div className="mb-16 bg-[#f0f7ff] border border-[#bfdbfe] rounded-[24px] p-7 flex items-center justify-between gap-6 flex-wrap">
          <div>
            <h2 className="text-[20px] font-semibold text-black mb-1">Got feedback or a question?</h2>
            <p className="text-sm text-[#6b6b6b]">Post in the Community — the founder reads and replies to every message personally.</p>
          </div>
          <Link href="/community" className="ps-btn shrink-0">Go to Community →</Link>
        </div>

        {/* Contact Methods */}
        <section className="mb-16">
          <h2 className="text-[35px] font-light text-black mb-8">Get in Touch</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {contactMethods.map((method, i) => (
              <div key={i} className="bg-white p-6 rounded-[19px]" style={{ boxShadow: 'rgba(0,0,0,0.06) 0 5px 9px 0' }}>
                <h3 className="text-[18px] font-semibold text-black mb-3">{method.title}</h3>
                <div className="space-y-2 text-sm text-[#6b6b6b]">
                  <p><span className="font-medium text-[#1f1f1f]">Email:</span>{' '}
                    <a href={`mailto:${method.email}`} className="text-[#0070cc] hover:text-[#1eaedb] transition-colors">{method.email}</a>
                  </p>
                  <p><span className="font-medium text-[#1f1f1f]">Response:</span> {method.responseTime}</p>
                  <p><span className="font-medium text-[#1f1f1f]">Best for:</span> {method.bestFor}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section className="mb-16 bg-[#f5f7fa] rounded-[24px] p-8 md:p-12">
          <h2 className="text-[35px] font-light text-black mb-8">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white p-6 rounded-[19px]" style={{ boxShadow: 'rgba(0,0,0,0.06) 0 5px 9px 0' }}>
                <h3 className="text-[18px] font-semibold text-black mb-2">{faq.q}</h3>
                <p className="text-sm text-[#6b6b6b] leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="flex justify-start">
          <Link href="/" className="ps-btn">Back to Games</Link>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ backgroundColor: '#003791' }} className="text-white py-10 mt-16">
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap justify-between items-center gap-4">
          <span className="font-light">Kiddy Learning Hub</span>
          <div className="flex gap-8 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
