# Design system

**Claude: read this before writing any UI. Use these tokens. Don't invent values.**

Four people building screens with no shared system produces four visual languages and a demo that looks like a merge conflict. This file is the shortest thing that prevents that. Everything below is decided — tokens, type, motion, components — so nobody relitigates palette at 18:15.

---

## North star — "Sleep On It"

A warm, quiet surface that gets out of the way until you touch it, then responds instantly. A single warm gradient blooms at the top and fades into near-black — calm and human, not a cold technical console. That bloom is the product's whole colour budget; everything else is quiet.

Capture is a single lit point of focus below the bloom — you thumb in a half-formed thought and it's gone, filed, no ceremony. Everything already captured recedes into calm, low-contrast history until you go looking for it. The one place the interface is allowed to show life is the **dream cycle**: overnight, notes captured weeks apart collide, and connections animate in with weight — like an idea physically finding its place. The wake screen is the payoff, and it must always be honest about whose words are whose: the user's fragments are quoted verbatim; the dream's one-step guesses ("extensions") are visibly the machine wondering, never dressed up as finished work.

Never persuasive. Never cold or intimidating. The gradient bloom and the one accent drawn from it earn all the colour there is. Motion is a response, not decoration — save two ambient exceptions that are the product's identity: the dream animation, and the bloom's slow drift (both below).

---

## The rule

**Mobile-first PWA. Always.** Design for a phone held one-handed, on a train platform, by someone with 3 minutes — or lying in the dark before sleep, which is where this product lives. Desktop is a widened phone layout, never the other way round.

Concretely: build at **390 × 844** (iPhone 14/15 viewport). If it works there it works everywhere. Add breakpoints upward only if there's time, which there won't be.

**Two themes, driven by the system.** Exactly two — light and dark — switching automatically on the OS setting (`prefers-color-scheme`), no in-app toggle and nothing tied to the time of day. Dark is the product's identity, so it's the **no-preference default**; light is a genuine daytime-on-a-platform case, not an afterthought. Both are warm and both carry the signature gradient (below): dark is orange-into-near-black, light is a pale peach over paper. Both are WCAG-verified below.

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
  /* Surface — DARK: warm near-black. Default when the OS has no preference. */
  --bg:            #0E0B09;   /* warm near-black canvas — the bloom fades into this */
  --surface:       #1C1713;   /* cards, history rows, the wake screen */
  --surface-raised:#241D17;   /* the one focused element — active capture bar */
  --border:        #332A22;   /* hairlines, card edges — warm, never cold grey */

  /* Text — warm cream, never a blue-white */
  --text:          #F6ECE1;   /* off-white with warmth — no glare in the dark */
  --text-muted:    #BCAD9A;   /* timestamps, history preview, the dream's guesses */

  /* Accent — one only. "Ember" (warm orange) — the colour the bloom is built from. */
  --accent:        #F0803F;
  --accent-on:     #2A1305;   /* dark label on the bright accent — white fails AA here */

  --danger:        #FF8A80;

  /* Signature gradient — a vibrant warm mesh bloom at the top, fading to transparent
     by ~56% so the base (--bg) carries the lower text zone. Sits on an animated
     ::before layer (see below), never on text. */
  --bloom:
    radial-gradient(120% 70% at 50% -10%, rgb(255 140 60 / 0.72) 0%, rgb(255 140 60 / 0) 56%),
    radial-gradient(95% 60% at 66% 18%,   rgb(230 50 35 / 0.65)  0%, rgb(230 50 35 / 0) 58%),
    radial-gradient(90% 58% at 28% 26%,   rgb(255 165 80 / 0.40) 0%, rgb(255 165 80 / 0) 54%);

  /* Space — 4px base */
  --s-1: 4px;  --s-2: 8px;  --s-3: 12px; --s-4: 16px;
  --s-5: 24px; --s-6: 32px; --s-7: 48px; --s-8: 64px;

  /* Radius — generous, soft. Nothing sharp. */
  --r-sm: 8px; --r-md: 12px; --r-lg: 20px; --r-full: 999px;

  /* Elevation — flat by default. The only lift is a warm focus glow (see Elevation). */
  --glow: 0 0 0 1px var(--accent), 0 0 24px -6px var(--accent);

  /* Motion — physics, not easing. One curve, used sparingly. */
  --spring: 420ms cubic-bezier(0.22, 1, 0.36, 1);

  /* Touch */
  --tap-min: 44px;
  --tap:     48px;
}

@media (prefers-color-scheme: light) {
  :root {
    /* LIGHT: warm greige — paper and stone, not cold blue-white. */
    --bg:            #F6F1EA;
    --surface:       #FEFCF8;
    --surface-raised:#FEFCF8;
    --border:        #E7DFD3;
    --text:          #221C15;   /* warm near-black */
    --text-muted:    #6A6055;
    --accent:        #A84A0E;   /* burnt terracotta — the same ember, in daylight */
    --accent-on:     #FFFFFF;
    --danger:        #C0392E;
    --glow:          0 0 0 1px var(--accent), 0 4px 16px -8px var(--accent);
    /* Same bloom shape, warmer/more saturated peach — fades to transparent over paper. */
    --bloom:
      radial-gradient(120% 70% at 50% -10%, rgb(255 150 70 / 0.48) 0%, rgb(255 150 70 / 0) 56%),
      radial-gradient(95% 60% at 66% 18%,   rgb(240 80 55 / 0.34)  0%, rgb(240 80 55 / 0) 58%),
      radial-gradient(90% 58% at 28% 26%,   rgb(255 185 120 / 0.36) 0%, rgb(255 185 120 / 0) 54%);
  }
}

* { -webkit-tap-highlight-color: transparent; }

html { color-scheme: dark light; }   /* dark listed first = the no-preference default */

body {
  background: var(--bg);   /* solid base carries the text zone */
  color: var(--text);
  font-size: 16px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  overscroll-behavior-y: none;   /* kills pull-to-refresh mid-dictation */
}

/* The signature bloom: fixed layer behind everything, drifting very slowly.
   Kept in the TOP region (overhang + small transform) so the lower text zone stays --bg. */
body::before {
  content: "";
  position: fixed;
  inset: -18% -18% auto -18%;   /* overhang so drift never reveals an edge */
  height: 96svh;
  z-index: -1;
  pointer-events: none;
  background: var(--bloom);
  transform-origin: 50% 0%;
  animation: bloom-drift 36s ease-in-out infinite alternate;
  will-change: transform, filter;
}
@keyframes bloom-drift {
  0%   { transform: translate3d(-2%, -1%, 0) scale(1.05); filter: hue-rotate(-6deg) saturate(1);    }
  50%  { transform: translate3d( 2%,  1%, 0) scale(1.10); filter: hue-rotate( 5deg) saturate(1.08); }
  100% { transform: translate3d(-1%,  0%, 0) scale(1.07); filter: hue-rotate(-3deg) saturate(1.02); }
}

/* Safe areas — apply to anything pinned to an edge */
.pin-bottom { padding-bottom: max(var(--s-4), env(safe-area-inset-bottom)); }
.pin-top    { padding-top:    max(var(--s-4), env(safe-area-inset-top)); }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
  body::before { animation: none; transform: scale(1.05); }   /* bloom stays, just holds still */
}
```

### Tailwind mapping

If we're on Tailwind, wire the tokens in so `bg-bg` / `text-muted` / `bg-accent` work and nobody reaches for `bg-[#F0803F]`:

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

### Signature gradient — the bloom

The one piece of colour the product spends. A vibrant warm mesh **blooms at the top of the canvas and fades out by ~56% down** — orange-into-red in dark, warm peach in light — over a solid base that carries all the text. It's the app's identity (visual reference: a Zentra-style onboarding gradient), and the accent is drawn from the same warm family so the whole surface reads as one temperature.

It **drifts very slowly** — a ~36s translate/scale/hue cycle on a fixed `body::before` — enough to feel alive, too slow to distract or to move brightness into the text zone. This is a deliberate, logged exception to "don't animate what the user didn't touch" (Decision 008): it's the product's identity, not a response to input, and it's the only ambient motion besides the dream animation.

It stays accessible because of one layout rule, borrowed from the reference: **the bloom is empty atmosphere; text lives on the base below it.**

- **No text — not even the headline — over the bloom's hot center.** With the vibrant palette, display text on the brightest dark hotspot is only 2.75:1, so nothing sits there.
- **Body, muted and label text sit on the solid base (`--bg`) or a solid `--surface`** — never on the bloom — both fully verified below and unaffected by the gradient. (Muted over the light bloom's hotspot would be ~3.2:1; it never goes there.)
- **The display line (hero headline) sits low**, in the faded lower reach of the bloom where it's near-base — verified 8.03:1 (dark) / 8.73:1 (light). This mirrors the reference: the headline is on near-black, not on the bright part.
- **The animation is confined to the top.** Overhang plus a small transform (`transform-origin: 50% 0%`) keep the bright region up top; the lower ~40% stays `--bg` throughout the cycle, so text ratios never change as it drifts.
- **Surfaces stay solid** and occlude the bloom, so every card/capture-bar ratio is unaffected.
- **`prefers-reduced-motion` freezes it** to a still frame (kept visible, just not moving) — non-negotiable #7.

No *other* gradient anywhere — this is the one. A second decorative gradient competes with it and the ban in the last section still holds.

---

## Contrast — verified

Computed with the formula below, not guessed. All pass **WCAG AA** (4.5:1 body text, 3:1 UI). Solid tokens are what carry text; the bloom hotspots are listed to prove the display-line exception holds.

| Pair | Ratio | |
|---|---|---|
| Body on bg (dark) | 16.82:1 | ✅ |
| Muted on bg (dark) | 8.95:1 | ✅ |
| Muted on surface (dark) | 8.11:1 | ✅ |
| Button label on accent (dark) | 6.59:1 | ✅ |
| Accent on bg (dark) | 7.35:1 | ✅ |
| Danger on bg (dark) | 8.59:1 | ✅ |
| Display line, faded lower bloom (dark) | 8.03:1 | ✅ |
| — bright bloom hotspot (dark): no text sits here | 2.75:1 | n/a |
| Body on bg (light) | 15.01:1 | ✅ |
| Muted on bg (light) | 5.47:1 | ✅ |
| Button label on accent (light) | 5.75:1 | ✅ |
| Accent on bg (light) | 5.12:1 | ✅ |
| Danger on bg (light) | 4.83:1 | ✅ |
| Display line over light bloom | 8.73:1 | ✅ |

**If you change a colour, recompute.** Don't eyeball it:

```bash
node -e 'const L=h=>{const c=[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255).map(v=>v<=.03928?v/12.92:((v+.055)/1.055)**2.4);return .2126*c[0]+.7152*c[1]+.0722*c[2]};const R=(a,b)=>{const[x,y]=[L(a),L(b)].sort((m,n)=>n-m);return((x+.05)/(y+.05)).toFixed(2)};console.log(R("#F0803F","#0E0B09"))'
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

**Fonts — decided (Decision 004), don't relitigate:** `Geist Sans` (UI + body + capture), `Geist Mono` (structured dream output), `Instrument Serif` (the single display line only). Clean and geometric so it never reads as the Inter-for-everything generic-AI default, but paired with warm colour and a serif display line it stays human, not clinical. All free, all one line to add in Next.js via `next/font`.

**Banned:** Inter, Roboto, Arial, bare `system-ui` stacks, purple-on-white gradients, and the cream-background-plus-serif look. Judges have seen all of these all afternoon.

---

## Elevation & motion

**Flat by default.** Shadows read muddy on a near-black canvas and cost more than they add. Elevation is communicated with a subtle border, plus a soft accent-coloured glow (`--glow`) on **only** the element currently receiving input — the capture bar when focused, a connection being pulled. Nothing else lifts.

**Motion is a response, not decoration** — with two sanctioned ambient exceptions, both part of the product's identity. Responsive motion uses the `--spring` curve (physics, not `ease-in-out`) in three places:

1. **Capture → saved** — the thought leaves the input and settles into history.
2. **Connections in the wake screen** — collision lines draw in with weight, weeks-apart notes pulling toward each other.
3. **The dream animation** — runs 10–20s while the API thinks (`docs/API.md`); the product's identity moment, covering latency in place of a spinner.

The two ambient exceptions (things that move without being touched): the **dream animation** above, and the **signature bloom** — a ~36s drift so slow it reads as atmosphere, not motion (see Signature gradient). Everything else stays still until the user touches it.

All of the above must collapse under `prefers-reduced-motion` (non-negotiable #7): responsive motions become near-instant state changes, the dream animation gets a static "dreaming…" state (not a frozen half-animation), and the bloom holds on a still frame.

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

- [ ] `app/manifest.json` — `name`, `short_name`, `start_url: "/"`, `display: "standalone"`, `background_color: "#0E0B09"`, `theme_color: "#0E0B09"`, and `icons` at 192px + 512px (plus one `"purpose": "maskable"`)
- [ ] Viewport meta **with `viewport-fit=cover`** — without it, `env(safe-area-inset-*)` returns 0 and rule 5 silently does nothing:
      `width=device-width, initial-scale=1, viewport-fit=cover`
- [ ] `apple-touch-icon` (180px) and `<meta name="theme-color" content="#0E0B09">` — iOS ignores the manifest for both. Match the warm near-black base (the bloom top sits under the status bar, so keep it dark). (Optionally add a light variant via `media="(prefers-color-scheme: light)" content="#F6F1EA"`.)
- [ ] Served over HTTPS — Vercel gives this free

---

## Do's and don'ts

**Do:** commit to the single accent everywhere it appears. Keep the capture bar's first-keystroke latency near zero. Use `--spring` physics only for the three sanctioned motions. Always render the dream's extension as visibly the machine's guess, not the user's words.

**Banned outright:**
- Raw hex or arbitrary values in components — use the tokens
- `100vh` (use `100dvh`), inputs under 16px, targets under 44px
- A second competing accent, or any gradient beyond the one signature bloom on the canvas — no second gradient, no hero blob elsewhere
- Body or muted text placed over the bloom (only the display line, and only in its lower near-base zone)
- Cold blue-white "light mode" or cold near-black "dark mode" — both themes are warm
- Hover as the only way to discover something; colour as the only signal for state
- `outline: none` without a visible replacement focus ring
- Nesting cards inside cards in the history view
- A rounded-square icon tile above headings — reads as generic AI-app output
- Animating anything the user didn't touch (the dream cycle is the one exception)
- Desktop-first layout with mobile bolted on after
