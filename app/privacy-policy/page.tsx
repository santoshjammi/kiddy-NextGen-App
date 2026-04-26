'use client';

import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Header */}
        <header className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white p-8 md:p-12 text-center">
          <h1 className="text-4xl md:text-5xl font-fredoka mb-4">🔒 Privacy Policy</h1>
          <nav className="text-indigo-100 flex justify-center items-center gap-2">
            <Link href="/" className="hover:text-white transition-colors">🏠 Home</Link>
            <span className="opacity-50">→</span>
            <span className="font-semibold">Privacy Policy</span>
          </nav>
        </header>

        <div className="p-6 md:p-12 space-y-12">
          {/* Last Updated Info */}
          <div className="bg-indigo-50 rounded-2xl p-6 text-sm text-indigo-800 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><strong className="text-indigo-900">Last updated:</strong> August 20, 2025</p>
              <p><strong className="text-indigo-900">Reviewed by:</strong> Dr. Sarah Mitchell, Child Privacy Specialist</p>
            </div>
            <div>
              <p><strong className="text-indigo-900">COPPA Certification:</strong> Current and compliant</p>
              <p><strong className="text-indigo-900">Legal Review:</strong> Children&apos;s Digital Privacy Law Firm</p>
            </div>
          </div>

          {/* Expert Protection Section */}
          <section>
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <span className="text-3xl">🛡️</span> Expert-Designed Privacy Protection
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              At Kiddy Learning Hub, child privacy protection is designed and overseen by <strong className="text-indigo-600">Dr. Sarah Mitchell, PhD in Early Childhood Education</strong> and certified COPPA compliance specialist with 15+ years of experience in child development and digital safety.
            </p>
            <div className="bg-white border-l-4 border-indigo-500 p-6 shadow-sm">
              <h3 className="font-bold text-indigo-800 mb-3">👩‍🎓 Privacy Expert Credentials</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li className="flex items-center gap-2"><span>•</span> <span className="text-gray-800"><strong className="text-gray-800">Dr. Sarah Mitchell:</strong> PhD Early Childhood Education, UC Berkeley</span></li>
                <li className="flex items-center gap-2"><span>•</span> <span className="text-gray-800"><strong className="text-gray-800">COPPA Certification:</strong> Children&apos;s Online Privacy Protection Act specialist</span></li>
                <li className="flex items-center gap-2"><span>•</span> <span className="text-gray-800"><strong className="text-gray-800">Legal Advisory:</strong> Partnership with Children&apos;s Digital Rights Law Firm</span></li>
                <li className="flex items-center gap-2"><span>•</span> <span className="text-gray-800"><strong className="text-gray-800">Regular Audits:</strong> Quarterly privacy assessments by independent experts</span></li>
              </ul>
            </div>
          </section>

          {/* Children's Privacy Section */}
          <section className="bg-red-50 rounded-3xl p-8 border border-red-100">
            <h2 className="text-3xl font-bold text-red-800 mb-6 flex items-center gap-3">
              <span className="text-3xl">👶</span> Children&apos;s Privacy
            </h2>
            <p className="text-lg font-semibold text-red-700 mb-8">
              We do NOT knowingly collect personal information from children under 13. Our games are designed to be safe and educational without requiring personal data collection.
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-red-800 mb-4">What we do:</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-center gap-2">✅ Provide educational games without requiring registration</li>
                  <li className="flex items-center gap-2">✅ Use child-safe advertising through Google AdSense</li>
                  <li className="flex items-center gap-2">✅ Comply with COPPA (Children&apos;s Online Privacy Protection Act)</li>
                  <li className="flex items-center gap-2">✅ Monitor content to ensure it&apos;s appropriate for children</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-red-800 mb-4">What we don't do:</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-center gap-2">❌ Collect names, addresses, or contact information</li>
                  <li className="flex items-center gap-2">❌ Ask children for personal information to play</li>
                  <li className="flex items-center gap-2">❌ Share children&apos;s information with third parties</li>
                  <li className="flex items-center gap-2">❌ Use tracking cookies for children under 13</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Information Collected */}
          <section>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">📊 Information We Collect</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-bold text-indigo-600 text-lg">Automatically Collected:</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" /> <span className="text-gray-800"><strong className="text-gray-800">Usage Analytics:</strong> Anonymous Google Analytics usage data.</span></li>
                  <li className="flex items-start gap-2"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" /> <span className="text-gray-800"><strong className="text-gray-800">Technical Info:</strong> Browser/device type for optimal performance.</span></li>
                  <li className="flex items-start gap-2"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" /> <span className="text-gray-800"><strong className="text-gray-800">Game Progress:</strong> Stored <strong className="text-indigo-600">locally on your device only</strong>.</span></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="font-bold text-indigo-600 text-lg">Advertising Information:</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" /> <span className="text-gray-800"><strong className="text-gray-800">Ad Serving:</strong> Google AdSense may use cookies for age-appropriate ads.</span></li>
                  <li className="flex items-start gap-2"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" /> <span className="text-gray-800"><strong className="text-gray-800">Ad Personalization:</strong> Can be disabled in your browser settings.</span></li>
                </ul>
              </div>
            </div>
          </section>

          {/* Cookies Section */}
          <section className="bg-gray-50 p-8 rounded-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🍪 Cookies and Tracking</h2>
            <p className="text-gray-600 mb-6">We use minimal cookies only for essential functions like game progress saving, basic analytics, and displaying appropriate ads.</p>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <p className="font-semibold text-gray-700 mb-2">Parents can:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Disable cookies in browser settings</li>
                <li>Use incognito/private browsing mode</li>
                <li>Clear browser data at any time</li>
              </ul>
            </div>
          </section>

          {/* Contact Section */}
          <section className="text-center py-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">📧 Privacy Questions?</h2>
            <p className="text-gray-600 mb-6">If you have questions about this policy or our practices, please contact us.</p>
            <a 
              href="mailto:countrysnews@gmail.com?subject=Privacy Policy Question"
              className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition-colors shadow-lg"
            >
              Email Us Directly
            </a>
          </section>
        </div>

        {/* Footer */}
        <footer className="bg-gray-50 p-8 text-center border-t">
          <div className="flex flex-wrap justify-center gap-6 mb-6 text-sm font-medium text-gray-600">
            <Link href="/" className="hover:text-indigo-600">🏠 Home</Link>
            <Link href="/about" className="hover:text-indigo-600">ℹ️ About</Link>
            <Link href="/contact" className="hover:text-indigo-600">📧 Contact</Link>
            <Link href="/terms-of-service" className="hover:text-indigo-600">📋 Terms</Link>
          </div>
          <p className="text-gray-400 text-xs">
            &copy; 2025 Kiddy Learning Hub. Protecting children&apos;s privacy since 2025.
          </p>
        </footer>
      </div>
    </div>
  );
}
