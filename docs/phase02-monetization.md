# PRD — Monetization Engine + Revenue Completion

## Kiddy Learning Engine Phase 2 (Revenue-First Execution)

---

# Document Version

**Version:** 2.0
**Focus:** Monetization + Revenue Completion
**Priority:** Highest
**Status:** Immediate Next Build Phase

---

# 1. Objective

Phase 1 is complete.

The product is functional.

The current blocker is not product capability.

The blocker is:

# Revenue Activation

Kiddy must move from:

```text
interesting educational platform
```

to

```text
parent-paid learning business
```

This PRD defines the complete execution plan for monetization, trust conversion, and remaining critical platform gaps.

This phase must prioritize:

* real payments
* premium conversion
* parent trust
* adaptive learning value
* measurable retention

Not new games.

Not AI features.

Not expansion.

Revenue first.

---

# 2. Business Goal

Primary objective:

## Convert free users into paying parents

through:

* visible child improvement
* trust-building dashboard insights
* premium learning recommendations
* guided upgrade flows
* clear outcome-based subscription offers

---

# 3. Revenue Strategy

---

# Current Problem

Current state:

```text
Upgrade page → Waitlist CTA
```

This is not monetization.

This is avoidance.

Users must be able to:

```text
Login → Pay → Unlock Premium → Continue Learning
```

with zero manual intervention.

---

# Required Revenue Flow

## Free User Journey

Homepage
→ Free playground
→ Child uses learning games
→ Parent sees dashboard insights
→ Weak areas exposed
→ Premium recommendation shown
→ Upgrade page
→ Payment completed
→ Premium unlocked instantly

This is the actual product loop.

---

# 4. Core Deliverables

---

# Deliverable A — Stripe Billing Integration

## Priority

🔴 Critical

## Objective

Enable actual payment collection

---

## Required Features

### A1. Stripe Checkout

Parent clicks:

```text
Upgrade to Premium
```

and enters secure Stripe Checkout flow

---

### A2. Pricing Model

## Initial Offer

### ₹299/month

Simple single-plan structure

Do not overcomplicate pricing.

No yearly plan initially.

No enterprise plans.

No pricing matrix.

One plan.

One decision.

---

### A3. Stripe Webhook

After successful payment:

Automatically update Firestore:

```json
{
  "isPremium": true,
  "premiumActivatedAt": "",
  "subscriptionStatus": "active"
}
```

No manual Firebase edits.

---

### A4. Failed Payment Handling

If payment fails:

* preserve user session
* return to upgrade page
* show retry CTA

No dead-end payment flows

---

### A5. Subscription Validation

On protected routes:

System verifies:

```text
isPremium === true
```

before access

No frontend-only premium checks

---

### A6. Subscription Cancellation Logic

Initial MVP:

Manual cancellation acceptable

Auto-cancellation can be Phase 3

Do not overbuild subscriptions now

---

# Deliverable B — Parent Dashboard Conversion Engine

## Priority

🔴 Critical

## Objective

Convert dashboard from “report page” into “sales engine”

---

# Required Changes

---

## B1. Problem Narrative

Current weak area display:

```text
Needs Practice: Multiplication
```

Bad.

Replace with:

```text
Your child is struggling with multiplication recall.

Daily guided premium practice helps improve confidence and speed.
```

This converts.

---

## B2. Premium Recommendation Card

Add:

```text
Recommended Today
```

with:

* exact next activity
* estimated completion time
* upgrade CTA if premium locked

Example:

```text
Today's Recommendation:
Carry Over Practice (10 min)
```

---

## B3. Weekly Progress Story

Not charts.

Simple summary:

```text
This week:
+ 42 problems solved
+ Addition improved by 18%
+ Borrowing needs review
```

Parents buy clarity.

Not graphs.

---

## B4. Learning Prescription

Premium feature:

```text
Today's Learning Plan

10 min Carry & Borrow
5 min Multiplication Race
5 min Missing Letter
```

Feels like a tutor

This is pricing power

---

## B5. Upgrade Triggers

Upgrade CTA must appear:

* after repeated weak areas
* after consistency drops
* after free learning path limit reached

Not random CTA spam

---

# Deliverable C — Session Logging Completion

## Priority

🟡 High

## Objective

Ensure dashboard data is trustworthy

---

# Problem

Only `/carry-borrow` logs session duration

This creates false dashboard data

Parents lose trust immediately

---

# Required Implementation

Add `logSession()` to:

* `/math`
* `/english`
* `/missing-letter`
* `/letter-fishing`
* `/multiplication-race`
* `/division-splitter`

---

# Required Data

```json
{
  "durationMinutes": 18,
  "subject": "math",
  "completedModules": 3,
  "date": ""
}
```

---

# Deliverable D — Parent Dashboard Subject Completion

## Priority

🟡 High

## Objective

Expose all completed learning modules

---

# Problem

Dashboard shows only:

* carry-borrow
* mathematics
* english

Missing:

* multiplication
* division

Parents cannot see value

This breaks trust

---

# Required Fix

Update:

```ts
SUBJECTS[]
```

to include:

* multiplication
* division

Full visibility required

---

# Deliverable E — Adaptive Weak-Area Routing

## Priority

🟡 High

## Objective

Turn platform into tutor-like system

This is moat-building

---

# Required Behavior

After session completion:

System checks:

```json
recent_struggles[]
```

and recommends specific remediation

---

## Example

Repeated issue:

```text
carry_over
```

System routes to:

```text
/carry-borrow
```

Repeated issue:

```text
vowel_confusion
```

System routes to:

```text
/missing-letter
```

This creates perceived intelligence

Much stronger than adding games

---

# Deliverable F — Premium Trial Offer

## Priority

🟡 High

## Objective

Reduce purchase friction

---

# Required Feature

## 7-Day Free Premium Trial

Why:

Parents do not trust immediately

Trial reduces friction

Conversion improves significantly

---

# Required Rules

* one trial per parent account
* premium access auto-enabled
* dashboard indicates:

```text
Trial: 5 days remaining
```

---

# Deliverable G — Outcome-Based Offers

## Priority

🟢 Medium

## Objective

Sell outcomes, not subscriptions

---

# Replace

Bad:

```text
Premium ₹299/month
```

with

Good:

```text
7-Day Math Confidence Challenge

Multiplication Master Track

Spelling Champion Program
```

People buy outcomes

Not pricing tables

---

# Deliverable H — Weekly Parent Email Summary

## Priority

🟢 Medium

## Objective

Retention + trust

---

# Weekly Email Example

```text
This Week in Kiddy

+ 42 problems solved
+ Addition improved by 18%
+ Needs Review: Borrowing
+ Recommended Next Step:
Carry & Borrow Practice
```

Simple.
High value.
Strong retention

---

# Deliverable I — Full Remaining Platform Completion

## Priority

🟡 High

Objective:
Close all unfinished product gaps from MVP

---

# Includes

---

## I1. EnglishEngine Level 5 Completion UX

Current issue:

Level 5 still behaves like progression exists

Fix:

When max level reached:

Show:

```text
Master Level Reached 🏆
```

instead of:

```text
Level Up!
```

---

## I2. Rewards Consistency Validation

Ensure all games:

* points awarded correctly
* badges unlock consistently
* streaks update properly

No reward fragmentation allowed

---

## I3. Upgrade Page Optimization

Current:

Pricing page

Required:

Sales page

Must include:

* parent pain points
* outcome-based offer
* testimonials later
* premium comparison
* urgency without fake scarcity

---

## I4. Hard Gate vs Soft Gate Review

Current:

soft gate on `/parent`

Decision required:

Keep current model OR full premium wall

Recommended:

keep soft gate

because visibility converts better

---

# 5. Firestore Additions

---

# rewards/current

Add:

```json
{
  "trialStartedAt": "",
  "trialEndsAt": "",
  "subscriptionStatus": "active",
  "premiumActivatedAt": ""
}
```

---

# progress

Improve:

```json
{
  "recent_struggles": [],
  "nextRecommendedModule": "",
  "recommendedToday": ""
}
```

---

# 6. Success Metrics

---

# North Star

## Paid Parent Conversion Rate

This matters most now

---

# Supporting Metrics

* trial → paid conversion
* dashboard return rate
* weekly learning completion
* weak area improvement
* premium renewal %
* upgrade page conversion %
* payment success %

Not vanity metrics

Revenue metrics only