import { useState, useCallback, useRef } from 'react'
import { callAgent }                    from '../lib/anthropicClient'
import {
  fetchMetaAds,
  formatMetaAdsForPrompt,
  refreshMetaToken,
  isTokenExpiredError,
} from '../lib/metaAdsClient'
import { AGENTS } from '../agents/agentConfig'

const INVESTIGADOR_INDEX = 1   // AGENTS[1] is the Investigador

const freshStates = () =>
  Object.fromEntries(
    AGENTS.map((a) => [a.id, { status: 'pending', content: '', error: null }])
  )

function buildContext(states) {
  return AGENTS.filter((a) => states[a.id]?.status === 'approved')
    .map((a) => `=== ${a.name.toUpperCase()} ===\n\n${states[a.id].content}`)
    .join('\n\n---\n\n')
}

export function useWorkflow() {
  const [product, setProduct]                     = useState('')
  const [workflowStarted, setWorkflowStarted]     = useState(false)
  const [currentAgentIndex, setCurrentAgentIndex] = useState(-1)
  const [agentStates, setAgentStates]             = useState(freshStates)
  const [campaignComplete, setCampaignComplete]   = useState(false)
  const [metaFetchStatus, setMetaFetchStatus]     = useState(null)
  // null | 'loading' | 'ok' | 'no_token' | 'refreshing' | 'refreshed' | 'refresh_failed' | 'error'

  // Refs to avoid stale closures across async operations
  const statesRef             = useRef(agentStates)
  const productRef            = useRef('')
  const metaTokenRef          = useRef('')
  const onTokenRefreshedRef   = useRef(null)   // callback → App.jsx updates its state

  const updateAgentState = useCallback((agentId, updates) => {
    setAgentStates((prev) => {
      const next = { ...prev, [agentId]: { ...prev[agentId], ...updates } }
      statesRef.current = next
      return next
    })
  }, [])

  /**
   * fetchMetaContext — runs before the Investigador calls Claude.
   * 1. Tries to fetch ads from Meta Ads Library.
   * 2. If the token has expired (error code 190), attempts a refresh via
   *    /api/meta-token, persists the new token, then retries the fetch.
   * 3. Returns a formatted Markdown block (or '' if no token is configured).
   */
  const fetchMetaContext = useCallback(async (product) => {
    const token = metaTokenRef.current
    if (!token) {
      setMetaFetchStatus('no_token')
      return ''
    }

    setMetaFetchStatus('loading')

    /* ── First attempt ── */
    try {
      const data      = await fetchMetaAds(product, token)
      const formatted = formatMetaAdsForPrompt(data, product)
      setMetaFetchStatus('ok')
      return formatted ? `\n\n---\n\n${formatted}` : ''
    } catch (firstErr) {

      /* ── Token expired → try to refresh and retry ── */
      if (isTokenExpiredError(firstErr)) {
        setMetaFetchStatus('refreshing')
        try {
          const newToken = await refreshMetaToken(token)

          // Persist the refreshed token
          localStorage.setItem('meta_ads_token', newToken)
          metaTokenRef.current = newToken
          onTokenRefreshedRef.current?.(newToken)   // notify App.jsx

          // Retry the Ads Library fetch with the new token
          const data      = await fetchMetaAds(product, newToken)
          const formatted = formatMetaAdsForPrompt(data, product)
          setMetaFetchStatus('refreshed')
          return formatted ? `\n\n---\n\n${formatted}` : ''

        } catch (refreshErr) {
          console.warn('[MetaAds] Token refresh failed:', refreshErr.message)
          setMetaFetchStatus('refresh_failed')
          return (
            '\n\n---\n\n' +
            '## META ADS LIBRARY — Token expirado\n' +
            `El token de Meta ha expirado y no se pudo renovar automáticamente (${refreshErr.message}). ` +
            'Para restaurar esta función, ingresa un nuevo token en la configuración de APIs y vuelve a lanzar la campaña.\n'
          )
        }
      }

      /* ── Other error (network, permissions, etc.) ── */
      console.warn('[MetaAds] Fetch error:', firstErr.message)
      setMetaFetchStatus('error')
      return (
        '\n\n---\n\n' +
        '## META ADS LIBRARY — Error al consultar\n' +
        `No se pudo acceder a la Ad Library (${firstErr.message}). ` +
        'Continúa el análisis sin estos datos y apóyate en la búsqueda web.\n'
      )
    }
  }, [])

  const runAgent = useCallback(
    async (agentIndex, apiKey) => {
      const agent = AGENTS[agentIndex]
      setCurrentAgentIndex(agentIndex)
      updateAgentState(agent.id, { status: 'active', content: '', error: null })

      const context = buildContext(statesRef.current)

      // For the Investigador: fetch Meta Ads Library data before calling Claude
      let metaContext = ''
      if (agentIndex === INVESTIGADOR_INDEX) {
        metaContext = await fetchMetaContext(productRef.current)
      }

      const userMessage =
        agentIndex === 0
          ? `Producto a analizar: ${productRef.current}`
          : `Producto: ${productRef.current}\n\nContexto aprobado del equipo:\n\n${context}${metaContext}\n\nProcede con tu análisis y entregables.`

      try {
        updateAgentState(agent.id, { status: 'streaming' })

        await callAgent({
          apiKey,
          systemPrompt: agent.systemPrompt,
          messages: [{ role: 'user', content: userMessage }],
          onChunk: (_chunk, fullText) => {
            updateAgentState(agent.id, { content: fullText })
          },
          onComplete: (fullText) => {
            updateAgentState(agent.id, { status: 'complete', content: fullText })
          },
          onError: (error) => {
            updateAgentState(agent.id, { status: 'error', error: error.message })
          },
        })
      } catch (error) {
        updateAgentState(agent.id, { status: 'error', error: error.message })
      }
    },
    [updateAgentState, fetchMetaContext]
  )

  const startWorkflow = useCallback(
    (productValue, apiKey, metaToken, onMetaTokenRefreshed) => {
      productRef.current          = productValue
      metaTokenRef.current        = metaToken ?? ''
      onTokenRefreshedRef.current = onMetaTokenRefreshed ?? null
      setMetaFetchStatus(null)

      const initial = freshStates()
      statesRef.current = initial
      setAgentStates(initial)
      setWorkflowStarted(true)
      setCampaignComplete(false)
      setCurrentAgentIndex(-1)
      // Tiny delay so React flushes state before the first agent call
      setTimeout(() => runAgent(0, apiKey), 80)
    },
    [runAgent]
  )

  const approveAgent = useCallback(
    (agentIndex, apiKey) => {
      const agent = AGENTS[agentIndex]
      updateAgentState(agent.id, { status: 'approved' })

      const next = agentIndex + 1
      if (next < AGENTS.length) {
        setTimeout(() => runAgent(next, apiKey), 700)
      } else {
        setCampaignComplete(true)
        setCurrentAgentIndex(-1)
      }
    },
    [updateAgentState, runAgent]
  )

  const rejectAgent = useCallback(
    (agentIndex, apiKey) => {
      runAgent(agentIndex, apiKey)
    },
    [runAgent]
  )

  const reset = useCallback(() => {
    setProduct('')
    setWorkflowStarted(false)
    setCurrentAgentIndex(-1)
    setCampaignComplete(false)
    setMetaFetchStatus(null)
    const initial = freshStates()
    setAgentStates(initial)
    statesRef.current           = initial
    productRef.current          = ''
    onTokenRefreshedRef.current = null
  }, [])

  return {
    product,
    setProduct,
    workflowStarted,
    currentAgentIndex,
    agentStates,
    campaignComplete,
    metaFetchStatus,
    startWorkflow,
    approveAgent,
    rejectAgent,
    reset,
  }
}
