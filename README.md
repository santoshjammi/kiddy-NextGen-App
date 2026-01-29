# Kiddy Next.js App — Production with NextAuth + Prisma

This project is a Next.js app using the App Router and NextAuth for Google authentication.

Quick setup (development):

1. Copy env file and fill values:

```bash
cp .env.local.example .env.local
# fill DATABASE_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NEXTAUTH_SECRET
```

2. Install dependencies:

```bash
npm install
```

3. Initialize Prisma and run migrations (Postgres example):

```bash
npx prisma migrate dev --name init
npx prisma generate
```

4. Run the dev server:

```bash
npm run dev
```

Production notes:

- Deploy to a platform that supports serverless functions or Node processes (Vercel, Render, Fly.io, Railway).
- Set `DATABASE_URL` to a managed Postgres, `NEXTAUTH_SECRET` to a secure random string, and Google OAuth credentials.
- Run Prisma migrations during CI/CD or on first deploy.

Recommendations for scale & stability:

- Use a managed Postgres (Neon, Supabase, RDS) with connection pooling.
- Use Vercel or Render for straightforward Next.js deployments with serverless functions.
- Add monitoring and logging (Sentry, Logflare) and set up rate limiting if needed.

If you want, I can:
- Add a CI workflow that runs `prisma migrate deploy` and `npx prisma generate` on deploy.
- Add role-based access control examples and server-side guards.
- Wire up an email verification or custom user fields.

