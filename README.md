# Task Manager

Full-stack task management app with per-user auth, weather-aware tasks, file attachments, and email notifications.

**Stack:** NestJS + PostgreSQL/Prisma (backend) · Next.js + Tailwind + GSAP/Lenis (frontend)

## Structure

```
├── client/ Next.js frontend
└── server/ NestJS REST API
```

Each folder has its own README with full setup instructions.

## Quick start

1. **Backend** — see [`server/README.md`](./server/README.md)
```bash
   cd server && npm install && npm run prisma:migrate && npm run start:dev
```
2. **Frontend** — see [`client/README.md`](./client/README.md)
```bash
   cd client && npm install && npm run dev
```

## Features

- JWT auth (register/login), tasks scoped per user
- CRUD with filter, search, sort, pagination
- Cloudinary file attachments, OpenWeatherMap live weather per task location
- Email on task creation and completion (Nodemailer)
- Protected routes, centralized error handling, DTO validation

## Environment variables

See `.env.example` in `server/` and `client/`. Required services: PostgreSQL (Neon/Supabase), Cloudinary, OpenWeatherMap, Gmail SMTP.

## Trade-offs / what I'd improve with more time

- Optimistic UI updates instead of refetch-on-mutation
- E2E test coverage (Cypress/Playwright) beyond current unit/integration tests
- Rate limiting tuned per-route instead of one global limit