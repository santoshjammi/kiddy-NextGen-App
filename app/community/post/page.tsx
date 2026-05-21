'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  doc,
  getDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  serverTimestamp,
  increment,
} from 'firebase/firestore';
import { useFirebase } from '../../../components/FirebaseProvider';
import AuthButton from '../../../components/AuthButton';
import {
  FeedbackPost,
  FeedbackReply,
  categoryLabel,
  CATEGORY_COLOURS,
  timeAgo,
} from '../../../lib/communityTypes';

const FOUNDER_EMAIL = process.env.NEXT_PUBLIC_FOUNDER_EMAIL ?? '';

function isFounderUser(email: string | null | undefined): boolean {
  return !!FOUNDER_EMAIL && email === FOUNDER_EMAIL;
}

// ── Reply card ──────────────────────────────────────────────────
function ReplyCard({ reply }: { reply: FeedbackReply }) {
  const isFounderReply = reply.role === 'founder';
  return (
    <div
      className={`rounded-[18px] px-5 py-4 ${
        isFounderReply
          ? 'bg-[#f0f7ff] border border-[#bfdbfe]'
          : 'bg-white border border-[#f3f3f3]'
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-semibold text-black">{reply.authorName}</span>
        {isFounderReply && (
          <span className="text-[10px] font-bold uppercase tracking-wider bg-[#0070cc] text-white px-2 py-0.5 rounded-full">
            👋 Founder
          </span>
        )}
        <span className="text-xs text-[#6b6b6b] ml-auto">
          {reply.createdAt ? timeAgo(reply.createdAt) : ''}
        </span>
      </div>
      <p className="text-sm text-[#1f1f1f] leading-relaxed whitespace-pre-wrap">{reply.message}</p>
    </div>
  );
}

// ── Main thread component (uses useSearchParams) ────────────────
function PostThread() {
  const searchParams = useSearchParams();
  const postId = searchParams.get('id') ?? '';
  const { user, db } = useFirebase();

  const [post, setPost] = useState<FeedbackPost | null>(null);
  const [replies, setReplies] = useState<FeedbackReply[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const founder = isFounderUser(user?.email);

  useEffect(() => {
    if (!postId) { setNotFound(true); setLoading(false); return; }
    getDoc(doc(db, 'feedback_posts', postId)).then((snap) => {
      if (!snap.exists()) { setNotFound(true); setLoading(false); return; }
      setPost({ id: snap.id, ...snap.data() } as FeedbackPost);
      setLoading(false);
    });
  }, [postId, db]);

  useEffect(() => {
    if (!postId) return;
    const q = query(
      collection(db, 'feedback_posts', postId, 'replies'),
      orderBy('createdAt', 'asc')
    );
    const unsub = onSnapshot(q, (snap) => {
      setReplies(snap.docs.map((d) => ({ id: d.id, ...d.data() } as FeedbackReply)));
    });
    return () => unsub();
  }, [postId, db]);

  const handleReply = async () => {
    if (!user || !replyText.trim() || !postId) return;
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'feedback_posts', postId, 'replies'), {
        authorId: user.uid,
        authorName: user.displayName ?? user.email ?? 'Parent',
        role: founder ? 'founder' : 'parent',
        message: replyText.trim(),
        createdAt: serverTimestamp(),
      });
      await updateDoc(doc(db, 'feedback_posts', postId), {
        replyCount: increment(1),
      });
      setReplyText('');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePin = async () => {
    if (!founder || !postId || !post) return;
    await updateDoc(doc(db, 'feedback_posts', postId), { pinned: !post.pinned });
    setPost((p) => p ? { ...p, pinned: !p.pinned } : p);
  };

  const handleResolve = async () => {
    if (!founder || !postId || !post) return;
    await updateDoc(doc(db, 'feedback_posts', postId), { resolved: !post.resolved });
    setPost((p) => p ? { ...p, resolved: !p.resolved } : p);
  };

  const handleLock = async () => {
    if (!founder || !postId || !post) return;
    await updateDoc(doc(db, 'feedback_posts', postId), { locked: !post.locked });
    setPost((p) => p ? { ...p, locked: !p.locked } : p);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-[#0070cc] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="bg-white rounded-[24px] p-10 text-center"
           style={{ boxShadow: 'rgba(0,0,0,0.07) 0 4px 8px 0' }}>
        <div className="text-4xl mb-3">🔍</div>
        <p className="text-[#6b6b6b] text-sm mb-4">This post was not found.</p>
        <Link href="/community" className="ps-btn ps-btn-sm inline-flex">← Back to Community</Link>
      </div>
    );
  }

  const colour = CATEGORY_COLOURS[post.category] ?? '#0070cc';
  const locked = post.locked;

  return (
    <div className="flex flex-col gap-6">
      {/* ── Original post ───────────────────────────────── */}
      <div className="bg-white rounded-[24px] p-7 md:p-8"
           style={{ boxShadow: 'rgba(0,0,0,0.07) 0 4px 8px 0' }}>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {post.pinned && (
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#003791] text-white px-2 py-0.5 rounded-full">
              📌 Pinned
            </span>
          )}
          {post.resolved && (
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#dcfce7] text-[#16a34a] px-2 py-0.5 rounded-full">
              ✅ Resolved
            </span>
          )}
          {post.locked && (
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#fef9c3] text-[#854d0e] px-2 py-0.5 rounded-full">
              🔒 Locked
            </span>
          )}
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white"
            style={{ backgroundColor: colour }}
          >
            {categoryLabel(post.category)}
          </span>
        </div>

        <h1 className="text-[22px] md:text-[26px] font-medium text-black leading-snug mb-3">
          {post.title}
        </h1>
        <p className="text-[#1f1f1f] text-[15px] leading-relaxed whitespace-pre-wrap mb-5">
          {post.body}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-[#f3f3f3]">
          <div className="flex items-center gap-2 text-xs text-[#6b6b6b]">
            <span className="font-semibold text-black">{post.authorName}</span>
            <span>·</span>
            <span>{post.createdAt ? timeAgo(post.createdAt) : ''}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-[#6b6b6b]">
            <span>♡ {post.likes}</span>
            <span>💬 {post.replyCount}</span>
          </div>
        </div>
      </div>

      {/* ── Founder controls ────────────────────────────── */}
      {founder && (
        <div className="bg-[#fffbeb] border border-[#fde68a] rounded-[18px] px-5 py-4">
          <p className="text-xs font-bold uppercase tracking-widest text-[#92400e] mb-3">
            Founder Controls
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handlePin}
              className={`ps-btn ps-btn-sm ${post.pinned ? 'bg-[#003791]' : 'ps-btn-ghost'}`}
            >
              {post.pinned ? '📌 Unpin' : '📌 Pin'}
            </button>
            <button
              onClick={handleResolve}
              className={`ps-btn ps-btn-sm ${post.resolved ? 'bg-[#16a34a]' : 'ps-btn-ghost'}`}
            >
              {post.resolved ? '✅ Unresolve' : '✅ Resolve'}
            </button>
            <button
              onClick={handleLock}
              className={`ps-btn ps-btn-sm ${post.locked ? 'bg-[#854d0e]' : 'ps-btn-ghost'}`}
            >
              {post.locked ? '🔒 Unlock' : '🔒 Lock thread'}
            </button>
          </div>
        </div>
      )}

      {/* ── Replies ─────────────────────────────────────── */}
      {replies.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#6b6b6b] mb-3 px-1">
            {replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}
          </h2>
          <div className="flex flex-col gap-3">
            {replies.map((r) => (
              <ReplyCard key={r.id} reply={r} />
            ))}
          </div>
        </section>
      )}

      {/* ── Reply editor ────────────────────────────────── */}
      {!locked && (
        <div className="bg-white rounded-[24px] p-6"
             style={{ boxShadow: 'rgba(0,0,0,0.07) 0 4px 8px 0' }}>
          {user ? (
            <>
              <p className="text-sm font-semibold text-black mb-3">
                {founder ? '👋 Reply as Founder' : 'Leave a reply'}
              </p>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={4}
                maxLength={1000}
                placeholder={founder ? 'Write your founder response…' : 'Share your thoughts…'}
                className="w-full border border-[#e8e8e8] rounded-[12px] px-4 py-3 text-sm text-black
                           focus:outline-none focus:border-[#0070cc] transition-colors resize-none mb-3"
              />
              <button
                onClick={handleReply}
                disabled={submitting || !replyText.trim()}
                className="ps-btn ps-btn-sm"
              >
                {submitting ? 'Posting…' : 'Post Reply →'}
              </button>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-[#6b6b6b] text-sm mb-4">Sign in to join the conversation.</p>
              <AuthButton />
            </div>
          )}
        </div>
      )}

      {locked && (
        <p className="text-center text-xs text-[#6b6b6b] py-2">🔒 This thread is locked.</p>
      )}
    </div>
  );
}

// ── Page wrapper (Suspense required for useSearchParams in static export) ──
export default function PostPage() {
  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <header className="bg-black sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/community" className="ps-btn ps-btn-sm ps-btn-ghost-dark">← Community</Link>
          <span className="text-white font-light text-lg">Thread</span>
          <AuthButton />
        </div>
      </header>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Suspense
          fallback={
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-[#0070cc] border-t-transparent rounded-full animate-spin" />
            </div>
          }
        >
          <PostThread />
        </Suspense>
      </div>
    </div>
  );
}
