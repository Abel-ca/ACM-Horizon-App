import { useState } from 'react'
import Header from './components/Header'
import ApiKeyModal from './components/ApiKeyModal'
import ProductInput from './components/ProductInput'
import PipelineProgress from './components/PipelineProgress'
import AgentOutputCard from './components/AgentOutputCard'
import CampaignComplete from './components/CampaignComplete'
import { useWorkflow } from './hooks/useWorkflow'
import { AGENTS } from './agents/agentConfig'

export default function App() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('acm_api_key') || '')
  const [showApiModal, setShowApiModal] = useState(() => !localStorage.getItem('acm_api_key'))

  const {
    product,
    setProduct,
    workflowStarted,
    currentAgentIndex,
    agentStates,
    campaignComplete,
    startWorkflow,
    approveAgent,
    rejectAgent,
    reset,
  } = useWorkflow()

  const handleSaveApiKey = (key) => {
    setApiKey(key)
    localStorage.setItem('acm_api_key', key)
    setShowApiModal(false)
  }

  const handleStart = () => {
    if (!apiKey) {
      setShowApiModal(true)
      return
    }
    startWorkflow(product, apiKey)
  }

  const handleApprove = (index) => approveAgent(index, apiKey)
  const handleReject = (index) => rejectAgent(index, apiKey)

  return (
    <div className="min-h-screen" style={{ background: '#06070f' }}>
      {/* Grid overlay */}
      <div className="grid-bg fixed inset-0 pointer-events-none opacity-40" />

      {/* Scanline sweep */}
      <div className="scanline" />

      {/* Ambient glow — top center */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: '900px',
          height: '350px',
          background: 'radial-gradient(ellipse at 50% 0%, rgba(240,180,41,0.06) 0%, transparent 70%)',
          animation: 'glowPulse 4s ease-in-out infinite',
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 pb-16">
        {/* Top divider line */}
        <div
          className="w-full mb-8"
          style={{
            height: '1px',
            background: 'linear-gradient(to right, transparent, #2d3068, transparent)',
          }}
        />

        <Header
          apiKey={apiKey}
          onApiKeyClick={() => setShowApiModal(true)}
          onReset={workflowStarted ? reset : undefined}
        />

        <div
          className="my-8 w-full"
          style={{
            height: '1px',
            background: 'linear-gradient(to right, transparent, #1a1c38, transparent)',
          }}
        />

        <main className="space-y-8">
          <ProductInput
            product={product}
            setProduct={setProduct}
            onStart={handleStart}
            disabled={workflowStarted}
          />

          {workflowStarted && (
            <>
              {/* Pipeline progress tracker */}
              <div
                className="rounded-xl px-6 py-5"
                style={{ background: '#0d0e1e', border: '1px solid #1a1c38' }}
              >
                <p
                  className="text-[9px] font-bold uppercase tracking-[0.3em] mb-4"
                  style={{ color: '#3a3f60' }}
                >
                  Pipeline de campaña
                </p>
                <PipelineProgress
                  agentStates={agentStates}
                  currentAgentIndex={currentAgentIndex}
                  campaignComplete={campaignComplete}
                />
              </div>

              {/* Agent output cards */}
              <div className="space-y-5">
                {AGENTS.map((agent, index) => {
                  const state = agentStates[agent.id]
                  if (state.status === 'pending') return null

                  return (
                    <AgentOutputCard
                      key={agent.id}
                      agent={agent}
                      state={state}
                      isCurrentAgent={index === currentAgentIndex}
                      onApprove={() => handleApprove(index)}
                      onReject={() => handleReject(index)}
                    />
                  )
                })}
              </div>

              {campaignComplete && <CampaignComplete onReset={reset} />}
            </>
          )}

          {/* Empty state hint */}
          {!workflowStarted && (
            <div className="text-center py-12">
              <div className="flex justify-center gap-6 mb-6">
                {AGENTS.map((agent) => (
                  <div
                    key={agent.id}
                    className="flex flex-col items-center gap-2"
                    style={{ opacity: 0.4 }}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                      style={{
                        background: `${agent.colorAlpha}0.08)`,
                        border: `1px solid ${agent.colorAlpha}0.2)`,
                        color: agent.color,
                      }}
                    >
                      {agent.icon}
                    </div>
                    <span
                      className="text-[9px] uppercase tracking-wider font-bold"
                      style={{ color: agent.color }}
                    >
                      {agent.role}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs" style={{ color: '#3a3f60' }}>
                Ingresá un producto arriba para activar los 4 agentes
              </p>
            </div>
          )}
        </main>
      </div>

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
