/**
 * metaAdsClient.js
 * Fetches active ads from the Meta Ads Library (ads_archive) API.
 * The call goes browser → graph.facebook.com directly (Meta supports CORS with a valid token).
 */

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
 * fetchMetaAds — calls the Ads Archive endpoint.
 * @param {string} searchTerms  Product name to search
 * @param {string} accessToken  Meta user access token from localStorage
 * @returns {Promise<object>}   Raw API response { data: [...], paging: {...} }
 */
export async function fetchMetaAds(searchTerms, accessToken) {
  const params = new URLSearchParams({
    access_token:        accessToken,
    search_terms:        searchTerms,
    ad_type:             'ALL',
    ad_reached_countries: COUNTRIES,
    limit:               '10',
    fields:              FIELDS,
  })

  const res = await fetch(`${META_BASE}?${params}`, { method: 'GET' })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    const msg  = body?.error?.message ?? `HTTP ${res.status}`
    throw new Error(`Meta Ads Library: ${msg}`)
  }

  return res.json()
}

/**
 * formatMetaAdsForPrompt — converts the API response into a Markdown block
 * that gets injected into the Investigador's user message.
 * Returns null if no ads found.
 */
export function formatMetaAdsForPrompt(data, searchTerms) {
  if (!data?.data?.length) {
    return `## META ADS LIBRARY — Sin resultados\nNo se encontraron anuncios activos para "${searchTerms}" en Ecuador, Colombia, México y Perú. Considera que el producto puede ser nuevo, no tener competencia directa en Meta, o que el término de búsqueda necesite variación.\n`
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
      lines.push(`- Impresiones estimadas: ${ad.impressions.lower_bound}–${ad.impressions.upper_bound}`)
    }

    if (ad.ad_snapshot_url)
      lines.push(`- URL creativo: ${ad.ad_snapshot_url}`)

    lines.push('')
  })

  lines.push(
    '> Analiza los copies, ángulos, formatos y el tiempo activo de estos anuncios.',
    '> Los anuncios con mayor gasto y tiempo activo son señales de que el ángulo funciona.',
    '',
  )

  return lines.join('\n')
}

/* ── helpers ── */
function fmtDate(iso) {
  try { return new Date(iso).toLocaleDateString('es-EC', { day: 'numeric', month: 'long', year: 'numeric' }) }
  catch { return iso }
}
