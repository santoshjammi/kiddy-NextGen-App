# Kiddy Learning Engine — Project Status

**Date:** 28 April 2026  
**Branch:** `phase02` → `santoshjammi/kiddy`  
**Deploy copy:** `santoshjammi/kiddy-NextGen-App` (main)  
**App root:** `NextJS_APP/`  

---

## Context for ChatGPT

Kiddy is a **parent-paid learning platform** for children ages 4–9 focused on foundational Math + English.  
Business model: parents pay for measurable improvement and visible progress reports — **not** for games.  
Built with: **Next.js 15 (App Router) + Firebase Auth + Cloud Firestore + Tailwind CSS + TypeScript**.  
Deployed to: **Hostinger Node.js** (static export via `server.js`) + Firebase for auth/data.  
PRD reference: `docs/PRD-MVP.MD` — drives all priorities.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15.1.3 (App Router, `output: 'export'`) |
| Auth | Firebase Auth (Google sign-in) |
| Database | Cloud Firestore (`kiddy-7badf` project) |
| Styling | Tailwind CSS 3.4 + PS design system |
| Language | TypeScript 5 |
| Deploy | Hostinger Node.js — `server.js` serves `out/` |
| Node | v20 (`.nvmrc`) |
| Design System | PS-inspired: `bg-black` headers, `rounded-[24px]` white cards, `#0070cc` blue |

---

## All Routes (32 total)

### Core Engines
| Route | Lines | Status | Notes |
|---|---|---|---|
| `/math` | 29 | ✅ Full | Wraps `MathEngine` — 5 difficulty levels, +/−/× |
| `/english` | 29 | ✅ Full | Wraps `EnglishEngine` — 4 word levels + letter blocks |
| `/carry-borrow` | 426 | ✅ Full | Carry & Borrow Grid, 5 levels, H/T/U labels, vinculum line |
| `/missing-letter` | 252 | ✅ Full | 3 levels: CVC vowel → 4-letter → 5-letter words |
| `/letter-fishing` | 254 | ✅ Full | Web Speech API phonics, 3 levels (vowels/consonants/long) |

### Parent + Premium
| Route | Lines | Status | Notes |
|---|---|---|---|
| `/parent` | 416 | ✅ Full | Dashboard: summary strip, weak areas, strengths, rewards, recommended CTA |
| `/learning-path` | 238 | ✅ Full | 12-step visual path, step states: done/active/locked |
| `/rewards` | 177 | ✅ Full | Points, progress ring, streak, earned/locked badge grid |
| `/upgrade` | 198 | ✅ Full | Free vs Premium cards (₹299/mo), waitlist CTA, FAQ |

### Original Games (pre-PRD)
| Route | Lines | Status | Notes |
|---|---|---|---|
| `/alphabet` | 206 | ✅ Full | 26 letters with phonics |
| `/numbers` | 245 | ✅ Full | 1–100 counting |
| `/shapes` | 235 | ✅ Full | 9 shapes, all clip-path fixed (oval + hexagon) |
| `/colors` | 165 | ✅ Full | Color recognition |
| `/counting` | 145 | ✅ Full | Counting game |
| `/memory-match` | 145 | ✅ Full | Flip-card memory game |
| `/spelling` | 187 | ✅ Full | Spell the word |
| `/rhyming` | 169 | ✅ Full | Rhyme matching |
| `/patterns` | 175 | ✅ Full | Pattern recognition |
| `/sight-words` | 165 | ✅ Full | High-frequency word flash cards |
| `/animals` | 197 | ✅ Full | Animal names + sounds |
| `/sentences` | 218 | ✅ Full | Simple sentence builder |
| `/time` | 167 | ✅ Full | Clock reading |
| `/tracing` | 172 | ✅ Full | Letter/number tracing |

### Static Pages
| Route | Status |
|---|---|
| `/` (home) | ✅ 19-game grid with nav to dashboard/learning-path/rewards/upgrade |
| `/about` | ✅ |
| `/contact` | ✅ |
| `/privacy-policy` | ✅ |
| `/terms-of-service` | ✅ |
| `/profile` | ✅ |

---

## Core Components

| File | Status | What It Does |
|---|---|---|
| `components/FirebaseProvider.tsx` | ✅ Fixed | Auth context + `isPremium` field, reads from `users/{uid}/rewards/current` |
| `components/useRewards.ts` | ✅ Done | 14 badges, points, streaks, `recordCorrect()`, `logSession()`, `awardBadge()` |
| `components/useSubjectProgress.ts` | ✅ Done | Per-subject mastery (1–5 difficulty, 0–100 mastery), auto level-up at 90% |
| `components/math/MathEngine.tsx` | ✅ Done | 5-level adaptive +/−/× problem generator |
| `components/math/VisualBlocks.tsx` | ✅ Done | Visual block representation for problems |
| `components/math/ColumnGrid.tsx` | ✅ Done | Column arithmetic grid |
| `components/math/WordProblem.tsx` | ✅ Done | Word problem UI |
| `components/english/EnglishEngine.tsx` | ✅ Done | 4-level word builder (2-letter → 4-letter), letter block dragging |
| `components/AuthButton.tsx` | ✅ Done | Google sign-in/out button |
| `server.js` | ✅ Done | Zero-dep Node.js static file server for Hostinger (path traversal safe, SPA fallback) |

---

## Firestore Setup

- **Project ID:** `kiddy-7badf`
- **Rules:** Deployed → users can only read/write their own data + subcollections
- **Schema used:**
  - `users/{uid}` — user profile
  - `users/{uid}/rewards/current` — points, badges, streakDays, `isPremium`
  - `users/{uid}/progress/{subject}` — mastery score, difficulty level, weak areas
  - `users/{uid}/sessions/{id}` — session logs (subject, durationMinutes, completedModules)

---

## PRD Phase 1 — All Complete ✅

Per `docs/PRD-MVP.MD` Section 14:

| PRD Item | Status |
|---|---|
| Next.js migration | ✅ Done |
| Firebase Auth + Firestore schema | ✅ Done |
| Parent Dashboard (`/parent`) | ✅ Done |
| MathEngine (`/math`) | ✅ Done |
| EnglishEngine (`/english`) | ✅ Done |
| Carry & Borrow Grid (`/carry-borrow`) | ✅ Done |
| Missing Letter Game (`/missing-letter`) | ✅ Done |
| Basic Premium Upgrade Flow (`/upgrade`) | ✅ Done (waitlist only, no live billing) |

---

## PRD Phase 2 — Not Started ❌

| PRD Item | Notes |
|---|---|
| Premium gating (hard block) | ⚠️ Currently soft-gate banner only on `/parent` and `/learning-path`. Other games are open. |
| Billing integration (Stripe) | ❌ `/upgrade` shows waitlist CTA only. No payment flow exists. |
| Advanced progression algorithms | ⚠️ `useSubjectProgress` is basic linear level-up. No adaptive weak-area targeting. |
| **Multiplication Race** game | ❌ PRD Game 2 — not built. No `/multiplication-race` route. |
| **Division Splitter** game | ❌ PRD Math Level 5 — not built. No `/division-splitter` route. |
| Letter Fishing (drag-and-drop) | ⚠️ Built but uses speech only. Drag-and-drop letters not implemented. |

---

## PRD Phase 3 — Not Started ❌ (Excluded from MVP)

| PRD Item | Notes |
|---|---|
| AI-generated exercises | PRD explicitly excluded |
| Teacher portal | PRD explicitly excluded |
| Advanced analytics | PRD explicitly excluded |
| Stripe automation | PRD explicitly excluded |

---

## Known Gaps vs PRD Spec

These are features the PRD requires that are **partially or not implemented**:

### Parent Dashboard gaps
| PRD Section | PRD Requirement | Current State |
|---|---|---|
| **D. Time Spent** | Daily learning minutes + weekly totals on dashboard | ❌ Not shown. `useRewards.logSession()` writes `durationMinutes` to Firestore but `/parent` page does not read or display it. |
| **Weekly consistency** | Weekly session count on progress summary | ❌ Not shown on dashboard. |
| **A. Child Progress Summary** | "Weekly consistency" field in summary strip | ❌ Missing from UI. |

### Premium gating
| Requirement | Current State |
|---|---|
| Premium routes should be hard-blocked for free users | ⚠️ Both `/parent` and `/learning-path` show a soft banner. User can dismiss it and still use the pages. No hard redirect or paywall enforced. |

### English Engine coverage
| PRD Requirement | Current State |
|---|---|
| Level 5: Simple Sentences ("The cat is on the ___") | ❌ `EnglishEngine` has 4 levels only. Level 5 sentence fill-in-blank not built. |

### PRD Game 5 — Learning Path Screen
| Requirement | Current State |
|---|---|
| Shows completed modules, rewards progression, next lesson within path | ✅ `/learning-path` covers this. Matches PRD intent. |

---

## Deployment State

| Item | Status |
|---|---|
| `out/` static build | ✅ Built and committed |
| `server.js` | ✅ Serves `out/`, reads `process.env.PORT`, SPA fallback, path traversal protection |
| `.nvmrc` | ✅ Node 20 |
| `package.json` `start` | ✅ `node server.js` |
| `firebase.json` | ✅ Created |
| `firestore.rules` | ✅ Deployed to `kiddy-7badf` |
| `kiddy-NextGen-App` repo | ✅ Pushed via `git subtree split --prefix=NextJS_APP` |
| GitHub branch | ✅ `phase02` on `santoshjammi/kiddy` |

---

## What To Build Next (Priority Order)

1. **Time Spent + Weekly Consistency on `/parent`** — read `sessions` subcollection, compute daily minutes and 7-day session count, display in summary strip. This closes the PRD's most visible dashboard gap.
2. **Hard premium gate** — redirect free users away from `/learning-path` and lock /parent sections behind a real paywall once billing is live.
3. **Stripe billing** — connect `/upgrade` waitlist to actual subscription checkout. Flip `isPremium: true` in Firestore on successful payment.
4. **Multiplication Race** (`/multiplication-race`) — PRD Game 2, timed round, streaks, local leaderboard.
5. **Division Splitter** (`/division-splitter`) — PRD Math Level 5, grouping/equal sharing UI.
6. **EnglishEngine Level 5** — sentence fill-in-blank ("The cat is on the ___").
7. **Letter Fishing drag-and-drop** — replace current speech-only UI with actual draggable letters per PRD spec.
