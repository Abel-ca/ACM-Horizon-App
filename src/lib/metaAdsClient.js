/**
 * metaAdsClient.js
 *
 * Handles all communication with the Meta Ads Library (Ads Archive) API.
 * Token refresh is delegated to /api/meta-token (Vercel serverless function)
 * so that META_APP_ID and META_APP_SECRET never leave the server.
 */

/* ─── Error class ────────────────────────────────────────────────────────── */

export class MetaApiError extends Error {
  /**
   * @param {string} message
   * @param {number|null} code        Meta error code (e.g. 190 = token invalid)
   * @param {number|null} subcode     Meta error subcode (e.g. 463 = expired)
   */
  constructor(message, code = null, subcode = null) {
    super(message)
    this.name    = 'MetaApiError'
    this.code    = code
    this.subcode = subcode
  }
}

/**
 * Returns true when the error is a Meta token-expired / token-invalid error.
 * Meta uses error code 190 for all OAuth token problems.
 * Subcodes 463 (expired) and 467 (invalid/revoked) are the most common.
 */
export function isTokenExpiredError(error) {
  return error instanceof MetaApiError && error.code === 190
}

/* ─── Token refresh ──────────────────────────────────────────────────────── */

/**
 * refreshMetaToken — calls the Vercel serverless function at /api/meta-token
 * which exchanges the current token for a new long-lived token (~60 days)
 * using the server-side META_APP_ID / META_APP_SECRET credentials.
 *
 * @param  {string} currentToken  The token to exchange (short-lived or expiring long-lived)
 * @returns {Promise<string>}     The new long-lived access token
 * @throws {Error}                On network failure or when Meta rejects the exchange
 */
export async function refreshMetaToken(currentToken) {
  const url = `/api/meta-token?token=${encodeURIComponent(currentToken)}`

  let res
  try {
    res = await fetch(url)
  } catch (networkErr) {
    throw new Error(`Token refresh: no se pudo contactar /api/meta-token — ${networkErr.message}`)
  }

  const data = await res.json().catch(() => ({}))

  if (!res.ok || data.error) {
    throw new Error(data.error ?? `Token refresh falló con HTTP ${res.status}`)
  }

  if (!data.access_token) {
    throw new Error('Token refresh: respuesta inválida de /api/meta-token')
  }

  return data.access_token
}

/* ─── Ads Archive fetch ──────────────────────────────────────────────────── */

const META_BASE = 'https://graph.facebook.com/v19.0/ads_archive'

const FIELDS = [
  'id',
  'page_name',
  'ad_creation_time',
  'ad_delivery_start_time',
  'ad_creative_bodies',
  'ad_creative_link_titles',
  'ad_creative_link_descriptions',
  'ad_creative_link_captions',
  'publisher_platforms',
  'ad_snapshot_url',
  'spend',
  'impressions',
  'currency',
].join(',')

const COUNTRIES = JSON.stringify(['EC', 'CO', 'MX', 'PE'])

/**
 * fetchMetaAds — queries the Meta Ads Archive.
 * Throws MetaApiError (with .code populated) on API-level errors so callers
 * can detect token expiry and trigger a refresh + retry.
 *
 * @param {string} searchTerms   Product name
 * @param {string} accessToken   Meta user access token
 * @returns {Promise<object>}    Raw API response  { data: [...], paging: {...} }
 */
export async function fetchMetaAds(searchTerms, accessToken) {
  const params = new URLSearchParams({
    access_token:         accessToken,
    search_terms:         searchTerms,
    ad_type:              'ALL',
    ad_reached_countries: COUNTRIES,
    limit:                '10',
    fields:               FIELDS,
  })

  let res
  try {
    res = await fetch(`${META_BASE}?${params}`, { method: 'GET' })
  } catch (networkErr) {
    throw new MetaApiError(`Error de red: ${networkErr.message}`)
  }

  const body = await res.json().catch(() => ({}))

  /* Meta often returns HTTP 200 with an error object inside */
  if (body?.error) {
    throw new MetaApiError(
      body.error.message ?? 'Error desconocido de Meta',
      body.error.code    ?? null,
      body.error.error_subcode ?? null,
    )
  }

  if (!res.ok) {
    throw new MetaApiError(`Meta respondió con HTTP ${res.status}`)
  }

  return body
}

/* ─── Prompt formatter ───────────────────────────────────────────────────── */

/**
 * formatMetaAdsForPrompt — converts the Ads Archive JSON into a Markdown block
 * that gets injected into the Investigador's user message.
 */
export function formatMetaAdsForPrompt(data, searchTerms) {
  if (!data?.data?.length) {
    return (
      `## META ADS LIBRARY — Sin resultados\n` +
      `No se encontraron anuncios activos para "${searchTerms}" en Ecuador, Colombia, México y Perú.\n` +
      `Considera: el producto puede ser nuevo, carecer de competencia directa en Meta, ` +
      `o el término de búsqueda puede necesitar variación.\n`
    )
  }

  const ads   = data.data
  const lines = [
    `## META ADS LIBRARY — ${ads.length} anuncio(s) encontrado(s) para "${searchTerms}"`,
    `Países analizados: Ecuador (EC), Colombia (CO), México (MX), Perú (PE)`,
    '',
  ]

  ads.forEach((ad, i) => {
    lines.push(`### Anuncio ${i + 1} — ${ad.page_name ?? 'Página desconocida'}`)

    if (ad.ad_creation_time)
      lines.push(`- Fecha de creación: ${fmtDate(ad.ad_creation_time)}`)
    if (ad.ad_delivery_start_time)
      lines.push(`- Activo desde: ${fmtDate(ad.ad_delivery_start_time)}`)
    if (ad.publisher_platforms?.length)
      lines.push(`- Plataformas: ${ad.publisher_platforms.join(', ')}`)

    const body = ad.ad_creative_bodies?.[0]
    if (body) lines.push(`- Copy principal: "${body}"`)

    const title = ad.ad_creative_link_titles?.[0]
    if (title) lines.push(`- Título del enlace: "${title}"`)

    const desc = ad.ad_creative_link_descriptions?.[0]
    if (desc) lines.push(`- Descripción: "${desc}"`)

    const caption = ad.ad_creative_link_captions?.[0]
    if (caption) lines.push(`- Caption: "${caption}"`)

    if (ad.spend?.lower_bound != null) {
      const cur = ad.currency ?? 'USD'
      lines.push(`- Gasto estimado: ${ad.spend.lower_bound}–${ad.spend.upper_bound} ${cur}`)
    }
    if (ad.impressions?.lower_bound != null) {
      lines.push(`- Impresiones: ${ad.impressions.lower_bound}–${ad.impressions.upper_bound}`)
    }
    if (ad.ad_snapshot_url)
      lines.push(`- URL creativo: ${ad.ad_snapshot_url}`)

    lines.push('')
  })

  lines.push(
    '> Analiza copies, ángulos, formatos y tiempo activo de estos anuncios.',
    '> Mayor gasto + mayor tiempo activo = señal de que el ángulo convierte.',
    '',
  )

  return lines.join('\n')
}

/* ─── helpers ────────────────────────────────────────────────────────────── */

function fmtDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('es-EC', {
      day: 'numeric', month: 'long', year: 'numeric',
    })
  } catch {
    return iso
  }
}
