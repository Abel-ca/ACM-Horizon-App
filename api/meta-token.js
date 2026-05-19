/**
 * api/meta-token.js — Vercel Serverless Function (Node.js, ESM)
 *
 * Exchanges a short-lived or expiring Meta user access token for a
 * long-lived token (valid ~60 days) using the server-side credentials
 * stored in Vercel environment variables (never exposed to the browser).
 *
 * Usage:  GET /api/meta-token?token=<current_access_token>
 *
 * Required env vars (set in Vercel dashboard or .env.local for vercel dev):
 *   META_APP_ID      — your Meta App ID
 *   META_APP_SECRET  — your Meta App Secret
 *
 * Response 200: { access_token: string, token_type: string }
 * Response 4xx: { error: string }
 */

const GRAPH_BASE = 'https://graph.facebook.com/oauth/access_token'

export default async function handler(req, res) {
  /* ── CORS headers — same origin in production, useful for vercel dev ── */
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  /* ── Validate input ── */
  const { token } = req.query
  if (!token || typeof token !== 'string' || !token.trim()) {
    return res.status(400).json({ error: 'Query param "token" is required.' })
  }

  /* ── Validate env vars ── */
  const appId     = process.env.META_APP_ID
  const appSecret = process.env.META_APP_SECRET

  if (!appId || !appSecret) {
    console.error('[meta-token] Missing META_APP_ID or META_APP_SECRET env vars.')
    return res.status(500).json({
      error: 'Server misconfiguration: Meta app credentials not set.',
    })
  }

  /* ── Call Meta Graph API — token exchange ── */
  const url = new URL(GRAPH_BASE)
  url.searchParams.set('grant_type',        'fb_exchange_token')
  url.searchParams.set('client_id',         appId)
  url.searchParams.set('client_secret',     appSecret)
  url.searchParams.set('fb_exchange_token', token.trim())

  let metaRes
  try {
    metaRes = await fetch(url.toString())
  } catch (networkErr) {
    console.error('[meta-token] Network error reaching Meta:', networkErr)
    return res.status(502).json({ error: 'Could not reach Meta Graph API.' })
  }

  const body = await metaRes.json()

  /* ── Meta returned an error ── */
  if (!metaRes.ok || body.error) {
    const msg = body?.error?.message ?? `Meta API responded with HTTP ${metaRes.status}`
    console.warn('[meta-token] Meta error:', msg)
    return res.status(400).json({ error: msg })
  }

  /* ── Success ── */
  return res.status(200).json({
    access_token: body.access_token,
    token_type:   body.token_type ?? 'bearer',
    // expires_in is only present for short-lived tokens in implicit flow;
    // long-lived tokens (~60 days) don't include it.
    ...(body.expires_in != null ? { expires_in: body.expires_in } : {}),
  })
}
