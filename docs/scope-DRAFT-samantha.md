# Scope — DRAFT for review (Samantha)

> Draft transcription of the team's Option-3 decision into the SCOPE.md template.
> Nothing here is committed to the real `docs/SCOPE.md` until the team signs off.
> Blanks I couldn't decide alone are marked **[NEEDS TEAM]**.

---

## Which prompt

**#1 — How can AI make its users better?** A better person, more informed, more critical — in the world, not just at work.

## Who it's for

Any working creative whose raw material arrives as fragments — noticings, overheard lines, stray images — captured on a phone and never revisited. **One general engine, tailored to the user's practice at signup.** The practice is a demo choice, not a product constraint (per merge doc). For the three-minute demo we show *one* of them: a **documentary filmmaker** mid-edit.

## The problem, in one sentence

Their best raw material arrives as half-thoughts they capture and then lose, so the thread they keep circling never becomes visible to them.

## What we're building, in one sentence

An app that catches those fleeting fragments through the week and, at week's end, reflects back the one thread the person keeps returning to without noticing.

## Why AI is the right tool here

Only a language model can read unstructured, idiosyncratic fragments *in the idiom of a given craft* and recognise that differently-worded scraps are the same underlying thread. A notes app stores them; a spreadsheet counts keywords; neither can tell that "the empty chair at the diner" and "he never said the word redundant" are the same preoccupation. **And it deliberately generates nothing** — it reflects the person's own material back, which is the whole point for an audience that fears the machine making the work.

---

## The demo (3 minutes)

**The moment:** the weekly read lands — she's been calling this "a film about the town," but the app shows she circled *her father's silence* five times, in different words, without noticing. Audible "oh." Then the kicker: swap the practice and the same engine runs for a novelist or a songwriter — it's not built for filmmakers, it's built for anyone.

| # | On screen | Said out loud |
|---|---|---|
| 1 | 15-second onboarding: one question — "What kind of work do you make?" → documentary film. | "Meet Maya. She's cutting a documentary. The app just needs to know what she makes." |
| 2 | A week of fragments already captured — voice scraps, timestamped, scattered across days. She adds one more live, by voice, on stage. | "All week she's been dropping half-thoughts in here. Watch — she adds one now, just talking." |
| 3 | Tap **Weekly read**. The report renders one thread: her father's silence, 5 times, in five different guises, quoted in her words. | "She thinks this film is about a town. Five times this week she came back to her dad. She never noticed. The app didn't tell her what to make — it showed her what she keeps saying." |

## In scope

- [ ] Onboarding: **one** question ("what do you make?") → interpolated into the system prompt
- [ ] Capture: voice-in (browser Web Speech API), one tap, no tagging, appends a fragment
- [ ] Seed set: 8–12 fragments across a fake week — the buried thread recurring in different words, never as the stated subject; timestamps spread
- [ ] Weekly read: send fragments to Claude → return the structured recurring-thread report
- [ ] One clean mobile screen per step (per `DESIGN.md`)

## Out of scope — explicitly

- Auth / accounts / login
- Real database → **JSON seed file**
- Live speech-to-text via Wispr/Whisper → **browser Web Speech API** (no key, no setup)
- **Any generative suggestions** — hard product constraint, not a time cut. The app never proposes material.
- Stated-priority input / divergence comparison — **cut.** The engine surfaces recurrence only, no "what are you working on" question.
- Mind map — **[NEEDS TEAM]**: "if possible" in the merge doc. Cut candidate, see below.
- Error handling past the happy path · tests · CI · analytics · settings · empty states · desktop layout · service worker

## Cut list, pre-agreed (drop in this order)

1. Mind map visualisation (report text alone carries the moment)
2. Live voice on stage (fall back to a pre-typed fragment if Web Speech is flaky on venue wifi)
3. Onboarding UI (hardcode "documentary film"; keep the question only as demo narration)
4. The "swap the practice" kicker (nice-to-have proof of generality; the core moment stands without it)

---

## Open questions for the team

- **[NEEDS TEAM]** Mind map: in or cut? I'd cut to protect the prompt, add back only if we're ahead at 17:00.
- **[NEEDS TEAM]** Metrics: the merge doc flags that "27 facts learned" counts consumption and breaks under Option 3. The weekly read measures *recurrence*, not volume. Confirm nobody's building a stats dashboard.
- **[NEEDS TEAM]** Ownership: who owns frontend vs seed set vs capture? I'm on the Claude brain (prompt + weekly read).
