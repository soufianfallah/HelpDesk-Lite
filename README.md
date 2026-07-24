# HelpDesk Lite
https://helpdesk-lite-beryl.vercel.app/login
A focused, portfolio-quality support ticket application built with Next.js. Users can securely register, sign in, manage their own tickets, search and filter requests, and keep a chronological discussion on each ticket.

## Stack and tools

- **Next.js 15 + React 19** — App Router, React Server Components, server actions, loading states, and Vercel-ready deployment.
- **TypeScript** — strict typing across UI, actions, validation, and database access.
- **PostgreSQL + Prisma ORM** — relational persistence, migrations, ownership indexes, and type-safe queries.
- **Better Auth** — email/password registration, login, logout, secure password hashing, database sessions, and cookie handling.
- **Tailwind CSS + shadcn/ui** — accessible Radix primitives and reusable UI components with responsive light/dark themes.
- **React Hook Form + Zod** — performant client forms with a shared validation contract and friendly inline messages.
- **Lucide React** — consistent interface icons.
- **Sonner** — concise success and error toast feedback.

## How the code is organized

```text
app/
├── (auth)/                 # Public login and registration screens
├── (app)/                  # Protected dashboard and ticket pages
├── actions/                # Server actions for ticket/comment mutations
└── api/auth/[...all]/      # Better Auth API handler
components/
├── ui/                     # Reusable shadcn-style primitives
└── *.tsx                   # Feature and layout components
lib/
├── auth.ts                 # Server-side Better Auth configuration
├── auth-client.ts          # Browser auth client
├── db.ts                   # Development-safe Prisma singleton
├── session.ts              # Session lookup and route guard
└── validations.ts          # Shared Zod schemas and input types
prisma/
├── migrations/             # Versioned PostgreSQL schema
├── schema.prisma           # Models, enums, relations, and indexes
└── seed.ts                 # Initial ticket categories
types/                      # Shared display labels and types
```

Pages in `app/(app)` call `requireSession()` before reading data. Every query and mutation also includes the authenticated `userId`; knowing another ticket ID therefore does not grant access. Validation runs in the browser for immediate feedback and again inside server actions, where it is part of the security boundary.

Better Auth intentionally stores the password hash in its `Account.password` field, not on `User`. This avoids keeping a second password copy while fulfilling credential authentication securely. The additional `Session`, `Account`, and `Verification` models are required by Better Auth.

## Local setup

Requirements: Node.js 20.9 or newer and a PostgreSQL database.

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and update the values:

   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/helpdesk_lite?schema=public"
   BETTER_AUTH_SECRET="a-random-secret-at-least-32-characters-long"
   BETTER_AUTH_URL="http://localhost:3000"
   ```

   Generate a secret with `openssl rand -base64 32`.

3. Apply the migration and seed the default categories:

   ```bash
   npx prisma migrate deploy
   npm run db:seed
   ```

4. Start development:

   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000), register an account, and create a ticket.

## Database workflow

After changing `prisma/schema.prisma` locally, create a migration with:

```bash
npm run db:migrate
```

For production or CI, apply committed migrations with:

```bash
npx prisma migrate deploy
```

The seed is idempotent: existing category names are skipped.

## Deploying to Vercel

1. Push the repository to GitHub, GitLab, or Bitbucket and import it in Vercel.
2. Provision a PostgreSQL database (for example, Neon, Supabase, or Vercel Postgres).
3. Add `DATABASE_URL`, `BETTER_AUTH_SECRET`, and `BETTER_AUTH_URL` in Vercel project settings. Set `BETTER_AUTH_URL` to the production URL, such as `https://your-project.vercel.app`.
4. Apply migrations against the production database once:

   ```bash
   npx prisma migrate deploy
   npm run db:seed
   ```

5. Deploy. The `build` script generates Prisma Client before `next build`.

For a custom domain, update `BETTER_AUTH_URL` to the final HTTPS origin and redeploy.

## Available commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local Turbopack development server |
| `npm run build` | Generate Prisma Client and create a production build |
| `npm start` | Run the production server |
| `npm run db:migrate` | Create/apply a development migration |
| `npm run db:seed` | Insert default categories |
| `npm run db:studio` | Open Prisma Studio |

## Included scope

Authentication, per-user ticket CRUD, close/reopen controls, title search, status/category filters, dashboard totals, recent tickets, chronological comments, responsive navigation, dark mode, dialogs, toasts, and loading/error states are included. The project deliberately excludes admin features, roles, email, notifications, uploads, charts, analytics, AI, WebSockets, Docker, and external APIs.
