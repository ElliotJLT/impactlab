# LLM contract — for whoever is scaffolding the app

Lane split (17:05): app scaffold and layout are owned by whoever is scaffolding; the LLM side (`prompts/`, `data/`, this contract) is Elliot's. Code against this file; if it needs to change, shout rather than editing app-side assumptions.

## The one route

```
POST /api/dream
```

**Request body** — the whole archive, verbatim shape of `data/archive.seed.json` (user block + notes, plus any note added live):

```json
{ "user": { "...": "..." }, "notes": [ { "id": "n01", "text": "...", "at": "ISO-8601" } ] }
```

**Response** — the dream JSON, exact schema in [`prompts/dream.md`](../prompts/dream.md):

```json
{ "reading": { "stated": {...}, "revealed": {...} }, "collisions": [...], "eureka": null }
```

`eureka` is `null` on most cycles by design. The wake screen must render both cases.

## Route implementation notes

- `@anthropic-ai/sdk`, `claude-opus-4-8`, `thinking: { type: "adaptive" }`, `max_tokens: 4000`, non-streaming, `output_config.format` = the json_schema in `prompts/dream.md`.
- System prompt: the `text` block in `prompts/dream.md` with `{placeholders}` filled from `body.user`. Read it from the file or paste it — but `prompts/dream.md` stays the source of truth while we tune.
- **Vercel: set `export const maxDuration = 60`** on the route. Measured cycle time is ~22s on the 3-note seed and will grow with 12 notes — the default function timeout kills it, and only on the deployed URL, not localhost.
- **Vercel: add `ANTHROPIC_API_KEY` in the project's environment settings.** `.env.local` doesn't deploy; forgetting this is the classic works-locally-dies-on-stage failure.
- Client covers latency with the dream animation (10–20s), not a spinner.

## Stage insurance (cheap, do it)

Commit the last good response as `data/dream.fallback.json`. If the API call throws on stage, serve that. Two lines in the route, and the demo survives venue wifi.

## Client-side expectations the LLM lane relies on

- Notes appended live get `id: "live-1"`, `at: now`. No other fields.
- Send the **full** archive every call — the API is stateless, no session.
- Don't trim or reorder notes client-side; timestamps and order carry signal.

## Testing the prompt without the app

```
node prompts/try.mjs        # needs ANTHROPIC_API_KEY in env or .env.local
```

Zero dependencies, reads `prompts/dream.md` + `data/archive.seed.json`, prints the dream JSON. This is how the prompt/seed workstream iterates while the app is being built.
