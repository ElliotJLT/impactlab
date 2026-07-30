# Entry UX — getting people to speak their ideas, extensively

For the front-end team, while you design the capture screen. This is the load-bearing moment:
the engine returns nothing from an empty archive, so **the entry point is the product**. Speaking
half-formed ideas aloud, at length, unpolished, is not natural for most people. This doc is how we
lower that barrier — with specific copy, not vibes.

Owner note: this is UX guidance from the LLM/scoping side (Samantha). Copy is a starting point —
edit freely. The *reasoning* behind each choice matters more than the exact words.

---

## The core insight

The product's promise — *"your half-thoughts are the valuable part, don't tidy them"* — is the same
message that unblocks the speaking. We don't overcome the anxiety with a separate trick; we teach the
product's philosophy **by how we ask**. Every line of entry copy is that philosophy in disguise.

## Why people freeze (the barriers we're designing against)

1. **Performance anxiety** — a mic feels like it records something that will be judged, so people
   self-edit and wait for "something good" (which never comes).
2. **Blank-slate paralysis** — "say whatever's on your mind" gives nothing to push against.
3. **Fragment-isn't-worth-it** — people think their job is polished output; a half-thought feels like
   wasting the tool's time.
4. **No visible payoff yet** — why talk for 90 seconds when you can't see what it does?

Each fix below maps to one of these.

---

## First-time entry — the screen

### Layout (top to bottom)

1. **The invitation** (in/above the capture area)
2. **The mic button** (primary action, bottom third — DESIGN.md rule 2)
3. **The worked example** (underneath, quiet/muted styling)

Putting the example **below**, not above, is deliberate: above the box it reads as an instruction
("do it like this" → pressure); below, it reads as permission ("here's what's okay" → safety). It
models the register without commanding it.

### Copy (starting point)

**The invitation:**
> **What's rattling around today?**
> Doesn't have to make sense. Half a thought is the whole point.

**The mic button (idle):**
> ● Just say it out loud

**While recording — transcript HIDDEN (see below):**
> *Listening… take your time. Ramble.*
> ◼ Done

**The worked example (underneath, muted):**
> *Someone dropped this in yesterday:*
> "the empty chair at the diner... dunno, it just stuck with me. and the way my dad went quiet
> when the news came on. not connected, probably."
> *↳ That's it. That's a good one.*

### Why this copy works

- **"Half a thought is the whole point"** — kills barrier 3 (fragment-isn't-worth-it). Product
  philosophy as reassurance.
- **"Ramble."** — one word, explicit permission to be extensive and shapeless. This is the "go all
  in" nudge. Kills barrier 1.
- **The example is deliberately incoherent and self-doubting** ("dunno," "not connected, probably")
  — models the *real* register (barrier 3), and quietly plants that seemingly-unconnected fragments
  are exactly what the engine connects (a stealth teaser for barrier 4 — without spoiling the reveal).
- **"That's a good one"** — validates messiness *as* quality. Flips good=polished.

---

## Hide the transcript while speaking — a firm recommendation

**Do not show words appearing live as the user talks.** Watching yourself transcribe makes people
self-edit, correct, and clam up — the opposite of extensive rambling. Show the text only *after* they
tap Done.

- While recording: a calm "Listening… ramble" state, no words.
- On stop: the transcript appears, editable, with a clear "add more" affordance.

This pairs with the whole entry philosophy: we engineer *low self-consciousness*, and a live transcript
is a mirror that raises it. (Technical note: the browser Web Speech API returns final results only in
our current build — good; keep interim results off, which also happens to hide the live transcript.)

---

## Re-entry / cold-start — just as important

The archive needs MANY fragments across days for the weekly read to find anything. The first capture
is only half the job; the **return visit** must never feel cold or blank.

### On return (day 2+), rotate a single gentle prompt

One soft question, answerable in a sentence, different each visit so it never feels like a form:

- "What did you notice since yesterday?"
- "What's still nagging at you from earlier?"
- "Overheard anything worth keeping?"
- "What keeps pulling your attention back?"
- "Anything you can't quite explain yet?"

Rules:
- **One question, not a menu.** A choice is friction; a single prompt is a doorway.
- Keep them **observational, not productive** — "what did you notice" not "what did you work on."
  We want raw noticing, not status updates.
- Show a soft count of momentum ("6 fragments this week") as gentle encouragement — never a
  guilt-inducing streak or an empty-state scold.

### Promise the payoff, never show it

A quiet line that gives a reason to keep feeding it, without revealing what it'll find (that's the
weekly read's job):

> *The more you drop in, the more it can show you at the week's end.*

---

## Accessibility (DESIGN.md, non-negotiable)

- The "listening" feedback must **not rely on a pulse animation alone** — pair colour + a text label,
  and honour `prefers-reduced-motion` (no pulse for those users).
- Mic button ≥ 44px, primary action in the bottom third, input at 16px min.
- The worked example is decorative-adjacent but should still be real text (screen-reader legible),
  not an image.

---

## What we're NOT doing (and why)

- **No forced minimum length / "speak for 30s" timer as a gate** — pressure raises the barrier we're
  lowering. Invite length ("ramble"), don't mandate it.
- **No tips/tutorial carousel** — friction before value. The worked example IS the tutorial.
- **No live transcript** — see above.
- **No streak-shaming empty states** — encouragement, never guilt.
