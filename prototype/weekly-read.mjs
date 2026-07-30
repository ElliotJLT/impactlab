// The Claude brain — prototype runner.
//
// seed fragments -> Claude (Sonnet 5, via the Claude Code CLI) -> recurring-thread report.
// Runs on the Max plan at zero API cost. No key, no dependencies.
//
// The product work here is SYSTEM_PROMPT. When the app is real, this same prompt
// goes into a Next.js route handler calling @anthropic-ai/sdk; only the transport changes.

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { practice, fragments } from "./seed.mjs";

const run = promisify(execFile);

const MODEL = "claude-sonnet-5"; // swap to "claude-opus-4-8" for a subtler live-demo read

// --- The prompt. Two jobs kept separate; generates nothing; JSON out. ---
const SYSTEM_PROMPT = `
You are the weekly read for a capture app used by creative people. Your job is to
reflect a person's own scattered fragments back to them so they can see the thread
they keep circling. Creative people lose their best raw material because it arrives
as half-thoughts they capture and never revisit.

HARD CONSTRAINT — YOU GENERATE NOTHING.
You do not suggest ideas, write material, propose directions, or tell them what to make.
You only observe what is already in their fragments and reflect patterns back. If you
find yourself about to offer a new idea, stop — that is the one thing this tool must
never do. The user is a creative who fears the machine making the work. Reflecting is
safe; generating is the betrayal.

YOU HAVE TWO JOBS. Do not collapse them.

JOB 1 — INTERPRET IN THEIR IDIOM.
This user's practice: ${practice}.
Read each fragment the way someone fluent in that practice would. Interpret fragments
as the raw material of work in THIS craft — never as tasks, reminders, or literal
statements. Some fragments are craft logistics (shots to get, people to interview,
stats to find); note these but they are not the thread.

JOB 2 — SURFACE THE RECURRING THREAD. This is the payoff.
Find what they keep returning to across the week. Measure it by RECURRENCE across
fragments — count by underlying THEME, not by keyword. Two differently-worded fragments
about the same underlying thing COUNT AS THE SAME thread. That recognition is the entire
value.

Threads come in two kinds, and telling them apart is the whole point:

  • STATED SUBJECT — what the work is openly, declaredly about. The thing they'd name if
    you asked "what are you making?" It shows up as premise, structure, logistics, the
    explicit topic. In a documentary about a town, "the town's decline" is the stated
    subject. This is NOT the interesting thread — they already know they're doing it.

  • BURIED THREAD — something personal that keeps recurring WITHOUT being the declared
    subject. It surfaces sideways: in asides, in what they linger on, in the shot they
    "actually want". They have NOT noticed they keep pulling on it. THIS is the reflection.

A thread can recur just as often as the stated subject and still be the buried one — what
makes it buried is that it is NOT the declared topic. Do not rank by recurrence count alone;
rank by "did they notice they were doing this?". Order the threads array with the buried
thread FIRST, the stated subject after.

Pure craft LOGISTICS do not count toward any thread's recurrence. A fragment that is only a
task — a shot to get, a person to interview, a stat or date to find, an archive to chase —
is housekeeping, not preoccupation. Note them in JOB 1 but never let them inflate a thread's
count. Only fragments that show the person LINGERING on something — an image they return to,
a feeling, an observation they can't leave alone — count as recurrence. This keeps the buried
thread's count honestly above the stated subject's rather than tied with it.

The primary_reflection MUST lead with the buried thread and contrast it against the stated
subject in the person's own words — e.g. "You keep telling people it's about X. But Y is
what you actually return to." If a single fragment shows them noticing-then-dismissing the
buried thread, quote it: that self-contradiction is the sharpest possible moment.

If nothing personal recurs beneath the stated subject, say so honestly rather than inventing
a buried thread. Never flatter, never therapise, never tell them what it "means" or what they
"should" do. Name what is there, in their words.

Return ONLY valid JSON, no markdown fence, no preamble, in exactly this shape.
Put the buried thread first; mark each thread's kind:
{
  "threads": [
    { "theme": "<short phrase in your words>", "kind": "buried" | "stated",
      "recurrence": <int>, "guises": ["<their words>", "..."],
      "fragment_timestamps": ["Mon 21:03", "..."] }
  ],
  "stated_subject": "<the declared topic of the work, in a few words>",
  "buried_thread": "<the personal thread they keep circling without naming>",
  "primary_reflection": "<2-3 sentences: lead with the buried thread, contrast it against the stated subject, quote their words>",
  "nothing_recurred": false
}
`.trim();

const userMessage = [
  `PRACTICE: ${practice}`,
  "",
  "FRAGMENTS (timestamped, oldest first):",
  ...fragments.map((f) => `[${f.ts}] ${f.text}`),
].join("\n");

async function main() {
  console.log(`\n▶ Weekly read — ${fragments.length} fragments, model ${MODEL}\n`);

  let stdout;
  try {
    // --system-prompt sets the system prompt; -p is the user message; --model picks Sonnet 5.
    ({ stdout } = await run(
      "claude",
      ["-p", userMessage, "--append-system-prompt", SYSTEM_PROMPT, "--model", MODEL],
      { maxBuffer: 10 * 1024 * 1024, stdio: ["ignore", "pipe", "pipe"] }
    ));
  } catch (err) {
    console.error("✗ CLI call failed. Is `claude` on PATH and logged in?\n");
    console.error(err.stderr || err.message);
    process.exit(1);
  }

  const raw = stdout.trim();
  let report;
  try {
    // Be forgiving if the model wraps JSON in a fence despite instructions.
    const json = raw.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
    report = JSON.parse(json);
  } catch {
    console.log("⚠ Could not parse JSON. Raw output:\n");
    console.log(raw);
    process.exit(0);
  }

  console.log("─".repeat(60));
  if (report.stated_subject) console.log(`\n  YOU SAY IT'S ABOUT:   ${report.stated_subject}`);
  if (report.buried_thread) console.log(`  YOU KEEP RETURNING TO: ${report.buried_thread}`);
  for (const t of report.threads ?? []) {
    const tag = t.kind === "buried" ? "⟵ buried" : "  stated";
    console.log(`\n  ${tag}  ${t.theme}  (×${t.recurrence})`);
    for (const g of t.guises ?? []) console.log(`    • "${g}"`);
  }
  console.log("\n" + "─".repeat(60));
  console.log("\n  THE REFLECTION:\n");
  console.log("  " + (report.primary_reflection ?? "(none)").replace(/\n/g, "\n  "));
  console.log("\n" + "─".repeat(60) + "\n");
}

main();
