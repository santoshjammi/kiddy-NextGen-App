'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  collection,
  query,
  orderBy,
  where,
  onSnapshot,
  doc,
  updateDoc,
  setDoc,
  deleteDoc,
  increment,
} from 'firebase/firestore';
import { useFirebase } from '../../components/FirebaseProvider';
import AuthButton from '../../components/AuthButton';
import {
  FeedbackPost,
  categoryLabel,
  CATEGORIES,
  CATEGORY_COLOURS,
  timeAgo,
} from '../../lib/communityTypes';

// ── Category filter pill ────────────────────────────────────────
function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
        active
          ? 'bg-[#0070cc] text-white'
          : 'bg-white text-[#6b6b6b] border border-[#e8e8e8] hover:border-[#0070cc] hover:text-[#0070cc]'
      }`}
    >
      {children}
    </button>
  );
}

// ── Post card ────────────────────────────────────────────────────
function PostCard({
  post,
  onLike,
  liked,
}: {
  post: FeedbackPost;
  onLike: (post: FeedbackPost) => void;
  liked: boolean;
}) {
  const colour = CATEGORY_COLOURS[post.category] ?? '#0070cc';
  return (
    <Link href={`/community/post?id=${post.id}`} className="block group">
      <div
        className="bg-white rounded-[24px] p-6 transition-transform duration-200 group-hover:scale-[1.005]"
        style={{ boxShadow: 'rgba(0,0,0,0.07) 0 4px 8px 0' }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* badges row */}
            <div className="flex items-center gap-2 flex-wrap mb-2">
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
              <span
                className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white"
                style={{ backgroundColor: colour }}
              >
                {categoryLabel(post.category)}
              </span>
            </div>

            <h3 className="text-[17px] font-medium text-black leading-snug mb-1 truncate">
              {post.title}
            </h3>
            <p className="text-[#6b6b6b] text-sm leading-relaxed line-clamp-2">{post.body}</p>
          </div>
        </div>

        {/* footer */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#f3f3f3]">
          <div className="flex items-center gap-3 text-xs text-[#6b6b6b]">
            <span className="font-medium text-black">{post.authorName}</span>
            <span>·</span>
            <span>{post.createdAt ? timeAgo(post.createdAt) : ''}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={(e) => {
                e.preventDefault();
                onLike(post);
              }}
              className={`flex items-center gap-1 text-xs font-medium transition-colors ${
                liked ? 'text-[#0070cc]' : 'text-[#6b6b6b] hover:text-[#0070cc]'
              }`}
            >
              {liked ? '♥' : '♡'} {post.likes}
            </button>
            <span className="flex items-center gap-1 text-xs text-[#6b6b6b]">
              💬 {post.replyCount}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── Page ─────────────────────────────────────────────────────────
export default function CommunityPage() {
  const { user, db } = useFirebase();
  const [posts, setPosts] = useState<FeedbackPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  // Real-time feed
  useEffect(() => {
    const q = query(
      collection(db, 'feedback_posts'),
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(q, (snap) => {
      setPosts(
        snap.docs.map((d) => ({ id: d.id, ...d.data() } as FeedbackPost))
      );
      setLoading(false);
    });
    return () => unsub();
  }, [db]);

  // Load liked post IDs for current user
  useEffect(() => {
    if (!user) { setLikedIds(new Set()); return; }
    const q = query(
      collection(db, 'feedback_votes'),
      where('userId', '==', user.uid)
    );
    const unsub = onSnapshot(q, (snap) => {
      const ids = new Set<string>();
      snap.docs.forEach((d) => ids.add(d.data().postId as string));
      setLikedIds(ids);
    });
    return () => unsub();
  }, [user, db]);

  const handleLike = async (post: FeedbackPost) => {
    if (!user) return;
    const voteId = `${post.id}_${user.uid}`;
    const voteRef = doc(db, 'feedback_votes', voteId);
    const postRef = doc(db, 'feedback_posts', post.id);
    if (likedIds.has(post.id)) {
      await deleteDoc(voteRef);
      await updateDoc(postRef, { likes: increment(-1) });
    } else {
      await setDoc(voteRef, { postId: post.id, userId: user.uid });
      await updateDoc(postRef, { likes: increment(1) });
    }
  };

  const filtered =
    activeFilter === 'all'
      ? posts
      : posts.filter((p) => p.category === activeFilter);

  const pinned = filtered.filter((p) => p.pinned);
  const rest = filtered.filter((p) => !p.pinned);

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      {/* ── Header ──────────────────────────────────────────── */}
      <header className="bg-black sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="ps-btn ps-btn-sm ps-btn-ghost-dark">← Home</Link>
          <span className="text-white font-light text-lg">Community</span>
          <AuthButton />
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-6">

        {/* ── Hero ────────────────────────────────────────── */}
        <div className="bg-black rounded-[24px] px-8 py-10 text-center">
          <div className="text-4xl mb-3">💬</div>
          <h1 className="text-[28px] font-light text-white mb-2 leading-tight">
            Parent Community
          </h1>
          <p className="text-[#6b6b6b] text-sm max-w-sm mx-auto leading-relaxed">
            Share feedback, ask questions, and connect with other parents. The founder reads and replies to every post.
          </p>
          {user ? (
            <Link href="/community/new" className="ps-btn mt-6 inline-flex">
              + Share Feedback
            </Link>
          ) : (
            <p className="text-[#6b6b6b] text-xs mt-5">Sign in to post</p>
          )}
        </div>

        {/* ── Filters ─────────────────────────────────────── */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <FilterPill active={activeFilter === 'all'} onClick={() => setActiveFilter('all')}>
            All
          </FilterPill>
          {CATEGORIES.map((c) => (
            <FilterPill
              key={c.value}
              active={activeFilter === c.value}
              onClick={() => setActiveFilter(c.value)}
            >
              {c.label}
            </FilterPill>
          ))}
        </div>

        {/* ── Skeleton loading ─────────────────────────────── */}
        {loading && (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-[24px] p-6 animate-pulse"
                style={{ boxShadow: 'rgba(0,0,0,0.07) 0 4px 8px 0' }}
              >
                <div className="flex gap-2 mb-3">
                  <div className="h-4 w-20 bg-[#e8e8e8] rounded-full" />
                  <div className="h-4 w-16 bg-[#e8e8e8] rounded-full" />
                </div>
                <div className="h-5 w-3/4 bg-[#e8e8e8] rounded-lg mb-2" />
                <div className="h-4 w-full bg-[#f3f3f3] rounded-lg mb-1" />
                <div className="h-4 w-2/3 bg-[#f3f3f3] rounded-lg mb-5" />
                <div className="flex justify-between pt-3 border-t border-[#f3f3f3]">
                  <div className="h-3 w-24 bg-[#e8e8e8] rounded-full" />
                  <div className="h-3 w-12 bg-[#e8e8e8] rounded-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Pinned posts ─────────────────────────────────── */}
        {!loading && pinned.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#6b6b6b] mb-3 px-1">
              Founder Updates
            </h2>
            <div className="flex flex-col gap-4">
              {pinned.map((p) => (
                <PostCard key={p.id} post={p} onLike={handleLike} liked={likedIds.has(p.id)} />
              ))}
            </div>
          </section>
        )}

        {/* ── All posts ───────────────────────────────────── */}
        {!loading && (
          <section>
            {pinned.length > 0 && (
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#6b6b6b] mb-3 px-1">
                Latest Posts
              </h2>
            )}
            {rest.length === 0 && pinned.length === 0 ? (
              <div className="bg-white rounded-[24px] p-10 text-center"
                   style={{ boxShadow: 'rgba(0,0,0,0.07) 0 4px 8px 0' }}>
                <div className="text-4xl mb-3">🌱</div>
                <p className="text-[#6b6b6b] text-sm">No posts yet. Be the first to share!</p>
                {user && (
                  <Link href="/community/new" className="ps-btn ps-btn-sm mt-4 inline-flex">
                    Start the conversation
                  </Link>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {rest.map((p) => (
                  <PostCard key={p.id} post={p} onLike={handleLike} liked={likedIds.has(p.id)} />
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
