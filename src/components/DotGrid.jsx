/**
 * DotGrid.jsx — animated mesh-gradient background (Winnerly design system).
 * Four radial-gradient orbs drift slowly to create the "living" Electric Modernism feel.
 */
export default function DotGrid() {
  return (
    <div className="mesh-bg" aria-hidden="true">
      <div className="mesh-orb mesh-orb-1" />
      <div className="mesh-orb mesh-orb-2" />
      <div className="mesh-orb mesh-orb-3" />
      <div className="mesh-orb mesh-orb-4" />
    </div>
  )
}
