import { useState, useCallback } from 'react'

function estimateCost(agentStates) {
  const totalChars = Object.values(agentStates || {})
    .reduce((acc, s) => acc + (s.content?.length || 0), 0)
  // claude-sonnet: $3/M input, $15/M output — rough estimate
  const outTokens = totalChars / 4
  const inTokens  = outTokens * 0.35
  const cost = (outTokens * 15 + inTokens * 3) / 1_000_000
  return parseFloat(cost.toFixed(3))
}

export function useCampaignHistory() {
  const [campaigns, setCampaigns] = useState(() => {
    try { return JSON.parse(localStorage.getItem('acm_campaigns') || '[]') }
    catch { return [] }
  })

  const saveCampaign = useCallback((product, agentStates) => {
    const now = new Date()
    const campaign = {
      id: now.getTime().toString(),
      product,
      date: now.toLocaleDateString('es-EC', { day: 'numeric', month: 'short' }),
      status: 'complete',
      estimatedCost: estimateCost(agentStates),
    }
    setCampaigns(prev => {
      const updated = [campaign, ...prev].slice(0, 100)
      localStorage.setItem('acm_campaigns', JSON.stringify(updated))
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
