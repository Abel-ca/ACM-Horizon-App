import { useState } from 'react'
import { Check } from 'lucide-react'
import { AGENTS } from '../agents/agentConfig'

function getNodeState(state) {
  if (state.status === 'approved')                               return 'approved'
  if (state.status === 'complete')                               return 'awaiting'
  if (state.status === 'streaming' || state.status === 'active') return 'running'
  if (state.status === 'error')                                  return 'error'
  return 'idle'
}

/* ── Tooltip ─────────────────────────────────────────────── */
function Tooltip({ agent, visible }) {
  if (!visible) return null
  return (
    <div
      className="absolute bottom-[calc(100%+12px)] left-1/2 -translate-x-1/2 z-50 pointer-events-none"
      style={{ width: 200 }}
    >
      <div
        className="rounded-xl px-3.5 py-2.5 text-center"
        style={{
          background: '#13171f',
          border: `1px solid ${agent.color}40`,
          boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 20px ${agent.color}18`,
        }}
      >
        <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] mb-1" style={{ color: agent.color }}>
          {agent.name}
        </p>
        <p className="text-[10px] leading-relaxed" style={{ color: '#7a8299' }}>
          {agent.description}
        </p>
      </div>
      {/* Arrow */}
      <div
        className="absolute left-1/2 -translate-x-1/2 -bottom-[6px] w-3 h-3 rotate-45 rounded-sm"
        style={{ background: '#13171f', border: `1px solid ${agent.color}40`, borderTop: 'none', borderLeft: 'none' }}
      />
    </div>
  )
}

/* ── Pipeline ─────────────────────────────────────────────── */
export default function PipelineProgress({ agentStates, campaignComplete }) {
  const [hoveredId, setHoveredId] = useState(null)

  return (
    <div className="flex items-center">
      {AGENTS.map((agent, index) => {
        const state      = agentStates[agent.id]
        const nodeState  = getNodeState(state)
        const isRunning  = nodeState === 'running'
        const isApproved = nodeState === 'approved'
        const isAwaiting = nodeState === 'awaiting'
        const isIdle     = nodeState === 'idle'
        const isActive   = isRunning || isAwaiting || isApproved
        const isLast     = index === AGENTS.length - 1

        const mainColor = isApproved ? '#10b981' : isActive ? agent.color : '#1e2530'
        const glowColor = isApproved ? 'rgba(16,185,129,' : `${agent.colorAlpha}`

        return (
          <div key={agent.id} className="flex items-center flex-1 min-w-0">

            {/* ── Node ── */}
            <div
              className="flex flex-col items-center flex-shrink-0"
              style={{ position: 'relative' }}
              onMouseEnter={() => setHoveredId(agent.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Tooltip */}
              <Tooltip agent={agent} visible={hoveredId === agent.id} />

              {/* Outer ring (pulsing when running) */}
              <div
                className={isRunning ? 'agent-ring' : ''}
                style={{
                  width: 76,
                  height: 76,
                  borderRadius: '50%',
                  border: `2px solid ${isRunning ? agent.color + '60' : 'transparent'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: isIdle ? 0.38 : 1,
                  transition: 'opacity 0.5s ease',
                }}
              >
                {/* Inner circle — 64px */}
                <div
                  className="relative flex items-center justify-center cursor-pointer"
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: isApproved
                      ? 'rgba(16,185,129,0.1)'
                      : isActive
                      ? `${agent.colorAlpha}0.09)`
                      : 'rgba(255,255,255,0.02)',
                    border: `1.5px solid ${mainColor}`,
                    boxShadow: isActive
                      ? `0 0 22px ${glowColor}0.18), inset 0 0 12px ${glowColor}0.05)`
                      : 'none',
                    transition: 'all 0.5s ease',
                  }}
                >
                  {isApproved ? (
                    <Check size={22} style={{ color: '#10b981' }} strokeWidth={2.5} />
                  ) : (
                    <span
                      style={{
                        fontSize: 26,
                        lineHeight: 1,
                        color: isActive ? agent.color : '#2d3a4a',
                        transition: 'color 0.4s ease',
                        userSelect: 'none',
                      }}
                    >
                      {agent.icon}
                    </span>
                  )}
                </div>
              </div>

              {/* Label */}
              <div
                className="mt-2 text-center"
                style={{ width: 80, opacity: isIdle ? 0.38 : 1, transition: 'opacity 0.5s ease' }}
              >
                <p
                  className="text-[8px] font-extrabold uppercase tracking-[0.22em] leading-none"
                  style={{ color: isApproved ? '#10b981' : isActive ? agent.color : '#3a4255' }}
                >
                  {agent.role}
                </p>
                <p
                  className="text-[10px] mt-1 leading-tight"
                  style={{ color: isActive || isApproved ? '#7a8299' : '#3a4255' }}
                >
                  {agent.name.split(' ').slice(0, 2).join(' ')}
                </p>
              </div>
            </div>

            {/* ── Connector track (not after last node) ── */}
            {!isLast && (
              <div
                className="relative flex-1 mx-1"
                style={{ height: 2, marginBottom: 36 }}
              >
                {/* Static track */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{ background: isApproved ? `${glowColor}0.3)` : '#1e2530' }}
                />

                {/* Continuous traveling particle — shown on approved or running segments */}
                {(isApproved || isRunning) && (
                  <div
                    className="pipeline-particle"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${isApproved ? '#10b981' : agent.color}, transparent)`,
                      boxShadow: `0 0 8px ${isApproved ? '#10b981' : agent.color}`,
                    }}
                  />
                )}
              </div>
            )}
          </div>
        )
      })}

      {/* ── Final star node ── */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div
          className="flex items-center justify-center"
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: campaignComplete ? 'rgba(245,158,11,0.1)' : 'rgba(255,255,255,0.02)',
            border: `1.5px solid ${campaignComplete ? '#f59e0b' : '#1e2530'}`,
            boxShadow: campaignComplete ? '0 0 24px rgba(245,158,11,0.22)' : 'none',
            opacity: campaignComplete ? 1 : 0.3,
            transition: 'all 0.5s ease',
          }}
        >
          <span style={{ fontSize: 26, color: campaignComplete ? '#f59e0b' : '#2d3a4a', lineHeight: 1 }}>★</span>
        </div>
        <div
          className="mt-2 text-center"
          style={{ width: 80, opacity: campaignComplete ? 1 : 0.3, transition: 'opacity 0.5s ease' }}
        >
          <p className="text-[8px] font-extrabold uppercase tracking-[0.22em] leading-none" style={{ color: campaignComplete ? '#f59e0b' : '#3a4255' }}>
            FIN
          </p>
          <p className="text-[10px] mt-1" style={{ color: campaignComplete ? '#7a8299' : '#3a4255' }}>
            Completo
          </p>
        </div>
      </div>
    </div>
  )
}
