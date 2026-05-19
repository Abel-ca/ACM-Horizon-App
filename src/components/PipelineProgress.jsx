import { useEffect, useRef, useState } from 'react'
import { Check } from 'lucide-react'
import { AGENTS } from '../agents/agentConfig'
import { getTheme } from '../design/agentTheme'

/* ── Status helper ─────────────────────────────────────── */
function nodeState(state) {
  if (state.status === 'approved')                               return 'approved'
  if (state.status === 'complete')                               return 'awaiting'
  if (state.status === 'streaming' || state.status === 'active') return 'running'
  if (state.status === 'error')                                  return 'error'
  return 'idle'
}

/* ── Tooltip ───────────────────────────────────────────── */
function Tooltip({ agent, theme, visible }) {
  if (!visible) return null
  return (
    <div
      className="absolute z-50 pointer-events-none"
      style={{
        bottom: 'calc(100% + 14px)',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 200,
        animation: 'panelEnter 0.2s ease both',
      }}
    >
      <div
        className="rounded-2xl px-4 py-3 text-center"
        style={{
          background: 'rgba(14,17,23,0.95)',
          backdropFilter: 'blur(16px)',
          border: `1px solid ${theme.color}35`,
          boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 24px ${theme.glow}0.15)`,
        }}
      >
        <p className="text-[10px] font-black uppercase tracking-[0.22em] mb-1" style={{ color: theme.color }}>
          {agent.name}
        </p>
        <p className="text-[10px] leading-relaxed" style={{ color: '#7a8299' }}>
          {agent.description}
        </p>
      </div>
      {/* Arrow */}
      <div
        style={{
          position: 'absolute',
          bottom: -6, left: '50%', transform: 'translateX(-50%) rotate(45deg)',
          width: 10, height: 10,
          background: 'rgba(14,17,23,0.95)',
          border: `1px solid ${theme.color}35`,
          borderTop: 'none', borderLeft: 'none',
        }}
      />
    </div>
  )
}

/* ── Single agent node ─────────────────────────────────── */
function AgentNode({ agent, state }) {
  const theme  = getTheme(agent.id)
  const status = nodeState(state)
  const isRunning  = status === 'running'
  const isApproved = status === 'approved'
  const isAwaiting = status === 'awaiting'
  const isIdle     = status === 'idle'
  const isActive   = isRunning || isAwaiting || isApproved

  const [hovered, setHovered]         = useState(false)
  const [bouncing, setBouncing]       = useState(false)
  const prevStatusRef                 = useRef(status)

  /* Bounce animation when node becomes approved */
  useEffect(() => {
    if (prevStatusRef.current !== 'approved' && status === 'approved') {
      setBouncing(true)
      setTimeout(() => setBouncing(false), 600)
    }
    prevStatusRef.current = status
  }, [status])

  const color = isApproved ? '#10b981' : isActive ? theme.color : '#1e2530'

  return (
    <div
      className="flex flex-col items-center"
      style={{ position: 'relative', flexShrink: 0 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Tooltip agent={agent} theme={theme} visible={hovered} />

      {/* Outer pulsing ring */}
      <div
        className={isRunning ? 'agent-ring' : ''}
        style={{
          width: 72, height: 72,
          borderRadius: '50%',
          border: `2px solid ${isRunning ? theme.color + '55' : 'transparent'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: isIdle ? 0.35 : 1,
          transition: 'opacity 0.4s ease',
        }}
      >
        {/* Inner circle */}
        <div
          className={bouncing ? 'node-bounce' : ''}
          style={{
            width: 52, height: 52,
            borderRadius: '50%',
            background: isApproved
              ? 'rgba(16,185,129,0.12)'
              : isActive
              ? theme.bg
              : 'rgba(255,255,255,0.02)',
            border: `1.5px solid ${color}`,
            boxShadow: isActive
              ? `0 0 20px ${theme.glow}0.2), inset 0 0 10px ${theme.glow}0.06)`
              : 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'default',
            transition: 'all 0.4s ease',
          }}
        >
          {isApproved ? (
            <Check size={20} style={{ color: '#10b981' }} strokeWidth={2.5} />
          ) : (
            <span style={{
              fontSize: 22, lineHeight: 1,
              color: isActive ? theme.color : '#2d3a4a',
              transition: 'color 0.4s ease',
              userSelect: 'none',
            }}>
              {agent.icon}
            </span>
          )}
        </div>
      </div>

      {/* Label */}
      <div
        className="mt-1.5 text-center"
        style={{ width: 76, opacity: isIdle ? 0.35 : 1, transition: 'opacity 0.4s ease' }}
      >
        <p className="text-[8px] font-extrabold uppercase tracking-[0.22em] leading-none"
           style={{ color: isApproved ? '#10b981' : isActive ? theme.color : '#3a4255' }}>
          {agent.role}
        </p>
        <p className="text-[10px] mt-0.5 leading-none"
           style={{ color: isActive || isApproved ? '#7a8299' : '#3a4255' }}>
          {agent.name.split(' ').slice(0, 2).join(' ')}
        </p>
      </div>
    </div>
  )
}

/* ── Connector track between nodes ────────────────────── */
function Connector({ fromApproved, fromRunning, fromColor, fromGlow }) {
  const lit = fromApproved || fromRunning
  return (
    <div className="relative flex-1 mx-2" style={{ height: 2, marginBottom: 28 }}>
      {/* Static track */}
      <div className="absolute inset-0 rounded-full" style={{ background: lit ? `${fromGlow}0.3)` : '#1e2530' }} />
      {/* Traveling particle */}
      {lit && (
        <div
          className="pipeline-particle"
          style={{
            background: `linear-gradient(90deg, transparent, ${fromApproved ? '#10b981' : fromColor}, transparent)`,
            boxShadow: `0 0 8px ${fromApproved ? '#10b981' : fromColor}`,
          }}
        />
      )}
    </div>
  )
}

/* ── Final star node ──────────────────────────────────── */
function FinalNode({ complete }) {
  return (
    <div className="flex flex-col items-center flex-shrink-0">
      <div
        style={{
          width: 52, height: 52, borderRadius: '50%',
          background: complete ? 'rgba(245,158,11,0.12)' : 'rgba(255,255,255,0.02)',
          border: `1.5px solid ${complete ? '#f59e0b' : '#1e2530'}`,
          boxShadow: complete ? '0 0 24px rgba(245,158,11,0.25)' : 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: complete ? 1 : 0.28,
          transition: 'all 0.5s ease',
        }}
      >
        <span style={{ fontSize: 24, color: complete ? '#f59e0b' : '#2d3a4a', lineHeight: 1 }}>★</span>
      </div>
      <div className="mt-1.5 text-center" style={{ width: 64, opacity: complete ? 1 : 0.28, transition: 'opacity 0.5s' }}>
        <p className="text-[8px] font-extrabold uppercase tracking-[0.22em] leading-none"
           style={{ color: complete ? '#f59e0b' : '#3a4255' }}>FIN</p>
        <p className="text-[10px] mt-0.5 leading-none" style={{ color: complete ? '#7a8299' : '#3a4255' }}>Completo</p>
      </div>
    </div>
  )
}

/* ── Pipeline ─────────────────────────────────────────── */
export default function PipelineProgress({ agentStates, campaignComplete }) {
  return (
    <div className="flex items-center">
      {AGENTS.map((agent, i) => {
        const state  = agentStates[agent.id]
        const status = nodeState(state)
        const theme  = getTheme(agent.id)
        const isLast = i === AGENTS.length - 1

        return (
          <div key={agent.id} className="flex items-center flex-1 min-w-0">
            <AgentNode agent={agent} state={state} />
            {!isLast && (
              <Connector
                fromApproved={status === 'approved'}
                fromRunning={status === 'running'}
                fromColor={theme.color}
                fromGlow={theme.glow}
              />
            )}
          </div>
        )
      })}
      <FinalNode complete={campaignComplete} />
    </div>
  )
}
