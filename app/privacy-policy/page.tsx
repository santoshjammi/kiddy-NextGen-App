'use client';

import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      {/* Header */}
      <header className="bg-black sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="ps-btn ps-btn-sm ps-btn-ghost-dark">← Home</Link>
          <span className="text-white font-light text-lg">Privacy Policy</span>
          <div className="w-24" />
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-[42px] font-light text-black leading-tight mb-2">
          Privacy Policy
        </h1>
        <p className="text-sm text-[#6b6b6b] mb-12">Last updated: May 2026</p>

        <div className="flex flex-col gap-8">

          {/* 1. Who we are */}
          <div className="bg-white rounded-[24px] p-8" style={{ boxShadow: 'rgba(0,0,0,0.07) 0 4px 8px 0' }}>
            <h2 className="text-[22px] font-semibold text-black mb-3">Who We Are</h2>
            <p className="text-sm text-[#1f1f1f] leading-relaxed">
              Kiddy Learning Hub is a structured learning platform for children ages 4–9, helping them build foundations in maths and English through short daily practice sessions. The platform is operated by an independent founder — not a corporation. Questions about this policy can be sent to{' '}
              <a href="mailto:countrysnews@gmail.com" className="text-[#0070cc] hover:underline">countrysnews@gmail.com</a>.
            </p>
          </div>

          {/* 2. What we collect */}
          <div className="bg-white rounded-[24px] p-8" style={{ boxShadow: 'rgba(0,0,0,0.07) 0 4px 8px 0' }}>
            <h2 className="text-[22px] font-semibold text-black mb-4">What We Collect</h2>
            <p className="text-sm text-[#6b6b6b] mb-6">We collect only what is needed to provide a personalised learning experience.</p>
            <div className="flex flex-col gap-6">
              <div>
                <h3 className="text-sm font-semibold text-black mb-2">When you sign in with Google (optional)</h3>
                <ul className="text-sm text-[#1f1f1f] leading-relaxed space-y-1.5 pl-3">
                  <li>• Your name, email address, and profile photo — provided by Google.</li>
                  <li>• We do not store your password. Authentication is handled entirely by Google Firebase.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-black mb-2">Your child&apos;s learning data (stored in Firebase Firestore, linked to your account)</h3>
                <ul className="text-sm text-[#1f1f1f] leading-relaxed space-y-1.5 pl-3">
                  <li>• Progress per subject — mastery score, current difficulty level.</li>
                  <li>• Session history — subject practised, duration in minutes, date.</li>
                  <li>• Rewards — points earned, badges unlocked, streak count.</li>
                  <li>• Community posts and replies, if you use the community feature.</li>
                  <li>• Screenshot images uploaded to community posts (stored in Firebase Storage).</li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-black mb-2">Anonymous usage data (Google Analytics)</h3>
                <ul className="text-sm text-[#1f1f1f] leading-relaxed space-y-1.5 pl-3">
                  <li>• Page views, device type, country — not linked to your account.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 3. What we don't collect */}
          <div className="bg-white rounded-[24px] p-8" style={{ boxShadow: 'rgba(0,0,0,0.07) 0 4px 8px 0' }}>
            <h2 className="text-[22px] font-semibold text-black mb-4">What We Don&apos;t Collect</h2>
            <ul className="text-sm text-[#1f1f1f] leading-relaxed space-y-3">
              <li className="flex gap-2"><span className="text-green-600 shrink-0">✓</span> We do not collect children&apos;s personal information directly — parents create and manage accounts.</li>
              <li className="flex gap-2"><span className="text-green-600 shrink-0">✓</span> We do not run ads or sell data to advertisers. Kiddy is funded by subscriptions only.</li>
              <li className="flex gap-2"><span className="text-green-600 shrink-0">✓</span> We do not store payment card details — payments are processed securely by Stripe.</li>
              <li className="flex gap-2"><span className="text-green-600 shrink-0">✓</span> We do not share your data with third parties beyond what is listed in this policy.</li>
            </ul>
          </div>

          {/* 4. How we use your data */}
          <div className="bg-white rounded-[24px] p-8" style={{ boxShadow: 'rgba(0,0,0,0.07) 0 4px 8px 0' }}>
            <h2 className="text-[22px] font-semibold text-black mb-4">How We Use Your Data</h2>
            <ul className="text-sm text-[#1f1f1f] leading-relaxed space-y-3">
              <li className="flex gap-2"><span className="text-[#0070cc] shrink-0">→</span> Power the Parent Dashboard — show progress stats, weekly consistency, and recommended focus areas.</li>
              <li className="flex gap-2"><span className="text-[#0070cc] shrink-0">→</span> Track learning streaks and award badges as your child reaches milestones.</li>
              <li className="flex gap-2"><span className="text-[#0070cc] shrink-0">→</span> Adapt difficulty automatically as your child improves.</li>
              <li className="flex gap-2"><span className="text-[#0070cc] shrink-0">→</span> Display and respond to community posts and feedback.</li>
            </ul>
          </div>

          {/* 5. Children's privacy */}
          <div className="bg-white rounded-[24px] p-8" style={{ boxShadow: 'rgba(0,0,0,0.07) 0 4px 8px 0' }}>
            <h2 className="text-[22px] font-semibold text-black mb-3">Children&apos;s Privacy</h2>
            <p className="text-sm text-[#1f1f1f] leading-relaxed">
              Kiddy is used by children under the supervision of a parent or guardian. Parents — not children — create and manage accounts. We do not knowingly allow children under 13 to create accounts independently. If you believe a child has registered without parental consent, contact us and we will delete the account promptly.
            </p>
          </div>

          {/* 6. Third parties */}
          <div className="bg-white rounded-[24px] p-8" style={{ boxShadow: 'rgba(0,0,0,0.07) 0 4px 8px 0' }}>
            <h2 className="text-[22px] font-semibold text-black mb-4">Third-Party Services</h2>
            <div className="flex flex-col gap-3">
              {[
                { name: 'Firebase (Google)', role: 'Authentication and database hosting.', url: 'https://firebase.google.com/support/privacy' },
                { name: 'Stripe', role: 'Subscription payment processing.', url: 'https://stripe.com/privacy' },
                { name: 'Google Analytics', role: 'Anonymous usage statistics.', url: 'https://policies.google.com/privacy' },
              ].map((t) => (
                <div key={t.name} className="flex items-start gap-4 bg-[#f5f7fa] rounded-[12px] px-4 py-3">
                  <span className="text-sm font-semibold text-black shrink-0 w-40">{t.name}</span>
                  <span className="text-sm text-[#6b6b6b]">{t.role}{' '}
                    <a href={t.url} target="_blank" rel="noopener noreferrer" className="text-[#0070cc] hover:underline">Privacy policy ↗</a>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 7. Data deletion */}
          <div className="bg-white rounded-[24px] p-8" style={{ boxShadow: 'rgba(0,0,0,0.07) 0 4px 8px 0' }}>
            <h2 className="text-[22px] font-semibold text-black mb-3">Your Rights &amp; Data Deletion</h2>
            <p className="text-sm text-[#1f1f1f] leading-relaxed mb-3">
              You can stop using Kiddy at any time. To request deletion of all your account data, email{' '}
              <a href="mailto:countrysnews@gmail.com?subject=Delete my account" className="text-[#0070cc] hover:underline">countrysnews@gmail.com</a>{' '}
              with the subject <em>&quot;Delete my account&quot;</em>. We will process it within 7 days.
            </p>
            <p className="text-sm text-[#6b6b6b]">Google Analytics data is anonymised and cannot be individually deleted.</p>
          </div>

          {/* 8. Questions */}
          <div className="bg-[#f0f7ff] border border-[#bfdbfe] rounded-[24px] p-8 text-center">
            <h2 className="text-[22px] font-semibold text-black mb-2">Questions?</h2>
            <p className="text-sm text-[#6b6b6b] mb-5">We&apos;re happy to answer any questions about how your data is handled.</p>
            <a
              href="mailto:countrysnews@gmail.com?subject=Privacy Question"
              className="ps-btn inline-flex"
            >
              Email Us →
            </a>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer style={{ backgroundColor: '#003791' }} className="text-white py-10 mt-16">
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap justify-between items-center gap-4">
          <span className="font-light">Kiddy Learning Hub</span>
          <div className="flex gap-8 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
