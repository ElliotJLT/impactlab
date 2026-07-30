# Impact Lab

Team build for the **Claude Communities Impact Lab** (London, 30 July 2026). Four people, one repo, ~3 hours, demo at 19:00.

Full brief: [`docs/BRIEF.md`](docs/BRIEF.md) · What we're building: [`docs/SCOPE.md`](docs/SCOPE.md) · Design system: [`docs/DESIGN.md`](docs/DESIGN.md) · Why we chose it: [`docs/DECISIONS.md`](docs/DECISIONS.md)

**Building any UI? Read [`docs/DESIGN.md`](docs/DESIGN.md) first.** Mobile-first PWA, 390×844, shared tokens. It's a phone app.

---

## Start here (60 seconds)

```bash
git clone https://github.com/ElliotJLT/impactlab.git
cd impactlab
cp .env.example .env.local   # paste the Anthropic credit key from the event

# One-time: make your commits attribute to you (10 seconds, do it now)
git config user.name  "Your Name"
git config user.email "your@github-email.com"   # must match your GitHub account
```

Skip the `git config` step and git silently invents an identity from your Mac's account name (`elliot@Elliots-MacBook-Air.local`) — commits still work, but they won't link to your GitHub profile and Claude can't tell who it's working for.

Then open Claude Code in this directory. It reads [`CLAUDE.md`](CLAUDE.md) automatically — that's your briefing, the ground rules, and who owns which files. Read it before your first prompt.

> **No app scaffold yet.** The stack gets committed once the idea is locked (see `docs/DECISIONS.md`). Until then this repo is docs only — don't `npm init` on your own branch, you'll fork the codebase four ways.

## New here? Start with these two things

**1. What this repo is right now: docs only.** No app code, and the idea isn't locked. Read [`docs/BRIEF.md`](docs/BRIEF.md) for what the organisers actually asked for, then [`docs/SCOPE.md`](docs/SCOPE.md) for what we decided. **If `SCOPE.md` is still full of blanks, we haven't chosen yet — and your answer below is part of how we choose.**

**2. Fill in your own row, then commit it.** One row each, so four people editing this table at once merges cleanly instead of conflicting.

| Person | Strongest with | Happy to own | Prompt you'd pick |
|---|---|---|---|
| Zan S. | | | |
| Andrei I. | | | |
| Elliot L. | | | |
| Samantha N. | | | |

- **Strongest with** — be blunt and specific. "React + Tailwind, shaky on backend" is useful. "Full-stack" isn't.
- **Happy to own** — frontend / API + Claude calls / data + seeding / demo script & narrative
- **Prompt you'd pick** — `1` better users · `2` accessible to all · `3` communities thrive ([`docs/BRIEF.md`](docs/BRIEF.md))

```bash
git add README.md
git commit -m "Zan: intake"
git pull --rebase origin main && git push
```

Worth the two minutes: role and file-ownership assignment falls straight out of this table, and it smoke-tests your git setup before a broken setup costs you something.

## Working agreement (the short version)

| | |
|---|---|
| **Branch** | `yourname/what-youre-doing` off `main` — e.g. `andrei/match-api` |
| **Merge** | Straight to `main` via PR, no review gate. Ship it. |
| **Before every push** | `git pull --rebase origin main` |
| **Never** | `git push --force` to `main` |
| **Commits** | Small and often. A broken `main` blocks the other three. |
| **Blocked >10 min** | Say so out loud. Don't debug alone. |

## Who's doing what

Team: **Zan S., Andrei I., Elliot L., Samantha N.**

Assign the two roles at kick-off. Ambiguity here is what kills hackathon teams — everyone builds, but these two jobs need a name against them.

| Role | Who | Owns |
|---|---|---|
| **Demo driver** | _TBD_ | The 3-minute script, and the laptop it runs on. Writes `docs/SCOPE.md` demo table. |
| **Integrator** | _TBD_ | Merges to `main`, resolves conflicts, calls the cut line at 18:00 |

Everyone also owns an area of the codebase — table in [`CLAUDE.md`](CLAUDE.md#file-ownership). Doubling up on roles is fine; leaving them unassigned is not.

You don't need to tell Claude who you are — it reads your git identity. Confirm yours is set (see the setup block above):

```bash
git config user.name   # should return your name. Empty means you skipped the setup step.
```

## Timeline

| Time | |
|---|---|
| 15:00 | Brief |
| 15:30 | Build starts |
| 17:00 | Food |
| **18:00** | **Feature freeze — polish and rehearse only** |
| 18:40 | Demo prep |
| 19:00 | Demos + awards |

18:00 is ours, not the organisers'. Nothing new after it.
