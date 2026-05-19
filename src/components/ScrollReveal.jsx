import { useEffect, useRef } from 'react'

/**
 * Wraps children in a div that fades + slides up when scrolled into view.
 * Uses IntersectionObserver — no layout jank, no scroll listener.
 */
export default function ScrollReveal({ children, delay = 0, className = '', style = {} }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Already in viewport on mount → reveal immediately (after tiny delay for paint)
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const t = setTimeout(() => el.classList.add('sr-visible'), delay)
          observer.disconnect()
          return () => clearTimeout(t)
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px -32px 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])

  return (
    <div ref={ref} className={`sr-hidden ${className}`} style={style}>
      {children}
    </div>
  )
}
