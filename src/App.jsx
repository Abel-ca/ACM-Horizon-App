import { useEffect, useState } from 'react'
import Header          from './components/Header'
import Sidebar         from './components/Sidebar'
import DotGrid         from './components/DotGrid'
import ApiKeyModal     from './components/ApiKeyModal'
import ProductInput    from './components/ProductInput'
import PipelineProgress from './components/PipelineProgress'
import AgentOutputCard from './components/AgentOutputCard'
import CampaignComplete from './components/CampaignComplete'
import ExportButton    from './components/ExportButton'
import { useWorkflow } from './hooks/useWorkflow'
import { useCampaignHistory } from './hooks/useCampaignHistory'
import { AGENTS } from './agents/agentConfig'

export default function App() {
  const [apiKey, setApiKey]       = useState(() => localStorage.getItem('acm_api_key') || '')
  const [showApiModal, setShowApiModal] = useState(() => !localStorage.getItem('acm_api_key'))

  const {
    product, setProduct,
    workflowStarted, currentAgentIndex,
    agentStates, campaignComplete,
    startWorkflow, approveAgent, rejectAgent, reset,
  } = useWorkflow()

  const {
    campaigns, saveCampaign,
    totalCampaigns, totalCost, validatedProducts,
  } = useCampaignHistory()

  /* Save campaign when it completes */
  useEffect(() => {
    if (campaignComplete && product) {
      saveCampaign(product, agentStates)
    }
  }, [campaignComplete]) // eslint-disable-line

  /* ── Handlers ─────────────────────────────────────────────── */
  const handleSaveApiKey = key => {
    setApiKey(key)
    localStorage.setItem('acm_api_key', key)
    setShowApiModal(false)
  }

  const handleStart = () => {
    if (!apiKey) { setShowApiModal(true); return }
    startWorkflow(product, apiKey)
  }

  const handleApprove = index => approveAgent(index, apiKey)
  const handleReject  = index => rejectAgent(index, apiKey)

  const handleNewCampaign = () => {
    reset()
  }

  /* ── Render ───────────────────────────────────────────────── */
  return (
    <div className="min-h-screen" style={{ background: '#06070f' }}>

      {/* Background layer */}
      <DotGrid />

      {/* Fixed header */}
      <Header
        apiKey={apiKey}
        onOpenApiModal={() => setShowApiModal(true)}
        onReset={reset}
        totalCampaigns={totalCampaigns}
        totalCost={totalCost}
        validatedProducts={validatedProducts}
      />

      {/* Sidebar */}
      <Sidebar campaigns={campaigns} onNewCampaign={handleNewCampaign} />

      {/* Main content — offset by header (64px) and sidebar (220px) */}
      <main
        className="relative z-10 min-h-screen pb-24"
        style={{ paddingTop: '64px', paddingLeft: '220px' }}
      >
        <div className="max-w-3xl mx-auto px-8 py-12">

          {/* Hero / Product Input */}
          {!workflowStarted && (
            <section className="mb-16">
              {/* Ambient text above */}
              <p className="hero-d1 text-[9px] font-extrabold uppercase tracking-[0.4em] mb-10 text-center" style={{ color: 'rgba(240,180,41,0.3)' }}>
                ACM Horizon · Centro de Comando
              </p>

              <ProductInput
                product={product}
                setProduct={setProduct}
                onStart={handleStart}
                disabled={workflowStarted}
              />

              {/* Idle agent preview */}
              <div className="hero-d4 flex justify-center gap-5 mt-14">
                {AGENTS.map(agent => (
                  <div key={agent.id} className="flex flex-col items-center gap-2" style={{ opacity: 0.3 }}>
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold"
                      style={{
                        background: `${agent.colorAlpha}0.07)`,
                        border: `1px solid ${agent.colorAlpha}0.18)`,
                        color: agent.color,
                      }}
                    >
                      {agent.icon}
                    </div>
                    <span className="text-[8px] uppercase tracking-[0.18em] font-bold" style={{ color: agent.color }}>
                      {agent.role}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Active workflow */}
          {workflowStarted && (
            <div className="space-y-8">

              {/* Product label */}
              <div className="section-enter flex items-center gap-3">
                <div
                  className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
                  style={{ background: 'rgba(240,180,41,0.08)', border: '1px solid rgba(240,180,41,0.2)', color: '#f0b429' }}
                >
                  Analizando
                </div>
                <h2 className="text-lg font-extrabold tracking-tight" style={{ color: '#f0f2ff' }}>
                  {product}
                </h2>
              </div>

              {/* Pipeline progress */}
              <div
                className="section-enter rounded-2xl px-6 py-5"
                style={{ background: 'rgba(13,14,30,0.7)', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(8px)' }}
              >
                <p className="text-[8px] font-extrabold uppercase tracking-[0.3em] mb-5" style={{ color: '#3a3f60' }}>
                  Pipeline de campaña
                </p>
                <PipelineProgress
                  agentStates={agentStates}
                  campaignComplete={campaignComplete}
                />
              </div>

              {/* Agent cards */}
              <div className="space-y-5">
                {AGENTS.map((agent, index) => {
                  const state = agentStates[agent.id]
                  if (state.status === 'pending') return null
                  return (
                    <AgentOutputCard
                      key={agent.id}
                      agent={agent}
                      state={state}
                      onApprove={() => handleApprove(index)}
                      onReject={() => handleReject(index)}
                    />
                  )
                })}
              </div>

              {/* Campaign complete screen */}
              {campaignComplete && <CampaignComplete onReset={reset} />}
            </div>
          )}
        </div>
      </main>

      {/* Floating PDF export button (only when campaign is complete) */}
      {campaignComplete && (
        <ExportButton product={product} agentStates={agentStates} />
      )}

      {/* API key modal */}
      {showApiModal && (
        <ApiKeyModal
          onSave={handleSaveApiKey}
          onClose={() => setShowApiModal(false)}
          hasKey={!!apiKey}
        />
      )}
    </div>
  )
}
