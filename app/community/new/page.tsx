'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  collection,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { useFirebase } from '../../../components/FirebaseProvider';
import AuthButton from '../../../components/AuthButton';
import { CATEGORIES } from '../../../lib/communityTypes';

export default function NewPostPage() {
  const { user, db, loading: authLoading } = useFirebase();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [body, setBody] = useState('');
  const [childAge, setChildAge] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!title.trim() || !category || !body.trim()) {
      setError('Please fill in the title, category, and message.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await addDoc(collection(db, 'feedback_posts'), {
        userId: user.uid,
        authorName: user.displayName ?? user.email ?? 'Parent',
        title: title.trim().slice(0, 120),
        category,
        body: body.trim().slice(0, 1000),
        ...(childAge ? { childAge } : {}),
        likes: 0,
        replyCount: 0,
        resolved: false,
        pinned: false,
        locked: false,
        createdAt: serverTimestamp(),
      });
      router.push('/community');
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#0070cc] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="bg-white rounded-[24px] p-10 max-w-md w-full text-center"
             style={{ boxShadow: 'rgba(0,0,0,0.08) 0 5px 9px 0' }}>
          <div className="text-4xl mb-4">🔒</div>
          <h2 className="text-[24px] font-light text-black mb-3">Sign in to post</h2>
          <p className="text-[#6b6b6b] text-sm mb-6">
            Only signed-in parents can share feedback with the community.
          </p>
          <AuthButton />
          <Link href="/community" className="block mt-4 text-sm text-[#6b6b6b] hover:text-[#0070cc]">
            ← Back to community
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      {/* ── Header ──────────────────────────────────────────── */}
      <header className="bg-black sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/community" className="ps-btn ps-btn-sm ps-btn-ghost-dark">← Back</Link>
          <span className="text-white font-light text-lg">New Post</span>
          <AuthButton />
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white rounded-[24px] p-8 md:p-10"
             style={{ boxShadow: 'rgba(0,0,0,0.07) 0 4px 8px 0' }}>
          <h1 className="text-[26px] font-light text-black mb-1">Share Feedback</h1>
          <p className="text-[#6b6b6b] text-sm mb-8">
            The founder reads every post and replies directly. Be as specific as you like.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-black mb-1.5">
                Title <span className="text-[#d53b00]">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={120}
                placeholder="What's on your mind?"
                className="w-full border border-[#e8e8e8] rounded-[12px] px-4 py-3 text-sm text-black
                           focus:outline-none focus:border-[#0070cc] transition-colors"
              />
              <p className="text-[11px] text-[#6b6b6b] mt-1 text-right">{title.length}/120</p>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-black mb-1.5">
                Category <span className="text-[#d53b00]">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-[#e8e8e8] rounded-[12px] px-4 py-3 text-sm text-black
                           focus:outline-none focus:border-[#0070cc] transition-colors bg-white"
              >
                <option value="">Select a category…</option>
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-semibold text-black mb-1.5">
                Message <span className="text-[#d53b00]">*</span>
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                maxLength={1000}
                rows={6}
                placeholder="Tell us more — the more detail you share, the better we can help."
                className="w-full border border-[#e8e8e8] rounded-[12px] px-4 py-3 text-sm text-black
                           focus:outline-none focus:border-[#0070cc] transition-colors resize-none"
              />
              <p className="text-[11px] text-[#6b6b6b] mt-1 text-right">{body.length}/1000</p>
            </div>

            {/* Child age (optional) */}
            <div>
              <label className="block text-sm font-semibold text-black mb-1.5">
                Child&apos;s age <span className="text-[#6b6b6b] font-normal">(optional)</span>
              </label>
              <select
                value={childAge}
                onChange={(e) => setChildAge(e.target.value)}
                className="w-full border border-[#e8e8e8] rounded-[12px] px-4 py-3 text-sm text-black
                           focus:outline-none focus:border-[#0070cc] transition-colors bg-white"
              >
                <option value="">Prefer not to say</option>
                {[3, 4, 5, 6, 7, 8].map((age) => (
                  <option key={age} value={age.toString()}>{age} years old</option>
                ))}
              </select>
            </div>

            {error && (
              <p className="text-sm text-[#d53b00] bg-[#fff5f5] rounded-[12px] px-4 py-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="ps-btn w-full justify-center py-4 text-[1rem]"
            >
              {submitting ? 'Posting…' : 'Post to Community →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
