# Daily 1% Better × Idea-First Entry Point

Four ways these could merge, plus the thing worth deciding before we pick one.

---

## The tension worth naming first

The two ideas have opposite theories of what makes a user better.

**Daily 1% Better** supplies content into idle time — consumption, breadth, streaks.
**Idea-first entry point** pressure-tests the user's own thinking — production, depth, no content supplied.

That's not a style difference, it's a disagreement about mechanism. A merge that ignores it produces a tool with a confused pitch, which is the usual way hackathon mergers fail. So the useful question isn't "where do they overlap" but **which idea absorbs the other**.

---

## Option 1 — The micro-moment becomes a thinking prompt

Same trigger, same three-minute slot. Instead of delivering a Spanish phrase, it asks what you're chewing on and does a structural read on your answer.

> "Waiting for the train"
> → *What's on your mind about the Henderson pitch?*
> → user dictates 90 seconds
> → returns: the claim you're making · the assumption you didn't state · the thinnest point · the strongest counter

Their surface, the other engine. Keeps the existing demo shape and the personalisation/memory stack, and swaps consumption for production.

**Cleanest merge. Both contributions survive intact.**

---

## Option 2 — Two modes, honestly separated

Learn mode when you have nothing in your head. Think mode when you do. The entry point asks which.

Easier to agree on politically, because nobody's idea gets cut. But it's a weaker pitch — two half-products, and the judge hears "we couldn't decide."

---

## Option 3 — Idea capture over time

The app catches half-thoughts as they occur through the day rather than filling dead time with facts, then does something across them at week's end.

Not *27 facts learned* but:

> You circled this problem three times this week. Here's the thread connecting the fragments.

This turns the memory/recommendation stack into something genuinely novel, and it's the version where the weekly summary gets interesting.

**Most original of the four. Higher build risk — needs state.**

---

## Option 4 — Existing content, better affordance

Keep the learning sessions, fix the entry point so it invites a thought rather than issuing a menu.

Cheapest merge, least interesting. The idea-first contribution reduces to copywriting.

---

## DECIDED: Option 3

Plus the decisions made since.

### Audience: creatives

The strongest case isn't the AI-hostility angle — that tells us who's resistant, not who's underserved. It's that **creatives' work already runs on unfinished material**. Notebooks, scraps, voice memos: capturing fragments and returning to them later is the native practice, currently done badly across Notes apps, camera rolls and half-lost recordings. We're not teaching a new behaviour, we're serving one that exists and is poorly tooled.

This also handles the AI-anxiety problem structurally rather than rhetorically. What creatives fear is *generation* — the machine making the work. **This app generates nothing.** It captures what you said and reflects patterns back. Worth treating as a hard constraint: if it starts suggesting ideas, we've become the thing they're afraid of. Good demo line too: "we deliberately don't generate."

### Not a vertical — onboarding shapes the prompt

One engine serving any creative practice, tailored at signup. The persona becomes a demo choice rather than a product constraint, so changing it late costs a seed set, not a rebuild. And "it generalises" is a stronger pitch than "we built the documentary one."

Three or four questions max — anything longer is friction before the user has seen value:

- **What kind of work do you make?** → shapes vocabulary and what counts as a fragment
- **What are you working on right now?** → the stated priority, one half of the divergence signal
- **How does an idea usually arrive for you?** → observations, phrases, images, questions
- *Optional:* **what's a project you abandoned or keep coming back to?** → seeds the revealed side so week one isn't empty

The master prompt has **two jobs that shouldn't be collapsed**: *interpretation* (reading fragments in the idiom of their practice) and *divergence detection* (stated vs revealed). Onboarding feeds the first. The second stays practice-agnostic — recurrence is recurrence regardless of medium.

### Context input: interpret, don't weight

Capturing who they are and what they're working on: yes. But **weighting fragments toward a stated goal cuts against what makes option 3 interesting.** The value is surfacing the thread you didn't notice you were pulling on. If the system amplifies what you already told it to care about, it confirms your existing priorities back to you — duller product, closer to a to-do app.

Keep two signals, held separately:

| Signal | What it is |
|---|---|
| **Stated priorities** | What you told it matters — the album, the client work, the income goal |
| **Revealed preoccupation** | What you actually keep returning to, measured by recurrence |

**The interesting output is where these diverge:**

> You said the priority was the passive income project. You've mentioned it twice this week. You've circled back to the thing about your father's workshop five times.

No other tool does this, and it names a very familiar creative experience — the gap between the work you think you should be doing and the work that keeps surfacing.

### Demo persona: standup

Two cautions if we stick with it. Comedy fragments are hard to write well and land badly if they're not funny — we'd be asking judges to evaluate the app while quietly evaluating the jokes. And standup is iteration on bits, so "you keep circling this without noticing" is less natural than for a filmmaker or novelist, where finding the buried through-line *is* the work.

**Fix:** seed fragments that are *observations* rather than punchlines — the raw noticing that precedes material, not finished bits. Plays to option 3's strength, sidesteps the is-it-funny problem.

### Build notes

- **Capture must be near-frictionless** or the data never accumulates. Voice in, no categorising, no tagging.
- **We can't wait a week for the demo.** Pre-seed a plausible fragment history for the persona, add one live on stage, run the weekly read. 8–12 fragments across a fake week — most on the stated project, a few on the buried thread, timestamps spread out.
- **Onboarding is cheap** — a few fields at signup interpolated into the system prompt. No extra infrastructure.
- **Parallel workstreams:** onboarding + prompt · capture · weekly read · seed set.
- The seed set decides whether the output lands sharp or mushy. Fixed slots in the weekly read so vagueness is visible while we iterate.

---

## Two things to settle early

**The framing that makes this an upgrade rather than a competing pitch:** the concept is about reclaiming wasted moments, and the sharpest use of a three-minute gap isn't consuming a fact you'll forget — it's getting your own half-formed thought pressure-tested.

**The metrics break under options 1 and 3.** *27 facts, 14 vocabulary words* measure consumption. If we go with either of those, the weekly summary needs rethinking. Worth raising now rather than at 7pm.

---

## Background: why the idea-first entry point exists

A blank box saying *"How can I help you today?"* presupposes the user's job is issuing requests, so people use it like a search bar. Nothing in the interface suggests bringing your own half-formed thinking.

The design choice that matters is **invitation, not refusal**. A tool that blocks blank prompts is a freedom threat, and gets rejected by exactly the users who'd benefit most — that comes out of psychological reactance findings in my doctoral research on why people reject messaging aimed at them. Making the better path the easier one works where blocking the worse path doesn't.

Half-thoughts aren't a lesser input to be tolerated. They're often the higher-value one, because they're the part that's genuinely yours and hasn't been smoothed into something safe yet.
