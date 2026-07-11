# david-webdev.de v2

Persönliche Portfolio-Seite von David Gröger. Nuxt 4 (SSG), zweisprachig DE/EN, Domain bleibt david-webdev.de.

## Designkonzept „Source → Render“

Vollständiges Konzept: https://claude.ai/code/artifact/8273905c-fa21-41d8-b732-b6b70e4dcfc8

- Leitmotiv: Die Seite „kompiliert“ sich beim Scrollen selbst (Code/Wireframe → fertiges UI).
- Farbwelt dark-first: Nachtblau `#0B0F1A`, Akzent Signal-Bernstein `#FFAD3B` (alles Interaktive), Code-Mint `#6FE3C2` (Syntax/Erfolg). Tokens in `app/assets/css/tokens.css`, Light-Theme über `[data-theme="light"]`.
- Fonts (selbst gehostet): Clash Display (Headlines, uppercase, eng), Satoshi (Fließtext), JetBrains Mono (Code/Labels/Eyebrows).
- Sektionen: /hero → /about → /stack → /agents (KI-Crew) → /log (Git-Graph-Werdegang) → /work (Case Studies) → /refs (Testimonials als PR-Reviews) → /init (Terminal-Kontakt).
- Alle Animationen respektieren `prefers-reduced-motion`. Ziel: Lighthouse 100.

## Befehle

- `npm run dev` — Dev-Server (Port 3000)
- `npm run generate` — statischer Build

## Struktur

- `app/` — Nuxt-App (Nuxt-4-Layout: pages, layouts, components, assets)
- `i18n/locales/` — de.json / en.json (alle Texte über i18n, nie hart verdrahtet)
- `public/fonts/` — Variable-Fonts (woff2)
- `alte-seite/` — gesicherte Assets der alten Webseite (Fotos, Screenshots, Lebenslauf-PDF); Quelle für Inhalte & den „git diff: du“-Slider

## Konventionen

- Texte immer in beide Sprachdateien.
- Eyebrows/Labels im Stil `/* section */` mit Mono-Font.
- Ein Signature-Moment pro Sektion, Rest ruhig halten.
