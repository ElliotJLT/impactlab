#!/usr/bin/env node
// Regenerates prompts/dream.generated.ts from prompts/dream.md so the app
// imports typed consts instead of parsing markdown at runtime.
// Run after ANY edit to dream.md:  node prompts/build.mjs
import { readFileSync, writeFileSync } from "node:fs";

const root = new URL("..", import.meta.url).pathname;
const md = readFileSync(root + "prompts/dream.md", "utf8");

const system = md.match(/```text\n([\s\S]*?)```/)?.[1];
const schema = md.match(/```json\n([\s\S]*?)```/)?.[1];
if (!system || !schema) {
  console.error("Could not find the ```text prompt or ```json schema block in dream.md");
  process.exit(1);
}
JSON.parse(schema); // fail loudly here rather than at request time

writeFileSync(
  root + "prompts/dream.generated.ts",
  `// GENERATED FILE — do not edit.
// Source: prompts/dream.md · Regenerate: node prompts/build.mjs

export const SYSTEM_PROMPT = ${JSON.stringify(system)};

export const DREAM_SCHEMA = ${schema.trim()} as const;

export function fillPrompt(user: {
  name: string; practice: string; stated_priority: string; idea_shape: string;
}) {
  return SYSTEM_PROMPT
    .replaceAll("{name}", user.name)
    .replaceAll("{practice}", user.practice)
    .replaceAll("{stated_priority}", user.stated_priority)
    .replaceAll("{idea_shape}", user.idea_shape);
}
`
);
console.log("wrote prompts/dream.generated.ts");
