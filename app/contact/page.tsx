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
      title: 'Privacy & Legal',
      email: 'countrysnews@gmail.com',
      responseTime: 'Within 48 hours',
      bestFor: 'Privacy concerns, data questions, legal matters'
    },
    {
      title: 'Educators & Schools',
      email: 'countrysnews@gmail.com',
      responseTime: 'Within 24 hours',
      bestFor: 'Classroom use, educational partnerships, bulk access'
    }
  ];

  const faqs = [
    {
      q: 'How do I access the games?',
      a: 'All our games are available directly on our website without registration. Simply click on any game from the main page to start playing!'
    },
    {
      q: 'Is my child\'s progress saved?',
      a: 'Yes! Game progress is automatically saved on your device using local storage. No personal information is sent to our servers.'
    },
    {
      q: 'Do the games work on tablets and phones?',
      a: 'Absolutely! Our games are designed to work on computers, tablets, and smartphones with touch controls optimized for each device.'
    },
    {
      q: 'What ages are the games suitable for?',
      a: 'Our games are designed for children ages 3-6, covering preschool and kindergarten learning levels. Content is age-appropriate and educational.'
    },
    {
      q: 'Do I need internet to play?',
      a: 'You need internet to initially load the games, but once loaded, many features work offline. For the best experience, we recommend staying connected.'
    },
    {
      q: 'Can teachers use these in classrooms?',
      a: 'Yes! Teachers and educators are welcome to use our games in classrooms. Contact us at countrysnews@gmail.com for more information.'
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
        <div className="mb-16">
          <h1 className="text-[54px] font-light text-black leading-tight tracking-[-0.1px] mb-6">
            Contact Us
          </h1>
          <p className="text-[18px] text-[#6b6b6b] font-light leading-relaxed max-w-2xl">
            Have questions, feedback, or need help with our educational games? We&apos;re here to help.
          </p>
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
