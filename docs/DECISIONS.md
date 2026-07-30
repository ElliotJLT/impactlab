# Decisions

Append-only. Newest at the bottom. One entry per decision that someone would otherwise have to reverse-engineer from the code.

Worth logging: stack and library choices, what we're faking and why, anything we cut, anything we tried that didn't work. Not worth logging: normal implementation detail.

Format — keep it to a few lines:

```
## NNN — Title
**When:** HH:MM · **Who:** name
**Decision:** what we're doing.
**Why:** the reason, including what we traded away.
```

The "why" is the part that earns its keep. In two hours someone will want to change this and needs to know what it costs.

---

## 001 — Docs-first repo, stack deferred
**When:** 16:20 · **Who:** Elliot
**Decision:** Repo ships with docs and Claude config only. No app scaffold until the idea is locked in `SCOPE.md`.
**Why:** Four people cloning at once, each running `npm init` on their own branch, produces four incompatible codebases and a merge problem at 18:00. One person scaffolds once, after the idea is decided, and pushes to `main`.

## 002 — Trunk-based, no review gate
**When:** 16:20 · **Who:** Elliot
**Decision:** Short-lived branches merged straight to `main`. No approval required. `git pull --rebase` before every push.
**Why:** PR review latency costs more than it saves over three hours. The trade is that `main` can break — mitigated by small, frequent commits and one named integrator.

## 003 — Identity is detected, not asked
**When:** 16:25 · **Who:** Elliot
**Decision:** Claude resolves who it's working for via `git var GIT_AUTHOR_IDENT` rather than asking at session start. Roster and branch prefixes live in `CLAUDE.md`.
**Why:** Asking is friction repeated every session, and there's nowhere durable to store the answer. Note `git config user.name` was empty on a clean machine — git falls back to the macOS account name, so `git var` is the command that actually resolves. Hence the one-time `git config` step in the README: it fixes GitHub attribution too.

## 004 — Mobile-first PWA with a fixed design system
**When:** 16:45 · **Who:** Elliot
**Decision:** Every screen is designed for a phone (390×844) as a rule, not a responsive afterthought. Tokens, type scale, components and the PWA checklist live in `docs/DESIGN.md`, and `CLAUDE.md` makes reading it mandatory before any UI work. One accent colour; fonts fixed to Geist Sans/Mono plus Instrument Serif.
**Why:** The use case is a 3-minute session, one hand, on a platform, so desktop-first would design for the wrong body. Four agents with no shared tokens also produce four visual languages, which reads as a broken product in a 3-minute demo. What it costs us: no desktop-specific layout, and nobody gets to pick their own palette.

## 005 — No service worker
**When:** 16:45 · **Who:** Elliot
**Decision:** PWA installability via manifest, icons and HTTPS only. No offline support.
**Why:** Service workers are the classic PWA time-sink and buy nothing in a live demo on venue wifi. The trade: the app won't work offline, which no judge will test.

## 006 — Dream-cycle concept as placeholder; lanes split
**When:** 17:05 · **Who:** Elliot
**Decision:** Working concept "Sleep On It": voice-note fragments captured over weeks, an overnight dream cycle that deconstructs and collides them (quotes verbatim, never composes), rare eureka slot. Master prompt and output schema in `prompts/dream.md`, seed shape in `data/archive.seed.json`, app↔LLM contract in `docs/API.md` — all placeholder pending Samantha's scoping. Lanes: app scaffold is owned separately; Elliot owns the LLM side.
**Why:** Builds on the decided Option 3 in `daily-1pc-merge-options.md` and keeps its no-generation constraint as a hard rule in the prompt. Splitting lanes now lets prompt tuning and app scaffolding run in parallel against one written contract instead of a conversation.

## 007 — Dream may extend, one step, from archive materials only
**When:** 17:15 · **Who:** Elliot — **needs Samantha's sign-off, loosens her constraint**
**Decision:** Collisions and eurekas may carry an `extension`: 1–2 sentences dreaming the thought forward, recombining only what's already in the archive, rendered visually distinct from the user's quoted words. Finished material in the user's medium remains failure.
**Why:** Sleeping on something doesn't just replay, it runs memories forward — and Elliot wants the hidden-intersection value, not just pattern reflection. The line moves from "never generates" to "never ghostwrites": extensions are discardable guesses built from your own materials. If that line proves uncomfortable, deleting the extension rule from `prompts/dream.md` and the field from the schema reverts it cleanly.

## 008 — App scaffold landed (Next.js + Railway). Working title: Nocturne
**When:** 17:10 · **Who:** Samantha
**Decision:** Scaffolded the app in parallel with Elliot's LLM lane: Next.js 16 + TS + Tailwind v4,
three screens (Capture / Week / Read), PWA per `DESIGN.md`. Working title "Nocturne" (pending team
sign-off) — same dream/night framing as "Sleep On It". Name lives in `layout.tsx`, `manifest.ts`,
`page.tsx`, `read/page.tsx`, and `STORAGE_KEY` in `lib/fragments.ts` if it changes.
**Why:** De-risked the LLM side end-to-end before scaffolding (see `samantha/claude-brain` branch).
The scaffold owns the app lane per the `CLAUDE.md` ownership table; it codes against Elliot's
`docs/API.md` contract (reconciliation pending — see 010).

## 009 — Deploy to Railway, not Vercel (overrides 005's platform)
**When:** 17:20 · **Who:** Samantha (team agreed)
**Decision:** Deploy to Railway. Next.js runs as a long-lived Node server (`npm run start`,
binds Railway's `$PORT`); config in `railway.json`, Node pinned in `.nvmrc`. `ANTHROPIC_API_KEY`
set in Railway's env. **Note:** Elliot's `docs/API.md` assumes Vercel (`maxDuration = 60`,
env-in-project-settings) — those specifics move to Railway equivalents; the timeout concern
still applies (a long dream cycle needs the server to not kill the request).
**Why:** Team's platform of choice and matches our house conventions; DECISION 004/005's
mobile-PWA/HTTPS reasoning is unchanged — only the host moves.

## 010 — Extensions approved (Option B); two brains merged into one prompt
**When:** 17:30 · **Who:** Samantha (signs off 007) + Elliot
**Decision:** Samantha signs off Elliot's 007 extension loosening — **Option B**. The AI's role is
to help the user connect the dots between their own fragments, which is core value, not ghostwriting;
extensions recombine only archive material and render visually distinct. The two independently-built
brains (Samantha's `lib/prompt.ts` buried-vs-stated reflection + Elliot's `prompts/dream.md`
mechanism-match/collisions/eureka) are reconciled into one master prompt — draft for review in
`docs/master-prompt-MERGED-for-review.md`. Next: agree that prompt, then update the route + Read
screen to Elliot's `POST /api/dream` contract and retire the placeholder `/api/weekly-read`.
**Why:** Option B was flagged for Samantha's call in 007; approving it aligns both brains, so the
merge is additive not competitive. Keeping both people's work (mechanism-match is the sharpest idea
in either; the buried-vs-stated frame is the proven "oh") beats picking a winner.

## 011 — App wired to the dream contract; entry-UX copy applied
**When:** 18:15 · **Who:** Elliot
**Decision:** The scaffold now runs against `POST /api/dream` (route + `lib/dream.ts` copied
from Elliot's lane per `docs/API.md`); the placeholder `/api/weekly-read` and `lib/prompt.ts`
are deleted. `lib/fragments.ts` stores the full archive shape (`user` + `notes[{id,text,at}]`,
seeded from `data/archive.seed.json`; live notes get `live-N`). Capture screen carries
`docs/ENTRY-UX.md` verbatim-ish: invitation + rotating re-entry prompts, worked example below
the box, "Just say it out loud" mic, transcript hidden while listening. Read is now the wake
screen (reading / collisions / eureka-or-calm-null, extensions rendered as "the dream's guess").
`globals.css` flipped to DESIGN.md's dark-first tokens (+`--surface-raised`, `--glow`,
`--spring`); PWA colours match the dark canvas. Verified: `npm run build` clean, live
`/api/dream` call returns schema-valid dream on the seed archive.
**Why:** Decision 010's named next step. The old brain and the new one disagreed on the wire
shape, so keeping both was a merge trap. What it costs: the localStorage key changed
(`nocturne.archive.v1`), so anything captured under the old key is orphaned — nothing real
exists there yet. Design folk restyle from here; the API contract and copy reasoning stay put.

## 012 — Named Muse; app CSS on the warm bloom tokens; deploying to Vercel
**When:** 18:25 · **Who:** Elliot
**Decision:** The app is **Muse** (was working title Nocturne) — updated in `layout.tsx`,
`manifest.ts`, the capture header, and the localStorage keys (`muse.archive.v1`). App
`globals.css` now implements the warm two-theme + bloom tokens from PR #1's `DESIGN.md`
(the follow-up that PR asked for), including the drifting `body::before` bloom with its
reduced-motion freeze; PWA colours match the new `#0E0B09` canvas. Deploying to **Vercel**
per `docs/DEPLOY.md` (Railway incident) — and the live route is now `/api/dream`, so
DEPLOY.md's "placeholder brain deploys" caveat no longer applies.
**Why:** Team rename + designer's palette, applied app-side so the doc and the running app
match before the demo. Note for PR #1 on merge: its `DECISIONS.md` entry is also numbered
011 — renumber to 013 when rebasing, don't collapse into this one.

<!-- next entry below -->

## 013 — Seed archive redesigned for a repeatable demo
**When:** 18:55 · **Who:** Elliot
**Decision:** Rewrote `data/archive.seed.json`. The buried thread is now concrete and
nameable — Sam's dad and the rented lock-up workshop (n02, n05, n07, n09, n10, each naming
dad or the workshop outright) against the stated renting hour (n01, n03, n04, n06, n08, n11,
n12). The two threads share no vocabulary, so a collision can only be a mechanism match.
Cut the wide-angle-listing-photos note (it was the hub of a "the market lies" cluster and
produced 5d and 10d collisions) and the "smell hits before the door's open" clause (it
cheap-matched the sawdust note on a shared sensory hook). Dropped `dormant_project` —
it named the workshop in the user block, handing the model the reveal. Regenerated
`data/dream.fallback.json` from a verified run.
**Why:** The output was too random to rehearse against: the revealed theme was worded
differently every cycle and collisions included weak same-week pairs. Measured over 4 runs
on the new seed, the revealed thread is identical every time (n02,n05,n07,n09,n10), every
collision spans 15–38 days, and the eureka fires only with the stage note. What it costs:
two decent jokes (the wide-angle bit, the mould line) traded for a rehearsable demo, and
the fallback had to be regenerated because it quoted the old note ids.

## 014 — Week screen reversed and softened; gradient CTA; saved-toast lifts away
**When:** 19:05 · **Who:** Elliot
**Decision:** Week lists newest-first (the note you just caught is the one you see), cards
drift in staggered, and the list dissolves into the bottom bar via a gradient scrim instead
of a hard `border-t` — the bar now carries the canvas colour. Primary `Button` is filled with
a new `--accent-grad` token (lit from the top) and a soft warm shadow, at 56px tall. The save
confirmation is now "Caught. Sleep on it." and rises away rather than blinking out
(`rise-away`, sanctioned motion 1). Capture's count pill got real padding and a full 48px
tap target.
**Why:** Elliot's call on the demo screens. Contrast recomputed rather than eyeballed: the
gradient's light end measures 8.77:1 in dark and 4.83:1 in light against `--accent-on`/white,
both AA — light mode cannot go brighter than `#B85512` without failing, which is why the two
themes use different gradient stops. Both new animations are gated behind
`prefers-reduced-motion: no-preference`, so reduced-motion users see static text at full
opacity rather than an element stuck at `opacity: 0`.
