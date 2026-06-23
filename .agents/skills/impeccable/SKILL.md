---
name: impeccable
description: Design guidance for AI coding agents. 23 commands and strict anti-patterns for professional frontend design. Use when the user asks to use impeccable, or wants to refine, critique, audit, or iterate on UI/UX design with professional commands like 'polish', 'audit', 'bolder', etc.
---

# Impeccable Design Skill

This skill enforces a high-end, deterministic design language to avoid "Generic AI Aesthetics" (e.g., overused fonts like Inter, generic gradients, nested cards, pure grays). 

## Commands
Whenever the user invokes one of these commands (e.g., `/impeccable <command>` or just asks for it), adopt the corresponding behavior:
- `init`: Create `PRODUCT.md` and `DESIGN.md` to establish the brand context, voice, anti-references, colors, typography.
- `craft`: Full shape-then-build flow with visual iteration.
- `document`: Generate root `DESIGN.md` from existing project code.
- `extract`: Pull reusable components and tokens into the design system.
- `shape`: Plan UX/UI before writing code.
- `critique`: UX design review focusing on hierarchy, clarity, emotional resonance.
- `audit`: Run technical quality checks (a11y, performance, responsive).
- `polish`: Final pass, design system alignment, and shipping readiness.
- `bolder`: Amplify boring designs with larger typography, striking colors, and bold layouts.
- `quieter`: Tone down overly bold designs to be more elegant and subtle.
- `distill`: Strip to essence, removing unnecessary borders, backgrounds, and elements.
- `harden`: Focus on error handling, i18n, text overflow, and edge cases.
- `onboard`: Design first-run flows, empty states, and activation paths.
- `animate`: Add purposeful motion (avoid bounce/elastic easing, prefer smooth bezier transitions).
- `colorize`: Introduce strategic color.
- `typeset`: Fix font choices, hierarchy, and sizing.
- `layout`: Fix layout, spacing, visual rhythm.
- `delight`: Add moments of joy (micro-interactions).
- `overdrive`: Add technically extraordinary effects.
- `clarify`: Improve unclear UX copy.
- `adapt`: Adapt for different devices (responsive design).
- `optimize`: Performance improvements.

## Strict Anti-Patterns (NEVER DO THESE)
- **Typography:** Do NOT use overused fonts (Arial, Inter, system defaults). Choose distinctive fonts like Outfit, Syne, Plus Jakarta Sans, Clash Display, etc.
- **Color:** Do NOT use gray text on colored backgrounds. Do NOT use pure black or pure gray (always tint them slightly with the primary brand color). Do NOT use generic purple-to-blue gradients.
- **Layout:** Do NOT wrap everything in cards. Do NOT nest cards inside cards. Reduce borders and explicit containers; use whitespace and spacing to group elements instead.
- **Animation:** Do NOT use bounce or elastic easing; it feels dated. Use subtle, purposeful motion.
- **Icons:** Avoid the "rounded-square icon tile above every heading" cliché.

## Implementation Details
Always strive for a design that feels premium, state-of-the-art, and specific to the project's brand context. If a `DESIGN.md` file exists in the workspace, adhere to it strictly.
