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

<!-- next entry below -->
