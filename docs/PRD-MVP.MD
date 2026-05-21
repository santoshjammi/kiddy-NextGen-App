# Kiddy Learning Engine — MVP PRD

## Parent-Paid Learning Platform for Foundational Math + English

---

# Document Version

**Version:** 1.0
**Product Stage:** Ruthless MVP
**Primary Goal:** Revenue-first MVP
**Secondary Goal:** Child engagement and retention
**Target Build Stack:** Next.js + Firebase + Firestore + Tailwind + TypeScript

---

# 1. Product Vision

Kiddy is a structured daily learning platform for children (ages 4–9) focused on foundational mathematics and English skills.

It is not a “games website.”

It is a parent-paid learning system where children improve through short daily practice sessions and parents receive visible progress reports, weakness analysis, and confidence that learning is happening.

The product combines:

* Interactive learning games
* Structured progression paths
* Saved learning state
* Parent progress visibility
* Premium subscription pathway

The business model is built around parent trust, not child entertainment.

---

# 2. Core Monetization Thesis

Parents do not pay for games.

Parents pay for:

* measurable improvement
* routine and consistency
* weak area identification
* visible progress reports
* confidence in academic growth

The platform must optimize for parent trust first and child engagement second.

### Core Purchase Sentence

**“Your child improves addition, subtraction, multiplication, and spelling through just 15 minutes of structured daily practice—with visible progress tracking for parents.”**

This is the product.

Everything else supports this.

---

# 3. MVP Scope (Strict)

---

# Included in MVP

## Student Side

* Free Playground (limited)
* Structured Learning Path
* Math Engine
* English Engine
* Basic Rewards System
* Login + Progress Save
* Daily Practice Flow

---

## Parent Side

* Parent Dashboard
* Weak Area Reporting
* Progress Summary
* Recommended Next Practice

---

## Platform

* Firebase Authentication
* Firestore Progress Engine
* Premium Route Gating
* Basic Premium Upgrade Flow (without advanced billing logic)

---

# Excluded from MVP

Do not build these now:

* Teacher Portal
* AI-generated stories
* OpenAI integration
* Advanced subscriptions
* Stripe automation
* Classroom features
* Social competition
* Multiplayer
* Printable worksheet engine
* Advanced gamification trophy rooms
* Full admin CMS
* Cambridge certification mapping
* Push notifications
* Mobile app native version

These are Phase 2+.

Do not poison MVP with them.

---

# 4. User Roles

---

# A. Student

### Responsibilities

* Practice learning modules
* Complete games
* Improve mastery
* Earn points and badges

### Primary Goal

Learning through repetition + visual engagement

---

# B. Parent

### Responsibilities

* Create account
* Monitor progress
* Understand weak areas
* Decide premium upgrade

### Primary Goal

Confidence and trust in child improvement

### Revenue Owner

This is the paying user.

Optimize for this role.

---

# C. Admin (Internal Only)

### Responsibilities

* Content management
* Manual corrections
* Monitoring user data

### MVP Note

Firebase Console is enough initially.

Do not overbuild admin.

---

# 5. Product Architecture

---

# Surface A — Free Playground (Traffic Engine)

## Purpose

SEO + acquisition + trust building

## Access

No login required

## Included Modules

### Free Math

* Counting
* Simple addition
* Simple subtraction
* Multiplication table basics

### Free English

* Letter recognition
* 2-letter words
* 3-letter words

## Features

* Instant play
* No saved progress
* No personalization

## Conversion Goal

Move users to account creation

---

# Surface B — Premium Learning Path (Revenue Engine)

## Purpose

Retention + monetization

## Access

Login required

## Features

* Saved progress
* Structured progression
* Adaptive difficulty
* Rewards
* Parent reporting

---

# Surface C — Parent Dashboard (Monetization Engine)

## Purpose

Subscription trust layer

## Features

* Progress visibility
* Weak area analysis
* Recommended next steps
* Time spent
* Session consistency

This is the revenue closer.

---

# 6. Learning Curriculum

---

# Mathematics Progression

---

## Level 1 — 1 Digit

### Skills

* Counting
* Addition
* Subtraction

### Examples

4 + 3
8 - 2

### UI

Visual blocks + drag/drop

---

## Level 2 — 2 Digits

### Skills

* Addition
* Subtraction
* Place value understanding

### Examples

24 + 15
47 - 13

### UI

Base-10 rods + number blocks

---

## Level 3 — 3 Digits

### Skills

* Carrying
* Borrowing

### Examples

458 + 267
703 - 284

### UI

Carry/Borrow Grid

This is the most important game.

---

## Level 4 — Multiplication Foundations

### Skills

* Tables
* Repeated addition

### Examples

7 × 8

### UI

Multiplication Race

---

## Level 5 — Division Foundations

### Skills

* Grouping
* Equal sharing

### Examples

12 ÷ 3

### UI

Division Splitter

---

# English Progression

---

## Level 1 — 2 Letter Words

### Examples

at
in
on

### UI

Letter Fishing

---

## Level 2 — 3 Letter Words

### Examples

cat
dog
sun

### UI

Missing Letter

---

## Level 3 — 4 Letter Words

### Examples

stop
play
chat

### UI

Spell Builder

---

## Level 4 — 5 Letter Words

### Examples

apple
train
clock

### UI

Word Challenge

---

## Level 5 — Simple Sentences

### Example

The cat is on the ___

### UI

Read & Choose

---

# 7. Core Games

---

# Game 1 — Carry & Borrow Grid

## Goal

Math mastery

## Importance

Highest retention value

## Functionality

* vertical column math
* carry input boxes
* borrow indicators
* answer validation
* retry loop

## Monetization Impact

Very high

Parents instantly understand its value

---

# Game 2 — Multiplication Race

## Goal

Fast multiplication recall

## Functionality

* timed rounds
* score streaks
* leaderboard local only

---

# Game 3 — Missing Letter

## Goal

Spelling development

## Functionality

C _ T

Choose correct missing letter

---

# Game 4 — Letter Fishing

## Goal

Phonics learning

## Functionality

Audio + drag/drop letters

---

# Game 5 — Learning Path Screen

## Goal

Progress visualization

## Functionality

* completed modules
* next lesson
* rewards progression

---

# 8. Parent Dashboard PRD

---

# Purpose

This page sells the subscription.

Not the homepage.

---

# Required Sections

---

## A. Child Progress Summary

### Shows

* Current level
* Current subject
* Progress %
* Weekly consistency

---

## B. Strength Areas

### Example

Strong in:

* addition
* 2-letter spelling

---

## C. Weak Areas

### Example

Needs practice in:

* borrowing
* multiplication recall

This is the conversion trigger.

---

## D. Time Spent

### Shows

* daily learning minutes
* weekly totals

---

## E. Recommended Next Practice

### Example

Recommended today:

“Carry over addition practice”

---

## F. Reward Summary

### Shows

* points
* badges earned

---

# Parent Dashboard Rule

Clarity > beauty

No dashboard clutter.

---

# 9. Core Engines

Build engines, not pages.

---

# MathEngine

Handles:

* problem generation
* answer validation
* level progression
* mastery scoring

---

# EnglishEngine

Handles:

* spelling progression
* difficulty scaling
* word generation

---

# RewardEngine

Handles:

* points
* badges
* streaks

---

# ParentAnalyticsEngine

Handles:

* weak area detection
* mastery reports
* next recommendations

This is the real product.

---

# 10. Firestore Schema

---

# Collection: users

```json id="z7j3cm"
{
  "uid": "",
  "name": "",
  "email": "",
  "role": "student | parent",
  "isPremium": false,
  "createdAt": "",
  "lastLogin": ""
}
```

---

# Collection: user_progress

```json id="zzes7v"
{
  "userId": "",
  "subject": "math",
  "topic": "addition",
  "currentLevel": 3,
  "masteryScore": 82,
  "attempts": 145,
  "correctAnswers": 120,
  "weakAreas": [
    "carry_over"
  ],
  "lastPlayed": "",
  "nextRecommendedModule": "multiplication_level_1"
}
```

---

# Collection: rewards

```json id="s9w59i"
{
  "userId": "",
  "points": 1200,
  "badges": [
    "Addition Master",
    "Spelling Star"
  ],
  "streakDays": 7
}
```

---

# Collection: sessions

```json id="vb8eyu"
{
  "userId": "",
  "date": "",
  "subject": "math",
  "durationMinutes": 18,
  "completedModules": 3
}
```

---

# 11. User Flows

---

# Student Flow

Landing Page
→ Free Playground
→ Wants Progress Save
→ Register/Login
→ Learning Path
→ Game Session
→ Save Progress
→ Rewards

---

# Parent Flow

Landing Page
→ Understand Value
→ Register Child
→ Parent Dashboard
→ Review Progress
→ Upgrade Premium

---

# 12. Success Metrics

---

# North Star Metric

## Weekly Active Learning Sessions Per Child

---

# Supporting Metrics

* 7-day retention
* average completed sessions
* progression improvement %
* weak area reduction
* parent dashboard return visits
* premium conversion rate

Do not chase vanity metrics.

---

# 13. Technical Stack

---

# Frontend

Next.js App Router

---

# Backend

Firebase Authentication

Cloud Firestore

Firebase Storage

---

# Styling

Tailwind CSS

shadcn/ui

---

# Deployment

Vercel + Firebase

---

# 14. Release Phases

---

# Phase 1 — Ship Fast

* Next.js migration
* Firebase Auth
* Firestore schema
* Parent Dashboard
* MathEngine
* EnglishEngine
* Carry/Borrow Grid
* Missing Letter Game

---

# Phase 2

* Premium gating
* Billing integration
* Advanced progression

---

# Phase 3

* AI-generated exercises
* Teacher portal
* Advanced analytics

---

# Final Rule

If a feature does not improve:

## Parent trust

or

## Child measurable progress

it should not be built.

That discipline is what creates a company instead of a side project.
