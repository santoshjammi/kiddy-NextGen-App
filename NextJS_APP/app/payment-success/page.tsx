'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useFirebase } from '../../components/FirebaseProvider';

export default function PaymentSuccessPage() {
  const { isPremium, isTrial } = useFirebase();

  // The webhook writes isPremium:true to Firestore → FirebaseProvider picks it up
  // via onSnapshot. If there's a brief delay, the page shows a loading state.
  useEffect(() => {
    // No-op: isPremium will update automatically via the onSnapshot listener
    // in FirebaseProvider once Stripe webhook fires.
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div
        className="bg-white rounded-[24px] p-10 max-w-md w-full text-center flex flex-col gap-6"
        style={{ boxShadow: 'rgba(0,0,0,0.08) 0 5px 9px 0' }}
      >
        {isPremium && !isTrial ? (
          <>
            <div className="text-[64px]">🎉</div>
            <h1 className="text-[28px] font-bold text-black">Welcome to Premium!</h1>
            <p className="text-[#6b6b6b] text-sm leading-relaxed">
              Your subscription is active. Full access to all premium features is unlocked.
            </p>
            <Link href="/parent" className="ps-btn bg-[#0070cc] text-white font-bold hover:bg-[#0060bb] text-center">
              View Your Dashboard →
            </Link>
            <Link href="/" className="text-sm text-[#6b6b6b] hover:text-[#0070cc]">
              Back to games
            </Link>
          </>
        ) : (
          <>
            <div className="text-[64px] animate-pulse">⏳</div>
            <h1 className="text-[28px] font-bold text-black">Activating Premium…</h1>
            <p className="text-[#6b6b6b] text-sm leading-relaxed">
              Your payment was successful. We&apos;re activating your premium access —
              this usually takes just a few seconds.
            </p>
            <p className="text-[#6b6b6b] text-xs">
              If this page doesn&apos;t update, please refresh or contact support.
            </p>
            <div className="w-8 h-8 border-2 border-[#0070cc] border-t-transparent rounded-full animate-spin mx-auto" />
            <Link href="/parent" className="text-sm text-[#0070cc] hover:underline">
              Check dashboard →
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
