


Pasted text.txt
Document
This has been my conversation. I want to build an app.Look at the pasted text and help me figure this out. I have already started building the app.

You’ve already done something useful: you stopped thinking “build a kids app” and started defining an actual learning system. That’s the difference between a hobby project and a product.

But your current conversation has a problem: it is too broad.

Right now you are mixing:

Free learning website

Premium SaaS for parents

Toy Theater clone

Cambridge curriculum platform

AI story engine

Teacher dashboard

Subscription business

Social learning game ecosystem

That is not one MVP. That is 4 companies pretending to be one.

If you keep building like this, you will create architecture for a fantasy product instead of shipping something parents will pay for.

So first, here’s the uncomfortable question:

What is the first thing parents will pay for?

Not “what is cool.”
Not “what can AI do.”
Not “what can be built.”

What creates pain relief?

Usually:
→ “My child is weak in basic math and spelling and I need structured daily practice.”

That’s your real product.

Not Toy Theater.
Not a game arcade.

That means your core product should be:

The Real MVP
Kiddy Learning Engine
A structured progression platform for:

Addition

Subtraction

Multiplication

Division

2-letter to 5-letter spelling

Reading foundations

with:

progress tracking

daily practice

parent visibility

adaptive difficulty

rewards

Everything else is secondary.

Your existing pasted plan 

 already points toward this, but you need ruthless prioritization.

What I Would Build First (Phase 1)
Product Positioning
“15 minutes daily learning for kids”
This is sellable.

Not:

“interactive educational platform with AI storytelling and manipulative ecosystems”

That sounds impressive and sells nothing.

Parents buy:

“My child improves multiplication tables in 30 days”
That sells.

Be sharper.

Final Product Structure
Product Split
A. Free Playground (Traffic Engine)
Purpose:
SEO + trust + acquisition

Includes:

free addition practice

free subtraction practice

free spelling mini games

counting games

basic multiplication tables

printable worksheets

math manipulatives

No login required.

This gets traffic.

B. Premium Learning Path (Revenue Engine)
Purpose:
Retention + subscription

Includes:

personalized progression

saved progress

adaptive difficulty

parent dashboard

weekly reports

premium structured curriculum

rewards system

advanced problem solving

AI-generated practice

This gets revenue.

C. Parent Layer (Decision Maker)
Parents pay.

Not children.

Your product must optimize for parent trust.

Includes:

progress report

weakness detection

“child struggles with borrowing”

practice recommendations

subscription/payment

achievement summaries

This closes sales.

Stronger Game Framework
Do NOT build random games.

Build games mapped to learning outcomes.

Every game must answer:

“What skill does this improve?”
If it doesn’t answer that clearly,
don’t build it.

Recommended Core Games
Math
1. Number Builder
Skill:
place value

2. Carry & Borrow Grid
Skill:
addition/subtraction mastery

3. Multiplication Race
Skill:
table recall speed

4. Division Splitter
Skill:
division logic

5. Word Problem Adventure
Skill:
application thinking

English
1. Letter Fishing
Skill:
phonics

2. Missing Letter
Skill:
vowel understanding

3. Spell Builder
Skill:
3–5 letter spelling

4. Sentence Quest
Skill:
contextual understanding

5. Read & Choose
Skill:
reading comprehension

Your Biggest Architecture Decision
This matters most:

Do NOT build “pages”
Build:

Engines
Example:

MathEngine

EnglishEngine

RewardEngine

ParentAnalyticsEngine

Everything dynamic.

Everything Firestore-driven.

No hardcoded lesson pages.

This is where most founders fail.

They build content.

You must build systems.

Firestore Truth
Your real database is not:

“games”

It is:

mastery states
Like:

{
  "userId": "abc123",
  "subject": "math",
  "topic": "addition",
  "level": 3,
  "mastery": 84,
  "attempts": 142,
  "weakAreas": ["carry_over"],
  "nextRecommendation": "level_4_addition"
}
That is your company.

Not the UI.

The UI is replaceable.

This data is the moat.

My Advice for Immediate Next Step
Stop expanding ideas.

Start defining:

Exact MVP Scope
I would force this:

Version 1 only includes:
Math
Addition

Subtraction

Multiplication

English
2–5 letter spelling

Parent dashboard basic version
That’s it.

No AI.
No teacher portal.
No subscriptions yet.
No 50 games.

Ship.

Learn.

Then expand.

Otherwise you will spend 18 months building a dead cathedral.

What You Need Next
You need:

A ruthless MVP PRD
Not inspiration.

Execution.

Specifically:

exact screens

exact collections

exact user flow

exact game flow

exact dashboard logic

exact premium gating logic

No vague ideas.

Only buildable decisions.

That is the next correct move.


A ruthless MVP PRD, lets make it.

Ruthless MVP PRD — Kiddy Learning Engine
Product: Kiddy Learning Platform for Foundational Math + English
1. Product Goal
Build a focused learning platform for kids (ages 4–9) that improves foundational:

Addition

Subtraction

Multiplication

Division (basic introduction only)

2-letter to 5-letter English spelling

Reading basics

through:

short daily learning sessions

interactive games

adaptive progression

saved progress

parent visibility

This is not a general “games website.”

This is a structured progression engine.

2. Core Business Thesis
Parents do not pay for games.

Parents pay for:

visible improvement

routine practice

measurable progress

weakness detection

confidence building

The product must optimize for parent trust first, child engagement second.

Wrong order kills edtech products.

3. MVP Scope (Strict)
Included
Student Side
Free Playground

Learning Path Engine

Math progression

English spelling progression

Rewards/Badges basic system

Login + Progress Saving

Parent Side
Parent dashboard basic version

Child progress summary

Weak area reporting

System
Firebase Auth

Firestore Progress Engine

Next.js migration

Premium route gating (basic)

Excluded (Phase 2+)
Not now:

Teacher Portal

AI-generated stories

OpenAI integration

Stripe subscriptions

Social features

Multiplayer

Trophy room advanced

Classroom analytics

Cambridge certification mapping

Printable worksheets engine

Admin CMS complex version

If it’s here now, your MVP is already dying.

4. User Roles
A. Student
Uses games and learning paths.

Primary actor.

B. Parent
Monitors progress and upgrades account.

Revenue actor.

C. Admin
Manages content manually.

Only internal.

No fancy admin panel in MVP.

Even Firebase Console is enough initially.

Do not overbuild admin.

5. Product Architecture
A. Free Playground (Traffic Engine)
Purpose
SEO + trust + free user acquisition

Access
No login required

Modules
Free Math
Counting

Simple addition

Simple subtraction

Multiplication table practice

Free English
Letter recognition

2-letter words

3-letter words

Features
Instant play

No save progress

No personalization

Purpose:
Get users in.

Not retention.

B. Premium Learning Path (Core Product)
Purpose
Retention + measurable improvement

Access
Login required

Modules
Mathematics
Level 1
1-digit addition/subtraction

Level 2
2-digit addition/subtraction

Level 3
3-digit carry/borrow system

Level 4
Multiplication foundations

Level 5
Division foundations

English
Level 1
2-letter words

Level 2
3-letter words

Level 3
4-letter words

Level 4
5-letter words

Level 5
Simple sentence completion

C. Parent Dashboard
Purpose
Trust + conversion

Includes
current level

progress %

time spent

strengths

weak areas

recommended next practice

Simple.
Clear.
No enterprise dashboard nonsense.

6. Core Game Modules
Only build games tied to learning outcomes.

No random entertainment.

Mathematics Games
Game 1: Number Builder
Goal
Understand quantity + place value

Skill
1-digit → 3-digit understanding

Example
Build 245 using blocks

Game 2: Carry & Borrow Grid
Goal
Addition/Subtraction mastery

Skill
Column calculation

Example
458 + 267

Student enters carry values manually

This is extremely important.

This is core retention.

Game 3: Multiplication Race
Goal
Fast recall of multiplication tables

Skill
Speed + memory

Example
7 × 8 = ?

Timed rounds

Game 4: Division Splitter
Goal
Understand grouping logic

Skill
Division basics

Example
12 apples ÷ 3 baskets

English Games
Game 1: Letter Fishing
Goal
Phonics

Skill
Sound recognition

Game 2: Missing Letter
Goal
Spelling logic

Skill
CVC understanding

Example
C _ T

Game 3: Spell Builder
Goal
3–5 letter spelling

Skill
Word construction

Game 4: Read & Choose
Goal
Reading comprehension

Skill
Context understanding

7. Critical System Architecture
Do NOT build page-based lessons.

Build engine-based systems.

Required Engines
MathEngine
Handles:

problem generation

level progression

answer validation

score tracking

EnglishEngine
Handles:

spelling progression

word generation

difficulty scaling

RewardEngine
Handles:

points

badges

unlocks

ParentAnalyticsEngine
Handles:

mastery tracking

weak area detection

progress reporting

This is your real product.

Not the homepage.

8. Firestore Schema
Collection: users
{
  "uid": "",
  "name": "",
  "email": "",
  "role": "student | parent",
  "isPremium": false,
  "createdAt": ""
}
Collection: user_progress
{
  "userId": "",
  "subject": "math",
  "topic": "addition",
  "currentLevel": 3,
  "masteryScore": 82,
  "attempts": 145,
  "correctAnswers": 120,
  "weakAreas": ["carry_over"],
  "lastPlayed": "",
  "nextRecommendedModule": "multiplication_level_1"
}
Collection: rewards
{
  "userId": "",
  "points": 1200,
  "badges": [
    "Addition Master",
    "Spelling Star"
  ]
}
9. User Flow
Student Flow
Landing Page
→ Free Playground
→ Wants Progress Save
→ Login/Register
→ Learning Path
→ Game Session
→ Save Progress
→ Rewards
→ Parent sees dashboard

Parent Flow
Landing Page
→ See value proposition
→ Register child
→ Dashboard
→ Review progress
→ Upgrade (Phase 2)

10. Success Metrics
Not vanity metrics.

Real metrics:

North Star
Weekly Active Learning Sessions per Child

Supporting Metrics
7-day retention

average session completion

progress improvement %

multiplication mastery speed

parent dashboard visits

premium conversion later

11. Technical Stack
Frontend
Next.js App Router

Backend
Firebase Auth

Cloud Firestore

Firebase Storage

Styling
Tailwind CSS

shadcn/ui where needed

Deployment
Vercel + Firebase

12. Release Plan
Phase 1 (Ship Fast)
Next.js migration

Firebase Auth

MathEngine

EnglishEngine

3 core games

Parent dashboard basic

Phase 2
Premium gating

Subscription flow

AI-generated exercises

Phase 3
Teacher portal

Full curriculum system

Advanced analytics

This is finally something that can be built.

Next:

We should define exact screen-by-screen UX flows
because PRDs fail when screens are vague.



Pasted markdown.md
File
I am already using the below design for the site;

Good — this changes the discussion.

You are not designing from scratch.

You already chose a strong premium visual system: PlayStation-inspired, high-trust, product-first, premium surfaces, strong CTA behavior, clean whitespace, and disciplined interaction rules 

.

That is actually a better direction than most “kids learning apps,” which become visual noise and lose parent trust.

But now comes the hard truth:

Your current visual language and your product promise are slightly in conflict.
PlayStation design signals:

premium electronics

confidence

authority

high-value product

parent trust

Your audience includes:

children ages 4–9

parents making buying decisions

If you lean too hard into PlayStation:
children won’t emotionally connect.

If you lean too hard into “cute kids app”:
parents won’t trust it.

Your real design challenge is not UI.

It is:

Dual-Audience Design
You must design for:

Child Engagement + Parent Trust
simultaneously.

Most people fail here.

What Must Change in Your Current Design System
Not replace.

Adapt.

Layer 1: Parent Trust Layer (Keep PlayStation DNA)
Keep:

premium structure

strong whitespace

black/white/blue authority

polished dashboards

disciplined layout

clean premium landing pages

serious progression UI

This is excellent.

Do NOT throw this away.

This sells subscriptions.

Layer 2: Child Learning Layer (Needs New Design Language)
Your game interfaces must NOT feel like PlayStation product pages.

That would be a disaster.

Kids need:

stronger visual feedback

larger interaction zones

more motion

brighter learning objects

emotional reward loops

visual play

Meaning:

Dashboard = PlayStation
Learning Games = Nintendo
That’s the right split.

Not one style for everything.

Two systems.

One product.

Ruthless UX Architecture
Here’s what your actual platform should be:

Surface A — Marketing + Parent Layer
Style:
PlayStation-inspired premium design

Pages:

Homepage

Pricing

About

Parent dashboard

Login/Register

Progress reports

Subscription pages

This should look premium and trustworthy.

Surface B — Student Learning Layer
Style:
Game-first interaction system

Pages:

Math games

English games

Rewards

Progress maps

Practice sessions

This should feel playful and rewarding.

Not corporate.

Critical Mistake to Avoid
Do NOT use:

hover: scale(1.2)
on every learning interaction.

That works for CTA buttons.

It becomes exhausting inside game UIs.

Imagine 50 draggable math blocks scaling constantly.

Terrible UX.

Your design system must split interaction rules.

Updated Design Rule
Marketing UI
Use PlayStation hover system

YES

Game UI
Use:

snap feedback

success animation

answer validation glow

reward pulses

micro celebrations

NOT premium CTA hover logic.

Huge difference.

Your Real Component Groups
You need 2 design systems:

System A — Premium Shell
Components:

Hero sections

Landing pages

Parent dashboard

Pricing cards

Premium CTA

Progress reports

User profile

Source:
your PlayStation system 


System B — Learning Engine UI
Components:

Number blocks

Carry/borrow grid

Letter drag-drop

Multiplication race

Division visualizer

Reward animations

Practice streak tracker

This must be designed separately.

This is where your product wins.

Immediate PRD Correction
Your PRD must now include:

Design Architecture Section
with:

Shell Design System
and

Learning Engine Design System
separately.

Because they are not the same thing.

Right now your PRD is missing that.

That’s dangerous.

My Strong Recommendation
Before building more features:

Define these 5 exact game screens
in detail:

Addition Carry Grid

Multiplication Race

Letter Fishing

Missing Letter

Parent Dashboard

Because these define your company.

Not the homepage.

Not pricing.

These.

Hard Question
Which one of these 5 screens is your strongest monetization driver?

That one should be designed first.

My answer:

Parent Dashboard
because parents pay.

Most founders wrongly start with the game.

That’s why they struggle to monetize.

Think harder:
what closes revenue, not what looks exciting.


Please suggest me the next steps then.

Your next steps should not be “build more.”

They should be reduce uncertainty.

Right now the biggest risk is not engineering. It’s building the wrong product beautifully.

So the order matters.

Next Steps (in the correct order)
Step 1 — Define the Monetization Core
Answer this first:

Why will a parent pay?
You need one brutal sentence.

Example:

“Your child will improve addition, subtraction, multiplication, and spelling through 15 minutes of structured daily practice, with visible progress reports for parents.”

Not:
“interactive learning platform”

Too vague.
Too weak.

Until this is sharp, everything else is decoration.

Step 2 — Finalize the Exact MVP Scope
Lock this.

No new features.

Write:

Version 1 includes ONLY:
Math
Addition

Subtraction

Multiplication

English
2–5 letter spelling

Parent Dashboard
progress

weak areas

recommendations

Free Playground
limited free practice

That’s it.

Anything extra must be rejected.

Your real job is saying no.

Step 3 — Define the 5 Critical Screens
These screens define your business:

Must Design First
Parent Dashboard

Addition Carry/Borrow Grid

Multiplication Race

Missing Letter Game

Learning Path Progress Screen

Not homepage first.

Homepage-first founders usually fail.

Step 4 — Define Firestore Truth
Your database should reflect:

mastery
not pages.

You must finalize:

users

progress

rewards

recommendations

parent summaries

before writing UI.

Because UI changes.

Data models survive.

Step 5 — Build the Master Engines
Before individual games:

Build:

MathEngine
EnglishEngine
RewardEngine
ParentAnalyticsEngine
Do not build isolated pages.

Build systems.

This is where most teams get trapped.

Step 6 — Choose ONE Proof-of-Concept Game
Only one.

I recommend:

Carry & Borrow Grid
Why?

Because:

it proves real learning value

it supports progression

it is difficult enough to create moat

parents understand its value instantly

“cute spelling game” is easy to copy.

This is stronger.

Step 7 — Validate with Real Parents
Not friends.

Parents.

Ask:

“Would you pay ₹299/month for this?”
and then stay silent.

Do not explain.

Do not defend.

Listen.

Most founders skip this because truth hurts.

Don’t.

Step 8 — Then Build Subscription Flow
Only after value is clear.

Not before.

People integrate payments for products nobody wants.

That’s amateur behavior.

My Brutal Recommendation
Do NOT touch:

AI stories

Teacher portals

Social features

Gamified trophy rooms

50 game ideas

for at least 60 days.

These are procrastination disguised as strategy.

What I Would Personally Do This Week
Day 1
Finalize MVP scope

Day 2
Design Parent Dashboard

Day 3
Design Carry/Borrow Grid

Day 4
Finalize Firestore schema

Day 5
Build MathEngine foundation

Day 6
Build first game POC

Day 7
Test with 5 real parents

That is real progress.

Not brainstorming.

Your Immediate Next Move
We should do this next:

Parent Dashboard PRD
because that is your monetization engine.

Not because it’s exciting.

Because it matters most.

That is the next correct step.


Ok. Let us stick to the monetization game. Give me a full detailed PRD in markdown so that I can start building the kiddy app full fledged for MVP. I will use continue agent with qwen 3.6 to understand my current implementation and continue with the next steps.

Kiddy Learning Engine — MVP PRD
Parent-Paid Learning Platform for Foundational Math + English
Document Version
Version: 1.0
Product Stage: Ruthless MVP
Primary Goal: Revenue-first MVP
Secondary Goal: Child engagement and retention
Target Build Stack: Next.js + Firebase + Firestore + Tailwind + TypeScript

1. Product Vision
Kiddy is a structured daily learning platform for children (ages 4–9) focused on foundational mathematics and English skills.

It is not a “games website.”

It is a parent-paid learning system where children improve through short daily practice sessions and parents receive visible progress reports, weakness analysis, and confidence that learning is happening.

The product combines:

Interactive learning games

Structured progression paths

Saved learning state

Parent progress visibility

Premium subscription pathway

The business model is built around parent trust, not child entertainment.

2. Core Monetization Thesis
Parents do not pay for games.

Parents pay for:

measurable improvement

routine and consistency

weak area identification

visible progress reports

confidence in academic growth

The platform must optimize for parent trust first and child engagement second.

Core Purchase Sentence
“Your child improves addition, subtraction, multiplication, and spelling through just 15 minutes of structured daily practice—with visible progress tracking for parents.”

This is the product.

Everything else supports this.

3. MVP Scope (Strict)
Included in MVP
Student Side
Free Playground (limited)

Structured Learning Path

Math Engine

English Engine

Basic Rewards System

Login + Progress Save

Daily Practice Flow

Parent Side
Parent Dashboard

Weak Area Reporting

Progress Summary

Recommended Next Practice

Platform
Firebase Authentication

Firestore Progress Engine

Premium Route Gating

Basic Premium Upgrade Flow (without advanced billing logic)

Excluded from MVP
Do not build these now:

Teacher Portal

AI-generated stories

OpenAI integration

Advanced subscriptions

Stripe automation

Classroom features

Social competition

Multiplayer

Printable worksheet engine

Advanced gamification trophy rooms

Full admin CMS

Cambridge certification mapping

Push notifications

Mobile app native version

These are Phase 2+.

Do not poison MVP with them.

4. User Roles
A. Student
Responsibilities
Practice learning modules

Complete games

Improve mastery

Earn points and badges

Primary Goal
Learning through repetition + visual engagement

B. Parent
Responsibilities
Create account

Monitor progress

Understand weak areas

Decide premium upgrade

Primary Goal
Confidence and trust in child improvement

Revenue Owner
This is the paying user.

Optimize for this role.

C. Admin (Internal Only)
Responsibilities
Content management

Manual corrections

Monitoring user data

MVP Note
Firebase Console is enough initially.

Do not overbuild admin.

5. Product Architecture
Surface A — Free Playground (Traffic Engine)
Purpose
SEO + acquisition + trust building

Access
No login required

Included Modules
Free Math
Counting

Simple addition

Simple subtraction

Multiplication table basics

Free English
Letter recognition

2-letter words

3-letter words

Features
Instant play

No saved progress

No personalization

Conversion Goal
Move users to account creation

Surface B — Premium Learning Path (Revenue Engine)
Purpose
Retention + monetization

Access
Login required

Features
Saved progress

Structured progression

Adaptive difficulty

Rewards

Parent reporting

Surface C — Parent Dashboard (Monetization Engine)
Purpose
Subscription trust layer

Features
Progress visibility

Weak area analysis

Recommended next steps

Time spent

Session consistency

This is the revenue closer.

6. Learning Curriculum
Mathematics Progression
Level 1 — 1 Digit
Skills
Counting

Addition

Subtraction

Examples
4 + 3
8 - 2

UI
Visual blocks + drag/drop

Level 2 — 2 Digits
Skills
Addition

Subtraction

Place value understanding

Examples
24 + 15
47 - 13

UI
Base-10 rods + number blocks

Level 3 — 3 Digits
Skills
Carrying

Borrowing

Examples
458 + 267
703 - 284

UI
Carry/Borrow Grid

This is the most important game.

Level 4 — Multiplication Foundations
Skills
Tables

Repeated addition

Examples
7 × 8

UI
Multiplication Race

Level 5 — Division Foundations
Skills
Grouping

Equal sharing

Examples
12 ÷ 3

UI
Division Splitter

English Progression
Level 1 — 2 Letter Words
Examples
at
in
on

UI
Letter Fishing

Level 2 — 3 Letter Words
Examples
cat
dog
sun

UI
Missing Letter

Level 3 — 4 Letter Words
Examples
stop
play
chat

UI
Spell Builder

Level 4 — 5 Letter Words
Examples
apple
train
clock

UI
Word Challenge

Level 5 — Simple Sentences
Example
The cat is on the ___

UI
Read & Choose

7. Core Games
Game 1 — Carry & Borrow Grid
Goal
Math mastery

Importance
Highest retention value

Functionality
vertical column math

carry input boxes

borrow indicators

answer validation

retry loop

Monetization Impact
Very high

Parents instantly understand its value

Game 2 — Multiplication Race
Goal
Fast multiplication recall

Functionality
timed rounds

score streaks

leaderboard local only

Game 3 — Missing Letter
Goal
Spelling development

Functionality
C _ T

Choose correct missing letter

Game 4 — Letter Fishing
Goal
Phonics learning

Functionality
Audio + drag/drop letters

Game 5 — Learning Path Screen
Goal
Progress visualization

Functionality
completed modules

next lesson

rewards progression

8. Parent Dashboard PRD
Purpose
This page sells the subscription.

Not the homepage.

Required Sections
A. Child Progress Summary
Shows
Current level

Current subject

Progress %

Weekly consistency

B. Strength Areas
Example
Strong in:

addition

2-letter spelling

C. Weak Areas
Example
Needs practice in:

borrowing

multiplication recall

This is the conversion trigger.

D. Time Spent
Shows
daily learning minutes

weekly totals

E. Recommended Next Practice
Example
Recommended today:

“Carry over addition practice”

F. Reward Summary
Shows
points

badges earned

Parent Dashboard Rule
Clarity > beauty

No dashboard clutter.

9. Core Engines
Build engines, not pages.

MathEngine
Handles:

problem generation

answer validation

level progression

mastery scoring

EnglishEngine
Handles:

spelling progression

difficulty scaling

word generation

RewardEngine
Handles:

points

badges

streaks

ParentAnalyticsEngine
Handles:

weak area detection

mastery reports

next recommendations

This is the real product.

10. Firestore Schema
Collection: users
{
  "uid": "",
  "name": "",
  "email": "",
  "role": "student | parent",
  "isPremium": false,
  "createdAt": "",
  "lastLogin": ""
}
Collection: user_progress
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
Collection: rewards
{
  "userId": "",
  "points": 1200,
  "badges": [
    "Addition Master",
    "Spelling Star"
  ],
  "streakDays": 7
}
Collection: sessions
{
  "userId": "",
  "date": "",
  "subject": "math",
  "durationMinutes": 18,
  "completedModules": 3
}
11. User Flows
Student Flow
Landing Page
→ Free Playground
→ Wants Progress Save
→ Register/Login
→ Learning Path
→ Game Session
→ Save Progress
→ Rewards

Parent Flow
Landing Page
→ Understand Value
→ Register Child
→ Parent Dashboard
→ Review Progress
→ Upgrade Premium

12. Success Metrics
North Star Metric
Weekly Active Learning Sessions Per Child
Supporting Metrics
7-day retention

average completed sessions

progression improvement %

weak area reduction

parent dashboard return visits

premium conversion rate

Do not chase vanity metrics.

13. Technical Stack
Frontend
Next.js App Router

Backend
Firebase Authentication

Cloud Firestore

Firebase Storage

Styling
Tailwind CSS

shadcn/ui

Deployment
Vercel + Firebase

14. Release Phases
Phase 1 — Ship Fast
Next.js migration

Firebase Auth

Firestore schema

Parent Dashboard

MathEngine

EnglishEngine

Carry/Borrow Grid

Missing Letter Game

Phase 2
Premium gating

Billing integration

Advanced progression

Phase 3
AI-generated exercises

Teacher portal

Advanced analytics

Final Rule
If a feature does not improve:

Parent trust
or

Child measurable progress
it should not be built.

That discipline is what creates a company instead of a side project.



