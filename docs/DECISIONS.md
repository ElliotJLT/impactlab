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

## 006 — Idea locked (Option 3, single-signal). Working title: Nocturne
**When:** 17:10 · **Who:** Samantha
**Decision:** Building a capture app that surfaces the recurring thread a creative keeps circling.
**Name is a working title only — "Nocturne" pending team sign-off.** It evokes the dream/night
framing: the weekly read does what sleep does to memory — consolidates scattered fragments and
surfaces the connection you didn't consciously make. If the name changes, it lives in a handful
of spots: `layout.tsx`, `manifest.ts`, `page.tsx` header, `read/page.tsx` footer, the
`STORAGE_KEY` in `lib/fragments.ts`. One general engine tailored to the user's practice at signup; documentary
filmmaker is the *demo* persona, not a vertical. The Claude brain has two jobs kept separate
(interpret in idiom · surface the buried thread against the stated subject) and **generates
nothing** — it only reflects the user's own fragments back.
**Why:** Option 3 from the merge doc, simplified. Dropped the stated-priority/divergence input:
the app just surfaces recurrence and distinguishes buried thread vs stated subject. Proven
end-to-end before scaffolding (see `prototype/`), so the risky part was de-risked first.

## 007 — Model: Sonnet 5 for the demo
**When:** 17:10 · **Who:** Samantha
**Decision:** `claude-sonnet-5` for the weekly read. Opus 4.8 kept as fallback.
**Why:** Ran the same fragments through both. Sonnet's count contrast (buried 6× vs stated 3×)
reads better on a screen in two seconds than Opus's more literal 6-vs-6 tie, and it's cheaper
and faster on a live call. Opus's prose was marginally finer — not worth the trade for a demo.

## 008 — Deploy to Railway, not Vercel (overrides 005's platform)
**When:** 17:20 · **Who:** Samantha (team agreed)
**Decision:** Deploy to Railway. Next.js runs as a long-lived Node server (`npm run start`,
binds Railway's `$PORT`); config in `railway.json`, Node pinned in `.nvmrc`. `ANTHROPIC_API_KEY`
set in Railway's env — production uses the SDK. Local dev needs no key: the API route
auto-falls-back to the Claude Code CLI (`claude -p`, free on the Max plan) when no key is set.
**Why:** Team's platform of choice and matches our house conventions; DECISION 004/005's
mobile-PWA/HTTPS reasoning is unchanged — only the host moves. Trade: Railway needs a start
command and an env var Vercel would have inferred, but it's the platform we operate confidently.

<!-- next entry below -->
