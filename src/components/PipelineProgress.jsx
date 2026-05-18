import { Check, Loader } from 'lucide-react'
import { AGENTS } from '../agents/agentConfig'

const STATUS_ORDER = ['pending', 'active', 'streaming', 'complete', 'approved', 'error']

function getNodeState(state, agentIndex, currentAgentIndex) {
  if (state.status === 'approved') return 'approved'
  if (state.status === 'complete') return 'awaiting'
  if (state.status === 'streaming' || state.status === 'active') return 'running'
  if (state.status === 'error') return 'error'
  return 'idle'
}

export default function PipelineProgress({ agentStates, currentAgentIndex, campaignComplete }) {
  return (
    <div className="relative py-2">
      {/* Connecting track */}
      <div
        className="absolute top-[22px] left-[5%] right-[5%] h-px"
        style={{ background: '#1a1c38' }}
      />

      {/* Nodes */}
      <div className="relative flex items-start">
        {AGENTS.map((agent, index) => {
          const state = agentStates[agent.id]
          const nodeState = getNodeState(state, index, currentAgentIndex)
          const isRunning = nodeState === 'running'
          const isApproved = nodeState === 'approved'
          const isAwaiting = nodeState === 'awaiting'

          const nodeColor = isApproved
            ? '#10b981'
            : isRunning || isAwaiting
            ? agent.color
            : '#1a1c38'

          const glowColor = isApproved
            ? 'rgba(16,185,129,0.25)'
            : isRunning || isAwaiting
            ? `${agent.colorAlpha}0.2)`
            : 'transparent'

          return (
            <div key={agent.id} className="flex flex-col items-center flex-1 gap-2.5">
              {/* Node circle */}
              <div
                className="relative w-11 h-11 rounded-full flex items-center justify-center transition-all duration-500"
                style={{
                  border: `2px solid ${nodeColor}`,
                  background: isApproved
                    ? 'rgba(16,185,129,0.1)'
                    : isRunning || isAwaiting
                    ? `${agent.colorAlpha}0.08)`
                    : '#111328',
                  boxShadow: `0 0 20px ${glowColor}`,
                }}
              >
                {isApproved ? (
                  <Check className="w-4 h-4" style={{ color: '#10b981' }} />
                ) : isRunning ? (
                  <Loader
                    className="w-4 h-4 animate-spin"
                    style={{ color: agent.color }}
                  />
                ) : (
                  <span
                    className="text-sm font-bold"
                    style={{ color: isAwaiting ? agent.color : '#3a3f60' }}
                  >
                    {agent.icon}
                  </span>
                )}

                {/* Pulse ring for active */}
                {isRunning && (
                  <div
                    className="absolute inset-0 rounded-full animate-ping"
                    style={{
                      border: `2px solid ${agent.color}`,
                      opacity: 0.3,
                    }}
                  />
                )}
              </div>

              {/* Label */}
              <div className="text-center px-1">
                <p
                  className="text-[9px] font-bold uppercase tracking-[0.18em] transition-colors duration-300"
                  style={{
                    color: isApproved
                      ? '#10b981'
                      : isRunning || isAwaiting
                      ? agent.color
                      : '#3a3f60',
                  }}
                >
                  {agent.role}
                </p>
                <p
                  className="text-[10px] mt-0.5 transition-colors duration-300 leading-tight"
                  style={{
                    color: isApproved || isRunning || isAwaiting ? '#8b90c0' : '#3a3f60',
                  }}
                >
                  {agent.name.split(' ').slice(-1)[0]}
                </p>
              </div>
            </div>
          )
        })}

        {/* Final node */}
        <div className="flex flex-col items-center gap-2.5">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-500"
            style={{
              border: `2px solid ${campaignComplete ? '#f0b429' : '#1a1c38'}`,
              background: campaignComplete ? 'rgba(240,180,41,0.08)' : '#111328',
              boxShadow: campaignComplete ? '0 0 20px rgba(240,180,41,0.2)' : 'none',
            }}
          >
            <span
              className="text-base"
              style={{ color: campaignComplete ? '#f0b429' : '#3a3f60' }}
            >
              ★
            </span>
          </div>
          <div className="text-center px-1">
            <p
              className="text-[9px] font-bold uppercase tracking-[0.18em]"
              style={{ color: campaignComplete ? '#f0b429' : '#3a3f60' }}
            >
              FIN
            </p>
            <p
              className="text-[10px] mt-0.5"
              style={{ color: campaignComplete ? '#8b90c0' : '#3a3f60' }}
            >
              Completo
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
