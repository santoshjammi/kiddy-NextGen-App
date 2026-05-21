# Kiddy Learning Engine — Project Status

**Last updated:** 28 April 2026  
**Branch:** `phase02` → `santoshjammi/kiddy`  
**Deploy copy:** `santoshjammi/kiddy-NextGen-App` (main)  
**App root:** `NextJS_APP/`

---

## What Is Kiddy? (Context for ChatGPT)

Kiddy is a **parent-paid structured learning platform** for children ages 4–9.  
It focuses on foundational **Math + English** through short daily practice sessions.

**Business model:** Parents pay for measurable improvement and visible progress reports — not for games.  
**Core purchase sentence:** *"Your child improves addition, subtraction, multiplication, and spelling through 15 minutes of daily practice — with visible progress tracking for parents."*

**Tech stack:** Next.js 15.1.3 (App Router, static export) · Firebase Auth (Google) · Cloud Firestore · Tailwind CSS 3.4 · TypeScript 5  
**Deployment:** Hostinger Node.js — `server.js` serves the `out/` static build. Firebase project: `kiddy-7badf`.  
**PRD reference:** `docs/PRD-MVP.MD` defines all phases and priorities.

---

## Tech Stack

| Layer | Detail |
|---|---|
| Framework | Next.js 15.1.3, App Router, `output: 'export'` → static `out/` |
| Auth | Firebase Auth — Google sign-in |
| Database | Cloud Firestore (`kiddy-7badf`) |
| Styling | Tailwind CSS 3.4 + custom PS design system |
| Language | TypeScript 5 |
| Deploy | Hostinger Node.js, `npm start` → `node server.js` |
| Node version | 20 (`.nvmrc`) |
| Design tokens | `bg-black` headers · `rounded-[24px]` white cards · `#0070cc` blue · `#003791` cobalt |

---

## All Routes — 34 total

### PRD Core Engines
| Route | Status | Notes |
|---|---|---|
| `/math` | ✅ Complete | `MathEngine` — 5 difficulty levels, adaptive +/−/× problems, `useSubjectProgress` wired |
| `/english` | ✅ Complete | `EnglishEngine` — **5 levels**: 2-letter words → 3-letter CVC → 4-letter scramble → 5-letter Wordle → **sentence fill-in-blank** |
| `/carry-borrow` | ✅ Complete | Carry & Borrow Grid, 5 levels, H/T/U column labels, vinculum line, `useRewards` wired |
| `/missing-letter` | ✅ Complete | 3 levels: CVC vowel blank → 4-letter → 5-letter words |
| `/letter-fishing` | ✅ Complete | **Drag-and-drop** tile + hook UI. Web Speech API auto-plays. 3 levels. |
| `/multiplication-race` | ✅ Complete | Timed race (20s), 4-choice answers, colour timer bar, local high score, 4 difficulty bands (×1–×5 → ×2–×12) |
| `/division-splitter` | ✅ Complete | Visual group reveal, word story context, 4 levels (÷2–÷3 → ÷2–÷12) |

### Parent + Premium
| Route | Status | Notes |
|---|---|---|
| `/parent` | ✅ Complete | 5-stat summary strip (problems, today mins, days/week, weekly mins, streak) · **Recommended Today** (premium — blurred + overlay gate) · Subject progress cards · **Needs Practice** (premium — blurred + overlay gate) · Strengths · Rewards |
| `/learning-path` | ✅ Complete | **14-step** path (includes Multiplication Race + Division Splitter) · **Hard gate**: free users get a full-page Premium upgrade screen — no bypass |
| `/rewards` | ✅ Complete | Points total, progress ring, streak counter, 14 earned/locked badges grid |
| `/upgrade` | ✅ Complete | Free vs Premium plan cards (₹299/mo), waitlist CTA with inline state, FAQ |

### Games (pre-PRD, fully functional)
| Route | Status | Notes |
|---|---|---|
| `/alphabet` | ✅ Complete | 26 letters, phonics |
| `/numbers` | ✅ Complete | 1–100 counting |
| `/shapes` | ✅ Complete | 9 shapes, oval/hexagon clip-path fixed |
| `/colors` | ✅ Complete | 12 colors |
| `/counting` | ✅ Complete | |
| `/memory-match` | ✅ Complete | Flip-card pairs |
| `/spelling` | ✅ Complete | |
| `/rhyming` | ✅ Complete | |
| `/patterns` | ✅ Complete | Emoji sequence logic |
| `/sight-words` | ✅ Complete | High-frequency flash cards |
| `/animals` | ✅ Complete | |
| `/sentences` | ✅ Complete | Scrambled word builder |
| `/time` | ✅ Complete | Analog clock reading |
| `/tracing` | ✅ Complete | Letter/number tracing |

### Static / Support Pages
| Route | Status |
|---|---|
| `/` (home) | ✅ 21-game grid, nav to dashboard/learning-path/rewards/upgrade |
| `/about` | ✅ |
| `/contact` | ✅ |
| `/privacy-policy` | ✅ |
| `/terms-of-service` | ✅ |
| `/profile` | ✅ |

---

## Core Components

| File | Status | What It Does |
|---|---|---|
| `components/FirebaseProvider.tsx` | ✅ | Auth context, `user`, `isPremium` (reads `users/{uid}/rewards/current`) |
| `components/useRewards.ts` | ✅ | 14 badges, points, streaks, `recordCorrect()`, `logSession()` (writes `durationMinutes` to `sessions` subcollection) |
| `components/useSubjectProgress.ts` | ✅ | Per-subject mastery 0–100, difficulty 1–5, auto level-up at 90%, writes to `users/{uid}/progress/{subject}` |
| `components/math/MathEngine.tsx` | ✅ | 5-level adaptive problem generator (+/−/×) |
| `components/math/VisualBlocks.tsx` | ✅ | Visual block illustrations for problems |
| `components/math/ColumnGrid.tsx` | ✅ | Column arithmetic layout |
| `components/math/WordProblem.tsx` | ✅ | Word problem UI component |
| `components/english/EnglishEngine.tsx` | ✅ | **5-level** engine: LetterBlocks → MissingVowel → WordScramble → WordleGame → SentenceChoose |
| `components/AuthButton.tsx` | ✅ | Google sign-in/out |
| `server.js` | ✅ | Zero-dep Node.js static server for Hostinger (path traversal safe, `process.env.PORT`, SPA fallback) |

---

## Firestore Schema

```
users/{uid}                          ← user profile (name, email, role, createdAt)
users/{uid}/rewards/current          ← points, badges[], streakDays, isPremium, lastSessionDate
users/{uid}/progress/{subject}       ← mastery_score, difficulty_level, recent_struggles, total_problems_solved
users/{uid}/sessions/{id}            ← subject, durationMinutes, completedModules, date, createdAt
```

**Security rules:** Deployed to `kiddy-7badf` — `users/{userId}/**` read/write only if `auth.uid == userId`.

---

## PRD Phase 1 — ✅ All Complete

| PRD Item (from PRD-MVP.MD § 14) | Status |
|---|---|
| Next.js migration | ✅ |
| Firebase Auth + Firestore schema | ✅ |
| Parent Dashboard | ✅ + time spent + weekly consistency added |
| MathEngine | ✅ |
| EnglishEngine | ✅ + Level 5 sentence builder added |
| Carry & Borrow Grid | ✅ |
| Missing Letter Game | ✅ |
| Basic Premium Upgrade Flow | ✅ (waitlist CTA — no live billing yet) |

---

## PRD Phase 2 — Partially Done

| Item | Status | Notes |
|---|---|---|
| Premium gating — Learning Path | ✅ **Hard gate** | Free users see full-page Premium redirect. No bypass. |
| Premium gating — Parent Dashboard | ✅ **Soft gate** | "Recommended Today" + "Needs Practice" sections are blurred with overlay + upgrade CTA. All other sections visible. |
| Multiplication Race game | ✅ **Built** | `/multiplication-race` — timed rounds, local high score |
| Division Splitter game | ✅ **Built** | `/division-splitter` — visual group reveal |
| Billing integration (Stripe) | ❌ **Not started** | `/upgrade` shows waitlist only. No checkout flow. `isPremium` must be flipped manually in Firestore. |
| Advanced progression / adaptive difficulty | ⚠️ **Basic only** | `useSubjectProgress` auto-levels at 90% mastery (linear). No weak-area adaptive re-routing. |

---

## PRD Phase 3 — ❌ Not Started (Excluded from MVP)

These items exist in the PRD but are explicitly out of scope until Phase 3:

| Item | Notes |
|---|---|
| AI-generated exercises | Excluded from MVP |
| Teacher portal | Excluded from MVP |
| Advanced analytics (full ParentAnalyticsEngine) | Excluded from MVP |
| Stripe subscription automation | Excluded from MVP |
| Push notifications | Excluded from MVP |
| Multiplayer / social competition | Excluded from MVP |
| Printable worksheet engine | Excluded from MVP |

---

## Remaining Real Gaps

Items that are PRD requirements but still not fully implemented:

| Gap | Detail | Priority |
|---|---|---|
| **Stripe billing** | `/upgrade` is waitlist-only. No payment flow exists. `isPremium` must be set manually in Firestore console. | 🔴 High — blocks monetisation |
| **Hard gate on `/parent`** | Currently soft gates (blur + overlay on 2 sections). Parent dashboard itself is not blocked for free users. Consider whether full-page gate is desired here or keep soft. | 🟡 Medium |
| **Session duration tracking in games** | Only `/carry-borrow` calls `logSession()`. All other games (math, english, letter-fishing, etc.) do not log `durationMinutes`. Parent dashboard "Today (min)" will always show 0 for those games. | 🟡 Medium |
| **Weak-area adaptive routing** | `useSubjectProgress` records `recent_struggles` but no engine re-routes the child to their weakest area automatically. Parent dashboard reads weak areas but there is no in-session targeting. | 🟡 Medium |
| **`/parent` shows only 3 subjects** | Dashboard tracks `carry-borrow`, `mathematics`, `english`. New subjects (`multiplication`, `division`) are not shown in Subject Progress cards. | 🟡 Medium |
| **EnglishEngine level cap display** | Header says `level < 5` for level-up hint but now there are 5 levels — cap should move to `level < 5` (already correct) but level 5 label says "Sentence Builder" rather than the level-up banner going away. Minor UI polish. | 🟢 Low |

---

## Deployment State

| Item | Status |
|---|---|
| `out/` static build | ✅ Built (committed) |
| `server.js` | ✅ Hostinger-ready static file server |
| `.nvmrc` | ✅ Node 20 |
| `package.json` `start` | ✅ `node server.js` |
| `firebase.json` + `firestore.indexes.json` | ✅ Created |
| `firestore.rules` | ✅ Deployed live to `kiddy-7badf` |
| GitHub `phase02` branch | ✅ `santoshjammi/kiddy` |
| `kiddy-NextGen-App` repo | ✅ Pushed via `git subtree split --prefix=NextJS_APP` |

---

## What To Build Next (Priority Order)

1. **Stripe billing** — integrate Stripe Checkout on `/upgrade`. On successful payment, write `isPremium: true` to `users/{uid}/rewards/current`. This is the only thing blocking real revenue.
2. **`logSession()` in all games** — add session duration tracking to `/math`, `/english`, `/letter-fishing`, `/missing-letter`, `/multiplication-race`, `/division-splitter`. Parent dashboard "Today (min)" currently only fills from `/carry-borrow`.
3. **Add `multiplication` + `division` to Parent Dashboard subject cards** — extend `SUBJECTS` array in `/parent` page.
4. **Full hard gate on `/parent`** — decide and implement: either full-page redirect for free users, or keep current soft gate.
5. **Adaptive weak-area routing** — after each session, check `recent_struggles` and suggest the specific game that targets that struggle area (e.g. many `carry_over` tags → redirect to `/carry-borrow`).
6. **EnglishEngine level-up banner** — when at Level 5 (max), replace "Level up!" prompt with a "Master level reached 🏆" badge instead.
