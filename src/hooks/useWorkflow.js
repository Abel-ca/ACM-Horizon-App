import { useState, useCallback, useRef } from 'react'
import { callAgent }                    from '../lib/anthropicClient'
import { fetchMetaAds, formatMetaAdsForPrompt } from '../lib/metaAdsClient'
import { AGENTS }                       from '../agents/agentConfig'

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
  const [product, setProduct]               = useState('')
  const [workflowStarted, setWorkflowStarted] = useState(false)
  const [currentAgentIndex, setCurrentAgentIndex] = useState(-1)
  const [agentStates, setAgentStates]       = useState(freshStates)
  const [campaignComplete, setCampaignComplete] = useState(false)
  const [metaFetchStatus, setMetaFetchStatus] = useState(null) // null | 'loading' | 'ok' | 'error' | 'skipped'

  // Refs to avoid stale closures across async operations
  const statesRef    = useRef(agentStates)
  const productRef   = useRef('')
  const metaTokenRef = useRef('')

  const updateAgentState = useCallback((agentId, updates) => {
    setAgentStates((prev) => {
      const next = { ...prev, [agentId]: { ...prev[agentId], ...updates } }
      statesRef.current = next
      return next
    })
  }, [])

  /**
   * fetchMetaContext — called only for the Investigador agent.
   * Queries the Meta Ads Library and returns a formatted Markdown block,
   * or a fallback message if the token is missing or the call fails.
   */
  const fetchMetaContext = useCallback(async (product) => {
    const token = metaTokenRef.current
    if (!token) {
      setMetaFetchStatus('skipped')
      return ''
    }

    setMetaFetchStatus('loading')
    try {
      const data      = await fetchMetaAds(product, token)
      const formatted = formatMetaAdsForPrompt(data, product)
      setMetaFetchStatus('ok')
      return formatted ? `\n\n---\n\n${formatted}` : ''
    } catch (err) {
      console.warn('[MetaAds]', err.message)
      setMetaFetchStatus('error')
      return `\n\n---\n\n## META ADS LIBRARY — Error al consultar\nNo se pudo acceder a la Ad Library (${err.message}). Continúa tu análisis sin estos datos y apóyate en la búsqueda web.\n`
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
    (productValue, apiKey, metaToken) => {
      productRef.current   = productValue
      metaTokenRef.current = metaToken ?? ''
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
    statesRef.current = initial
    productRef.current = ''
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
