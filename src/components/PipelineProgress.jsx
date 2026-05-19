import { Check } from 'lucide-react'
import { AGENTS } from '../agents/agentConfig'

function getNodeState(state) {
  if (state.status === 'approved')                              return 'approved'
  if (state.status === 'complete')                              return 'awaiting'
  if (state.status === 'streaming' || state.status === 'active') return 'running'
  if (state.status === 'error')                                 return 'error'
  return 'idle'
}

export default function PipelineProgress({ agentStates, campaignComplete }) {
  return (
    <div className="section-enter">
      <div className="relative flex items-center">

        {AGENTS.map((agent, index) => {
          const state    = agentStates[agent.id]
          const nodeState = getNodeState(state)
          const isRunning  = nodeState === 'running'
          const isApproved = nodeState === 'approved'
          const isAwaiting = nodeState === 'awaiting'
          const isIdle     = nodeState === 'idle'
          const isActive   = isRunning || isAwaiting || isApproved

          const nodeColor = isApproved ? '#10b981' : isActive ? agent.color : '#1e2248'

          const isLast = index === AGENTS.length - 1

          return (
            <div key={agent.id} className="flex items-center flex-1">
              {/* Node */}
              <div className="flex flex-col items-center" style={{ flexShrink: 0 }}>
                {/* Outer ring (pulsing when running) */}
                <div
                  className={isRunning ? 'agent-ring' : ''}
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    border: `2px solid ${isRunning ? agent.color : 'transparent'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: isIdle ? 0.4 : 1,
                    transition: 'opacity 0.4s ease',
                  }}
                >
                  {/* Inner circle */}
                  <div
                    className="relative flex items-center justify-center transition-all duration-500"
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: '50%',
                      background: isApproved
                        ? 'rgba(16,185,129,0.12)'
                        : isActive
                        ? `${agent.colorAlpha}0.1)`
                        : 'rgba(255,255,255,0.03)',
                      border: `1.5px solid ${nodeColor}`,
                      boxShadow: isActive ? `0 0 20px ${nodeColor}40` : 'none',
                    }}
                  >
                    {isApproved ? (
                      <Check size={18} style={{ color: '#10b981' }} strokeWidth={2.5} />
                    ) : (
                      <span
                        className="font-bold select-none"
                        style={{ fontSize: 22, color: isActive ? agent.color : '#3a3f60', lineHeight: 1 }}
                      >
                        {agent.icon}
                      </span>
                    )}
                  </div>
                </div>

                {/* Label below node */}
                <div className="mt-2 text-center" style={{ width: 72, opacity: isIdle ? 0.4 : 1, transition: 'opacity 0.4s' }}>
                  <p
                    className="text-[8px] font-extrabold uppercase tracking-[0.2em] leading-none"
                    style={{ color: isApproved ? '#10b981' : isActive ? agent.color : '#3a3f60' }}
                  >
                    {agent.role}
                  </p>
                  <p
                    className="text-[10px] mt-1 leading-tight"
                    style={{ color: isActive || isApproved ? '#8b90c0' : '#3a3f60' }}
                  >
                    {agent.name.split(' ').slice(0, 2).join(' ')}
                  </p>
                </div>
              </div>

              {/* Connector track (not after last agent) */}
              {!isLast && (
                <div className="relative flex-1 mx-1" style={{ height: 2, marginBottom: 36 }}>
                  {/* Static track */}
                  <div
                    className="absolute inset-0"
                    style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 1 }}
                  />
                  {/* Flowing light — shown when next segment is active or this agent is approved */}
                  {(isApproved || isRunning) && (
                    <div
                      className="flow-light"
                      style={{
                        borderRadius: 1,
                        background: `linear-gradient(90deg, transparent, ${isApproved ? '#10b981' : agent.color}cc, transparent)`,
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          )
        })}

        {/* Final star node */}
        <div className="flex flex-col items-center" style={{ flexShrink: 0 }}>
          <div
            className="flex items-center justify-center transition-all duration-500"
            style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              background: campaignComplete ? 'rgba(240,180,41,0.12)' : 'rgba(255,255,255,0.02)',
              border: `1.5px solid ${campaignComplete ? '#f0b429' : '#1e2248'}`,
              boxShadow: campaignComplete ? '0 0 24px rgba(240,180,41,0.25)' : 'none',
              opacity: campaignComplete ? 1 : 0.35,
              transition: 'all 0.5s ease',
            }}
          >
            <span style={{ fontSize: 22, color: campaignComplete ? '#f0b429' : '#3a3f60' }}>★</span>
          </div>
          <div className="mt-2 text-center" style={{ width: 72, opacity: campaignComplete ? 1 : 0.35, transition: 'opacity 0.4s' }}>
            <p className="text-[8px] font-extrabold uppercase tracking-[0.2em] leading-none" style={{ color: campaignComplete ? '#f0b429' : '#3a3f60' }}>
              FIN
            </p>
            <p className="text-[10px] mt-1" style={{ color: campaignComplete ? '#8b90c0' : '#3a3f60' }}>
              Completo
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
