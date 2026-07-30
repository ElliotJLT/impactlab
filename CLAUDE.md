# CLAUDE.md

Read this first. All four of us are using Claude Code in this repo at the same time, so these rules exist to stop four agents editing the same file.

## What this is

A team build for the Claude Communities **Impact Lab** — a one-afternoon event where teams build something against one of three prompts drawn from a public conversation about what AI is doing to people. Demos at 19:00, same day.

The three prompts, verbatim:

1. **How can AI make its users better?** A better person, more educated, more informed, more critical. Not just at work, in the world.
2. **How do we make AI accessible for all?** Bring the benefits to non-technical backgrounds, those without computers, younger people, or different cognitive needs.
3. **How can AI help communities thrive?** Instead of centralising opportunities, how can it expose them locally and match people to what's needed?

Full brief in `docs/BRIEF.md`. **What we actually decided to build is in `docs/SCOPE.md`** — read it before writing code. If it still says TBD, we haven't picked yet; ask before building.

## The constraint that governs every decision

**A working demo at 19:00.** Not a complete product. Not clean architecture. A thing that runs, in front of judges, telling a story.

Consequences, in priority order:

1. **Demoable beats complete.** A hardcoded happy path that runs is worth more than a general solution that half-works.
2. **Fake the unglamorous parts.** Seed data over a real DB. A JSON file over an admin UI. Real auth is never the demo.
3. **No rewrites after 18:00.** If it works at 18:00, it ships as-is. Polish the demo, not the code.
4. **Cut early, cut loudly.** When something is going to overrun, say so and cut it. Silent overruns are what lose demos.

## Rules for you (Claude)

- **Don't touch files outside the owner's area** in the table below without saying so first. Multiple agents rewriting one file is the main failure mode here.
- **Don't add dependencies** unless the task needs them. No state library, no ORM, no test framework, no CI. Someone else's `package-lock.json` conflict costs the team 15 minutes.
- **Don't refactor adjacent code.** Fix the thing asked for. Leave the rest ugly.
- **No tests unless asked.** Not the right trade at this timescale.
- **Prefer editing an existing file to creating a new one.** Fewer files, fewer conflicts.
- **`git pull --rebase origin main` before you push.** Every time.
- **Never `git push --force`** to `main`. Never rewrite shared history.
- **Log real decisions** in `docs/DECISIONS.md` — a one-liner, append-only. Anything the next person would otherwise have to reverse-engineer.
- **If a task feels like it needs three files and an abstraction, say so** before building it. That's usually a sign it should be cut or faked.

## File ownership

One owner per area. Cross-area change → tell the owner, or do it in a separate commit so the conflict is easy to see.

| Area | Owner | Notes |
|---|---|---|
| `docs/` | anyone | Append, don't rewrite others' entries |
| _TBD once stack is picked_ | | |

Fill this in the moment the first code lands. An empty ownership table with four people committing is how you get merge hell at 18:30.

## Stack

**Not chosen yet.** Once it is, it goes in `docs/DECISIONS.md` and the ownership table above, and nobody changes it.

When we do pick, the default lean is: **Next.js (App Router) + TypeScript + Tailwind, deployed to Vercel** — because it demos from a URL rather than someone's laptop, and everyone can `npm run dev` without setup.

## Calling Claude from the app

If the build talks to the Anthropic API:

- **Server-side only.** The key never reaches the browser — call it from a route handler / server action, never from a client component.
- **`@anthropic-ai/sdk`**, not raw `fetch`.
- **Key lives in `.env.local`**, which is gitignored. `.env.example` documents the variable names. Committing a key burns the team's event credits and is a pain to rotate.
- **Model: `claude-opus-4-8`.** Highest-capability tier and it makes demos look good. Drop to `claude-haiku-4-5` only if something is latency-critical (live typing, per-keystroke calls).
- **Stream anything the user waits on.** A 20-second silent spinner reads as broken on stage. Use `client.messages.stream()`.
- **`max_tokens`**: ~4000 non-streaming, ~16000 streaming. Don't lowball it — truncated output mid-demo looks like a crash.
- **Adaptive thinking** (`thinking: { type: "adaptive" }`) for anything that needs real reasoning. Note `budget_tokens` and `temperature` are rejected on this model — they return a 400.

Minimal shape:

```ts
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic(); // reads ANTHROPIC_API_KEY from env

const stream = client.messages.stream({
  model: "claude-opus-4-8",
  max_tokens: 16000,
  system: SYSTEM_PROMPT,
  messages: [{ role: "user", content: userInput }],
});
```

Model IDs and pricing verified against the Anthropic docs on 2026-07-30. Current tiers: Opus 4.8 `$5`/`$25` per Mtok, Sonnet 5 `$3`/`$15`, Haiku 4.5 `$1`/`$5`.

## Demo hygiene

The judges see three minutes. Protect them:

- **One person drives.** Decided at kick-off, named in the README.
- **Deployed URL, not localhost.** Conference wifi will let you down; a deployed app fails less often than a laptop.
- **Seed data that tells the story.** Realistic, pre-loaded, no live typing of long inputs.
- **Rehearse the script out loud at 18:40.** Every time a team skips this, they discover the bug on stage.
- **Have a screen recording as backup.** Two minutes of insurance.
