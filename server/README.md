# Task Manager API

NestJS backend — JWT auth, per-user task CRUD with filtering/pagination, and three integrations: email (Nodemailer), file storage (Cloudinary), weather (OpenWeatherMap).

## Stack

NestJS · PostgreSQL + Prisma · Passport JWT · bcryptjs · class-validator

## Setup

```bash
npm install
cp .env.example .env      # fill in DATABASE_URL, JWT_SECRET, SMTP_*, CLOUDINARY_*, OPENWEATHER_API_KEY
npm run prisma:migrate
npm run start:dev         # http://localhost:5000/api
```

## Test

```bash
npm test          # unit tests
npm run test:e2e  # e2e (needs a real DB)
```

## API

| Method           | Route                | Auth                                                                                 |
| ---------------- | -------------------- | ------------------------------------------------------------------------------------ |
| POST             | `/api/auth/register` | –                                                                                    |
| POST             | `/api/auth/login`    | –                                                                                    |
| GET              | `/api/tasks`         | JWT — `page, limit, status, priority, search, startDate, endDate, sortBy, sortOrder` |
| POST             | `/api/tasks`         | JWT — multipart, optional `attachment`                                               |
| GET/PATCH/DELETE | `/api/tasks/:id`     | JWT                                                                                  |

Responses: `{ success, data }` or `{ success: false, statusCode, message }`.

## Deploy (Render/Railway/Fly.io)

1. Root directory: `server/`
2. Build: `npm install && npm run build` · Start: `npm run start:prod`
3. Set all `.env` vars in the host dashboard
4. Run `npx prisma migrate deploy` once against the production DB
