# Task Manager - Web Client

Next.js (App Router) frontend for the Task Manager assignment. GSAP-animated
landing page, Lenis smooth scrolling, Zustand for auth state, React Query
for server state.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS - custom design tokens (mesh-gradient background, glass-card
  utility, glow shadows) in `tailwind.config.ts` / `globals.css`
- GSAP + `@gsap/react` (ScrollTrigger for scroll-reveal and parallax, quickTo
  for cursor-tilt cards, a magnetic-hover primary button)
- Lenis for smooth scrolling, synced into GSAP's ticker
- Zustand for auth state, TanStack React Query for task data
- Axios, react-hot-toast

## Setup

```bash
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_API_URL to your backend
npm run dev                  # http://localhost:3000
```

## Test

```bash
npm test
```

## How auth protection works

Login/register sets the JWT into a cookie (`tm_token`, via `js-cookie`), not just `localStorage` — that's what `middleware.ts` reads server-side to guard `/dashboard` and `/tasks/*`. The same cookie is attached as the `Authorization` header by the Axios interceptor.

## Structure

```
src/
├── app/                 # routes (App Router)
│   ├── (auth)/           # login, register - public
│   ├── (dashboard)/       # dashboard, task detail - protected, shared Navbar layout
│   └── page.tsx           # animated landing page
├── components/
│   ├── ui/                # Button, Input, Select, Modal, Badge, Skeleton - no app logic
│   ├── tasks/              # TaskCard, TaskGrid, filters, pagination, form modal
│   ├── landing/             # Hero, features, CTA (GSAP/ScrollTrigger)
│   └── shared/               # EmptyState, ErrorState, ConfirmDialog
├── hooks/                # useTasks (query), useTaskMutations (create/update/delete)
├── store/                # authStore (Zustand)
└── lib/                  # api client, gsap setup, cn/date utils
```

## Deployment (Vercel)

1. Import the repo, set the root directory to `client/`.
2. Add `NEXT_PUBLIC_API_URL` pointing at the deployed backend.
3. Deploy - Vercel auto-detects Next.js, no extra build config needed.

## Trade-offs / what I'd improve with more time

- Optimistic updates for task create/update/delete instead of waiting on
  invalidation + refetch.
- A dedicated toast/undo affordance for delete instead of a blocking confirm
  dialog.
- Cypress/Playwright e2e coverage for the full login → create task → see
  weather flow (current tests are unit/component level).
