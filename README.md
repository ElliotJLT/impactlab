# Impact Lab

Team build for the **Claude Communities Impact Lab** (London, 30 July 2026). Four people, one repo, ~3 hours, demo at 19:00.

Full brief: [`docs/BRIEF.md`](docs/BRIEF.md) · What we're building: [`docs/SCOPE.md`](docs/SCOPE.md) · Why we chose it: [`docs/DECISIONS.md`](docs/DECISIONS.md)

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
