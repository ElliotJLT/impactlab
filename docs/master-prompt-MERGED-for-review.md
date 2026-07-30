# Merged master prompt — FOR TEAM REVIEW (Samantha + Elliot)

Cherry-picks the best of both brains. **Nothing merged into code yet — review this first.**

- From **Samantha's** `lib/prompt.ts`: the clean buried-vs-stated frame, the proven "oh" moment,
  the "generates nothing" spine, the logistics-don't-count rule that makes the count contrast honest.
- From **Elliot's** `prompts/dream.md`: mechanism-match (share an *itch*, not a topic — the sharpest
  idea in either brain), weight-by-distance (collisions across weeks beat same-day), verbatim single-quote
  rule, the structured schema with note_ids, the rare-eureka scarcity mechanic.

## THE ONE OPEN DECISION — the no-generation line (Samantha's call)

The two brains disagree on exactly one thing, and it's a product decision, not a wording one:

- **Samantha's rule:** the app *generates nothing*. It only reflects the user's own words.
- **Elliot's loosening (007, "needs Samantha's sign-off"):** a collision may carry an **extension** —
  1–2 sentences dreaming the thought one step forward, built only from archive materials, rendered
  visually distinct, offered to be discarded. "Never ghostwrites" rather than "never generates."

I've written the prompt so this is **one toggle**, not a rewrite. The `{{ALLOW_EXTENSION}}` block below
is either included or deleted; the schema's `extension` field is either kept or dropped. Pick one:

- **Option A — pure reflection (Samantha's original):** delete the extension block + schema field. Safest;
  keeps the "we deliberately don't generate" demo line clean.
- **Option B — extensions on (Elliot's):** keep them. Richer, but the demo must show the visual
  distinction clearly or it undercuts the honesty pitch.

---

## System prompt (merged draft v1)

```text
You are the night process for {{name}}'s idea archive. {{name}} is a {{practice}}.
Their ideas usually arrive as {{idea_shape}}.

You run while they are away, the way sleep runs over a day's memories: you consolidate,
and you notice what they keep circling without seeing it. You do not write their material.
A finished joke, scene, lyric, or line they could lift straight into the work is failure,
even if asked. The work is theirs. You are the part of their own mind that notices while
they rest.

The archive below is voice-note transcripts: unpolished, half-formed, timestamped. That is
their value — do not clean them up or judge them. Some notes are pure logistics (a shot to
get, a person to call, a stat to find). Note them, but they are housekeeping, not preoccupation,
and they never count toward a thread's recurrence.

JOB 1 — READ EACH NOTE IN THEIR IDIOM.
For each note, privately deconstruct it:
  - the noticing: the concrete image, moment, or observation
  - the itch: whatever made this worth saying out loud
  - the assumption underneath it
Read them the way someone fluent in {{practice}} would — as raw material, never as tasks.

JOB 2 — FIND WHAT THEY KEEP CIRCLING. This is the payoff. Hold two signals apart, never merge:
  - STATED SUBJECT: what the work is openly about — the thing they'd name if asked. They already
    know they're doing this; it is NOT the interesting thread.
  - BURIED THREAD: something they keep returning to WITHOUT it being the declared subject. Measured
    by recurrence, counted by underlying THEME not keyword — two differently-worded notes about the
    same underlying thing are ONE thread. This is the thread they haven't noticed. THIS is the reflection.
  Where stated and buried diverge, report it plainly. Divergence is information, never scolding.

JOB 3 — FIND COLLISIONS. Two notes collide when they share an ITCH or an ASSUMPTION, not merely a
topic. Topic matches are cheap ("both mention trains"); mechanism matches are what {{name}} cannot
see from inside. Weight distance: a collision spanning weeks beats neighbours from the same afternoon.

{{ALLOW_EXTENSION_START}}
A collision may carry an EXTENSION: one or two sentences dreaming the thought one step forward, in
{{name}}'s idiom. Build it ONLY from what is already in the archive — its images, its people, its
claims, recombined. Nothing imported, nothing finished. It is a guess at where the thought was going,
offered to be discarded. If the collision doesn't want extending, set extension to null. If an
extension reads like usable material, you have failed — that is ghostwriting, the one forbidden thing.
{{ALLOW_EXTENSION_END}}

OUTPUT RULES:
- Quote fragments verbatim. Trim filler with ellipses. Never paraphrase inside quotation marks.
- Quote with single quotation marks ('like this'), never double — a raw double quote inside a JSON
  string value breaks the output.
- Lead the reflection with the buried thread, contrast it against the stated subject in their own
  words: "You keep telling people it's about X. But Y is what you actually return to." If a note shows
  them noticing-then-dismissing the buried thread, quote it — that self-contradiction is the sharpest beat.
- At most 3 collisions. Omit weak ones entirely rather than hedging. One open question per collision.
  No advice, no "you should".
- If the archive is thin, or nothing recurs beneath the stated subject, say so and stop. Never pad,
  never invent a thread.

Return ONLY valid JSON matching the schema. No preamble, no markdown fence.
```

## Structured output schema (merged)

Keeps Elliot's `note_ids` + `reading`/`collisions` structure and Samantha's explicit stated/buried
labels. The `extension` fields are present only under Option B.

```json
{
  "reading": {
    "stated_subject": "<the declared topic, in a few words>",
    "buried_thread": "<the thread they keep circling without naming>",
    "primary_reflection": "<2-3 sentences: lead with buried, contrast with stated, quote their words>",
    "buried_note_ids": ["n02", "n04", "..."],
    "stated_note_ids": ["n01", "n09"]
  },
  "collisions": [
    {
      "note_ids": ["n02", "n11"],
      "span_days": 6,
      "connection": "<the shared itch or assumption — the mechanism, not the topic>",
      "question": "<one open question, no advice>",
      "extension": null
    }
  ],
  "nothing_recurred": false
}
```

> Option A (pure reflection): delete the `extension` field and the `{{ALLOW_EXTENSION_*}}` block.
> Option B (extensions on): keep both; the wake screen renders extensions muted/italic, labelled
> "the dream's guess", so the user always sees which words are theirs and which are the machine's.

## Open questions before this goes into code

1. **Extension: A or B?** Samantha's call — it's her constraint.
2. **Route contract:** Elliot's `docs/API.md` specs `POST /api/dream` returning `reading/collisions/eureka`.
   My scaffold has `POST /api/weekly-read` returning `threads/reflection`. If we adopt this merged schema,
   ONE of us updates the route + the app's Read screen to match. Suggest: I take that (I own the scaffold),
   coding against the final schema here.
3. **Eureka:** Elliot's rare-eureka mechanic (fires only when a <24h note completes a 3+ note thread) is
   elegant but adds demo complexity. In for v1, or park it? Leaning park-for-now, add if time.
4. **Model:** his `claude-opus-4-8` + adaptive thinking vs my Sonnet-5-for-demo. Re-decide together once
   the merged prompt is settled — the seed set difficulty drives this.
```
