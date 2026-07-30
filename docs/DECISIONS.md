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

<!-- next entry below -->
