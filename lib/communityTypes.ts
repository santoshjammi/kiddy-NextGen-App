import { Timestamp } from 'firebase/firestore';

export interface FeedbackPost {
  id: string;
  userId: string;
  authorName: string;
  title: string;
  category: string;
  body: string;
  likes: number;
  replyCount: number;
  resolved: boolean;
  pinned: boolean;
  locked: boolean;
  createdAt: Timestamp;
  screenshotUrl?: string;
  childAge?: string;
}

export interface FeedbackReply {
  id: string;
  authorId: string;
  authorName: string;
  role: 'parent' | 'founder';
  message: string;
  createdAt: Timestamp;
}

export const CATEGORIES: { value: string; label: string; founderOnly?: boolean }[] = [
  { value: 'feature_request', label: 'Feature Request' },
  { value: 'bug', label: 'Bug Report' },
  { value: 'learning_issue', label: 'Learning Issue' },
  { value: 'parent_suggestion', label: 'Parent Suggestion' },
  { value: 'app_experience', label: 'App Experience' },
  { value: 'game_feedback', label: 'Game Feedback' },
  { value: 'announcement', label: 'Announcement', founderOnly: true },
];

export function categoryLabel(value: string): string {
  return CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

export function timeAgo(ts: Timestamp): string {
  const now = Date.now();
  const ms = ts.toMillis();
  const diff = Math.floor((now - ms) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export const CATEGORY_COLOURS: Record<string, string> = {
  feature_request: '#7c3aed',
  bug: '#d53b00',
  learning_issue: '#0891b2',
  parent_suggestion: '#16a34a',
  app_experience: '#f59e0b',
  game_feedback: '#0070cc',
  announcement: '#003791',
};
