export default function DotGrid() {
  return (
    <>
      {/* Moving dot grid */}
      <div className="dot-grid fixed inset-0 pointer-events-none z-0" />

      {/* Radial vignette so edges fade to solid black */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 70% at 50% 0%, transparent 30%, #06070f 100%)',
        }}
      />

      {/* Subtle top-center ambient glow */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 pointer-events-none z-0"
        style={{
          width: '700px',
          height: '300px',
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(240,180,41,0.07) 0%, transparent 70%)',
          animation: 'glowBreath 5s ease-in-out infinite',
        }}
      />
    </>
  )
}
