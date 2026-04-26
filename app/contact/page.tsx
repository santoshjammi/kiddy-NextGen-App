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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-500 to-teal-500 text-white p-8 md:p-12 text-center">
          <h1 className="text-4xl md:text-5xl font-fredoka mb-4">📧 Contact Us</h1>
          <nav className="text-blue-100 flex justify-center items-center gap-2">
            <Link href="/" className="hover:text-white transition-colors">🏠 Home</Link>
            <span className="opacity-50">→</span>
            <span className="font-semibold">Contact Us</span>
          </nav>
        </header>

        <div className="p-6 md:p-12 space-y-16">
          {/* Intro */}
          <section className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">💬 We&apos;d Love to Hear From You!</h2>
            <p className="text-lg text-gray-600">Have questions, feedback, or need help with our educational games? We&apos;re here to help! Our team is committed to providing the best learning experience for children and support for parents and educators.</p>
          </section>

          {/* Contact Methods */}
          <section>
            <div className="grid md:grid-cols-2 gap-6">
              {contactMethods.map((method, i) => (
                <div key={i} className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                  <h3 className="text-xl font-bold text-blue-800 mb-4">{method.title}</h3>
                  <div className="space-y-2 text-gray-700">
                    <p><strong className="text-blue-900">Email:</strong> <a href={`mailto:${method.email}`} className="text-blue-600 hover:underline">{method.email}</a></p>
                    <p><strong className="text-blue-900">Response Time:</strong> {method.responseTime}</p>
                    <p><strong className="text-blue-900">Best For:</strong> {method.bestFor}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* FAQs */}
          <section>
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">❓ Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-800 mb-2">{faq.q}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Feedback Section */}
          <section className="bg-teal-50 rounded-3xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold text-teal-800 mb-4">💡 Share Your Feedback</h2>
            <p className="text-gray-600 mb-6">Your feedback helps us improve! We&apos;d love to hear about game ideas, bug reports, success stories, or feature requests.</p>
            <div className="flex flex-wrap justify-center gap-4">
                <div className="bg-white px-6 py-3 rounded-full shadow-sm text-teal-700 font-medium">🎯 Game Ideas</div>
                <div className="bg-white px-6 py-3 rounded-full shadow-sm text-teal-700 font-medium">🐛 Bug Reports</div>
                <div className="bg-white px-6 py-3 rounded-full shadow-sm text-teal-700 font-medium">⭐ Success Stories</div>
                <div className="bg-white px-6 py-3 rounded-full shadow-sm text-teal-700 font-medium">🎨 Feature Requests</div>
            </div>
          </section>

          {/* Urgent/Social */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                <h3 className="text-red-800 font-bold text-xl mb-4">🚨 Urgent Issues</h3>
                <p className="text-sm text-red-700 mb-2">For site-wide outages or security concerns:</p>
                <p className="font-bold text-red-800">countrysnews@gmail.com</p>
                <p className="text-xs text-red-600 mt-2">Response within 2 hours during business hours</p>
            </div>
            <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                <h3 className="text-indigo-800 font-bold text-xl mb-4">🌟 Stay Connected</h3>
                <p className="text-sm text-indigo-700 mb-4">Follow us for updates and learning tips:</p>
                <ul className="text-sm space-y-2 text-indigo-600">
                    <li className="list-none">📧 Newsletter: countrysnews@gmail.com</li>
                    <li className="list-none">🐦 Twitter: @KiddyLearningHub (Coming Soon)</li>
                    <li className="list-none">📘 Facebook: KiddyLearningHub (Coming Soon)</li>
                </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-50 p-8 text-center border-t">
          <div className="flex flex-wrap justify-center gap-6 mb-6 text-sm font-medium text-gray-600">
            <Link href="/" className="hover:text-indigo-600">🏠 Home</Link>
            <Link href="/about" className="hover:text-indigo-600">ℹ️ About</Link>
            <Link href="/privacy-policy" className="hover:text-indigo-600">🔒 Privacy</Link>
            <Link href="/terms-of-service" className="hover:text-indigo-600">📋 Terms</Link>
          </div>
          <p className="text-gray-400 text-xs">&copy; 2025 Kiddy Learning Hub. We&apos;re here to help!</p>
        </footer>
      </div>
    </div>
  );
}
