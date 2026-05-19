import { useEffect, useState } from 'react'
import Header           from './components/Header'
import Sidebar          from './components/Sidebar'
import DotGrid          from './components/DotGrid'
import ApiKeyModal      from './components/ApiKeyModal'
import ProductInput     from './components/ProductInput'
import PipelineProgress from './components/PipelineProgress'
import AgentOutputCard  from './components/AgentOutputCard'
import CampaignComplete from './components/CampaignComplete'
import ExportButton     from './components/ExportButton'
import ScrollReveal     from './components/ScrollReveal'
import { useWorkflow }       from './hooks/useWorkflow'
import { useCampaignHistory } from './hooks/useCampaignHistory'
import { AGENTS } from './agents/agentConfig'

/* ── Empty state illustration ─────────────────────────────── */
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {/* SVG rocket illustration */}
      <svg
        width="120"
        height="140"
        viewBox="0 0 120 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ marginBottom: 32, opacity: 0.55 }}
      >
        {/* Rocket body */}
        <ellipse cx="60" cy="62" rx="22" ry="38" fill="#1e2530" stroke="#2d3a4a" strokeWidth="1.5"/>
        {/* Rocket nose */}
        <path d="M60 8 C44 24 38 44 38 62 H82 C82 44 76 24 60 8Z" fill="#253040" stroke="#2d3a4a" strokeWidth="1.5"/>
        {/* Window */}
        <circle cx="60" cy="58" r="10" fill="#0e1117" stroke="#f59e0b" strokeWidth="1.5"/>
        <circle cx="60" cy="58" r="6" fill="rgba(245,158,11,0.12)"/>
        {/* Left fin */}
        <path d="M38 80 L20 100 L38 95Z" fill="#1e2530" stroke="#2d3a4a" strokeWidth="1.5"/>
        {/* Right fin */}
        <path d="M82 80 L100 100 L82 95Z" fill="#1e2530" stroke="#2d3a4a" strokeWidth="1.5"/>
        {/* Exhaust nozzle */}
        <rect x="50" y="98" width="20" height="8" rx="2" fill="#1e2530" stroke="#2d3a4a" strokeWidth="1.5"/>
        {/* Flame 1 */}
        <ellipse cx="60" cy="118" rx="10" ry="14" fill="rgba(245,158,11,0.3)"/>
        <ellipse cx="60" cy="120" rx="6"  ry="10" fill="rgba(245,158,11,0.5)"/>
        <ellipse cx="60" cy="122" rx="3"  ry="6"  fill="rgba(253,211,77,0.7)"/>
        {/* Stars */}
        <circle cx="16" cy="30" r="1.5" fill="#2d3a4a"/>
        <circle cx="28" cy="12" r="1"   fill="#2d3a4a"/>
        <circle cx="94" cy="20" r="1.5" fill="#2d3a4a"/>
        <circle cx="108" cy="42" r="1"  fill="#2d3a4a"/>
        <circle cx="10"  cy="58" r="1"  fill="#2d3a4a"/>
        <circle cx="112" cy="68" r="1.5" fill="#2d3a4a"/>
      </svg>

      <h3
        className="font-extrabold mb-3 tracking-tight"
        style={{ fontSize: 22, color: '#f0f4ff', letterSpacing: '-0.02em' }}
      >
        Tu primera campaña está a un<br />
        <span className="text-gradient-gold">producto de distancia</span>
      </h3>
      <p className="text-sm max-w-xs" style={{ color: '#3a4255', lineHeight: 1.7 }}>
        Escribe un producto arriba y los 4 agentes de IA construirán tu brief completo en segundos.
      </p>

      {/* Idle agent icons */}
      <div className="flex items-center gap-4 mt-10">
        {AGENTS.map(agent => (
          <div key={agent.id} className="flex flex-col items-center gap-2">
            <div
              className="flex items-center justify-center rounded-xl"
              style={{
                width: 42,
                height: 42,
                background: `${agent.colorAlpha}0.06)`,
                border: `1px solid ${agent.colorAlpha}0.15)`,
                color: agent.color,
                fontSize: 20,
                opacity: 0.55,
              }}
            >
              {agent.icon}
            </div>
            <span
              className="text-[8px] uppercase tracking-[0.2em] font-bold"
              style={{ color: agent.color, opacity: 0.45 }}
            >
              {agent.role}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── App ─────────────────────────────────────────────────── */
export default function App() {
  const [apiKey, setApiKey]             = useState(() => localStorage.getItem('acm_api_key') || '')
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

  /* Save campaign when all 4 agents complete */
  useEffect(() => {
    if (campaignComplete && product) saveCampaign(product, agentStates)
  }, [campaignComplete]) // eslint-disable-line

  /* ── Handlers ──────────────────────────────────────────── */
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

  /* ── Render ────────────────────────────────────────────── */
  return (
    <div className="min-h-screen" style={{ background: '#080a0f' }}>

      {/* Ambient dot grid */}
      <DotGrid />

      {/* Fixed top header */}
      <Header
        apiKey={apiKey}
        onOpenApiModal={() => setShowApiModal(true)}
        onReset={reset}
        totalCampaigns={totalCampaigns}
        totalCost={totalCost}
        validatedProducts={validatedProducts}
      />

      {/* Fixed left sidebar */}
      <Sidebar campaigns={campaigns} onNewCampaign={reset} />

      {/* Main content — offset by header 64px + sidebar 220px */}
      <main
        className="relative z-10 min-h-screen"
        style={{ paddingTop: '64px', paddingLeft: '220px' }}
      >
        <div className="max-w-3xl mx-auto px-8 py-14">

          {/* ── IDLE STATE: hero + empty state ── */}
          {!workflowStarted && (
            <section>
              <ProductInput
                product={product}
                setProduct={setProduct}
                onStart={handleStart}
                disabled={false}
              />
              <EmptyState />
            </section>
          )}

          {/* ── ACTIVE WORKFLOW ── */}
          {workflowStarted && (
            <div className="space-y-8">

              {/* Product label */}
              <div className="flex items-center gap-3">
                <div
                  className="px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest"
                  style={{
                    background: 'rgba(245,158,11,0.08)',
                    border: '1px solid rgba(245,158,11,0.2)',
                    color: '#f59e0b',
                  }}
                >
                  Analizando
                </div>
                <h2
                  className="font-extrabold tracking-tight"
                  style={{ fontSize: 20, color: '#f0f4ff' }}
                >
                  {product}
                </h2>
              </div>

              {/* Pipeline tracker */}
              <ScrollReveal>
                <div
                  className="rounded-2xl px-6 py-6"
                  style={{
                    background: '#0e1117',
                    border: '1px solid #1e2530',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
                  }}
                >
                  <p
                    className="text-[8px] font-extrabold uppercase tracking-[0.3em] mb-6"
                    style={{ color: '#3a4255' }}
                  >
                    Pipeline de campaña
                  </p>
                  <PipelineProgress
                    agentStates={agentStates}
                    campaignComplete={campaignComplete}
                  />
                </div>
              </ScrollReveal>

              {/* Agent output cards */}
              <div className="space-y-5">
                {AGENTS.map((agent, index) => {
                  const state = agentStates[agent.id]
                  if (state.status === 'pending') return null
                  return (
                    <ScrollReveal key={agent.id} delay={index * 60}>
                      <AgentOutputCard
                        agent={agent}
                        state={state}
                        onApprove={() => handleApprove(index)}
                        onReject={() => handleReject(index)}
                      />
                    </ScrollReveal>
                  )
                })}
              </div>

              {/* Campaign complete */}
              {campaignComplete && (
                <ScrollReveal>
                  <CampaignComplete onReset={reset} />
                </ScrollReveal>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Floating PDF export — only when campaign is done */}
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
