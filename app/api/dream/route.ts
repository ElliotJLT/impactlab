// The dream route — implements docs/API.md exactly. Copied from
// prompts/route.reference.ts (Elliot's lane owns that + prompts/dream.md; after a
// prompt edit, run `node prompts/build.mjs` and re-copy dream.generated.ts to lib/dream.ts).
// Falls back to the committed known-good response if the API errors or times out,
// so a wifi drop can't kill the demo.
import Anthropic from "@anthropic-ai/sdk";
import { DREAM_SCHEMA, fillPrompt } from "@/lib/dream";
import fallback from "@/data/dream.fallback.json";

// Adaptive thinking on 12 notes measures ~40s. Vercel's default kills it,
// and only on the deployed URL — never locally. Do not remove.
export const maxDuration = 60;

const client = new Anthropic(); // reads ANTHROPIC_API_KEY from env

export async function POST(req: Request) {
  try {
    const { user, notes } = await req.json();

    const res = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 4000,
      thinking: { type: "adaptive" },
      output_config: { effort: "medium", format: { type: "json_schema", schema: DREAM_SCHEMA } },
      system: fillPrompt(user),
      messages: [
        {
          role: "user",
          content: JSON.stringify({ cycle_at: new Date().toISOString(), user, notes }),
        },
      ],
    });

    if (res.stop_reason === "refusal") throw new Error("refusal");

    const text = res.content.find((b) => b.type === "text");
    if (!text || text.type !== "text") throw new Error("no text block");

    return Response.json(JSON.parse(text.text));
  } catch (err) {
    // Stage insurance: never show the judges an error screen.
    console.error("[dream] falling back:", err);
    return Response.json(fallback, { headers: { "x-dream-fallback": "1" } });
  }
}
