import { useEffect, useState } from 'react'
import { Download } from 'lucide-react'

const AGENT_LABELS = {
  director:   { name: 'Director de Marketing',     color: '#f59e0b' },
  researcher: { name: 'Investigador de Productos', color: '#06b6d4' },
  copywriter: { name: 'Copywriter de Conversión',  color: '#a855f7' },
  creative:   { name: 'Director Creativo Visual',  color: '#f43f5e' },
}

function buildHtml(product, agentStates) {
  const sections = Object.entries(agentStates)
    .filter(([, s]) => s.status === 'approved' && s.content)
    .map(([id, s]) => {
      const label = AGENT_LABELS[id] || { name: id, color: '#888' }
      const escaped = s.content
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      return `
        <section style="margin-bottom:48px;">
          <h2 style="font-size:11px;font-weight:800;letter-spacing:0.22em;text-transform:uppercase;
                     color:${label.color};border-bottom:1px solid ${label.color}33;
                     padding-bottom:8px;margin-bottom:20px;">${label.name}</h2>
          <pre style="font-family:'Courier New',monospace;font-size:11px;line-height:1.9;
                      white-space:pre-wrap;word-break:break-word;color:#222;">${escaped}</pre>
        </section>`
    }).join('')

  const now = new Date().toLocaleDateString('es-EC', { day: 'numeric', month: 'long', year: 'numeric' })

  return `<!DOCTYPE html>
<html lang="es"><head>
<meta charset="UTF-8"/>
<title>ACM Horizon — ${product}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, sans-serif; background: #fff; color: #111; padding: 48px; max-width: 860px; margin: 0 auto; }
  @media print { body { padding: 24px; } .no-print { display: none; } }
  .cover { margin-bottom: 56px; padding-bottom: 32px; border-bottom: 3px solid #f59e0b; }
  .label { font-size: 10px; font-weight: 800; letter-spacing: 0.3em; text-transform: uppercase; color: #f59e0b; margin-bottom: 12px; }
  .title { font-size: 30px; font-weight: 800; color: #080a0f; line-height: 1.2; margin-bottom: 6px; }
  .meta  { font-size: 11px; color: #666; }
  .print-btn { display: inline-flex; align-items: center; gap: 8px; margin-top: 20px; padding: 10px 24px;
               background: #f59e0b; color: #080a0f; font-weight: 800; font-size: 12px;
               letter-spacing: 0.15em; text-transform: uppercase; border: none; border-radius: 8px; cursor: pointer; }
</style>
</head>
<body>
  <div class="cover">
    <p class="label">ACM Horizon · Brief de Campaña</p>
    <h1 class="title">${product}</h1>
    <p class="meta">Generado el ${now}</p>
    <button class="print-btn no-print" onclick="window.print()">⬇ Exportar PDF</button>
  </div>
  ${sections}
</body></html>`
}

export default function ExportButton({ product, agentStates }) {
  const [visible, setVisible] = useState(false)

  // Animate in with a slight delay
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  function handleExport() {
    const html = buildHtml(product, agentStates)
    const win = window.open('', '_blank', 'width=920,height=720')
    if (!win) return
    win.document.write(html)
    win.document.close()
    setTimeout(() => win.print(), 800)
  }

  return (
    <button
      onClick={handleExport}
      title="Exportar campaña completa a PDF"
      className="fixed bottom-8 right-8 z-50 flex items-center gap-2.5 px-5 py-3.5 rounded-2xl text-xs font-extrabold uppercase tracking-widest transition-all duration-300"
      style={{
        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
        color: '#080a0f',
        boxShadow: '0 8px 32px rgba(245,158,11,0.3)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.95)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-3px) scale(1.04)'
        e.currentTarget.style.boxShadow = '0 14px 44px rgba(245,158,11,0.45)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)'
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(245,158,11,0.3)'
      }}
    >
      <Download size={14} strokeWidth={2.5} />
      Exportar PDF
    </button>
  )
}
