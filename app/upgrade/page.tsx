'use client';

import { useState } from 'react';
import Link from 'next/link';
import AuthButton from '../../components/AuthButton';
import { useFirebase } from '../../components/FirebaseProvider';
import { useRewards } from '../../components/useRewards';

// Razorpay billing is enabled once Firebase Functions are deployed with the
// RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET secrets configured.
// Set this to true after running:  firebase deploy --only functions
const RAZORPAY_BILLING_ENABLED = false;



const OUTCOME_TRACKS = [
  {
    icon: '🏆',
    title: '7-Day Math Confidence Challenge',
    body: 'Your child stops avoiding math and starts asking for more problems. Carry-overs, borrowing and place value — built right from the first attempt.',
  },
  {
    icon: '📖',
    title: 'Spelling Champion Program',
    body: 'In 14 days, your child moves from guessing letters to spelling words independently. Daily phonics practice that actually sticks.',
  },
  {
    icon: '🏎️',
    title: 'Multiplication Master Track',
    body: 'Times tables cracked in 3 weeks — no flashcards, no tears. The race-style format makes your child beg to practise.',
  },
];

const COMPARISON = [
  { feature: 'All 21 learning games', free: true, premium: true },
  { feature: 'Parent Dashboard — basic view', free: true, premium: true },
  { feature: 'Reward system (points, badges)', free: true, premium: true },
  { feature: 'Structured 14-Step Learning Path', free: false, premium: true },
  { feature: 'Personalised daily practice plan', free: false, premium: true },
  { feature: 'Weak area detection & analysis', free: false, premium: true },
  { feature: 'Carry & Borrow structured grid', free: false, premium: true },
  { feature: 'Adaptive difficulty per child', free: false, premium: true },
  { feature: 'Session time tracking', free: false, premium: true },
  { feature: 'Weekly progress story', free: false, premium: true },
];

export default function UpgradePage() {
  const { user, isTrial, trialDaysLeft, isPremium } = useFirebase();
  const { startTrial } = useRewards();
  const [trialLoading, setTrialLoading] = useState(false);
  const [trialError, setTrialError] = useState('');
  const [trialStarted, setTrialStarted] = useState(false);
  const [payLoading, setPayLoading] = useState(false);
  const [payError, setPayError] = useState('');

  const handleStartTrial = async () => {
    if (!user) return;
    setTrialLoading(true);
    setTrialError('');
    const result = await startTrial();
    setTrialLoading(false);
    if (result.success) {
      setTrialStarted(true);
    } else if (result.error === 'trial_already_used') {
      setTrialError('Your free trial has already been used on this account.');
    } else {
      setTrialError('Something went wrong. Please try again.');
    }
  };

  const handleSubscribe = async () => {
    if (!user || !RAZORPAY_BILLING_ENABLED) return;
    setPayLoading(true);
    setPayError('');
    try {
      // 1. Create a Razorpay order on the server
      const { getFunctions, httpsCallable } = await import('firebase/functions');
      const { app } = await import('../../firestore');
      const fns = getFunctions(app, 'asia-south1');
      const createOrder = httpsCallable<unknown, { orderId: string; amount: number; currency: string; keyId: string }>(fns, 'createRazorpayOrder');
      const { data } = await createOrder({});

      // 2. Open Razorpay checkout (script loaded in layout or dynamically here)
      const Razorpay = (window as unknown as { Razorpay: new (opts: unknown) => { open(): void } }).Razorpay;
      if (!Razorpay) {
        // Dynamically load the Razorpay script if not already present
        await new Promise<void>((resolve, reject) => {
          const s = document.createElement('script');
          s.src = 'https://checkout.razorpay.com/v1/checkout.js';
          s.onload = () => resolve();
          s.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
          document.head.appendChild(s);
        });
      }
      const rzp = new (window as unknown as { Razorpay: new (opts: unknown) => { open(): void } }).Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'Kiddy Learning',
        description: 'Kiddy Premium — ₹299/month',
        order_id: data.orderId,
        prefill: {
          email: user.email ?? '',
          name: user.displayName ?? '',
        },
        theme: { color: '#0070cc' },
        handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
          // 3. Verify payment on server — activates premium in Firestore
          const verifyPayment = httpsCallable<unknown, { success: boolean }>(fns, 'verifyRazorpayPayment');
          const verify = await verifyPayment(response);
          if (verify.data.success) {
            window.location.href = '/payment-success';
          } else {
            setPayError('Payment verification failed. Please contact support.');
            setPayLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setPayLoading(false);
          },
        },
      });
      rzp.open();
    } catch {
      setPayError('Unable to start checkout. Please try again.');
      setPayLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">

      {/* ── Header ──────────────────────────────────────────── */}
      <header className="bg-black border-b border-[#1a1a1a] sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="ps-btn ps-btn-sm ps-btn-ghost-dark">← Back</Link>
          <h1 className="text-[20px] font-light text-white">Unlock Premium</h1>
          <div className="flex items-center gap-3">
            <Link href="/community" className="text-[#cccccc] text-sm font-medium hover:text-[#1883fd] transition-colors hidden md:block">Community</Link>
            <AuthButton />
          </div>
        </div>
      </header>

      {/* ── Trial active banner ───────────────────────────── */}
      {isTrial && (
        <div className="bg-[#0070cc] text-white text-center py-3 px-6">
          <p className="text-sm font-semibold">
            🎉 Your free trial is active — <span className="font-bold">{trialDaysLeft} day{trialDaysLeft !== 1 ? 's' : ''}</span> remaining
          </p>
        </div>
      )}

      {/* ── Already premium banner ────────────────────────── */}
      {isPremium && !isTrial && (
        <div className="bg-[#003791] text-white text-center py-3 px-6">
          <p className="text-sm font-semibold">✅ You&apos;re on Premium — full access is active</p>
        </div>
      )}

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="bg-black py-16 px-6 text-center border-b border-[#1a1a1a]">
        <div className="max-w-2xl mx-auto flex flex-col gap-6">
          <div className="text-[64px]">🚀</div>
          <h2 className="text-[36px] md:text-[48px] font-bold text-white leading-tight">
            Know your child&apos;s gaps.<br />
            Close them in <span style={{ color: '#0070cc' }}>15 minutes a day</span>.
          </h2>
          <p className="text-[#6b6b6b] text-lg leading-relaxed max-w-xl mx-auto">
            Premium shows you exactly where your child is struggling — then builds a daily plan to fix it.
            Most parents see measurable progress within 2 weeks.
          </p>

          {/* Primary CTA */}
          {!user ? (
            <div className="flex flex-col items-center gap-3">
              <p className="text-[#6b6b6b] text-sm">Sign in to start your free trial</p>
              <AuthButton />
            </div>
          ) : trialStarted ? (
            <div className="flex flex-col items-center gap-3">
              <div className="text-5xl">🎉</div>
              <p className="text-white text-lg font-semibold">7-Day Trial Activated!</p>
              <p className="text-[#6b6b6b] text-sm">You now have full premium access for 7 days.</p>
              <Link href="/parent" className="ps-btn bg-[#0070cc] text-white font-bold hover:bg-[#0060bb]">
                View Dashboard →
              </Link>
            </div>
          ) : isTrial ? (
            <div className="flex flex-col items-center gap-3">
              <p className="text-white/70 text-sm">Trial active — {trialDaysLeft} days remaining</p>
              <Link href="/parent" className="ps-btn bg-[#0070cc] text-white font-bold hover:bg-[#0060bb]">
                Go to Dashboard →
              </Link>
            </div>
          ) : isPremium ? (
            <div className="flex flex-col items-center gap-3">
              <p className="text-white/70 text-sm">You already have premium access</p>
              <Link href="/parent" className="ps-btn bg-[#0070cc] text-white font-bold hover:bg-[#0060bb]">
                View Dashboard →
              </Link>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={handleStartTrial}
                disabled={trialLoading}
                className="ps-btn bg-[#0070cc] text-white font-bold text-lg px-10 py-4 hover:bg-[#0060bb] disabled:opacity-60"
              >
                {trialLoading ? 'Activating...' : 'Start 7-Day Free Trial →'}
              </button>
              <p className="text-[#6b6b6b] text-xs">No credit card needed · One trial per account · Cancel anytime</p>
              {trialError && <p className="text-red-400 text-sm">{trialError}</p>}
              <div className="flex items-center gap-3 mt-2">
                <div className="h-px bg-[#1a1a1a] flex-1" />
                <span className="text-[#6b6b6b] text-xs uppercase tracking-wider">or</span>
                <div className="h-px bg-[#1a1a1a] flex-1" />
              </div>
              {/* Razorpay Checkout */}
              {RAZORPAY_BILLING_ENABLED ? (
                <>
                  <button
                    onClick={handleSubscribe}
                    disabled={payLoading}
                    className="ps-btn bg-[#003791] text-white font-bold hover:bg-[#002a6e] disabled:opacity-60"
                  >
                    {payLoading ? 'Opening checkout...' : 'Subscribe — ₹299/month'}
                  </button>
                  {payError && <p className="text-red-400 text-xs mt-1">{payError}</p>}
                  <p className="text-[#444] text-xs">Secure checkout via Razorpay · Cancel anytime</p>
                </>
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <button
                    disabled
                    className="ps-btn bg-[#0d0d0d] border border-[#1a1a1a] text-[#6b6b6b] cursor-not-allowed opacity-70"
                  >
                    Subscribe — ₹299/month (coming soon)
                  </button>
                  <p className="text-[#444] text-xs text-center">
                    Paid billing is in setup · Start your free 7-day trial above in the meantime
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── Outcome tracks ──────────────────────────────────── */}
      <section className="py-16 px-6 border-b border-[#1a1a1a]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-white text-2xl font-bold text-center mb-10">What your child will achieve</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {OUTCOME_TRACKS.map(({ icon, title, body }) => (
              <div
                key={title}
                className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-[20px] p-6 flex flex-col gap-4"
              >
                <div className="text-[48px]">{icon}</div>
                <h3 className="text-white font-semibold text-lg leading-tight">{title}</h3>
                <p className="text-[#6b6b6b] text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Social proof ─────────────────────────────────────── */}
      <section className="py-12 px-6 border-b border-[#1a1a1a]">
        <div className="max-w-3xl mx-auto">
          <p className="text-[#6b6b6b] text-xs uppercase tracking-widest text-center mb-8">What parents say after 2 weeks</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                quote: 'He used to cry over carry-overs. After two weeks on Kiddy, he shows me how to solve them.',
                name: 'Priya M.',
                detail: 'Parent of a 6-year-old',
              },
              {
                quote: 'I can finally see exactly where she needs help. The dashboard tells me more than her teacher does.',
                name: 'Kartik R.',
                detail: 'Parent of a 5-year-old',
              },
              {
                quote: 'She asks to "do her Kiddy time" before dinner now. That is not something I expected.',
                name: 'Sonal D.',
                detail: 'Parent of a 5-year-old',
              },
            ].map(({ quote, name, detail }) => (
              <div
                key={name}
                className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-[20px] p-5 flex flex-col gap-3"
              >
                <p className="text-[#b0b0b0] text-sm leading-relaxed italic">&ldquo;{quote}&rdquo;</p>
                <div className="mt-auto pt-2 border-t border-[#1a1a1a]">
                  <p className="text-white text-sm font-semibold">{name}</p>
                  <p className="text-[#6b6b6b] text-xs">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Plans comparison ─────────────────────────────────── */}
      <section className="py-16 px-6 border-b border-[#1a1a1a]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-white text-2xl font-bold text-center mb-10">What changes when you upgrade</h2>
          <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-[20px] overflow-hidden">
            <div className="grid grid-cols-3 gap-0 border-b border-[#1a1a1a] bg-black px-6 py-4">
              <span className="text-[#6b6b6b] text-sm font-semibold">Feature</span>
              <span className="text-[#6b6b6b] text-sm font-semibold text-center">Free</span>
              <span className="text-[#0070cc] text-sm font-semibold text-center">Premium</span>
            </div>
            {COMPARISON.map(({ feature, free, premium }) => (
              <div key={feature} className="grid grid-cols-3 gap-0 px-6 py-3.5 border-b border-[#1a1a1a] last:border-0">
                <span className="text-white text-sm">{feature}</span>
                <span className="text-center text-lg">{free ? '✅' : '—'}</span>
                <span className="text-center text-lg">{premium ? '✅' : '—'}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────── */}
      <section className="py-16 px-6 border-b border-[#1a1a1a]">
        <div className="max-w-2xl mx-auto text-center flex flex-col gap-6">
          <h2 className="text-white text-2xl font-bold">Simple pricing</h2>
          <div
            className="bg-[#0d0d0d] border border-[#0070cc]/40 rounded-[24px] p-8 flex flex-col items-center gap-4"
            style={{ boxShadow: 'rgba(0,112,204,0.15) 0 8px 24px 0' }}
          >
            <span className="text-[#0070cc] text-sm font-semibold uppercase tracking-widest">Premium Plan</span>
            <div className="text-[52px] font-bold text-white">
              ₹299<span className="text-lg font-normal text-[#6b6b6b]">/month</span>
            </div>
            <p className="text-[#6b6b6b] text-sm">Full access · Adaptive learning · Parent dashboard · Cancel anytime</p>
            <p className="text-[#0070cc] text-sm font-semibold">Start free for 7 days — no card required</p>
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────── */}
      <section className="py-12 px-6 border-t border-[#1a1a1a]">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-white text-2xl font-bold text-center mb-8">Common questions</h2>
          <div className="flex flex-col gap-4">
            {[
              {
                q: 'What happens after the 7-day trial?',
                a: 'Your trial ends and access returns to the free tier. Billing will be available shortly — you\'ll receive an email when it\'s ready to subscribe.',
              },
              {
                q: 'Can I use it on any device?',
                a: 'Yes — Kiddy works on phones, tablets, and desktops. Progress syncs across devices when signed in.',
              },
              {
                q: 'What age group is this for?',
                a: 'Kiddy is optimised for kindergarten to Grade 2 (ages 4–8). The adaptive difficulty means it grows with your child.',
              },
              {
                q: 'Will my child\'s progress be saved?',
                a: 'Yes. All progress, badges, and streaks are saved automatically when signed in with Google.',
              },
            ].map(({ q, a }) => (
              <div key={q} className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-[16px] p-5">
                <p className="text-white font-semibold mb-2">{q}</p>
                <p className="text-[#6b6b6b] text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer CTA ────────────────────────────────────────── */}
      <footer
        className="py-12 px-6 text-center"
        style={{ background: 'linear-gradient(180deg, #001a4d 0%, #003791 100%)' }}
      >
        <p className="text-white/70 text-sm mb-6">
          Real learning. Measurable results. 15 minutes a day.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          {!user ? (
            <AuthButton />
          ) : !isPremium && !isTrial ? (
            <button
              onClick={handleStartTrial}
              disabled={trialLoading}
              className="ps-btn bg-white text-[#003791] font-bold hover:bg-yellow-50"
            >
              {trialLoading ? 'Activating...' : 'Start Free Trial →'}
            </button>
          ) : isTrial ? (
            <Link href="/parent" className="ps-btn bg-white text-[#003791] font-bold hover:bg-yellow-50">
              Dashboard ({trialDaysLeft}d left) →
            </Link>
          ) : (
            <Link href="/parent" className="ps-btn bg-white text-[#003791] font-bold hover:bg-yellow-50">
              View Dashboard →
            </Link>
          )}
          <Link href="/" className="ps-btn bg-transparent border border-white/40 text-white hover:bg-white/10">
            Explore Free Games
          </Link>
        </div>
      </footer>
    </div>
  );
}

