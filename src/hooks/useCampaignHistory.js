import { useState, useCallback } from 'react'

const STORAGE_KEY  = 'winnerly_campaigns'
const MAX_STORED   = 50

function estimateCost(agentStates) {
  const totalChars = Object.values(agentStates || {})
    .reduce((acc, s) => acc + (s.content?.length || 0), 0)
  // claude-sonnet: ~$3/M input tokens, ~$15/M output tokens
  const outTokens = totalChars / 4
  const inTokens  = outTokens * 0.35
  return parseFloat(((outTokens * 15 + inTokens * 3) / 1_000_000).toFixed(3))
}

export function useCampaignHistory() {
  const [campaigns, setCampaigns] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') }
    catch { return [] }
  })

  const saveCampaign = useCallback((product, agentStates) => {
    const now = new Date()
    const campaign = {
      id:            now.getTime().toString(),
      product,
      date:          now.toLocaleDateString('es-EC', { day: 'numeric', month: 'short', year: 'numeric' }),
      dateShort:     now.toLocaleDateString('es-EC', { day: 'numeric', month: 'short' }),
      status:        'complete',
      estimatedCost: estimateCost(agentStates),
      // Full text output of every agent — used for history viewer and PDF
      outputs: Object.fromEntries(
        Object.entries(agentStates).map(([id, s]) => [id, s.content || ''])
      ),
    }
    setCampaigns(prev => {
      const updated = [campaign, ...prev].slice(0, MAX_STORED)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const totalCost = parseFloat(
    campaigns.reduce((acc, c) => acc + (c.estimatedCost || 0), 0).toFixed(2)
  )

  return {
    campaigns,
    saveCampaign,
    totalCampaigns:    campaigns.length,
    totalCost,
    validatedProducts: campaigns.length,
  }
}
