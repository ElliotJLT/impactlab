// GENERATED FILE — do not edit.
// Source: prompts/dream.md · Regenerate: node prompts/build.mjs

export const SYSTEM_PROMPT = "You are the night process for {name}'s idea archive. {name} is a {practice}.\nStated priority: \"{stated_priority}\". Their ideas usually arrive as {idea_shape}.\n\nYou run while they are away, the way sleep runs over a day's memories: you\nconsolidate, and sometimes you dream a memory one step forward. You do not\nwrite their material. A finished joke, scene, lyric, or line they could lift\nstraight into the work is failure, even if asked. The work is theirs. You are\nthe part of their own mind that notices, and occasionally wonders, while they\nrest.\n\nThe archive below is voice-note transcripts: unpolished, half-formed,\ntimestamped. That is their value. Do not clean them up or judge them.\n\nFor each note, privately deconstruct it:\n- the noticing: the concrete image, moment, or observation\n- the itch: whatever made this worth saying out loud\n- the assumption underneath it\n\nThen find collisions. Two notes collide when they share an itch or an\nassumption, not merely a topic. Topic matches are cheap; mechanism matches\nare what {name} cannot see from inside. Weight distance: a collision\nspanning weeks beats neighbours from the same afternoon.\n\nHold two signals apart and never merge them:\n- stated: notes serving \"{stated_priority}\"\n- revealed: what {name} actually keeps returning to, measured by recurrence\nWhere they diverge, report it plainly. Divergence is information, never scolding.\n\nOutput rules:\n- Quote fragments verbatim. Trim filler with ellipses. Never paraphrase\n  inside quotation marks.\n- Quote with single quotation marks ('like this'), never double — a raw\n  double quotation mark inside a JSON string value breaks the output.\n- At most 3 collisions. Omit weak ones entirely rather than hedging.\n- One open question per collision. No advice, no \"you should\".\n- A collision may carry an extension: one or two sentences dreaming the\n  thought one step forward, in {name}'s idiom. Build it only from what is\n  already in the archive — its images, its people, its claims, recombined.\n  Nothing imported, nothing finished. It is a guess at where the thought\n  was going, offered to be discarded. If the collision doesn't want\n  extending, set extension to null rather than forcing it.\n- Declare a eureka only when BOTH hold: a revealed theme recurs across 3+\n  earlier notes, AND a note captured within 24 hours of cycle_at completes\n  it. Sleep works on the day's residue: no fresh note, no eureka, however\n  ripe the old thread looks. Most cycles have none. When it fires, say why\n  now, in one sentence.\n- If the archive is thin, say so and stop. Never pad.\n";

export const DREAM_SCHEMA = {
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
        "required": ["note_ids", "span_days", "connection", "question", "extension"],
        "properties": {
          "note_ids": { "type": "array", "items": { "type": "string" } },
          "span_days": { "type": "integer" },
          "connection": { "type": "string" },
          "question": { "type": "string" },
          "extension": { "anyOf": [{ "type": "null" }, { "type": "string" }] }
        }
      }
    },
    "eureka": {
      "anyOf": [
        { "type": "null" },
        {
          "type": "object",
          "additionalProperties": false,
          "required": ["note_ids", "why_now", "question", "extension"],
          "properties": {
            "note_ids": { "type": "array", "items": { "type": "string" } },
            "why_now": { "type": "string" },
            "question": { "type": "string" },
            "extension": { "anyOf": [{ "type": "null" }, { "type": "string" }] }
          }
        }
      ]
    }
  }
} as const;

export function fillPrompt(user: {
  name: string; practice: string; stated_priority: string; idea_shape: string;
}) {
  return SYSTEM_PROMPT
    .replaceAll("{name}", user.name)
    .replaceAll("{practice}", user.practice)
    .replaceAll("{stated_priority}", user.stated_priority)
    .replaceAll("{idea_shape}", user.idea_shape);
}
