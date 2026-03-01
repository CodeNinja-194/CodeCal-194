// Deprecated endpoint retained for backwards compatibility.
// New cron job lives at /api/cron/updateContests

export default async function handler(req, res) {
  res.status(410).json({
    error: 'This endpoint has been retired. Use /api/cron/updateContests instead.'
  });
}
