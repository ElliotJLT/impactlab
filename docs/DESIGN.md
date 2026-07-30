# Design system

**Claude: read this before writing any UI. Use these tokens. Don't invent values.**

Four people building screens with no shared system produces four visual languages and a demo that looks like a merge conflict. This file is the shortest thing that prevents that. Everything below is decided — tokens, type, motion, components — so nobody relitigates palette at 18:15.

---

## North star — "Sleep On It"

A dark, quiet surface that gets out of the way until you touch it, then responds instantly.

Capture is a single lit point of focus on an otherwise unlit screen — you thumb in a half-formed thought and it's gone, filed, no ceremony. Everything already captured recedes into calm, low-contrast history until you go looking for it. The one place the interface is allowed to show life is the **dream cycle**: overnight, notes captured weeks apart collide, and connections animate in with weight — like an idea physically finding its place. The wake screen is the payoff, and it must always be honest about whose words are whose: the user's fragments are quoted verbatim; the dream's one-step guesses ("extensions") are visibly the machine wondering, never dressed up as finished work.

Never decorative. Never persuasive. One accent colour earns all the attention it gets. Motion is a response, not decoration — with exactly one sanctioned exception (the dream animation, below).

---

## The rule

**Mobile-first PWA. Always.** Design for a phone held one-handed, on a train platform, by someone with 3 minutes — or lying in the dark before sleep, which is where this product lives. Desktop is a widened phone layout, never the other way round.

Concretely: build at **390 × 844** (iPhone 14/15 viewport). If it works there it works everywhere. Add breakpoints upward only if there's time, which there won't be.

**Dark-first, light-real.** The night theme is the product's identity, so dark is the *designed-for* default. But daylight on a platform is a genuine use case, so light mode is first-class, not an afterthought — both are WCAG-verified below and switch automatically on `prefers-color-scheme`.

---

## Eight non-negotiables

Each is a real device behaviour, not a preference. Ignoring them produces bugs you'll find on stage.

| # | Rule | Why |
|---|---|---|
| 1 | **Touch targets ≥ 44px**, 48px preferred | Apple HIG minimum is 44pt, Material is 48dp. Below that, thumbs miss. |
| 2 | **Primary action in the bottom third** | Thumb reach on a 6"+ phone. Top-right is the hardest place to tap one-handed. |
| 3 | **`100dvh`, never `100vh`** | `100vh` on mobile Safari includes the URL bar, so `100vh` layouts get cut off. |
| 4 | **Inputs at `font-size: 16px` minimum** | iOS Safari auto-zooms the page on focus for anything smaller. Looks broken, is hard to undo. |
| 5 | **Respect safe areas** — `env(safe-area-inset-*)` | Otherwise your capture bar sits under the home indicator and your header under the notch. Needs `viewport-fit=cover`. |
| 6 | **No hover-only affordances** | Touch devices have no hover. Guard hover styles in `@media (hover: hover)`; style `:active` instead. |
| 7 | **Honour `prefers-reduced-motion`** | Vestibular disorders — and the dream animation is our biggest motion. Also the brief's prompt 2 is literally about accessibility. |
| 8 | **One primary action per screen** | 3-minute session, one thumb, in the dark. Two CTAs means neither gets pressed. |

---

## Tokens

Paste into `app/globals.css`. Everything references these — **no raw hex in components.** `:root` is dark (the default); light is the `prefers-color-scheme: light` override.

```css
:root {
  /* Surface — dark is the default identity */
  --bg:            #0A0B0D;   /* near-black canvas — the unlit screen */
  --surface:       #141519;   /* cards, history rows, the wake screen */
  --surface-raised:#1E2027;   /* the one focused element — active capture bar */
  --border:        #282A31;   /* hairlines, card edges — never pure white */

  /* Text */
  --text:          #F2F4F7;   /* off-white, never #FFFFFF — reduces glare in the dark */
  --text-muted:    #9AA5B4;   /* timestamps, history preview, the dream's guesses */

  /* Accent — one only. "Signal" (aqua-teal). */
  --accent:        #3FBFB2;
  --accent-on:     #06201E;

  --danger:        #F0857E;

  /* Space — 4px base */
  --s-1: 4px;  --s-2: 8px;  --s-3: 12px; --s-4: 16px;
  --s-5: 24px; --s-6: 32px; --s-7: 48px; --s-8: 64px;

  /* Radius */
  --r-sm: 8px; --r-md: 12px; --r-lg: 20px; --r-full: 999px;

  /* Elevation — flat by default. The only lift is a focus glow (see Elevation). */
  --glow: 0 0 0 1px var(--accent), 0 0 24px -6px var(--accent);

  /* Motion — physics, not easing. One curve, used sparingly. */
  --spring: 420ms cubic-bezier(0.22, 1, 0.36, 1);

  /* Touch */
  --tap-min: 44px;
  --tap:     48px;
}

@media (prefers-color-scheme: light) {
  :root {
    --bg:            #F7F8FA;
    --surface:       #FFFFFF;
    --surface-raised:#FFFFFF;
    --border:        #E2E6EC;
    --text:          #12151C;
    --text-muted:    #5A6472;
    --accent:        #16776F;
    --accent-on:     #FFFFFF;
    --danger:        #C2413B;
    --glow:          0 0 0 1px var(--accent), 0 4px 16px -8px var(--accent);
  }
}

* { -webkit-tap-highlight-color: transparent; }

html { color-scheme: dark light; }

body {
  background: var(--bg);
  color: var(--text);
  font-size: 16px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  overscroll-behavior-y: none;   /* kills pull-to-refresh mid-dictation */
}

/* Safe areas — apply to anything pinned to an edge */
.pin-bottom { padding-bottom: max(var(--s-4), env(safe-area-inset-bottom)); }
.pin-top    { padding-top:    max(var(--s-4), env(safe-area-inset-top)); }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Tailwind mapping

If we're on Tailwind, wire the tokens in so `bg-bg` / `text-muted` / `bg-accent` work and nobody reaches for `bg-[#3FBFB2]`:

```js
// tailwind.config.ts → theme.extend.colors
colors: {
  bg:      'var(--bg)',
  surface: { DEFAULT: 'var(--surface)', raised: 'var(--surface-raised)' },
  border:  'var(--border)',
  text:    'var(--text)',
  muted:   'var(--text-muted)',
  accent:  { DEFAULT: 'var(--accent)', on: 'var(--accent-on)' },
  danger:  'var(--danger)',
}
```

---

## Contrast — verified

Computed with the formula below, not guessed. All pass **WCAG AA** (4.5:1 body text, 3:1 UI).

| Pair | Ratio | |
|---|---|---|
| Body on bg (dark) | 17.87:1 | ✅ |
| Muted on bg (dark) | 7.89:1 | ✅ |
| Muted on surface (dark) | 7.31:1 | ✅ |
| Button label on accent (dark) | 7.55:1 | ✅ |
| Accent on bg (dark) | 8.73:1 | ✅ |
| Danger on bg (dark) | 7.84:1 | ✅ |
| Body on bg (light) | 17.19:1 | ✅ |
| Muted on bg (light) | 5.65:1 | ✅ |
| Button label on accent (light) | 5.38:1 | ✅ |
| Accent on bg (light) | 5.06:1 | ✅ |
| Danger on bg (light) | 4.80:1 | ✅ |

**If you change a colour, recompute.** Don't eyeball it:

```bash
node -e 'const L=h=>{const c=[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255).map(v=>v<=.03928?v/12.92:((v+.055)/1.055)**2.4);return .2126*c[0]+.7152*c[1]+.0722*c[2]};const R=(a,b)=>{const[x,y]=[L(a),L(b)].sort((m,n)=>n-m);return((x+.05)/(y+.05)).toFixed(2)};console.log(R("#3FBFB2","#0A0B0D"))'
```

---

## Type

The capture input is the largest text on screen at rest — everything else is quieter than the thing being captured.

| Role | Size / line-height | Weight | Use |
|---|---|---|---|
| Display | `32px / 1.15` | 400 | The one hero line per screen — the wake greeting, a fired eureka |
| Capture | `24px / 1.3` | 400 | The capture input at rest — the loudest thing on the screen |
| H1 | `24px / 1.25` | 600 | Screen title |
| H2 | `19px / 1.3` | 600 | Section — "what you kept returning to", a collision header |
| Body | `16px / 1.5` | 400 | Everything. Never smaller for real content. |
| Label | `13px / 1.4` | 500, `0.02em` tracking, uppercase | Field labels, structural tags, "the dream's guess" caption |
| Mono | `14px / 1.5` | 400 | Structured dream output — the reading, collision fields, timestamps |

**Fonts — decided (Decision 004), don't relitigate:** `Geist Sans` (UI + body + capture), `Geist Mono` (structured dream output), `Instrument Serif` (the single display line only). Geometric and slightly technical, so it never reads as the Inter-for-everything generic-AI default. All free, all one line to add in Next.js via `next/font`.

**Banned:** Inter, Roboto, Arial, bare `system-ui` stacks, purple-on-white gradients, and the cream-background-plus-serif look. Judges have seen all of these all afternoon.

---

## Elevation & motion

**Flat by default.** Shadows read muddy on a near-black canvas and cost more than they add. Elevation is communicated with a subtle border, plus a soft accent-coloured glow (`--glow`) on **only** the element currently receiving input — the capture bar when focused, a connection being pulled. Nothing else lifts.

**Motion is a response, not decoration.** Use the `--spring` curve (physics, not `ease-in-out`) and only in three places:

1. **Capture → saved** — the thought leaves the input and settles into history.
2. **Connections in the wake screen** — collision lines draw in with weight, weeks-apart notes pulling toward each other.
3. **The dream animation** — *the one sanctioned ambient motion.* It runs 10–20s while the API thinks (`docs/API.md`); it is the product's identity moment and covers latency in place of a spinner. Everything else stays still until the user touches it.

Every one of these must collapse to a near-instant state change under `prefers-reduced-motion` (non-negotiable #7). The dream animation in particular needs a static reduced-motion path — a calm "dreaming…" state, not a frozen half-animation.

---

## Components

Minimum set. Build once, reuse, don't fork.

### System primitives

**Button** — `min-height: var(--tap)`, `padding: 0 var(--s-5)`, `border-radius: var(--r-full)`, `background: var(--accent)`, `color: var(--accent-on)`, `font-weight: 500`. `:active { transform: scale(0.97) }`. Hover only inside `@media (hover: hover)`.

**Card** — `background: var(--surface)`, `border: 1px solid var(--border)`, `border-radius: var(--r-lg)`, `padding: var(--s-5)`. Border over shadow. Never nest a card inside a card.

### Product surfaces

**Capture bar** — bottom-anchored (rule 2), thumb-zone, class `pin-bottom`, always visible and focus-ready: one tap or app-open to first keystroke. `font-size: 16px` minimum (rule 4), `border-radius: var(--r-md)`, `background: var(--surface-raised)`. Focused, it's the one lit element: `box-shadow: var(--glow)` — never `outline: none` with nothing to replace it. No placeholder copy that requires reading. First-keystroke latency near zero is the metric this product lives or dies on.

**Mic / dictate button** — `var(--tap)` square minimum, `--r-full`. Recording state must be **colour change plus a text label** — never colour alone, that fails for colourblind users. No pulse animation under reduced motion.

**History row** — text-forward on `var(--surface)`, timestamp in `--text-muted` (Mono), no thumbnails or icons cluttering the row. Recedes into calm low contrast until looked at. Tap to promote a note into the wake view.

**Wake screen — the reading, collisions, eureka.** Renders the structured output from `docs/API.md`, never prose:
- The user's quoted fragments are `--text`, Mono, verbatim — their words, foregrounded.
- **The dream's `extension` is rendered visibly distinct** — `--text-muted`, italic, with a Label caption like "the dream's guess." The product's honesty depends on the user always seeing which words are theirs and which are the machine wondering. This is a hard rule, not a style choice.
- A **eureka is rare and earns the Display face** — it's the one screen allowed a hero line. Most cycles have none; the empty case ("nothing new tonight") must feel calm and intentional, not like a failure.

---

## PWA checklist

Installable needs three things. It does **not** need a service worker (Decision 005 — offline is out of scope; buys nothing in a live demo on venue wifi).

- [ ] `app/manifest.json` — `name`, `short_name`, `start_url: "/"`, `display: "standalone"`, `background_color: "#0A0B0D"`, `theme_color: "#0A0B0D"`, and `icons` at 192px + 512px (plus one `"purpose": "maskable"`)
- [ ] Viewport meta **with `viewport-fit=cover`** — without it, `env(safe-area-inset-*)` returns 0 and rule 5 silently does nothing:
      `width=device-width, initial-scale=1, viewport-fit=cover`
- [ ] `apple-touch-icon` (180px) and `<meta name="theme-color" content="#0A0B0D">` — iOS ignores the manifest for both. Match the dark canvas so the status bar blends into the night theme.
- [ ] Served over HTTPS — Vercel gives this free

---

## Do's and don'ts

**Do:** commit to the single accent everywhere it appears. Keep the capture bar's first-keystroke latency near zero. Use `--spring` physics only for the three sanctioned motions. Always render the dream's extension as visibly the machine's guess, not the user's words.

**Banned outright:**
- Raw hex or arbitrary values in components — use the tokens
- `100vh` (use `100dvh`), inputs under 16px, targets under 44px
- A second competing accent, or a purple-to-blue gradient
- Hover as the only way to discover something; colour as the only signal for state
- `outline: none` without a visible replacement focus ring
- Nesting cards inside cards in the history view
- A rounded-square icon tile above headings — reads as generic AI-app output
- Animating anything the user didn't touch (the dream cycle is the one exception)
- Desktop-first layout with mobile bolted on after
