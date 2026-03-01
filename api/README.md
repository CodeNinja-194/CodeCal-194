# API Handlers - JavaScript Versions

The API handlers have been converted from TypeScript to JavaScript for better Vercel compatibility.

## Files

- **api/contests.js** - Frontend fetches contest data from Supabase
- **api/cron/updateContests.js** - Daily cron job that syncs all contest sources

## Legacy TypeScript Files (deprecated)

The following TypeScript files are kept for reference but **not used in production**:

- `api/contests.ts` (deprecated)
- `api/cron/updateContests.ts` (deprecated)

These can be safely deleted after verifying the JavaScript versions work on Vercel.

## How Vercel Routes Work

1. When deployed, Vercel detects `.js` files in the `/api` folder
2. `/api/contests.js` becomes the endpoint: `GET /api/contests`
3. `/api/cron/updateContests.js` becomes the cron endpoint called at: `0 6 * * *` (6 AM UTC)

## Testing Locally

```bash
# Test fetchers and Supabase connection
npm run test:fetchers

# Import sample data
npm run import:contests
```

## Environment Variables Required on Vercel

- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` or `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase API key

Set these in Vercel Dashboard → Project Settings → Environment Variables
