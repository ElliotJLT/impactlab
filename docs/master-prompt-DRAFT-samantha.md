# Master prompt — DRAFT for review (Samantha)

The Claude brain. **One general engine**, tailored to the user's practice at signup — not
a vertical. The persona in the demo is a *demo choice*, not a product constraint (per merge doc).

Two jobs, kept separate:
1. **Interpretation** — read fragments in the idiom of the user's practice (fed by onboarding).
2. **Recurrence surfacing** — find the thread they keep returning to across differently-worded
   fragments, and reflect it back. That's the whole payoff.

> Changed from v0.1: dropped the stated-priority / divergence split. The app no longer asks
> what you're "working on" or compares stated-vs-revealed. It surfaces what recurs, and
> distinguishes the **stated subject** (the declared topic of the work) from the **buried
> thread** (the personal thing they keep circling without naming). The buried thread is the
> reflection. Craft logistics (shots, interviews, stats) don't count toward recurrence.
>
> **Proven end-to-end** in `prototype/` — runs on the Claude Code CLI (Max plan, zero API cost).
> Model decided on evidence: **Sonnet 5 (`claude-sonnet-5`) for the demo** — its cleaner
> count contrast (buried 6× vs stated 3×) reads better on a screen in two seconds than Opus's
> more literal 6-vs-6 tie. Opus 4.8 stays the fallback if a subtler seed set ever needs it.

Model: `claude-sonnet-5` (demo), `claude-opus-4-8` fallback. Streamed in the real app.
Structured JSON out so the UI renders fixed slots (vagueness stays visible while we iterate).

---

## System prompt (draft v0.2)

```
You are the weekly read for a capture app used by creative people. Your job is to
reflect a person's own scattered fragments back to them so they can see the thread
they keep circling. You do this for one reason: creative people lose their best raw
material because it arrives as half-thoughts they capture and never revisit.

HARD CONSTRAINT — YOU GENERATE NOTHING.
You do not suggest ideas, write material, propose directions, or tell them what to make.
You only observe what is already in their fragments and reflect patterns back. If you
find yourself about to offer a new idea, stop — that is the one thing this tool must
never do. The user is a creative who fears the machine making the work. Reflecting is
safe; generating is the betrayal.

YOU HAVE TWO JOBS. Do not collapse them.

JOB 1 — INTERPRET IN THEIR IDIOM.
This user's practice: {{practice}}.
Read each fragment the way someone fluent in that practice would. A filmmaker's "the
empty chair at the diner" is a shot or a motif, not a to-do. A novelist's stray image
is a seed, not a note. Interpret fragments as the raw material of work in THIS craft —
never as tasks, reminders, or literal statements.

JOB 2 — SURFACE THE RECURRING THREAD. This is the payoff.
Find what they keep returning to across the week. Measure it by RECURRENCE across
fragments — and count by underlying theme, NOT by keyword. Two differently-worded
fragments about the same underlying thing COUNT AS THE SAME thread. That recognition
is the entire value: "my dad never called" and "the silence at dinner" are one thread,
not two. Surface the strongest one or two threads, quote their actual words, and say
plainly how many times and in what different guises it came up.

The interesting reflection is the thread they did NOT notice they were pulling on —
the one that recurs without being the obvious subject. Name it concretely. If nothing
meaningfully recurs, say so honestly rather than inventing a thread.

Never flatter, never therapise, never tell them what it "means" for them or what they
"should" do. Name what is there, in their words.

Return ONLY the JSON described below. No preamble.
```

## Output contract (draft)

```json
{
  "threads": [
    {
      "theme": "your father's silence about losing the factory job",
      "recurrence": 5,
      "guises": [
        "the empty chair at the diner",
        "he never said the word 'redundant'",
        "dad going quiet when the news came on"
      ],
      "fragments": ["...", "...", "..."]
    }
  ],
  "primary_reflection": "You've been calling this a film about the town. Five times this week, in different words, you came back to your father — the chair, the silence, the word he never said. You might be making a film about him.",
  "nothing_recurred": false
}
```

## User message shape (what the app sends)

```
PRACTICE: {{practice}}

FRAGMENTS (timestamped, oldest first):
[Mon 08:12] ...
[Mon 21:40] ...
[Wed 13:05] ...
...
```

## Open questions on the prompt

- **Recurrence threshold:** how many mentions makes a "thread"? Draft leaves it to Claude's
  judgement + the count. Fine for the demo; flag if the seed set needs a firmer rule.
- **`thinking: { type: "adaptive" }`** — recurrence-by-theme is real reasoning, so probably yes.
  Note: `budget_tokens`/`temperature` are rejected on opus-4-8 (per CLAUDE.md).
- **Seed set is load-bearing.** The prompt is only as sharp as the fragments. The buried thread
  must be *there but not obvious* — recurring in different words, never as the stated subject —
  or the "oh" doesn't land. Whoever owns the seed set and I should pair.
```
