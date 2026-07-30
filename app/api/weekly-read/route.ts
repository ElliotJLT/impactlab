import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import {
  buildSystemPrompt,
  buildUserMessage,
  type Fragment,
  type WeeklyRead,
} from "@/lib/prompt";

const run = promisify(execFile);

// Demo model decided on evidence — Sonnet 5's count contrast reads better on screen than
// Opus's more literal tie (see docs/master-prompt-DRAFT-samantha.md). Opus is the fallback.
const MODEL = "claude-sonnet-5";

// Two transports, auto-selected:
//   • ANTHROPIC_API_KEY set  → SDK (production / Railway). Server-side only; key never
//     reaches the browser (CLAUDE.md).
//   • no key                 → Claude Code CLI (`claude -p`), free on the Max plan, for
//     local dev. Same prompt, same output — nothing else in the app changes.
export async function POST(req: Request) {
  let body: { practice?: string; fragments?: Fragment[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { practice, fragments } = body;
  if (!practice || !Array.isArray(fragments) || fragments.length === 0) {
    return NextResponse.json(
      { error: "Need a practice and at least one fragment." },
      { status: 400 }
    );
  }

  const system = buildSystemPrompt(practice);
  const user = buildUserMessage(practice, fragments);

  try {
    const raw = process.env.ANTHROPIC_API_KEY
      ? await viaSdk(system, user)
      : await viaCli(system, user);

    // Be forgiving if the model wraps JSON in a fence despite instructions.
    const json = raw.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
    const report = JSON.parse(json) as WeeklyRead;
    return NextResponse.json(report);
  } catch (err) {
    console.error("weekly-read failed:", err);
    return NextResponse.json(
      { error: "The weekly read failed. Check the server logs." },
      { status: 502 }
    );
  }
}

async function viaSdk(system: string, user: string): Promise<string> {
  const client = new Anthropic();
  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 4000,
    system,
    messages: [{ role: "user", content: user }],
  });
  return message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();
}

async function viaCli(system: string, user: string): Promise<string> {
  const { stdout } = await run(
    "claude",
    ["-p", user, "--append-system-prompt", system, "--model", MODEL],
    { maxBuffer: 10 * 1024 * 1024 }
  );
  return stdout.trim();
}
