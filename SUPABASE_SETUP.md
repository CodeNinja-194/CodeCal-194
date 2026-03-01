# 🚀 CodeCal Supabase Setup Guide

## Step-by-Step Instructions

### 1️⃣ Create Supabase Account & Project

**Visit:** https://supabase.com

1. Click **"Start your project"**
2. Sign up with GitHub, Google, or email
3. Create a **new project**:
   - **Name**: `CodeCal`
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you (e.g., `US East` or `EU-West`)
4. Wait for the project to initialize (~2 minutes)

---

### 2️⃣ Create the Contests Table

Once your project is ready:

1. Go to **SQL Editor** (left sidebar)
2. Click **New Query**
3. Copy and paste this SQL:

```sql
create table contests (
  id text primary key,
  platform text not null,
  name text not null,
  "startTime" timestamptz not null,
  "endTime" timestamptz not null,
  "durationSeconds" integer not null,
  url text not null,
  created_at timestamptz default now()
);

-- Add an index for faster queries
create index idx_contests_startTime on contests("startTime");
```

4. Click **Run** (or press Ctrl+Enter)
5. You should see: ✅ "Success. No rows returned"

---

### 3️⃣ Get Your API Keys

1. Go to **Settings** (bottom of left sidebar)
2. Click **API**
3. Copy the following:

| Item             | Where to find                                                           |
| ---------------- | ----------------------------------------------------------------------- |
| **Project URL**  | Under "API" section, labeled `URL`                                      |
| **anon public**  | Under "API KEYS", find the one labeled `anon public`                    |
| **service_role** | Under "API KEYS", find the one labeled `service_role` (click to reveal) |

**Save these in a safe place!**

---

### 4️⃣ Configure Environment Variables in Vercel

1. Open https://vercel.com/dashboard
2. Find your **CodeCal** project
3. Click on the project to open it
4. Click **Settings** (top navigation)
5. Click **Environment Variables** (left sidebar)
6. Add these two variables:

| Name                | Value                                    |
| ------------------- | ---------------------------------------- |
| `SUPABASE_URL`      | Paste your Project URL from step 3       |
| `SUPABASE_ANON_KEY` | Paste your `anon public` key from step 3 |

**Optional (for better security):**
Add `SUPABASE_SERVICE_ROLE_KEY` with your service_role key value.

7. Click **Save**
8. Click **Deployments** (top)
9. Find the latest deployment and click **Redeploy** to apply the env vars

---

### 5️⃣ Test Local Connection (Optional)

To verify everything is working before deployment:

1. Copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and paste your Supabase credentials:

   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   ```

3. Run the diagnostic test:

   ```bash
   npm run test:fetchers
   ```

4. You should see:

   ```
   ═══════════════════════════════════════
    CodeCal Fetcher Diagnostic
   ═══════════════════════════════════════

   🟦 Testing Codeforces...
   ✅ Codeforces: Found X upcoming contests

   ✅ Supabase connected successfully!
   ```

---

### 6️⃣ Verify in Supabase Dashboard

1. Go to Supabase Dashboard: https://supabase.com/dashboard
2. Select your **CodeCal** project
3. Go to **Table Editor** (left sidebar)
4. Click **contests**

**You should see:**

- If recently deployed: Empty table (will fill after cron runs)
- After cron runs (6 AM UTC daily): Table with contest data

Each row will have:

- `id` - unique contest identifier
- `platform` - Codeforces, LeetCode, AtCoder, or CodeChef
- `name` - contest name
- `startTime` - ISO format timestamp
- `endTime` - ISO format timestamp
- `durationSeconds` - contest duration in seconds
- `url` - link to contest
- `created_at` - when added to database

---

## 🔧 Troubleshooting

| Problem                             | Solution                                                                                                    |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **"Missing SUPABASE_URL" error**    | Check that env vars are set in Vercel Settings → Environment Variables                                      |
| **Contests table is empty**         | The cron runs at 6 AM UTC daily. To test manually, run `npm run test:fetchers` locally                      |
| **Only Codeforces data appears**    | Check the test output: `npm run test:fetchers`. Other fetchers might be erroring. See the logs for details. |
| **401 Unauthorized error**          | Verify your `SUPABASE_ANON_KEY` is correct and hasn't expired. Re-copy it from Supabase dashboard.          |
| **Table doesn't exist**             | Re-run the SQL create table command in Supabase SQL Editor                                                  |
| **Can't find Supabase Project URL** | In Supabase dashboard, go Settings → API. Look for the `URL` field.                                         |

---

## 📊 How Data Flows

```
┌─────────────────────────────────────────┐
│  Daily Cron (0 6 * * *)                 │
│  /api/cron/updateContests.ts            │
└──────────────────┬──────────────────────┘
                   │
        ┌──────────┼──────────┐
        ▼          ▼          ▼
    Codeforces  LeetCode  AtCoder  CodeChef
    (API)       (Generated) (HTML)  (Generated)
        │          │          │
        └──────────┼──────────┘
                   │
        ┌──────────▼──────────┐
        │  Deduplicate &      │
        │  Sort by Date       │
        └──────────┬──────────┘
                   │
        ┌──────────▼──────────┐
        │  Supabase Database  │
        │  (PostgreSQL)       │
        └──────────┬──────────┘
                   │
        ┌──────────▼──────────┐
        │  /api/contests      │
        │  (Frontend reads)    │
        └─────────────────────┘
```

---

## ✅ Quick Checklist

- [ ] Created Supabase account
- [ ] Created CodeCal project
- [ ] Created `contests` table in SQL Editor
- [ ] Copied Project URL and API keys
- [ ] Added `SUPABASE_URL` env var to Vercel
- [ ] Added `SUPABASE_ANON_KEY` env var to Vercel
- [ ] Redeployed project (or waited for next auto-deployment)
- [ ] (Optional) Tested locally with `npm run test:fetchers`
- [ ] Checked Supabase table for data (wait until 6 AM UTC)

---

## 🎯 Next Steps

Once everything is set up:

1. The frontend automatically fetches from `/api/contests` instead of third-party APIs
2. Data stays fresh with the daily cron job at 6 AM UTC
3. No external API dependency - if a platform goes down, you still have cached data
4. Future features (per-contest alerts, email notifications) can use the database

---

**Questions?** Check the diagnostic output: `npm run test:fetchers`
