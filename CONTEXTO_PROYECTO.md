# CONTEXTO DEL PROYECTO — Winnerly (ACM Horizon App)

---

## ¿Qué es Winnerly?

**Winnerly** es la interfaz web de ACM Horizon, una mini agencia de IA especializada en dropshipping en Ecuador. Opera bajo el modelo **contra-entrega** y usa **Dropi** como proveedor, **Meta Ads** y **TikTok Ads** como canales, y **Freepik AI** para producción de creativos.

La agencia está operada por una sola persona (el CEO). La app es su **centro de comando**: el CEO habla directamente con el Director de Marketing en un chat integrado, y el Director coordina automáticamente al equipo de 3 subagentes para entregar un brief completo listo para lanzar.

**Repositorio:** `github.com/Abel-ca/ACM-Horizon-App`
**Producción:** [winnerly.pro](https://winnerly.pro) (dominio propio conectado a Vercel)

---

## Los 4 Agentes

### 1. Director de Marketing — ORQUESTADOR · índigo `#6366f1`
- **Rol:** Socio estratégico del CEO. Valida productos, crea estrategias y coordina al equipo. Habla como colega cercano — directo, sin relleno.
- **Prompt:** Compacto (~300 palabras). Incluye benchmarks ACM, sistema de testeo 3 fases, 7 leyes de creatividad, protocolo de delegación. Responde siempre con semáforo 🟢🟡🔴 y termina con "¿Apruebas?"
- **Web search:** ❌ Desactivado. Prompt explícita: "NUNCA usas búsqueda web."
- **Fuente:** `src/agents/agentConfig.js` → id: `director`

### 2. Investigador de Productos — RESEARCH · cyan `#06b6d4`
- **Rol:** Especialista en inteligencia de mercado. Analiza producto con 15 lentes de ángulo, detecta dolores del comprador, contexto de compra, competencia y saturación para Ecuador.
- **Modos:** A (producto específico) / B (descubrimiento en nicho)
- **Web search:** ✅ Activo · máximo 3 búsquedas por sesión — priorizando Facebook Ad Library, TikTok trends y precios Dropi/AliExpress.
- **Fuente:** `src/agents/agentConfig.js` → id: `researcher`

### 3. Copywriter de Conversión — COPY · violeta `#8b5cf6`
- **Rol:** Convierte el research en copy listo para Meta y TikTok. Genera mínimo 5 hooks, copy principal PAS/AIDA, variaciones A/B, CTAs contra-entrega y caption.
- **Reglas clave:** Nunca pedir tarjeta, lenguaje ecuatoriano, prueba social.
- **Web search:** ✅ Disponible (slang local, hooks virales actuales)
- **Fuente:** `src/agents/agentConfig.js` → id: `copywriter`
- **⚠ Pendiente:** Optimizar prompt (reducir extensión, forzar formato compacto)

### 4. Director Creativo Visual — CREATIVO · pink `#ec4899`
- **Rol:** Define dirección visual y genera prompts para Freepik AI. Entrega brief visual completo: concepto, dirección de arte, pacing de video, prompts en inglés, checklist de producción.
- **Formatos:** 9:16 (TikTok/Stories/Reels) y 1:1 (feed Meta)
- **Web search:** ✅ Disponible (referencias visuales, creativos ganadores recientes)
- **Fuente:** `src/agents/agentConfig.js` → id: `creative`
- **⚠ Pendiente:** Optimizar prompt (reducir extensión, forzar formato compacto)

---

## Arquitectura de la Interfaz

### Director como eje central (diseño actual)

```
┌─────────────────────────────────────────────────────────┐
│  DIRECTOR CARD — chat estilo ChatGPT (ocupa todo el     │
│  ancho, ~55vh). El CEO escribe aquí. El Director        │
│  responde con burbujas diferenciadas. Auto-aprueba      │
│  y activa subagentes sin intervención del CEO.          │
└─────────────────────────────────────────────────────────┘
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  INVESTIGADOR │  │  COPYWRITER  │  │   CREATIVO   │
│  (read-only) │  │  (read-only) │  │  (read-only) │
│  streaming   │  │  streaming   │  │  streaming   │
└──────────────┘  └──────────────┘  └──────────────┘
```

**Flujo automático:**
1. CEO escribe producto en el chat del Director
2. Director analiza y responde en el chat (streaming visible)
3. Cuando Director completa → auto-aprobación → bubble de brief en el chat
4. Pill de sistema *"Activando subagentes..."*
5. Los 3 subagentes trabajan en sus cards (CEO solo observa)
6. Cuando todo termina → confetti + CTA del Director con botones PDF y nueva campaña

---

## Flujo de Datos

```
CEO escribe en DirectorCard
        ↓
startWorkflow(texto, apiKey) → Director [streaming → auto-approve]
        ↓
approveAgent(0) → Investigador [streaming → auto-approve]
        ↓
approveAgent(1) → Copywriter [streaming → auto-approve]
        ↓
approveAgent(2) → Director Creativo [streaming → auto-approve]
        ↓
campaignComplete → saveCampaign → confetti → CTA bubble
```

Cada agente recibe como contexto todos los outputs aprobados anteriores. La auto-aprobación ocurre en `App.jsx` vía `useEffect` sobre `agentStates` — sin tocar `useWorkflow.js`.

---

## Estructura del Proyecto

```
ACM-Horizon-App/
├── index.html                      # Entry point — fuentes Sora + Hanken Grotesk + JetBrains Mono
├── package.json                    # Dependencias (type: module)
├── vite.config.js                  # Vite + proxy a Anthropic API
├── tailwind.config.js              # Tokens Winnerly design system
├── postcss.config.js
├── DESIGN.md                       # Sistema de diseño Winnerly (fuente de verdad visual)
├── CONTEXTO_PROYECTO.md            # Este archivo
├── stitch-reference.html           # Reference sheet visual interactiva (glassmorphism, patrones)
│
└── src/
    ├── main.jsx                    # Bootstrap React
    ├── App.jsx                     # Layout + estado global + chat messages + auto-aprobación
    ├── index.css                   # Estilos: mesh gradient, glassmorphism, animaciones, chat
    │
    ├── agents/
    │   └── agentConfig.js          # 4 agentes: prompts + web search protocol
    │
    ├── design/
    │   └── agentTheme.js           # Colores por agente: getTheme(id), PALETTE
    │
    ├── lib/
    │   ├── anthropicClient.js      # SDK Anthropic con streaming + web_search tool
    │   └── pdfExport.js            # jsPDF — genera PDF del brief completo
    │
    ├── hooks/
    │   ├── useWorkflow.js          # Máquina de estado del pipeline (NO TOCAR)
    │   ├── useCampaignHistory.js   # Historial en localStorage + estimación de costo
    │   └── useIsMobile.js          # Breakpoint hook (< 768px)
    │
    └── components/
        ├── Header.jsx              # Barra superior: logo Winnerly, métricas, API key
        ├── Sidebar.jsx             # Historial de campañas (220px, fixed, drawer en móvil)
        ├── DotGrid.jsx             # Mesh gradient + cursor glow + 28 partículas + parallax
        ├── ApiKeyModal.jsx         # Modal de ingreso de API key
        ├── DirectorCard.jsx        # ★ Card principal: chat CEO↔Director, streaming, CTA
        ├── SubagentCard.jsx        # Card de observación read-only por subagente
        ├── AgentOutputCard.jsx     # Panel legacy: scroll interno 400px + modal "Ver completo"
        ├── CampaignViewer.jsx      # Visor de campañas del historial
        └── CampaignComplete.jsx    # Pantalla de completado (legacy, ahora integrada al chat)
```

**Archivos que NO se tocan bajo ninguna circunstancia:**
- `src/agents/agentConfig.js` — solo editar prompts con instrucción explícita
- `src/hooks/useWorkflow.js` — lógica de estado crítica
- `src/lib/anthropicClient.js` — cliente SDK

---

## Tecnologías

| Tecnología | Versión | Uso |
|---|---|---|
| React | 18.3.x | UI y gestión de estado |
| Vite | 6.x | Bundler + dev server + proxy Anthropic |
| Tailwind CSS | 3.4.x | Estilos utilitarios |
| @anthropic-ai/sdk | 0.96.x | Cliente oficial con streaming y web search |
| jsPDF + html2canvas | latest | Export PDF del brief completo |
| lucide-react | 0.469.x | Iconos |
| Sora | Google Fonts | Headlines / display |
| Hanken Grotesk | Google Fonts | Body text |
| JetBrains Mono | Google Fonts | Labels, metadata, outputs técnicos |

**Modelo IA:** `claude-sonnet-4-6`
**Web Search:** `web_search_20250305` (tool nativa Anthropic, server-side, solo en Investigador)

---

## Diseño Visual — Winnerly Design System

Fuente de verdad: `DESIGN.md` · Estilo: **Electric Modernism** (Glassmorphism + High-Contrast Bold)

| Elemento | Valor |
|---|---|
| Fondo base | `#0d112a` (Deep Indigo) |
| Primary / Electric Blue | `#2e5bff` — acciones, botones, foco |
| Secondary / Neon Teal | `#00f2d1` / `#00dfc1` — aprobado, éxito, sistema |
| Tertiary / Electric Purple | `#b000ec` — orbs, acentos creativos |
| On-surface | `#dee0ff` — texto principal |
| On-surface variant | `#c4c5d9` — texto secundario |
| Director | Índigo `#6366f1` |
| Investigador | Cyan `#06b6d4` |
| Copywriter | Violeta `#8b5cf6` |
| Creativo | Pink `#ec4899` |
| Glassmorphism | `rgba(22,26,51,0.65)` + `blur(12px)` + borde `rgba(184,195,255,0.10)` |
| Glass card (hover) | Shine sweep `shineSweep 0.7s` + lift `translateY(-3px)` |
| Fondo animado | 4 orbs mesh gradient con `meshFloat1-4` (24-30s) |
| Cursor glow | Radial 400px `rgba(46,91,255,0.07)` siguiendo el mouse |
| Partículas | 28 dust particles flotantes deterministas |
| Parallax | Mesh orbs se desplazan ±9px en X/Y con el mouse (RAF) |
| Typography | Sora 800 headlines · Hanken Grotesk 400/600 body · JetBrains Mono 500 labels |

---

## Estado Actual — Qué Está Hecho

### Base técnica
- [x] Setup React + Vite + Tailwind CSS
- [x] Proxy Vite → Anthropic (sin CORS)
- [x] Cliente Anthropic SDK con streaming en tiempo real
- [x] Hook `useWorkflow` con máquina de estado completa
- [x] Hook `useIsMobile` con resize listener
- [x] Hook `useCampaignHistory` con localStorage (`winnerly_campaigns`)
- [x] 4 agentes con prompts reales de ACM Horizon
- [x] Flujo secuencial con auto-aprobación (sin intervención del CEO)
- [x] Contexto acumulativo entre agentes
- [x] Export PDF con jsPDF (A4, todos los outputs)
- [x] Build de producción sin errores
- [x] Repositorio en GitHub (`Abel-ca/ACM-Horizon-App`)

### Prompts e inteligencia
- [x] **Director optimizado** — prompt compacto ~300 palabras, formato semáforo, sin web search
- [x] **Investigador con web search** — único agente con búsquedas en tiempo real, máx 3 búsquedas priorizadas
- [x] **Instrucción de concisión** añadida a los 4 agentes ("Máximo 400 palabras por sección, sin relleno")
- [x] **Contexto de negocio ACM completo** — benchmarks, modelo de precio, sistema de testeo 3 fases, 7 leyes creativas

### Interfaz y diseño
- [x] **Winnerly Design System aplicado desde DESIGN.md** — colores, tipografía y glassmorphism completos
- [x] **Arquitectura Director-centric** — chat integrado como eje central, subagentes en grid de observación
- [x] **DirectorCard** — chat CEO↔Director con burbujas diferenciadas, live streaming, CTA de campaña
- [x] **SubagentCard** — cards read-only con accent bar, status badge, streaming y fade gradient
- [x] **DotGrid mejorado** — cursor glow reactivo, 28 partículas flotantes, parallax suave en mesh orbs
- [x] **AgentOutputCard mejorado** — scroll interno 400px + fade gradient + botón "Ver completo" (modal con ESC/clic afuera)
- [x] **Responsive móvil** — sidebar drawer, layout 1 columna, DirectorCard y SubagentCards adaptados
- [x] Mesh gradient animado (4 orbs, drift 24-30s)
- [x] Glass cards con shine sweep en hover
- [x] Stagger animations en todas las secciones nuevas
- [x] Confetti al completar campaña (65 piezas deterministas)
- [x] Historial de campañas en sidebar + CampaignViewer
- [x] Métricas en header con count-up animado
- [x] Formateo de markdown en outputs (headers, bullets, bold, separadores)
- [x] Botón copiar al portapapeles por agente

### Despliegue
- [x] Deploy en Vercel (CI/CD automático desde main)
- [x] **Dominio `winnerly.pro` conectado a Vercel** (SSL automático)
- [x] Sin variables de entorno requeridas en servidor (API key en localStorage del usuario)

---

## Pendientes

### Prompts e inteligencia
- [ ] **Optimizar prompt del Copywriter** — reducir extensión, forzar formato compacto y bullets cortos
- [ ] **Optimizar prompt del Director Creativo** — reducir extensión, forzar briefing conciso con prompts Freepik directamente accionables
- [ ] **Validar el sistema completo en Cowork** — probar todos los agentes con productos reales antes de continuar desarrollo de la app web
- [ ] Limitar web search del Investigador con criterio de parada (`max_searches: 3` a nivel de prompt)

### Interfaz
- [ ] **Seguir mejorando la interfaz visual** — refinar animaciones, pulir estados de error, mejorar mobile UX
- [ ] Colapsar/expandir outputs en CampaignViewer (acordeón)
- [ ] Toast notifications para eventos del sistema (aprobación, errores)
- [ ] Cross-browser (Chrome, Firefox, Edge, Safari mobile)

### Operaciones
- [ ] Prueba end-to-end con producto real de Dropi en `winnerly.pro`
- [ ] Error handling completo: API key inválida, timeout, error de red, cuota excedida
- [ ] Documentar flujo de onboarding para nuevos usuarios (primer uso sin API key)

---

## Cómo Correr el Proyecto Localmente

### Requisitos
- Node.js 18+
- API key de Anthropic → [console.anthropic.com/account/keys](https://console.anthropic.com/account/keys)

### Pasos

```bash
# Clonar
git clone https://github.com/Abel-ca/ACM-Horizon-App.git
cd ACM-Horizon-App

# Instalar
npm install

# Desarrollo
npm run dev
# → http://localhost:5173
```

### Otros comandos

```bash
npm run build    # Build de producción (dist/)
npm run preview  # Preview del build en local
```

---

## Deploy en Vercel

1. La API key la ingresa el usuario → se guarda en su `localStorage` → viaja en el header de cada llamada
2. `dangerouslyAllowBrowser: true` configurado en `anthropicClient.js`
3. Sin variables de entorno requeridas en Vercel
4. CI/CD: push a `main` → Vercel build automático → deploy en `winnerly.pro`

```
GitHub push → Vercel build (npm run build) → deploy automático → winnerly.pro
```

---

## Decisiones Técnicas Clave

### Proxy Vite → Anthropic
`vite.config.js` redirige `/api/anthropic/*` → `https://api.anthropic.com/*`. Resuelve CORS: el browser habla con localhost, Vite hace la llamada server-side.

### Web Search — solo Investigador
El tool `web_search_20250305` se activa únicamente en la llamada del Investigador. El Director tiene la instrucción "NUNCA usas búsqueda web" en su prompt. Anthropic ejecuta las búsquedas server-side sin loop cliente-lado.

### Auto-aprobación en App.jsx
`useWorkflow.js` no se modifica. La auto-aprobación ocurre en `App.jsx` con un `useEffect` que observa `agentStates`: cuando cualquier agente llega a `status === 'complete'`, se llama `approveAgent(index, apiKey)` después de un delay (1400ms Director, 700ms subagentes). Un `autoApprovedRef` previene doble ejecución.

### Chat messages como estado en App.jsx
`chatMessages` es un array de objetos `{ id, role, type, content }`. Los tipos son: `intro` (welcome), `ceo` (CEO bubble), `director` con `type: 'brief'` (output del Director), `system` (pills de notificación), `cta` (campaña completa con botones). El live streaming se muestra como bubble ephemeral fuera del array, controlado por `showLiveBubble`.

### Anti-stale closure con useRef
`useWorkflow.js` usa `statesRef` y `productRef` para evitar closures obsoletos en callbacks async.

### Historial en localStorage
`useCampaignHistory` guarda bajo `winnerly_campaigns` (máx. 50 entradas). Estima costo por campaña asumiendo ~3500 tokens a precio claude-sonnet.

### Colores en archivo separado
`src/design/agentTheme.js` exporta `getTheme(agentId)`. Los componentes importan de aquí — permite override visual sin tocar los prompts.

---

*Winnerly — ACM Horizon App · v1.3 · React + Vite + Tailwind + Anthropic SDK · winnerly.pro*
