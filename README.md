# NotingTTRPGWeb

## Backend (NestJS + PostgreSQL)

- Location: `server-side`
- Copy `.env.example` to `.env` and adjust secrets / DB settings as needed.
- Install dependencies: `cd server-side && npm install`
- Development server: `npm run start:dev` (watches files with hot-reload).
- Production build: `npm run build && npm run start:prod`
- Docker: from the repo root run `docker compose up --build` to start PostgreSQL and the API together (`api` listens on port `4000` by default).
- Auth: passwords are hashed with bcrypt, JWT access + refresh tokens are issued, and refresh tokens are stored (hashed) in the `auth_tokens` table.

## Frontend (Next.js)

- Location: `app-ui`
- Copy `.env.local.example` to `.env.local` and set `NEXT_PUBLIC_API_BASE_URL` (default `http://localhost:4000/api`).
- Install dependencies: `cd app-ui && npm install`
- Start dev server: `npm run dev` (will proxy API calls to the backend URL from the env file).

With both servers running you can register/login from the UI, create worlds, and manage world items backed by PostgreSQL.
