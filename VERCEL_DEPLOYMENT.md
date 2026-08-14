# Deploying `fc-escuela-final` to Vercel (Production)

This guide walks you through migrating from Docker to **Vercel** for hosting `fc-escuela-final` in production.

---

## Prerequisites

1. A **Vercel Account**: Sign up at [vercel.com](https://vercel.com).
2. A **Cloud PostgreSQL Database**: Since Vercel uses serverless edge infrastructure, you need a hosted PostgreSQL database.
   - Recommended free/managed options:
     - **Neon PostgreSQL**: [neon.tech](https://neon.tech) (Recommended - instant setup, fully serverless compatible)
     - **Supabase**: [supabase.com](https://supabase.com)
     - **Vercel Postgres**: Available directly inside the Vercel Dashboard Marketplace.

---

## Step-by-Step Deployment Instructions

### Step 1: Set Up Supabase Cloud PostgreSQL Database

1. Sign up at [supabase.com](https://supabase.com) and create a new project.
2. In your Supabase Dashboard, go to **Project Settings** -> **Database**.
3. Under **Connection Strings**, copy the connection strings:
   - **Transaction Pooler Connection** (Port `6543`, with `?pgbouncer=true`): Set as `DATABASE_URL` in Vercel.
   - **Direct Connection** (Port `5432`): Set as `DIRECT_URL` in Vercel.
   ```env
   # Transaction Pooler (for Vercel runtime serverless functions)
   DATABASE_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"

   # Direct Connection (for Prisma migrations)
   DIRECT_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
   ```

### Step 2: Push Database Schema to Production

Before or during your first deployment, run your database migrations against the cloud database:

```bash
# Run migrations on remote database
npx prisma migrate deploy

# Seed initial data (optional)
npm run seed
```

---

### Step 3: Deploy to Vercel

#### Option A: Via Vercel Dashboard (Recommended)

1. Push your repository to **GitHub** / **GitLab** / **Bitbucket**.
2. Go to [vercel.com/new](https://vercel.com/new) and import your repository.
3. In the **Environment Variables** section, paste all values from `.env`:
   - `DATABASE_URL` (Your cloud PostgreSQL URL)
   - `NEXTAUTH_SECRET` (A strong random secret string)
   - `NEXTAUTH_URL` (`https://<your-project-name>.vercel.app`)
   - `NEXT_PUBLIC_BASE_URL` (`https://<your-project-name>.vercel.app`)
   - OAuth keys (`GOOGLE_CLIENT_ID`, `FACEBOOK_CLIENT_ID`, etc.)
   - Stripe & SMTP keys
4. Click **Deploy**. Vercel will run `npm install`, trigger `"postinstall": "prisma generate"`, and build the Next.js app.

#### Option B: Via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

---

### Step 4: Configure OAuth Redirect URIs

After deployment, update your OAuth callback URLs in provider developer dashboards:

- **Google Cloud Console**:
  Add Authorized Redirect URI: `https://<your-app>.vercel.app/api/auth/callback/google`
- **Facebook Developers**:
  Add Valid OAuth Redirect URI: `https://<your-app>.vercel.app/api/auth/callback/facebook`

---

## Architecture Comparison: Docker vs Vercel

| Feature | Previous (Docker) | New (Vercel) |
|---|---|---|
| **Hosting** | VPS / Docker Container | Serverless Edge Functions |
| **Database** | Docker PostgreSQL container (`db`) | Cloud PostgreSQL (Neon / Supabase) |
| **Cache (Redis)** | Local Redis Container | Optional Upstash Redis / Vercel KV (Gracefully bypassed if unconfigured) |
| **SSL & CDN** | Manual Reverse Proxy / Nginx | Automatic Global CDN & Free SSL |
| **Build & Deploy** | `docker compose up -d --build` | Git push / `vercel --prod` |

---

## Troubleshooting

- **Prisma Client not generated during build**:
  Vercel automatically triggers `"postinstall": "prisma generate"` added to `package.json`. If builds fail with missing `@prisma/client`, ensure Prisma is listed in `dependencies`.
- **Database Connection Timeouts**:
  Ensure your database URL includes connection pooling settings if using Neon/Supabase with high serverless traffic (e.g. `?pgbouncer=true` or connection pooler mode).
