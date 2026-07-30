# Sleep On It 🐑

You have half-ideas all day. In the shower, on the bus, walking home. You mumble them into your phone and never listen back. Everyone's notes app is a graveyard of them.

This app takes those scraps and does what your brain does overnight: it wanders back through everything you've said, weeks of it, and finds the two thoughts that turn out to be the same thought. Then one morning it shows you the connection you were too close to see.

It never writes your material. Every word it quotes is a word you already said. The lightbulb is yours; it just noticed the bulb was flickering.

> Built for the **Claude Communities Impact Lab**, London, 30 July 2026. Four people, one afternoon, demos at 19:00. Working title, and the concept is still Samantha's to confirm.

Brief: [`docs/BRIEF.md`](docs/BRIEF.md) · Scope: [`docs/SCOPE.md`](docs/SCOPE.md) · Design: [`docs/DESIGN.md`](docs/DESIGN.md) · API contract: [`docs/API.md`](docs/API.md) · Decisions: [`docs/DECISIONS.md`](docs/DECISIONS.md)

---

## Status at 17:50

| Piece | State |
|---|---|
| Concept and audience | Decided. Option 3 in `daily-1pc-merge-options.md`, creatives, capture-over-time |
| Master prompt + output schema | Done, `prompts/dream.md`. Tested against the live API four times |
| Seed archive with the eureka arc | Done, `data/archive.seed.json`. 12 notes, two threads |
| Known-good response (build fixture + stage insurance) | Done, `data/dream.fallback.json` |
| Drop-in API route | Done, `prompts/route.reference.ts` |
| Design system and tokens | Done, `docs/DESIGN.md`. Contrast verified WCAG AA |
| **App scaffold, screens, capture UI** | **Outstanding. The critical path.** |
| Vercel project + `ANTHROPIC_API_KEY` env var | Outstanding, Elliot |
| `docs/SCOPE.md` demo script | Outstanding, Samantha |
| Extension rule sign-off (DECISIONS 007) | Outstanding, Samantha |

## How it works

Three moving parts, no database.

1. **Capture.** Voice note in, transcript out, appended to the archive. No tags, no categories. Friction here kills the product.
2. **The dream cycle.** One call to `claude-opus-4-8` over the whole archive. It deconstructs each note into its noticing, its itch, and its assumption, then looks for collisions: two notes that share a mechanism rather than a topic. It holds your **stated** priority apart from your **revealed** preoccupation and reports where they diverge.
3. **The wake screen.** Divergence read, up to three collisions with the dates they span, and occasionally a **eureka**: fires only when a thread recurring across three or more old notes is completed by something you said in the last 24 hours. Most cycles have none, which is what makes it land when it does.

Each collision can carry an `extension`, one or two sentences dreaming the thought a step forward using only material already in your archive. Render it visually distinct from the user's own words. The user must always be able to tell which words are theirs.

## Start here

```bash
git clone https://github.com/ElliotJLT/impactlab.git
cd impactlab
cp .env.example .env.local   # paste the Anthropic key from the event

# One-time, 10 seconds, so your commits attribute to you
git config user.name  "Your Name"
git config user.email "your@github-email.com"
```

Then open Claude Code here. It reads [`CLAUDE.md`](CLAUDE.md) automatically: ground rules, file ownership, design rules, API conventions.

**Writing UI?** Read [`docs/DESIGN.md`](docs/DESIGN.md) first. Mobile-first PWA at 390×844, shared tokens, no raw hex.

**Wiring the API?** Don't reimplement it, copy it:

```bash
npm i @anthropic-ai/sdk
cp prompts/dream.generated.ts lib/dream.ts
cp prompts/route.reference.ts  app/api/dream/route.ts
```

That route already has `maxDuration = 60`, `effort: "medium"`, `cycle_at`, and a fallback to the committed known-good dream if the API fails. Venue wifi cannot put an error screen in front of the judges.

**Tuning the prompt or seed?** No app needed:

```bash
node prompts/try.mjs            # 12-note archive, expect eureka: null
node prompts/try.mjs --stage    # plus the rehearsed stage note, expect eureka
node prompts/try.mjs "any text" # ad-hoc live note
node prompts/build.mjs          # regenerate the TS module after editing dream.md
```

A cycle takes about 40 seconds and costs roughly 9p. Rate limits are nowhere near a concern: 5M input tokens a minute on this key.

## Repo map

```
prompts/dream.md            master prompt + output schema  ← source of truth
prompts/dream.generated.ts  typed module the app imports (generated)
prompts/route.reference.ts  drop-in Next.js route
prompts/try.mjs             run a dream cycle, no app required
prompts/build.mjs           regenerate the TS module from dream.md
data/archive.seed.json      12 seed notes + the rehearsed stage note
data/dream.fallback.json    known-good response: build fixture and stage insurance
docs/                       brief, scope, design system, API contract, decisions
```

## Working agreement

| | |
|---|---|
| **Branch** | `yourname/what-youre-doing` off `main`, e.g. `andrei/capture-screen` |
| **Merge** | Straight to `main`. No review gate. Ship it. |
| **Before every push** | `git pull --rebase origin main` |
| **Never** | `git push --force` to `main` |
| **Commits** | Small and often. A broken `main` blocks the other three. |
| **Blocked 10 minutes** | Say so out loud. Don't debug alone. |

## Who's doing what

Team: **Zan S., Andrei I., Elliot L., Samantha N.**

| Role | Who | Owns |
|---|---|---|
| LLM lane | Elliot | `prompts/`, `data/`, `docs/API.md` |
| App scaffold, screens | _add your name_ | Everything under `app/`, codes against `docs/API.md` |
| Concept, scope, seed content | Samantha | `docs/SCOPE.md`, note content in the seed archive |
| Demo driver | _TBD_ | The 3-minute script and the laptop it runs on |

Nobody needs to tell Claude who they are. It resolves identity from your git config; see the roster in [`CLAUDE.md`](CLAUDE.md).

## The demo

Sam is a standup writing an hour about renting in London. Her archive holds six weeks of observations. Most are about renting. A few, which she has never connected, circle her dad's workshop: the tools he never labelled but always found, the pencil he sharpened with a knife, ten minutes spent breathing sawdust in a hardware shop for no reason she could name.

On stage she dictates one new note, about a tenancy renewal that forbids picture hooks and counts repainting as damage. The dream cycle runs. The wake screen connects five notes across six weeks and asks:

> If the workshop was nothing but a lifetime of unlabelled marks proving a man lived by hand, what does it do to you to rent a place where leaving any mark at all is damage?

The audience watched the last piece go in. That is the moment.

## Timeline

| Time | |
|---|---|
| 15:30 | Build starts |
| **18:00** | **Feature freeze. Polish and rehearse only.** |
| 18:40 | Demo prep, rehearse out loud, record the backup video |
| 19:00 | Demos |

18:00 is ours, not the organisers'. Nothing new after it.
