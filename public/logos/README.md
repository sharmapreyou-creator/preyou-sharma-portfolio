# Logos

The tool and platform marks in the Skills section (LinkedIn, Indeed, Naukri, Internshala,
Excel, Word, PowerPoint, Instagram, Google Drive, Claude, ChatGPT, HeyGen, ElevenLabs) are
**simple monogram marks drawn in code** (`src/components/ui/TechLogo.tsx`). They use each
brand's approximate colour but are **not the official artwork**.

To use the official logos:

1. Download the SVGs (for example the devicon "original" set, or simple-icons).
2. Copy them into this folder **together with the licence file** that ships with the set
   (devicon: MIT, simple-icons: CC0). Brand logos remain trademarks of their owners.
3. In `TechLogo.tsx`, render `<img src="/logos/linkedin.svg" ... />` for that id instead of
   the monogram.

The concept skills (recruitment, payroll, scheduling...) use thin line icons drawn in code.
