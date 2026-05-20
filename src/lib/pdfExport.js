/**
 * pdfExport.js — jsPDF-based campaign brief generator.
 *
 * Accepts two different data shapes:
 *   agentStates  →  { director: { content: '...' }, researcher: { content: '...' }, ... }
 *   campaign.outputs → { director: '...', researcher: '...', ... }
 *
 * Both are normalised to plain strings before rendering.
 */
import jsPDF from 'jspdf'

const AGENTS_META = [
  { id: 'director',   label: 'Director de Marketing',     rgb: [99,  102, 241] },
  { id: 'researcher', label: 'Investigador de Productos', rgb: [6,   182, 212] },
  { id: 'copywriter', label: 'Copywriter de Conversión',  rgb: [139, 92,  246] },
  { id: 'creative',   label: 'Director Creativo Visual',  rgb: [236, 72,  153] },
]

/** Normalise either shape to a plain string */
function extractContent(val) {
  if (!val) return ''
  if (typeof val === 'string') return val
  return val.content || ''
}

/**
 * downloadPdf(product, data)
 *   product  — product name (string)
 *   data     — agentStates object OR campaign.outputs object
 */
export function downloadPdf(product, data) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const W = 210, M = 18, CW = W - 2 * M

  /* ── Cover band ── */
  doc.setFillColor(8, 10, 15)
  doc.rect(0, 0, W, 52, 'F')

  // Logo: "ACM" indigo + " Horizon" white
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(99, 102, 241)
  doc.text('ACM', M, 26)
  doc.setTextColor(240, 244, 255)
  const acmW = doc.getTextWidth('ACM')
  doc.text(' Horizon', M + acmW, 26)

  // Tagline
  doc.setFontSize(8.5)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(140, 150, 185)
  doc.text('Brief de Campaña Completo · ACM Horizon', M, 37)

  /* ── Product name ── */
  doc.setFontSize(17)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(15, 18, 30)
  const prodLines = doc.splitTextToSize(product, CW)
  doc.text(prodLines, M, 65)

  const now = new Date().toLocaleDateString('es-EC', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
  doc.setFontSize(8.5)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(130, 140, 165)
  const afterProd = 65 + prodLines.length * 8
  doc.text(`Generado el ${now}`, M, afterProd)

  // Divider
  doc.setDrawColor(215, 218, 228)
  doc.setLineWidth(0.3)
  doc.line(M, afterProd + 8, W - M, afterProd + 8)

  let y = afterProd + 18

  /* ── Agent sections ── */
  for (const { id, label, rgb } of AGENTS_META) {
    const content = extractContent(data?.[id])
    if (!content) continue

    if (y > 252) { doc.addPage(); y = 20 }

    // Section label
    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...rgb)
    doc.text(label.toUpperCase(), M, y)
    y += 3.5

    // Coloured rule
    doc.setDrawColor(...rgb)
    doc.setLineWidth(0.45)
    doc.line(M, y, W - M, y)
    y += 6

    // Body text
    doc.setFontSize(8.5)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(30, 35, 55)

    const bodyLines = doc.splitTextToSize(content, CW)
    for (const line of bodyLines) {
      if (y > 278) {
        doc.addPage()
        y = 18
        doc.setFontSize(8.5)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(30, 35, 55)
      }
      doc.text(line, M, y)
      y += 4.2
    }
    y += 12
  }

  /* ── Page footers ── */
  const total = doc.getNumberOfPages()
  for (let p = 1; p <= total; p++) {
    doc.setPage(p)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(165, 170, 190)
    doc.text('ACM Horizon — Brief de Campaña', M, 291)
    doc.text(`${p} / ${total}`, W - M, 291, { align: 'right' })
  }

  const safe = product.replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').slice(0, 50)
  doc.save(`ACM-Horizon-${safe}.pdf`)
}
