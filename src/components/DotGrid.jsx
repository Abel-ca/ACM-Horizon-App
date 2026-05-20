import { useEffect, useRef } from 'react'

/* Deterministic particles — stable values across re-renders */
const PARTICLE_COLORS = ['#2e5bff', '#00f2d1', '#b000ec', '#6366f1']
const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  id:       i,
  left:     `${(i * 3.57) % 100}%`,
  bottom:   `${(i * 6.9) % 58}%`,
  size:     1 + (i % 3),
  color:    PARTICLE_COLORS[i % 4],
  opacity:  0.13 + (i % 4) * 0.05,
  duration: `${8 + (i % 13)}s`,
  delay:    `-${(i * 0.77) % 11}s`,
}))

export default function DotGrid() {
  const glowRef = useRef(null)
  const meshRef = useRef(null)

  useEffect(() => {
    let rafId
    let targetX = 0, targetY = 0
    let currentX = 0, currentY = 0

    const onMove = (e) => {
      targetX = e.clientX
      targetY = e.clientY

      /* Cursor glow — instant snap via CSS transition */
      if (glowRef.current) {
        glowRef.current.style.left = `${e.clientX}px`
        glowRef.current.style.top  = `${e.clientY}px`
      }
    }

    /* Smooth parallax on the mesh orb container */
    const tick = () => {
      if (meshRef.current && window.innerWidth > 0) {
        const dx = (targetX / window.innerWidth  - 0.5) * 18
        const dy = (targetY / window.innerHeight - 0.5) * 18
        currentX += (dx - currentX) * 0.055
        currentY += (dy - currentY) * 0.055
        meshRef.current.style.transform =
          `translate(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px)`
      }
      rafId = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    rafId = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div className="mesh-bg" aria-hidden="true">

      {/* Cursor radial glow — follows mouse */}
      <div
        ref={glowRef}
        className="cursor-glow"
        style={{ left: -200, top: -200 }}
      />

      {/* Parallax mesh orbs */}
      <div
        ref={meshRef}
        style={{ position: 'absolute', inset: 0, willChange: 'transform' }}
      >
        <div className="mesh-orb mesh-orb-1" />
        <div className="mesh-orb mesh-orb-2" />
        <div className="mesh-orb mesh-orb-3" />
        <div className="mesh-orb mesh-orb-4" />
      </div>

      {/* Floating dust particles */}
      {PARTICLES.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            left:              p.left,
            bottom:            p.bottom,
            width:             p.size,
            height:            p.size,
            background:        p.color,
            opacity:           p.opacity,
            animationDuration: p.duration,
            animationDelay:    p.delay,
          }}
        />
      ))}
    </div>
  )
}
