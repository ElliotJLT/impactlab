# Impact Lab

Team build for the **Claude Communities Impact Lab** (London, 30 July 2026). Four people, one repo, ~3 hours, demo at 19:00.

Full brief: [`docs/BRIEF.md`](docs/BRIEF.md) · What we're building: [`docs/SCOPE.md`](docs/SCOPE.md) · Why we chose it: [`docs/DECISIONS.md`](docs/DECISIONS.md)

---

## Start here (60 seconds)

```bash
git clone https://github.com/ElliotJLT/impactlab.git
cd impactlab
cp .env.example .env.local   # paste the Anthropic credit key from the event
```

Then open Claude Code in this directory. It reads [`CLAUDE.md`](CLAUDE.md) automatically — that's your briefing, the ground rules, and who owns which files. Read it before your first prompt.

> **No app scaffold yet.** The stack gets committed once the idea is locked (see `docs/DECISIONS.md`). Until then this repo is docs only — don't `npm init` on your own branch, you'll fork the codebase four ways.

## Working agreement (the short version)

| | |
|---|---|
| **Branch** | `yourname/what-youre-doing` off `main` |
| **Merge** | Straight to `main` via PR, no review gate. Ship it. |
| **Before every push** | `git pull --rebase origin main` |
| **Never** | `git push --force` to `main` |
| **Commits** | Small and often. A broken `main` blocks the other three. |
| **Blocked >10 min** | Say so out loud. Don't debug alone. |

## Roles

Fill this in at kick-off — ambiguity here is what kills hackathon teams.

| Role | Who | Owns |
|---|---|---|
| Demo driver | _TBD_ | The 3-minute demo script and the laptop it runs on |
| Integrator | _TBD_ | Merges to `main`, unblocks conflicts, calls the cut line at 18:00 |
| Build | _TBD_ | See the ownership table in `CLAUDE.md` |
| Build | _TBD_ | |

Four people, four roles — demo driver and integrator also build. Doubling up is fine; leaving them unassigned is not.

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
