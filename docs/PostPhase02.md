KIDDY Testing

# Kiddy Learning Engine — Comprehensive Test Strategy & Master Test Plan

## Revenue-Critical MVP + Monetization Phase QA Blueprint

---

# Document Version

**Version:** 1.0
**Scope:** Full-platform QA Strategy
**Coverage:** MVP + Monetization Phase
**Goal:** Production-grade confidence before revenue launch

---

# 1. Executive Testing Philosophy

Most teams test features.

Senior teams test:

* business failure points
* monetization leaks
* trust-breaking inconsistencies
* silent data corruption
* parent confidence destroyers

This platform is parent-paid.

That means your highest-risk bug is not UI.

It is:

## “Parent stops trusting the platform”

Examples:

* child played 40 mins → dashboard shows 0 mins
* premium paid → premium not unlocked
* progress completed → weak area still unchanged
* billing succeeded → upgrade still blocked

These kill revenue immediately.

Testing must prioritize:

# Trust > UI polish

Always.

---

# 2. Testing Layers

---

# Layer A — Product Logic Testing

Focus:

* progression correctness
* rewards integrity
* adaptive routing
* premium gating

---

# Layer B — Revenue Testing

Focus:

* Stripe flow
* premium unlock
* trial conversion
* subscription state integrity

---

# Layer C — Data Integrity Testing

Focus:

* Firestore writes
* consistency across engines
* session logging
* reward accuracy

---

# Layer D — UX Confidence Testing

Focus:

* parent trust
* child usability
* friction points
* conversion blockers

---

# Layer E — Production Reliability

Focus:

* deployment
* static export safety
* Hostinger runtime
* auth persistence
* webhook reliability

---

# 3. Critical Risk Map (Must Never Fail)

---

# Severity P0 — Revenue Killers

Must never reach production

* payment success without premium unlock
* premium access without payment
* session logs missing
* parent dashboard false reporting
* progress reset unexpectedly
* Firestore permission leak
* auth login loop
* broken learning path progression
* rewards duplication exploit

---

# Severity P1 — Trust Damage

* incorrect weak area detection
* wrong recommendations
* wrong level-up logic
* incorrect streak resets
* broken badges
* incorrect difficulty escalation

---

# Severity P2 — UX Friction

* visual alignment issues
* mobile overflow
* hover/focus issues
* non-blocking animation defects

---

# 4. Functional Test Modules

---

# MODULE 1 — Authentication System

## Functionality Under Test

Google Sign-In
Firebase Auth
Role persistence
Session persistence

---

# Test Scenarios

---

## AUTH-001 New User Registration

### Validate

New Google user creates:

```text
users/{uid}
```

correctly

### Expected

* profile created
* rewards/current created
* default free account
* role assigned correctly

---

## AUTH-002 Existing User Login

### Validate

Returning user state restored

### Expected

* previous progress visible
* rewards preserved
* premium state retained

---

## AUTH-003 Auth Persistence Refresh

### Validate

Refresh browser mid-session

### Expected

* user remains logged in
* premium state persists

---

## AUTH-004 Logout Integrity

### Validate

Logout removes protected access

### Expected

* premium routes blocked
* no stale dashboard access

---

## AUTH-005 Multi-Device Login

### Validate

Same account from mobile + desktop

### Expected

* state consistency
* no reward duplication

---

## AUTH-006 Unauthorized Firestore Access

### Validate

Attempt reading another user’s path

### Expected

DENIED

Mandatory security validation

---

# MODULE 2 — Premium Gating

## Functionality Under Test

Access control
Premium verification
Learning Path gating

---

## PREM-001 Free User → Learning Path

### Expected

Hard gate screen shown

No bypass

---

## PREM-002 Free User → Parent Dashboard

### Expected

Soft gate sections blurred

No premium content leak

---

## PREM-003 Premium User Access

### Expected

Full access restored

No false blocking

---

## PREM-004 Manual Firestore Premium Flip

### Expected

Immediate UI reflection

---

## PREM-005 Frontend URL Manipulation

### Validate

User manually enters premium routes

### Expected

Still blocked

---

# MODULE 3 — Stripe Billing

## Functionality Under Test

Checkout → payment → premium unlock

This is your highest-value test area

---

## BILL-001 Successful Payment

### Validate

Checkout completes successfully

### Expected

* webhook fires
* Firestore updated
* premium unlocked
* redirect success page

---

## BILL-002 Payment Success + Webhook Failure

### Validate

Stripe success but webhook delay/failure

### Expected

Recovery mechanism exists

No lost payments

Critical

---

## BILL-003 Payment Failure

### Expected

* no premium unlock
* retry CTA shown

---

## BILL-004 Payment Cancellation

### Expected

* user returned safely
* no broken state

---

## BILL-005 Duplicate Webhook Delivery

### Validate

Stripe retries webhook

### Expected

Idempotent handling

No duplicate premium state corruption

---

## BILL-006 Trial → Paid Conversion

### Expected

trial replaced correctly

No premium collision

---

# MODULE 4 — Math Engine

## Functionality Under Test

Adaptive progression
Problem generation
Mastery updates

---

## MATH-001 Level 1 Problem Accuracy

### Validate

1-digit operations only

No invalid generation

---

## MATH-002 Level Auto Progression

### Validate

Mastery ≥ 90

### Expected

Level increases exactly once

No repeated promotions

---

## MATH-003 Wrong Answer Handling

### Expected

* retry loop
* weak area recorded

---

## MATH-004 Difficulty Cap

### Expected

Max level respected

No overflow

---

## MATH-005 Negative Number Prevention

### Validate

Age-appropriate constraints

No invalid subtraction UX

---

# MODULE 5 — Carry & Borrow Grid

## Functionality Under Test

Column arithmetic correctness

Most critical learning game

---

## CB-001 Carry Value Validation

### Expected

Correct carry required

---

## CB-002 Borrow Detection

### Expected

Borrow logic enforced

---

## CB-003 Manual Input Tampering

### Validate

Skip carry inputs manually

### Expected

Cannot bypass correctness

---

## CB-004 Mobile Alignment Integrity

### Expected

H/T/U alignment perfect

Critical for trust

---

## CB-005 Session Logging

### Expected

Duration recorded accurately

---

# MODULE 6 — English Engine

## Functionality Under Test

2-letter → sentence progression

---

## ENG-001 Correct Level Generation

### Expected

Words match current level only

---

## ENG-002 Missing Letter Accuracy

### Expected

Only valid vowel/consonant choices

---

## ENG-003 Level 5 Sentence Completion

### Expected

Final level shows mastery state

No false “Level Up”

---

## ENG-004 Speech API Failure

### Validate

Browser blocks speech

### Expected

Graceful fallback

---

# MODULE 7 — Rewards Engine

## Functionality Under Test

Points
Badges
Streaks

---

## REW-001 Correct Answer Points

### Expected

Single award only

---

## REW-002 Duplicate Submission Exploit

### Validate

Spam clicking

### Expected

No duplicate points exploit

---

## REW-003 Streak Integrity

### Expected

Daily streak correct across timezone boundaries

Critical edge case

---

## REW-004 Badge Unlock Rules

### Expected

Badge unlock exactly once

---

# MODULE 8 — Parent Dashboard

## Functionality Under Test

Revenue conversion layer

Second highest criticality

---

## PD-001 Today Minutes Accuracy

### Expected

Matches all game sessions

No false zero

---

## PD-002 Weak Area Correctness

### Expected

Based on actual struggles

Not random

---

## PD-003 Recommendation Quality

### Expected

Correct next activity

Not generic recommendation spam

---

## PD-004 Multiplication + Division Visibility

### Expected

All subjects visible

---

## PD-005 Premium Blur Integrity

### Expected

Blur cannot be bypassed visually

---

# MODULE 9 — Adaptive Routing

## Functionality Under Test

Tutor-like recommendation engine

---

## AR-001 Carry Over Failure → Redirect

### Expected

recommend `/carry-borrow`

---

## AR-002 Vowel Confusion → Missing Letter

### Expected

recommend `/missing-letter`

---

## AR-003 Recommendation Freshness

### Expected

updates after improvement

No stale routing

---

# MODULE 10 — Deployment Reliability

## Functionality Under Test

Production deployment integrity

---

## DEP-001 Static Export Safety

### Expected

all routes accessible

No 404 trap

---

## DEP-002 Hostinger Node Runtime

### Expected

server.js safe

---

## DEP-003 Path Traversal Attack

### Expected

blocked

Critical security

---

## DEP-004 Environment Variable Safety

### Expected

No Firebase key leaks

---

# 5. Non-Functional Testing

---

# Performance

Test:

* first load speed
* game interaction latency
* parent dashboard render speed

Target:

< 2.5s first meaningful paint

---

# Accessibility

Test:

* keyboard navigation
* focus visibility
* speech fallback
* screen reader basics

Parents matter too

Not just children

---

# Mobile Testing

Test:

* iPhone Safari
* Android Chrome
* tablets

Most users will be mobile

Desktop-first QA is lazy QA

---

# Browser Compatibility

Test:

* Chrome
* Safari
* Firefox
* Edge

Especially:

Speech API fallbacks

---

# 6. Test Automation Strategy

---

# Automate First

Must automate:

* auth
* premium gating
* billing flow
* progress updates
* reward duplication prevention
* dashboard integrity

Manual testing here is irresponsible

---

# Suggested Stack

* Playwright
* Firebase Emulator
* Stripe test mode
* CI pipeline GitHub Actions

---

# Manual Exploratory Testing

Best for:

* child usability
* parent trust evaluation
* weird progression paths
* conversion friction

Humans required

---

# 7. Final QA Gate Before Release

Must pass:

## 100% P0

## 95% P1

before production

No exceptions

---

# Final Principle

Never ask:

## “Does it work?”

Ask:

## “Would a paying parent trust this enough to subscribe?”

That is the real test.

Would a paying parent trust this enough to subscribe?

Right now?

## Not yet.

The product is close, but “close” does not convert payments.

Parents do not subscribe because the app is technically good.
They subscribe because they feel three things immediately:

1. **This helps my child**
2. **I can see proof**
3. **This is safer and easier than alternatives**

Your current platform is strong on #1, decent on #2, and weak on #3.

That’s the gap.

---

# Brutal Evaluation

---

# What Builds Trust Today

## Strong foundation

You already have:

* structured progression
* real learning modules
* visible parent dashboard
* premium gating
* progression tracking
* clear educational purpose
* focused math + English scope

This is far better than “random kids game websites.”

Good.

That gives legitimacy.

---

# What Still Breaks Trust

This is where parents hesitate.

---

# 1. Payment Without Confidence

Your upgrade page says:

## ₹299/month

But parents ask:

## “Why should I believe this works?”

You need stronger evidence.

Right now you are selling access.

You should be selling outcomes.

Bad:

```text id="56mxll"
Premium Plan
₹299/month
```

Good:

```text id="72dy6w"
Help your child improve multiplication confidence in 14 days
```

That difference is massive.

Parents buy certainty.

---

# 2. Dashboard Must Feel Like a Tutor

Current dashboards often feel like reporting tools.

Parents want:

## expert interpretation

Not:

```text id="2n95ae"
Mastery Score: 82%
```

They want:

```text id="3g4wfd"
Your child understands addition well but struggles with borrowing during subtraction.
We recommend 10 minutes daily this week.
```

That feels valuable.

That feels worth paying for.

---

# 3. Missing Social Proof

This is a major trust gap.

Parents ask:

## “Who else uses this?”

If the answer is invisible, hesitation rises.

You eventually need:

* testimonials
* before/after outcomes
* parent stories
* child progress examples

Without that, conversion is weaker.

Even if the product is excellent.

---

# 4. Session Accuracy Must Be Perfect

If:

```text id="vbp44c"
Today: 0 minutes
```

after actual learning time—

trust collapses instantly.

This is why session logging is not “analytics.”

It is trust infrastructure.

---

# 5. No Strong Trial Mechanism

₹299 is small.

But trust friction is large.

You likely need:

## 7-day premium trial

because:

parents trust experience more than promises.

Without this, conversion is harder.

---

# 6. Weak “Parent Safety” Signaling

Parents of kids care about:

* privacy
* no ads
* safe learning environment
* no distraction
* no junk content

You must explicitly communicate:

## Safe. Focused. No ad-driven nonsense.

If not stated, they assume risk.

Silence creates doubt.

---

# My Real Subscription Test

Ask this:

## “Would I confidently ask 100 parents to pay today?”

If your honest answer is hesitation—

you are not ready.

And that’s useful truth.

---

# What Must Exist Before Serious Monetization Push

Minimum:

## Stripe live

## session tracking fixed

## stronger upgrade page

## outcome-based offers

## parent dashboard interpretation

## 7-day trial

## clear safety messaging

Then yes—
you can push subscriptions seriously.

Before that,
you’re asking parents to trust too much.

---

# Harder Question

Forget features.

Answer this:

# Why should a parent choose Kiddy over:

* school worksheets
* YouTube
* tuition teacher
* Byju’s style platforms
* free random learning apps

If your answer is weak,
your monetization will be weak.

That is the real strategy question.

Not UI.

Not code.

That answer decides the company.

I feel the answer is continuous progress and analytics on what is solved and what was unsolved?

That answer is directionally right, but still too weak to sell.

“Continuous progress and analytics” sounds like something you would say in a product meeting, not something a parent would pay for.

Parents do not wake up thinking:

## “I need analytics.”

They think:

## “My child is struggling and I don’t know how to help.”

That distinction matters.

You are describing the mechanism.

You need the outcome.

---

# Stronger Positioning

Instead of:

## continuous progress + analytics

say:

## We help parents identify exactly where their child is struggling and give them a daily plan to fix it.

That sells.

Because it solves emotional pain.

Not reporting.

---

# Better Core Promise

This is stronger:

## “Your child gets 15 minutes of focused daily practice, and you know exactly what improved and what still needs work.”

Much better.

Now it sounds like relief.

Not software.

---

# The Real Competitor Isn’t Another App

It is:

## parental uncertainty

That is what you are selling against.

Parents are buying:

* clarity
* confidence
* routine
* reduced guilt
* proof of improvement

Not dashboards.

Never dashboards.

---

# Your Competitive Edge Should Be

Not:

## “we have many games”

Not:

## “we use Firestore”

Not:

## “we track mastery”

Those are implementation details.

Your edge is:

## We convert practice into parent confidence.

That is powerful.

That is memorable.

That is hard to compete against.

---

# Rewrite Your Offer Like This

Bad:

```text id="9n8mgh"
Premium dashboard with analytics
```

Good:

```text id="pf4dz4"
Know exactly where your child needs help — and what to practice next.
```

Bad:

```text id="u2w5vc"
Track progress across learning modules
```

Good:

```text id="8e2w0z"
No more guessing if your child is improving.
```

That is language that converts.

---

# Hard Truth

If your messaging sounds like it was written for investors,
parents won’t buy.

If it sounds like it was written for worried parents,
they will.

Choose the second.

---

# Strategic Upgrade

Your parent dashboard should not be called:

## Dashboard

It should be called something like:

## Learning Report

or

## Child Progress Report

or

## Today’s Learning Plan

“Dashboard” is cold.

Parents don’t buy dashboards.

They buy guidance.

Even naming matters.

---

# Your Next Real Task

Before more engineering:

rewrite these 3 things:

1. Homepage hero message
2. Upgrade page value proposition
3. Parent dashboard labels

because positioning drives revenue more than features.

Right now your product likely works better than it sells.

That is a fixable problem.

And honestly, that is a better problem than the reverse.
