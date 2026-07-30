# Deploy notes — Vercel

**Elliot — this one's for you.** Railway had a platform incident (paused new deploys on
Hobby/Trial), so we're going Vercel for now to get a live URL today. Everything's on `main` and
Vercel-ready; the notes below are the gotchas so nothing bites you live. — Samantha

---

## The three things that matter

1. **Import the repo → deploy. Zero config.** Vercel auto-detects Next.js 16. The `railway.json`
   in the root is inert on Vercel — ignore it, no need to delete.

2. **Set `ANTHROPIC_API_KEY` in Vercel's Environment Variables** (Project → Settings → Environment
   Variables). Without it the Read screen fails on the live URL — `.env.local` does NOT deploy. This
   is the classic works-local-dies-on-stage trap your own `API.md` warns about.

3. **The serverless timeout is already handled** on `/api/weekly-read` — I added
   `export const maxDuration = 60` (the Claude call takes 20-40s; Vercel's default ~10s would kill
   it only on the deployed URL). **If you swap the live route to your `/api/dream`**, that route
   needs the same line — your `route.reference.ts` already has it, so you're covered if you use it.

## What actually deploys right now (heads-up)

The live app runs **my placeholder `/api/weekly-read`** with the original single-signal prompt — NOT
the merged prompt or your `/api/dream` yet. So Capture / Week / Read all work end-to-end, but the
deployed brain is the basic scaffold, not our merged version. That's deliberate — get a URL up today,
wire the merged brain after. Flagging so nobody thinks the deployed version is final.

## Model / cost note

The deployed route uses `claude-sonnet-5` (demo model, DECISION 007-ish — see DECISIONS.md 007/010).
On Vercel with `ANTHROPIC_API_KEY` set, it uses the Anthropic SDK — so this spends real Anthropic
credits per Read, not the free local CLI path. Fine for the event credits; just so it's not a surprise.

## Still open (not blocking the deploy)

- Wire the app to the **merged master prompt** (`docs/master-prompt-MERGED-for-review.md`) + your
  `/api/dream` contract, retiring the placeholder route. I can take this — I own the scaffold lane.
- Front-end team is mid-design; entry-UX guidance is in `docs/ENTRY-UX.md` when they want it.

Ping me if anything on deploy is off and I'll jump on it.

---

**Update (Elliot, 18:30):** the "placeholder brain deploys" caveat above is resolved — `main`
now runs `/api/dream` (merged contract, `claude-opus-4-8`, fallback insurance) and the
placeholder `/api/weekly-read` is deleted. See DECISIONS 011/012. Deploying as project
**muse** via the CLI.
