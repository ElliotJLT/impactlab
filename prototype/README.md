# prototype/ — throwaway, NOT the app scaffold

Standalone script to prove the Claude brain works end-to-end:
**seed fragments → Claude (Sonnet 5) → recurring-thread report.**

Deliberately isolated from the real app:

- **No dependencies, no `package.json`.** It shells out to the Claude Code CLI (`claude -p`),
  which runs on Sam's Max plan at **zero API cost** and needs no key. DECISION 001 (no scaffold
  until the idea is locked) stays intact — nothing here touches the repo root or locks the stack.
- The real product work is the **prompt** in `weekly-read.mjs`. When the team picks Next.js and
  the event API key is in hand, that same prompt drops into a route handler using
  `@anthropic-ai/sdk`. This folder then gets deleted.

## Run it

```bash
cd prototype
node weekly-read.mjs        # runs against the seed fragments in seed.mjs, prints the report
```

Requires the Claude Code CLI on PATH (`claude`). No key, no install, no cost on the Max plan.
Model is Sonnet 5 (`claude-sonnet-5`) — smart enough for thematic recurrence; swap to
`claude-opus-4-8` for the live demo if a subtler read is needed.
