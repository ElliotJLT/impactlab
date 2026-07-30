# Design system

**Claude: read this before writing any UI. Use these tokens. Don't invent values.**

Four people building screens with no shared system produces four visual languages and a demo that looks like a merge conflict. This file is the shortest thing that prevents that.

---

## The rule

**Mobile-first PWA. Always.** Design for a phone held one-handed, on a train platform, in daylight, by someone with 3 minutes. Desktop is a widened phone layout — never the other way round.

Concretely: build at **390 × 844** (iPhone 14/15 viewport). If it works there it works everywhere. Add breakpoints upward only if there's time, which there won't be.

---

## Eight non-negotiables

Each of these is a real device behaviour, not a preference. Ignoring them produces bugs you'll find on stage.

| # | Rule | Why |
|---|---|---|
| 1 | **Touch targets ≥ 44px**, 48px preferred | Apple HIG minimum is 44pt, Material is 48dp. Below that, thumbs miss. |
| 2 | **Primary action in the bottom third** | Thumb reach on a 6"+ phone. Top-right is the hardest place to tap one-handed. |
| 3 | **`100dvh`, never `100vh`** | `100vh` on mobile Safari includes the URL bar, so `100vh` layouts get cut off. |
| 4 | **Inputs at `font-size: 16px` minimum** | iOS Safari auto-zooms the page on focus for anything smaller. Looks broken, is hard to undo. |
| 5 | **Respect safe areas** — `env(safe-area-inset-*)` | Otherwise your bottom bar sits under the home indicator and your header under the notch. Needs `viewport-fit=cover`. |
| 6 | **No hover-only affordances** | Touch devices have no hover. Guard hover styles in `@media (hover: hover)`; style `:active` instead. |
| 7 | **Honour `prefers-reduced-motion`** | Vestibular disorders. Also the brief's prompt 2 is literally about accessibility. |
| 8 | **One primary action per screen** | 3-minute session, one thumb, moving train. Two CTAs means neither gets pressed. |

---

## Tokens

Paste into `app/globals.css`. Everything references these — **no raw hex in components.**

```css
:root {
  /* Surface */
  --bg:            #F7F8FA;
  --surface:       #FFFFFF;
  --border:        #E2E6EC;

  /* Text */
  --text:          #12151C;
  --text-muted:    #5A6472;

  /* Accent — one only */
  --accent:        #16776F;
  --accent-on:     #FFFFFF;

  --danger:        #C2413B;

  /* Space — 4px base */
  --s-1: 4px;  --s-2: 8px;  --s-3: 12px; --s-4: 16px;
  --s-5: 24px; --s-6: 32px; --s-7: 48px; --s-8: 64px;

  /* Radius */
  --r-sm: 8px; --r-md: 12px; --r-lg: 20px; --r-full: 999px;

  /* Elevation — sparingly, mobile reads flat */
  --shadow: 0 1px 2px rgb(18 21 28 / 0.06), 0 4px 12px rgb(18 21 28 / 0.05);

  /* Touch */
  --tap-min: 44px;
  --tap:     48px;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg:         #10131A;
    --surface:    #191E28;
    --border:     #2A3140;
    --text:       #F2F4F7;
    --text-muted: #9AA5B4;
    --accent:     #3FBFB2;
    --accent-on:  #08201E;
    --danger:     #F0857E;
  }
}

* { -webkit-tap-highlight-color: transparent; }

html { color-scheme: light dark; }

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

If we're on Tailwind, wire the tokens in so `bg-bg` / `text-muted` / `bg-accent` work and nobody reaches for `bg-[#16776F]`:

```js
// tailwind.config.ts → theme.extend.colors
colors: {
  bg:      'var(--bg)',
  surface: 'var(--surface)',
  border:  'var(--border)',
  text:    'var(--text)',
  muted:   'var(--text-muted)',
  accent:  { DEFAULT: 'var(--accent)', on: 'var(--accent-on)' },
  danger:  'var(--danger)',
}
```

---

## Contrast — verified

Computed, not guessed. All pass **WCAG AA** (4.5:1 body text, 3:1 UI).

| Pair | Ratio | |
|---|---|---|
| Body on bg (light) | 17.19:1 | ✅ |
| Muted on bg (light) | 5.65:1 | ✅ |
| Button label on accent (light) | 5.38:1 | ✅ |
| Accent on bg (light) | 5.06:1 | ✅ |
| Body on bg (dark) | 16.86:1 | ✅ |
| Muted on bg (dark) | 7.45:1 | ✅ |
| Button label on accent (dark) | 7.53:1 | ✅ |
| Accent on bg (dark) | 8.24:1 | ✅ |
| Danger on bg (light / dark) | 4.80 / 7.40:1 | ✅ |

**If you change a colour, recompute.** Don't eyeball it:

```bash
node -e 'const L=h=>{const c=[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255).map(v=>v<=.03928?v/12.92:((v+.055)/1.055)**2.4);return .2126*c[0]+.7152*c[1]+.0722*c[2]};const R=(a,b)=>{const[x,y]=[L(a),L(b)].sort((m,n)=>n-m);return((x+.05)/(y+.05)).toFixed(2)};console.log(R("#16776F","#F7F8FA"))'
```

---

## Type

| Role | Size / line-height | Weight | Use |
|---|---|---|---|
| Display | `32px / 1.15` | 400 | The one hero line per screen |
| H1 | `24px / 1.25` | 600 | Screen title |
| H2 | `19px / 1.3` | 600 | Section |
| Body | `16px / 1.5` | 400 | Everything. Never smaller for real content. |
| Label | `13px / 1.4` | 500, `0.02em` tracking, uppercase | Field labels, structural tags |
| Mono | `14px / 1.5` | 400 | Structured output (claim / assumption / counter) |

**Fonts — decided, don't relitigate:** `Geist Sans` (UI + body), `Geist Mono` (structured output), `Instrument Serif` (display line only). All free, all one line to add in Next.js via `next/font`.

**Banned:** Inter, Roboto, Arial, bare `system-ui` stacks, purple-on-white gradients, and the cream-background-plus-serif look. These are the generic AI-generated aesthetic and judges have seen them all afternoon.

---

## Components

Minimum set. Build these once, reuse them, don't fork them.

**Button** — `min-height: var(--tap)`, `padding: 0 var(--s-5)`, `border-radius: var(--r-full)`, `background: var(--accent)`, `color: var(--accent-on)`, `font-weight: 500`. `:active { transform: scale(0.97) }`. Hover only inside `@media (hover: hover)`.

**Textarea (the main input)** — `font-size: 16px` (rule 4), `min-height: 120px`, `border-radius: var(--r-md)`, `border: 1px solid var(--border)`, `background: var(--surface)`. Focus: `outline: 2px solid var(--accent); outline-offset: 2px` — never `outline: none` with nothing to replace it.

**Card** — `background: var(--surface)`, `border: 1px solid var(--border)`, `border-radius: var(--r-lg)`, `padding: var(--s-5)`. Border over shadow; shadows read muddy on small screens.

**Bottom action bar** — `position: fixed; bottom: 0; left: 0; right: 0`, class `pin-bottom`, `background: var(--surface)`, `border-top: 1px solid var(--border)`. This is where the primary action lives (rule 2).

**Mic / dictate button** — `var(--tap)` square minimum, `--r-full`, clear recording state (colour change plus a text label — **never colour alone**, that fails for colourblind users). Reduced-motion users get no pulse animation.

---

## PWA checklist

Installable needs three things. It does **not** need a service worker.

- [ ] `app/manifest.json` — `name`, `short_name`, `start_url: "/"`, `display: "standalone"`, `background_color: "#F7F8FA"`, `theme_color: "#16776F"`, and `icons` at 192px + 512px (plus one `"purpose": "maskable"`)
- [ ] Viewport meta **with `viewport-fit=cover`** — without it, `env(safe-area-inset-*)` returns 0 and rule 5 silently does nothing:
      `width=device-width, initial-scale=1, viewport-fit=cover`
- [ ] `apple-touch-icon` (180px) and `<meta name="theme-color">` — iOS ignores the manifest for both
- [ ] Served over HTTPS — Vercel gives this free

**Service worker / offline: out of scope.** It's the classic PWA time-sink and buys us nothing in a live demo on wifi. If someone wants the install prompt on stage, the manifest above is enough.

---

## Banned outright

- Raw hex or arbitrary values in components — use the tokens
- `100vh` (use `100dvh`), inputs under 16px, targets under 44px
- Hover as the only way to discover something
- Colour as the only signal for state
- A second competing accent colour
- Desktop-first layout with mobile bolted on after
- `outline: none` without a visible replacement focus ring
