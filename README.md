# Preyou Sharma — portfolio

A quiet, white / black / gray portfolio with a talking hero video. Next.js 15 (App Router),
React 19, TypeScript, Tailwind CSS 4, and Lenis for smooth scrolling (the only animation
dependency). No GSAP, no three.js, no loader, no external scripts at runtime.

## Run it

```bash
npm install        # also copies the three self-hosted fonts into src/fonts (postinstall)
npm run dev        # http://localhost:3000
npm run build && npm run start
npm run lint
```

Fonts (Inter Tight, Instrument Serif, JetBrains Mono) are installed from the `@fontsource*`
packages and copied to `src/fonts/*.woff2` by `scripts/copy-fonts.mjs`, then loaded with
`next/font/local`. If that script reports missing files, put these four files in `src/fonts`:
`InterTight-Variable.woff2`, `InstrumentSerif-Regular.woff2`, `InstrumentSerif-Italic.woff2`,
`JetBrainsMono-Variable.woff2`.

Optional layout check (screenshots at 1440×900 and 390×844 + horizontal overflow test):

```bash
npx playwright install chromium
npm run build && npm run start      # terminal 1
npm run check                       # terminal 2
```

## Sections

| # | Section | Component | What it is |
|---|---------|-----------|------------|
| – | Hero | `hero/Hero.tsx` | Looping talking video (multiply-blended into the page), ghost first name, role heading, CTAs, ▶/❚❚ sound button. The voice pauses when less than 35% of the hero is visible. |
| 01 | About | `sections/About.tsx` | Summary, quick facts and a hanging lanyard ID card (damped pendulum, flips on hover / tap / Enter). |
| 02 | Skills | `sections/Skills.tsx` | Periodic table of 39 skills, family filters, sticky inspector. |
| 03 | Work | `sections/Work.tsx` | Expanding accordion of 5 projects with grayscale "Illustrative UI" mock-ups. |
| 04 | Experience | `sections/Experience.tsx` | Education and experience as one path; the spine draws as you scroll. |
| 05 | Contact | `sections/Contact.tsx` + `Footer.tsx` | Hopping-letter heading, copy-email chip, phone, LinkedIn, spinning badge. |

Certifications and Achievements are left out on purpose: the résumé has none.

## Content

Everything lives in `src/lib/data.ts` (PROFILE, NAV, SKILLS, PROJECTS, EXPERIENCE, EDUCATION,
TIMELINE, FACTS). Components only read from it. Content comes from the résumé, plus what Preyou
added in chat: MBA 80%, B.Sc. 65%, and the Certificate of Completion she designed for candidates.

Things to check in `data.ts`:

- `HERO_TRANSCRIPT` is the screen-reader text for the video. It must match what the video says.
- `resumeSummary` is copied verbatim and still says "MBA (HR & Finance) candidate" although the
  MBA dates are 2023–2025. Update the résumé wording if that is out of date.
- `phoneHref` assumes +91 (India); the résumé has no country code.
- The quote in About is a paraphrase of the résumé's last summary sentence.
- LinkedIn URL is built from the visible résumé text.
- There is no GitHub link (none in the résumé), so no GitHub buttons render. Set `PROFILE.github`
  and a project's `github` field to show them.

## Rebuild the hero video

```bash
python3 scripts/build-hero-assets.py --src intro.mp4 --photo photo.jpg \
        --portrait-crop 740:925:100:100
```

Needs `ffmpeg`, `ffprobe`, Python 3, `numpy`, `Pillow`. The script finds the person (or take
`--crop W:H:X:Y`), crops head to toe, scales to 768 px wide, turns the off-white backdrop pure
white, and makes the loop seamless by cross-fading the last 0.5 s into the first 0.5 s (picture
with `xfade`, audio sample-accurately in numpy; the clip is never retimed, so lips stay in sync).
It writes `public/hero/hero.mp4` (H.264 + AAC), `hero.webm` (VP9 + Opus), `portrait-bust.webp`,
`og.jpg` and `favicon.ico`.

## Logos

See `public/logos/README.md`. The brand marks are drawn monograms, not official artwork.

## Accessibility and motion

Semantic sections and heading order, visible focus styles, every visual has a text equivalent,
`prefers-reduced-motion` turns off smooth scroll and decorative motion (the video then waits for
the play button instead of autoplaying).
