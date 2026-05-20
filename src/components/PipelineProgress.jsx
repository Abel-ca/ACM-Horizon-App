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

/* ── Tooltip (desktop only) ────────────────────────────── */
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
          background: 'rgba(8,12,37,0.97)',
          backdropFilter: 'blur(16px)',
          border: `1px solid ${theme.color}35`,
          boxShadow: `0 8px 32px rgba(8,12,37,0.7), 0 0 24px ${theme.glow}0.12)`,
        }}
      >
        <p className="text-[10px] font-black uppercase tracking-[0.22em] mb-1"
           style={{ color: theme.color, fontFamily: 'JetBrains Mono, monospace' }}>
          {agent.name}
        </p>
        <p className="text-[10px] leading-relaxed" style={{ color: '#8e90a2' }}>
          {agent.description}
        </p>
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: -6, left: '50%', transform: 'translateX(-50%) rotate(45deg)',
          width: 10, height: 10,
          background: 'rgba(8,12,37,0.97)',
          border: `1px solid ${theme.color}35`,
          borderTop: 'none', borderLeft: 'none',
        }}
      />
    </div>
  )
}

/* ── Single agent node ─────────────────────────────────── */
function AgentNode({ agent, state, isMobile, hideTooltip }) {
  const theme  = getTheme(agent.id)
  const status = nodeState(state)
  const isRunning  = status === 'running'
  const isApproved = status === 'approved'
  const isAwaiting = status === 'awaiting'
  const isIdle     = status === 'idle'
  const isActive   = isRunning || isAwaiting || isApproved

  const [hovered, setHovered]   = useState(false)
  const [bouncing, setBouncing] = useState(false)
  const prevStatusRef           = useRef(status)

  useEffect(() => {
    if (prevStatusRef.current !== 'approved' && status === 'approved') {
      setBouncing(true)
      setTimeout(() => setBouncing(false), 600)
    }
    prevStatusRef.current = status
  }, [status])

  const color = isApproved ? '#00dfc1' : isActive ? theme.color : '#242842'

  const outerSize = isMobile ? 56 : 72
  const innerSize = isMobile ? 42 : 52
  const iconSize  = isMobile ? 18 : 22
  const checkSize = isMobile ? 16 : 20

  return (
    <div
      className="flex flex-col items-center"
      style={{ position: 'relative', flexShrink: 0 }}
      onMouseEnter={() => !hideTooltip && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {!hideTooltip && <Tooltip agent={agent} theme={theme} visible={hovered} />}

      {/* Outer pulsing ring */}
      <div
        className={isRunning ? 'agent-ring' : ''}
        style={{
          width: outerSize, height: outerSize,
          borderRadius: '50%',
          border: `2px solid ${isRunning ? theme.color + '55' : 'transparent'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: isIdle ? 0.30 : 1,
          transition: 'opacity 0.4s ease',
        }}
      >
        {/* Inner circle */}
        <div
          className={bouncing ? 'node-bounce' : ''}
          style={{
            width: innerSize, height: innerSize,
            borderRadius: '50%',
            background: isApproved
              ? 'rgba(0,223,193,0.10)'
              : isActive ? theme.bg : 'rgba(184,195,255,0.03)',
            border: `1.5px solid ${color}`,
            boxShadow: isActive
              ? `0 0 20px ${theme.glow}0.18), inset 0 0 10px ${theme.glow}0.05)`
              : 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.4s ease',
          }}
        >
          {isApproved
            ? <Check size={checkSize} style={{ color: '#00dfc1' }} strokeWidth={2.5} />
            : <span style={{
                fontSize: iconSize, lineHeight: 1,
                color: isActive ? theme.color : '#434656',
                transition: 'color 0.4s ease',
                userSelect: 'none',
              }}>
                {agent.icon}
              </span>
          }
        </div>
      </div>

      {/* Label */}
      <div className="mt-1.5 text-center" style={{ opacity: isIdle ? 0.30 : 1, transition: 'opacity 0.4s ease' }}>
        <p
          className={`font-extrabold uppercase leading-none ${isMobile ? 'text-[7px] tracking-[0.18em]' : 'text-[8px] tracking-[0.22em]'}`}
          style={{
            color: isApproved ? '#00dfc1' : isActive ? theme.color : '#434656',
            fontFamily: 'JetBrains Mono, monospace',
          }}
        >
          {agent.role}
        </p>
        {!isMobile && (
          <p className="text-[10px] mt-0.5 leading-none"
             style={{ color: isActive || isApproved ? '#8e90a2' : '#434656' }}>
            {agent.name.split(' ').slice(0, 2).join(' ')}
          </p>
        )}
      </div>
    </div>
  )
}

/* ── Connector (desktop only) ──────────────────────────── */
function Connector({ fromApproved, fromRunning, fromColor, fromGlow }) {
  const lit = fromApproved || fromRunning
  return (
    <div className="relative flex-1 mx-2" style={{ height: 2, marginBottom: 28 }}>
      <div className="absolute inset-0 rounded-full"
           style={{ background: lit ? `${fromGlow}0.28)` : '#242842' }} />
      {lit && (
        <div
          className="pipeline-particle"
          style={{
            background: `linear-gradient(90deg, transparent, ${fromApproved ? '#00dfc1' : fromColor}, transparent)`,
            boxShadow: `0 0 8px ${fromApproved ? '#00dfc1' : fromColor}`,
          }}
        />
      )}
    </div>
  )
}

/* ── Final star node ──────────────────────────────────── */
function FinalNode({ complete, small }) {
  const sz = small ? 38 : 52
  return (
    <div className="flex flex-col items-center flex-shrink-0">
      <div style={{
        width: sz, height: sz, borderRadius: '50%',
        background: complete ? 'rgba(245,158,11,0.12)' : 'rgba(184,195,255,0.03)',
        border: `1.5px solid ${complete ? '#f59e0b' : '#242842'}`,
        boxShadow: complete ? '0 0 24px rgba(245,158,11,0.22)' : 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: complete ? 1 : 0.25,
        transition: 'all 0.5s ease',
      }}>
        <span style={{ fontSize: small ? 18 : 24, color: complete ? '#f59e0b' : '#434656', lineHeight: 1 }}>★</span>
      </div>
      <div className="mt-1.5 text-center" style={{ opacity: complete ? 1 : 0.25, transition: 'opacity 0.5s' }}>
        <p className="text-[8px] font-extrabold uppercase tracking-[0.22em] leading-none"
           style={{ color: complete ? '#f59e0b' : '#434656', fontFamily: 'JetBrains Mono, monospace' }}>
          FIN
        </p>
      </div>
    </div>
  )
}

/* ── Pipeline ─────────────────────────────────────────── */
export default function PipelineProgress({ agentStates, campaignComplete, isMobile }) {

  /* ── Mobile: 2×2 grid ── */
  if (isMobile) {
    return (
      <div style={{ width: '100%', padding: '4px 8px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', marginBottom: 8 }}>
          {AGENTS.map(agent => (
            <div key={agent.id} style={{ display: 'flex', justifyContent: 'center' }}>
              <AgentNode agent={agent} state={agentStates[agent.id]} isMobile hideTooltip />
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <FinalNode complete={campaignComplete} small />
        </div>
      </div>
    )
  }

  /* ── Desktop: horizontal row ── */
  return (
    <div className="flex items-center">
      {AGENTS.map((agent, i) => {
        const state  = agentStates[agent.id]
        const status = nodeState(state)
        const theme  = getTheme(agent.id)
        const isLast = i === AGENTS.length - 1
        return (
          <div key={agent.id} className="flex items-center flex-1 min-w-0">
            <AgentNode agent={agent} state={state} isMobile={false} />
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
