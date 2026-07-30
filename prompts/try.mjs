#!/usr/bin/env node
// Prompt-iteration harness. NOT app code — the app uses @anthropic-ai/sdk per
// CLAUDE.md; this is a zero-dependency script so the prompt/seed workstream can
// run dream cycles before the app scaffold exists (and without touching the
// scaffolder's package.json).
// Usage:
//   node prompts/try.mjs                  seed archive only (expect eureka: null)
//   node prompts/try.mjs --stage          seed + rehearsed _stage_note (expect eureka)
//   node prompts/try.mjs "any note text"  seed + an ad-hoc live note
import { readFileSync, existsSync } from "node:fs";

const root = new URL("..", import.meta.url).pathname;

// key: env first, then .env.local
let key = process.env.ANTHROPIC_API_KEY;
if (!key && existsSync(root + ".env.local")) {
  const m = readFileSync(root + ".env.local", "utf8").match(/^ANTHROPIC_API_KEY=(.+)$/m);
  if (m) key = m[1].trim();
}
if (!key || key.includes("sk-ant-...")) {
  console.error("No ANTHROPIC_API_KEY in env or .env.local"); process.exit(1);
}

const md = readFileSync(root + "prompts/dream.md", "utf8");
const system = md.match(/```text\n([\s\S]*?)```/)[1];
const schema = JSON.parse(md.match(/```json\n([\s\S]*?)```/)[1]);
const archive = JSON.parse(readFileSync(root + "data/archive.seed.json", "utf8"));

const arg = process.argv[2];
if (arg) {
  const text = arg === "--stage" ? archive._stage_note : arg;
  archive.notes.push({ id: "live-1", text, at: new Date().toISOString() });
  console.error(`[live note added: "${text.slice(0, 60)}..."]`);
}

const filled = system
  .replaceAll("{name}", archive.user.name)
  .replaceAll("{practice}", archive.user.practice)
  .replaceAll("{stated_priority}", archive.user.stated_priority)
  .replaceAll("{idea_shape}", archive.user.idea_shape);

const t0 = Date.now();
const res = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
  body: JSON.stringify({
    model: "claude-opus-4-8",
    max_tokens: 4000,
    thinking: { type: "adaptive" },
    output_config: { effort: "medium", format: { type: "json_schema", schema } },
    system: filled,
    messages: [{ role: "user", content: JSON.stringify({ cycle_at: new Date().toISOString(), user: archive.user, notes: archive.notes }) }],
  }),
});

const data = await res.json();
if (!res.ok) { console.error(JSON.stringify(data, null, 2)); process.exit(1); }
const text = data.content.find(b => b.type === "text")?.text ?? "";
console.log(JSON.stringify(JSON.parse(text), null, 2));
console.error(`\n[${((Date.now() - t0) / 1000).toFixed(1)}s · in ${data.usage.input_tokens} out ${data.usage.output_tokens} tokens · stop ${data.stop_reason}]`);
