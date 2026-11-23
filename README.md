# FORMA creative demo

A fictional creative event used to demonstrate expressive website design and browser interactions. Author: TwK. FORMA does not represent a real event or customer. All sessions, times, copy and registration are illustrative. No venue, event date, ticket price, real speakers, payments or reservations are provided.

## Experience

- A black, chrome and orange visual identity extending from the hero through the middle sections.
- Original generated sculpture images, a large manifesto section, custom poster, dark agenda cards, CSS artwork and an interactive native canvas.
- Program filtering, expandable descriptions, locally saved session selection and reset.
- A local-only registration demonstration with validation and an explicitly invalid example ticket. Personal fields are cleared when the dialog closes and are never transmitted or persisted.
- Responsive navigation, scroll reveals and reduced-motion support. No third-party runtime libraries, remote fonts, trackers or form backend.

## Assets and prompts

Golos Text and Unbounded fonts are distributed under their included SIL Open Font License texts.

Both artwork images were created with the built-in image generation tool, not a CLI, then encoded as JPEG for web delivery without creative editing:

- `assets/hero.jpg`: main sculpture. Exact prompt: [assets/hero-prompt.txt](assets/hero-prompt.txt).
- `assets/middle.jpg`: new sculpture for the middle section. Exact prompt: [assets/middle-prompt.txt](assets/middle-prompt.txt).

The poster, favicon, layout, kinetic CSS artwork and native canvas are implemented in code.

## Preview and publication

Run a static HTTP server in this directory. No build or package installation is needed. Public hosting uses GitHub Pages. Never commit private research, credentials or customer data.
