import { Download } from 'lucide-react'

const AGENT_LABELS = {
  director:   { name: 'Director de Marketing',      color: '#f0b429' },
  researcher: { name: 'Investigador de Productos',  color: '#00d4ff' },
  copywriter: { name: 'Copywriter de Conversión',   color: '#a855f7' },
  creative:   { name: 'Director Creativo Visual',   color: '#f43f5e' },
}

function buildHtml(product, agentStates) {
  const sections = Object.entries(agentStates)
    .filter(([, s]) => s.status === 'approved' && s.content)
    .map(([id, s]) => {
      const label = AGENT_LABELS[id] || { name: id, color: '#888' }
      const escaped = s.content
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
      return `
        <section style="margin-bottom:48px;">
          <h2 style="font-size:13px;font-weight:800;letter-spacing:0.2em;text-transform:uppercase;color:${label.color};border-bottom:1px solid ${label.color}33;padding-bottom:8px;margin-bottom:20px;">${label.name}</h2>
          <pre style="font-family:'Courier New',monospace;font-size:11px;line-height:1.9;white-space:pre-wrap;word-break:break-word;color:#222;">${escaped}</pre>
        </section>`
    }).join('')

  const now = new Date().toLocaleDateString('es-EC', { day: 'numeric', month: 'long', year: 'numeric' })

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8"/>
<title>ACM Horizon — ${product}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, sans-serif; background: #fff; color: #111; padding: 48px; max-width: 860px; margin: 0 auto; }
  @media print {
    body { padding: 24px; }
    .no-print { display: none; }
  }
  .cover { margin-bottom: 56px; padding-bottom: 32px; border-bottom: 2px solid #f0b429; }
  .cover-label { font-size: 10px; font-weight: 800; letter-spacing: 0.3em; text-transform: uppercase; color: #f0b429; margin-bottom: 12px; }
  .cover-title { font-size: 28px; font-weight: 800; color: #06070f; line-height: 1.2; margin-bottom: 8px; }
  .cover-meta { font-size: 11px; color: #666; }
  .print-btn { display: inline-flex; align-items: center; gap: 8px; margin-top: 24px; padding: 10px 24px; background: #f0b429; color: #06070f; font-weight: 800; font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase; border: none; border-radius: 8px; cursor: pointer; }
</style>
</head>
<body>
  <div class="cover">
    <p class="cover-label">ACM Horizon · Brief de Campaña</p>
    <h1 class="cover-title">${product}</h1>
    <p class="cover-meta">Generado el ${now}</p>
    <button class="print-btn no-print" onclick="window.print()">⬇ Exportar PDF</button>
  </div>
  ${sections}
</body>
</html>`
}

export default function ExportButton({ product, agentStates }) {
  function handleExport() {
    const html = buildHtml(product, agentStates)
    const win = window.open('', '_blank', 'width=900,height=700')
    if (!win) return
    win.document.write(html)
    win.document.close()
    // Give fonts/styles a moment to load before auto-printing
    setTimeout(() => win.print(), 800)
  }

  return (
    <button
      onClick={handleExport}
      title="Exportar campaña completa a PDF"
      className="fixed bottom-8 right-8 z-50 flex items-center gap-2.5 px-5 py-3.5 rounded-xl text-xs font-extrabold uppercase tracking-widest shadow-2xl transition-all duration-200"
      style={{
        background: 'linear-gradient(135deg, #f0b429, #d4950a)',
        color: '#06070f',
        boxShadow: '0 8px 32px rgba(240,180,41,0.35)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)'
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(240,180,41,0.5)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'none'
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(240,180,41,0.35)'
      }}
    >
      <Download size={14} strokeWidth={2.5} />
      Exportar PDF
    </button>
  )
}
