# AI Agent Skills (Cursor + Codex)

This file defines shared operating skills for AI agents working in this repository, including a color design system inspired by Apple's Human Interface Guidelines (HIG).

## Skill: Design System Enforcement

### Goal
- Keep UI decisions consistent, accessible, and maintainable.
- Prefer semantic color tokens over one-off hex values.
- Produce output that feels native to Apple platform conventions: clear hierarchy, restrained accents, and high contrast.

### Rules
- Always use semantic tokens first (`--color-bg`, `--color-text-primary`, `--color-accent`, etc.).
- Do not hardcode color hex values directly in components unless introducing or updating a design token.
- Validate minimum contrast:
- Normal text: `4.5:1`
- Large text (18pt+ regular or 14pt+ bold): `3:1`
- Reserve accent colors for interaction states, highlights, and key data emphasis.
- Keep destructive actions red and success states green.

## Apple HIG-Inspired Color System

These tokens are derived from Apple-style system color behavior and naming conventions.

### Core Accent Tokens
- `--color-accent-blue: #007AFF`
- `--color-accent-green: #34C759`
- `--color-accent-indigo: #5856D6`
- `--color-accent-orange: #FF9500`
- `--color-accent-pink: #FF2D55`
- `--color-accent-purple: #AF52DE`
- `--color-accent-red: #FF3B30`
- `--color-accent-teal: #5AC8FA`
- `--color-accent-yellow: #FFCC00`

### Semantic Tokens (Light)
- `--color-bg: #FFFFFF`
- `--color-bg-secondary: #F2F2F7`
- `--color-bg-tertiary: #FFFFFF`
- `--color-surface: #FFFFFF`
- `--color-surface-elevated: #FFFFFF`
- `--color-text-primary: #111111`
- `--color-text-secondary: #3C3C43`
- `--color-text-tertiary: #6C6C70`
- `--color-separator: #C6C6C8`
- `--color-accent: var(--color-accent-blue)`
- `--color-success: var(--color-accent-green)`
- `--color-warning: var(--color-accent-orange)`
- `--color-danger: var(--color-accent-red)`
- `--color-info: var(--color-accent-teal)`

### Semantic Tokens (Dark)
- `--color-bg: #000000`
- `--color-bg-secondary: #1C1C1E`
- `--color-bg-tertiary: #2C2C2E`
- `--color-surface: #1C1C1E`
- `--color-surface-elevated: #2C2C2E`
- `--color-text-primary: #FFFFFF`
- `--color-text-secondary: #EBEBF5`
- `--color-text-tertiary: #AEAEB2`
- `--color-separator: #38383A`
- `--color-accent: #0A84FF`
- `--color-success: #30D158`
- `--color-warning: #FF9F0A`
- `--color-danger: #FF453A`
- `--color-info: #64D2FF`

## Skill: Implementation Pattern

When asked to design or restyle UI:

1. Define or update tokens at global theme level first.
2. Map component styles to semantic tokens.
3. Verify contrast and interactive states (default, hover, active, disabled, focus).
4. Keep charts/data visuals consistent:
- Income/success: `--color-success`
- Expense/destructive: `--color-danger`
- Budget/limit warning: `--color-warning`
- Neutral/supporting data: `--color-accent` or `--color-info`

## Skill: Agent Output Contract

When generating UI code or design guidance, agents should:
- Return token-first CSS (or Tailwind variable mapping) before component examples.
- Explain which semantic token was chosen and why.
- Avoid introducing new brand colors unless explicitly requested.
- Preserve these tokens unless the user asks for a redesign.

## Optional CSS Starter

```css
:root {
  --color-bg: #FFFFFF;
  --color-bg-secondary: #F2F2F7;
  --color-surface: #FFFFFF;
  --color-text-primary: #111111;
  --color-text-secondary: #3C3C43;
  --color-separator: #C6C6C8;
  --color-accent: #007AFF;
  --color-success: #34C759;
  --color-warning: #FF9500;
  --color-danger: #FF3B30;
}

[data-theme="dark"] {
  --color-bg: #000000;
  --color-bg-secondary: #1C1C1E;
  --color-surface: #1C1C1E;
  --color-text-primary: #FFFFFF;
  --color-text-secondary: #EBEBF5;
  --color-separator: #38383A;
  --color-accent: #0A84FF;
  --color-success: #30D158;
  --color-warning: #FF9F0A;
  --color-danger: #FF453A;
}
```

