'use client';

import Link from 'next/link';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Header */}
        <header className="bg-gradient-to-r from-gray-700 to-gray-900 text-white p-8 md:p-12 text-center">
          <h1 className="text-4xl md:text-5xl font-fredoka mb-4">📋 Terms of Service</h1>
          <nav className="text-gray-300 flex justify-center items-center gap-2">
            <Link href="/" className="hover:text-white transition-colors">🏠 Home</Link>
            <span className="opacity-50">→</span>
            <span className="font-semibold">Terms of Service</span>
          </nav>
        </header>

        <div className="p-6 md:p-12 space-y-12">
          {/* Last Updated */}
          <div className="text-sm text-gray-500 text-center">
            <p>Last updated: August 20, 2025</p>
          </div>

          {/* Welcome Section */}
          <section className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">🎯 Welcome to Kiddy Learning Hub</h2>
            <p className="text-gray-600 leading-relaxed">
              Thank you for choosing Kiddy Learning Hub! These Terms of Service (&quot;Terms&quot;) govern your use of our educational games and website. By using our services, you agree to these terms.
            </p>
            <div className="mt-6 bg-amber-50 border-l-4 border-amber-400 p-4 text-amber-800 rounded-r-xl">
              <p className="font-semibold">⚠️ Important:</p>
              <p className="text-sm">If you are under 18, please have a parent or guardian review these terms with you.</p>
            </div>
          </section>

          {/* Services & Acceptable Use */}
          <section className="grid md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="text-2xl">🎮</span> Our Services
              </h2>
              <ul className="space-y-4 text-gray-600">
                <li className="flex gap-3"><span className="text-indigo-500 font-bold">✓</span> <span><strong className="text-gray-800">Educational Games:</strong> ABC Letters, Numbers, Shapes, and Colors learning games</span></li>
                <li className="flex gap-3"><span className="text-indigo-500 font-bold">✓</span> <span><strong className="text-gray-800">Access:</strong> All games are available to use without registration</span></li>
                <li className="flex gap-3"><span className="text-indigo-500 font-bold">✓</span> <span><strong className="text-gray-800">Safe Environment:</strong> Child-friendly content and advertising</span></li>
                <li className="flex gap-3"><span className="text-indigo-500 font-bold">✓</span> <span><strong className="text-gray-800">Progress Tracking:</strong> Local game progress saving (stored on your device)</span></li>
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="text-2xl">✅</span> Acceptable Use
              </h2>
              <div className="space-y-6">
                <div className="bg-green-50 p-4 rounded-xl">
                  <h3 className="font-bold text-green-800 mb-2 text-sm uppercase tracking-wider">You may:</h3>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Educational purposes for children ages 3-6</li>
                    <li>• Personal, non-commercial use</li>
                    <li>• Sharing with family and friends</li>
                    <li>• Classroom use by educators</li>
                  </ul>
                </div>
                <div className="bg-red-50 p-4 rounded-xl">
                  <h3 className="font-bold text-red-800 mb-2 text-sm uppercase tracking-wider">You must NOT:</h3>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Copy, distribute, or reproduce our games without permission</li>
                    <li>• Attempt to hack, disrupt, or damage our services</li>
                    <li>• Use automated tools to access our games</li>
                    <li>• Remove or modify any copyright notices</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Privacy & Advertising */}
          <section className="grid md:grid-cols-2 gap-8">
            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
              <h2 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
                <span className="text-xl">🔒</span> Privacy and Data
              </h2>
              <ul className="space-y-2 text-blue-900/70 text-sm">
                <li className="flex items-start gap-2"><span className="text-blue-500">•</span> <span><strong className="text-blue-900">No Registration:</strong> Games work without creating accounts</span></li>
                <li className="flex items-start gap-2"><span className="text-blue-500">•</span> <span><strong className="text-blue-900">Local Storage:</strong> Game progress is saved on your device only</span></li>
                <li className="flex items-start gap-2"><span className="text-blue-500">•</span> <span><strong className="text-blue-900">COPPA Compliant:</strong> We follow children&apos;s privacy laws</span></li>
              </ul>
            </div>
            <div className="bg-yellow-50 p-6 rounded-2xl border border-yellow-100">
              <h2 className="text-xl font-bold text-yellow-800 mb-4 flex items-center gap-2">
                <span className="text-xl">💰</span> Advertising
              </h2>
              <p className="text-sm text-yellow-900/70 mb-4">Our service is supported by advertising:</p>
              <ul className="space-y-2 text-yellow-900/70 text-sm">
                <li className="flex items-start gap-2"><span className="text-yellow-500">•</span> <span><strong className="text-yellow-900">Child-Safe Ads:</strong> All advertisements are filtered for appropriate content</span></li>
                <li className="flex items-start gap-2"><span className="text-yellow-500">•</span> <span><strong className="text-yellow-900">Google AdSense:</strong> We use Google&apos;s advertising platform</span></li>
              </ul>
            </div>
          </section>

          {/* Disclaimer */}
          <section className="border-t pt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">🛡️ Disclaimer and Limitations</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-50 p-6 rounded-2xl">
                <h3 className="font-bold text-gray-800 mb-3">Educational Purpose</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Our games are designed to support learning but are not a substitute for formal education. They should complement, not replace, other learning activities. Results may vary by individual child.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-2xl">
                <h3 className="font-bold text-gray-800 mb-3">Service Availability</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  We strive to provide continuous service, but services may be temporarily unavailable for maintenance and we cannot guarantee 100% uptime.
                </p>
              </div>
            </div>
          </section>

          {/* Contact/Governing Law */}
          <section className="text-center space-y-6 pb-10">
            <h2 className="text-2xl font-bold text-gray-800">Questions?</h2>
            <p className="text-gray-600">If you have questions about these Terms of Service, contact us at:</p>
            <a href="mailto:countrysnews@gmail.com" className="text-xl font-semibold text-indigo-600 hover:underline">countrysnews@gmail.com</a>
            <div className="pt-6 text-xs text-gray-400">
              <p>Governing Law: These Terms are governed by the laws of your local jurisdiction. Any disputes will be resolved in the courts of your local jurisdiction.</p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="bg-gray-50 p-8 text-center border-t">
          <div className="flex flex-wrap justify-center gap-6 mb-6 text-sm font-medium text-gray-600">
            <Link href="/" className="hover:text-indigo-600">🏠 Home</Link>
            <Link href="/about" className="hover:text-indigo-600">ℹ️ About</Link>
            <Link href="/contact" className="hover:text-indigo-600">📧 Contact</Link>
            <Link href="/privacy-policy" className="hover:text-indigo-600">🔒 Privacy</Link>
          </div>
          <p className="text-gray-400 text-xs">&copy; 2025 Kiddy Learning Hub. Making learning fun and accessible.</p>
        </footer>
      </div>
    </div>
  );
}
