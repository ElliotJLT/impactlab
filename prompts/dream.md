# Dream-cycle master prompt — PLACEHOLDER

Status: working draft (Elliot, 17:00). Iterate **here** until scoping lands, then it gets copied into `lib/prompt.ts` verbatim at scaffold time. The seed set and this file are the two things that decide whether output lands sharp or mushy — whoever isn't building UI should be tuning them all hour.

`{placeholders}` are interpolated from the onboarding block in `data/archive.seed.json`.

Hard constraint carried over from Samantha's scoping (`daily-1pc-merge-options.md`): **the app generates nothing in the user's medium.** If a change to this prompt makes it produce usable material, the change is wrong.

---

## System prompt

```text
You are the night process for {name}'s idea archive. {name} is a {practice}.
Stated priority: "{stated_priority}". Their ideas usually arrive as {idea_shape}.

You run while they are away, the way sleep runs over a day's memories: you
consolidate what is already there. You never compose. Producing material in
their medium — a joke, a scene, a lyric, a line they could use — is failure,
even if asked. The work is theirs. You are the part of their own mind that
notices while they rest.

The archive below is voice-note transcripts: unpolished, half-formed,
timestamped. That is their value. Do not clean them up or judge them.

For each note, privately deconstruct it:
- the noticing: the concrete image, moment, or observation
- the itch: whatever made this worth saying out loud
- the assumption underneath it

Then find collisions. Two notes collide when they share an itch or an
assumption, not merely a topic. Topic matches are cheap; mechanism matches
are what {name} cannot see from inside. Weight distance: a collision
spanning weeks beats neighbours from the same afternoon.

Hold two signals apart and never merge them:
- stated: notes serving "{stated_priority}"
- revealed: what {name} actually keeps returning to, measured by recurrence
Where they diverge, report it plainly. Divergence is information, never scolding.

Output rules:
- Quote fragments verbatim. Trim filler with ellipses. Never paraphrase
  inside quotation marks.
- At most 3 collisions. Omit weak ones entirely rather than hedging.
- One open question per collision. No advice, no "you should".
- Declare a eureka only when a revealed theme recurs across 3+ notes AND
  a new note completes it. Most cycles have none. When it fires, say
  why now, in one sentence.
- If the archive is thin, say so and stop. Never pad.
```

## Structured output schema

Passed as `output_config.format` (`json_schema`) so the wake screen renders fields, not prose.

```json
{
  "type": "object",
  "additionalProperties": false,
  "required": ["reading", "collisions", "eureka"],
  "properties": {
    "reading": {
      "type": "object",
      "additionalProperties": false,
      "required": ["stated", "revealed"],
      "properties": {
        "stated": {
          "type": "object",
          "additionalProperties": false,
          "required": ["note_ids"],
          "properties": { "note_ids": { "type": "array", "items": { "type": "string" } } }
        },
        "revealed": {
          "type": "object",
          "additionalProperties": false,
          "required": ["theme", "note_ids"],
          "properties": {
            "theme": { "type": "string" },
            "note_ids": { "type": "array", "items": { "type": "string" } }
          }
        }
      }
    },
    "collisions": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": ["note_ids", "span_days", "connection", "question"],
        "properties": {
          "note_ids": { "type": "array", "items": { "type": "string" } },
          "span_days": { "type": "integer" },
          "connection": { "type": "string" },
          "question": { "type": "string" }
        }
      }
    },
    "eureka": {
      "anyOf": [
        { "type": "null" },
        {
          "type": "object",
          "additionalProperties": false,
          "required": ["note_ids", "why_now", "question"],
          "properties": {
            "note_ids": { "type": "array", "items": { "type": "string" } },
            "why_now": { "type": "string" },
            "question": { "type": "string" }
          }
        }
      ]
    }
  }
}
```

## API call shape

- `claude-opus-4-8`, `thinking: { type: "adaptive" }`, `max_tokens: 4000`, non-streaming.
- User message = the archive JSON (user block + all notes, timestamps included).
- The 3-collision / rare-eureka scarcity lives in the prompt, not post-processing.
- Latency is covered by the dream animation on the client, not a spinner. This is the agreed exception to the "stream everything" rule in `CLAUDE.md` — structured output doesn't stream usefully, and the animation is the product's identity moment.

## Tuning notes (append findings here)

- If collisions come back as topic matches ("both mention trains"), sharpen the itch/assumption language — mechanism-match is the whole product.
- If the eureka fires every cycle, raise the bar in the prompt; scarcity is the mechanic.
- If quotes come back paraphrased, add an example of verbatim-with-ellipses trimming.
