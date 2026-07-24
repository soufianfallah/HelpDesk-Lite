# HelpDesk Lite

**Live demo:** [https://helpdesk-lite-beryl.vercel.app](https://helpdesk-lite-beryl.vercel.app)

A focused, portfolio-quality support ticket application built with Next.js. Clients can securely submit and track support requests, while administrators manage the complete ticket queue and respond to clients.

## User roles and workflow

HelpDesk Lite provides two server-enforced roles:

### Client

- Registers and signs in through Better Auth.
- Creates support tickets with a title, description, category, and priority.
- Views, searches, and filters only their own tickets.
- Edits, closes, reopens, or deletes their own tickets.
- Adds comments and reads support responses in chronological order.
- Cannot access the admin dashboard or another client's ticket, even with its URL.

### Administrator

- Sees an **ADMIN** badge in the sidebar.
- Gets an additional **Admin queue** navigation link.
- Views dashboard totals across all clients.
- Searches and filters the complete ticket queue.
- Sees the client name and email associated with each ticket.
- Replies to discussions with a visible **SUPPORT** label.
- Edits, closes, reopens, or deletes any client ticket.

The application flow is:

```text
Client creates a ticket
        ↓
Administrator reviews it in the admin queue
        ↓
Administrator responds and updates the status
        ↓
Client and administrator continue the discussion
        ↓
The ticket is closed when resolved
```

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

Pages in `app/(app)` call `requireSession()` before reading data. Client queries and mutations include the authenticated `userId`, while admin pages require the `ADMIN` role on the server. Validation runs in the browser for immediate feedback and again inside server actions, where it is part of the security boundary.

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
   ADMIN_EMAIL="admin@example.com"
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

The account matching `ADMIN_EMAIL` is promoted to administrator after registration. Every other registration defaults to `CLIENT`.

## Managing administrators

The project deliberately does not expose role management through the website. Administrator access is assigned directly in PostgreSQL so clients cannot elevate their own privileges.

### Add another administrator

First, have the person register normally in HelpDesk Lite. Then open the Neon SQL Editor (or another PostgreSQL client connected to the application database) and run:

```sql
UPDATE "user"
SET "role" = 'ADMIN'
WHERE lower("email") = lower('new-admin@example.com');
```

Replace `new-admin@example.com` with the registered account's email. Confirm the result:

```sql
SELECT "name", "email", "role"
FROM "user"
WHERE lower("email") = lower('new-admin@example.com');
```

The administrator must sign out and sign back in after the update so Better Auth issues a fresh session containing the new role.

### Remove administrator access

```sql
UPDATE "user"
SET "role" = 'CLIENT'
WHERE lower("email") = lower('admin@example.com');
```

After being changed back to `CLIENT`, that user can access only their own tickets. They should sign out and sign back in to refresh the session.

`ADMIN_EMAIL` automatically promotes one designated email when that account is created. Additional administrators can be assigned with the SQL command above.

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
3. Add `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, and `ADMIN_EMAIL` in Vercel project settings. Set `BETTER_AUTH_URL` to the production URL, such as `https://your-project.vercel.app`.
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

Authentication, client ticket CRUD, an administrator queue, role-aware authorization, close/reopen controls, title search, status/category filters, dashboard totals, recent tickets, chronological client/support discussions, responsive navigation, dark mode, dialogs, toasts, and loading/error states are included. The project deliberately excludes user-management screens, email, notifications, uploads, charts, analytics, AI, WebSockets, Docker, and external APIs.
