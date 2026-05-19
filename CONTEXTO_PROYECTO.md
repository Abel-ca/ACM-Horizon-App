# CONTEXTO DEL PROYECTO — ACM Horizon App

---

## ¿Qué es ACM Horizon?

ACM Horizon es una mini agencia de IA especializada en dropshipping en Ecuador. Opera bajo el modelo **contra-entrega** (cash-on-delivery) y usa **Dropi** como plataforma de proveedores, **Meta Ads** y **TikTok Ads** como canales de publicidad, y **Freepik AI** para producción de creativos.

La agencia está operada por una sola persona (el CEO). La app es su **centro de comando**: ingresa un producto, y cuatro agentes de IA trabajan en secuencia para entregar un brief de campaña completo listo para lanzar.

---

## Los 4 Agentes

### 1. Director de Marketing — ORQUESTADOR · color índigo `#6366f1`
- **Rol:** Socio estratégico del CEO. Valida el producto, evalúa viabilidad para el mercado ecuatoriano y crea el brief estratégico maestro para los demás agentes.
- **Incluye:** Benchmarks del Método ACM (CPA ≤ $3, ROAS > 2, Margen > 50%), sistema de testeo de 3 fases, 7 leyes de creatividad en 3 pilares, protocolo de delegación.
- **Web search:** Disponible para información muy reciente (noticias, política publicitaria, lanzamientos).
- **Prompt:** `src/agents/agentConfig.js` → id: `director`

### 2. Investigador de Productos — RESEARCH · color cyan `#06b6d4`
- **Rol:** Especialista en inteligencia de mercado. Analiza el producto con las 15 lentes de ángulo, detecta dolores del comprador, contexto de compra, competencia y saturación del mercado ecuatoriano.
- **Modos:** A (producto específico) / B (descubrimiento en un nicho)
- **Web search (obligatorio):** 6 búsquedas en secuencia — Facebook Ad Library, TikTok, YouTube/Google, precios Dropi/AliExpress, reviews del comprador, saturación regional.
- **Prompt:** `src/agents/agentConfig.js` → id: `researcher`

### 3. Copywriter de Conversión — COPY · color violeta `#8b5cf6`
- **Rol:** Convierte el research en copy listo para Meta y TikTok. Genera mínimo 5 hooks, copy principal en formato PAS o AIDA, variaciones para testeo A/B, CTAs contra-entrega y caption.
- **Reglas clave:** Nunca pedir tarjeta en CTAs, lenguaje ecuatoriano natural, prueba social.
- **Web search:** Disponible para slang local vigente y hooks virales actuales.
- **Prompt:** `src/agents/agentConfig.js` → id: `copywriter`

### 4. Director Creativo Visual — CREATIVO · color pink `#ec4899`
- **Rol:** Define la dirección visual y genera prompts listos para Freepik AI. Entrega brief visual completo: concepto, dirección de arte, pacing de video, prompts en inglés y checklist de producción.
- **Formatos:** 9:16 (TikTok/Stories/Reels) y 1:1 (feed Meta).
- **Web search:** Disponible para referencias visuales y creativos ganadores recientes.
- **Prompt:** `src/agents/agentConfig.js` → id: `creative`

---

## Flujo de la Aplicación

```
Usuario ingresa producto
        ↓
Director de Marketing genera brief estratégico
        ↓  [Aprobar / Redirigir]
Investigador de Productos genera research (+ búsquedas web en tiempo real)
        ↓  [Aprobar / Redirigir]
Copywriter de Conversión genera paquete de copy
        ↓  [Aprobar / Redirigir]
Director Creativo Visual genera brief visual + prompts Freepik
        ↓
★ Campaña completa lista para lanzar
```

Cada agente recibe como contexto todos los outputs aprobados anteriores. Si el CEO rechaza un output, ese agente regenera sin afectar a los demás.

---

## Estructura del Proyecto

```
ACM-Horizon-App/
├── index.html                      # Entry point con fuentes Google
├── package.json                    # Dependencias (type: module)
├── vite.config.js                  # Vite + proxy a Anthropic API
├── tailwind.config.js              # Tokens de diseño
├── postcss.config.js
├── .gitignore
├── .env.example                    # Documentación de vars de entorno
├── CONTEXTO_PROYECTO.md            # Este archivo
│
└── src/
    ├── main.jsx                    # Bootstrap React
    ├── App.jsx                     # Layout principal + estado global + confetti + PDF
    ├── index.css                   # Estilos globales: blobs, glassmorphism, animaciones
    │
    ├── agents/
    │   └── agentConfig.js          # 4 agentes: prompts reales + web search protocol
    │
    ├── design/
    │   └── agentTheme.js           # Colores por agente: getTheme(id), PALETTE
    │
    ├── lib/
    │   └── anthropicClient.js      # SDK Anthropic con streaming + web_search tool
    │
    ├── hooks/
    │   ├── useWorkflow.js          # Máquina de estado del pipeline
    │   └── useCampaignHistory.js   # Historial en localStorage + estimación de costo
    │
    └── components/
        ├── Header.jsx              # Barra superior: logo, métricas con count-up, API key
        ├── Sidebar.jsx             # Historial de campañas (220px, fixed)
        ├── DotGrid.jsx             # 3 blobs de color animados (fondo)
        ├── ApiKeyModal.jsx         # Modal de ingreso de API key
        ├── ProductInput.jsx        # Input con typing placeholder y chips de ejemplo
        ├── PipelineProgress.jsx    # Tracker visual: nodos 72px, conectores, tooltips
        ├── AgentOutputCard.jsx     # Panel único de agente: streaming, skeleton, footer pegado
        └── CampaignComplete.jsx    # Pantalla final: trophy, pills de agentes, export PDF
```

---

## Tecnologías Usadas

| Tecnología | Versión | Uso |
|---|---|---|
| React | 18.3.x | UI y gestión de estado |
| Vite | 6.x | Bundler + dev server + proxy Anthropic |
| Tailwind CSS | 3.4.x | Estilos utilitarios |
| @anthropic-ai/sdk | 0.96.x | Cliente oficial con streaming y web search |
| lucide-react | 0.469.x | Iconos |
| Plus Jakarta Sans | Google Fonts | Fuente UI principal |
| IBM Plex Mono | Google Fonts | Fuente de outputs de agentes |

**Modelo IA:** `claude-sonnet-4-6`
**Web Search:** `web_search_20250305` (tool nativa de Anthropic, server-side)

---

## Decisiones Técnicas Clave

### Proxy Vite → Anthropic
`vite.config.js` redirige `/api/anthropic/*` → `https://api.anthropic.com/*`. Resuelve CORS: el browser habla con localhost, Vite hace la llamada server-side. La API key viaja en el header `x-api-key`.

### dangerouslyAllowBrowser: true
El SDK está configurado con esta opción para permitir llamadas desde el browser. Combinado con el proxy de Vite, es seguro en desarrollo local.

### Web Search — server-side, sin loop de herramientas
El tool `web_search_20250305` se agrega al array `tools` de la llamada. Anthropic ejecuta las búsquedas en sus servidores — no hay loop cliente-lado. Se usa `client.beta.messages.stream()` con `betas: ['web-search-2025-03-05']`.

### Anti-stale closure con useRef
`useWorkflow.js` usa `statesRef` y `productRef` para evitar closures obsoletos en callbacks async. El estado React se sincroniza con los refs en cada actualización.

### API key en localStorage
Se guarda bajo `acm_api_key`. El modal aparece automáticamente si no hay key guardada.

### Streaming SSE
`anthropicClient.js` usa `client.beta.messages.stream()` e itera eventos con `for await`. Los chunks `text_delta` se acumulan en el estado del agente en tiempo real. Los eventos `tool_use` (web search) disparan el callback `onWebSearch`.

### Panel único con fade
Solo se renderiza un `AgentOutputCard` a la vez — el del agente activo/completo/error. Al aprobar, `panelOpacity` baja a 0 (320ms), se ejecuta `approveAgent`, luego sube a 1 (800ms). `key={agent.id}` en el wrapper fuerza remount limpio.

### Historial en localStorage
`useCampaignHistory` guarda bajo `acm_campaigns` (máx. 50 entradas). Estima costo por campaña asumiendo ~3500 tokens promedio a precio claude-sonnet.

### Colores de agentes en archivo separado
`src/design/agentTheme.js` exporta `getTheme(agentId)` y `PALETTE`. Los componentes importan de aquí en lugar de usar `agent.color` del config, permitiendo override visual sin tocar los prompts.

---

## Diseño Visual

| Elemento | Valor |
|---|---|
| Fondo | `#080a0f` con 3 blobs animados: índigo arriba-izq, púrpura arriba-der, pink abajo-centro |
| Director | Índigo `#6366f1` |
| Investigador | Cyan `#06b6d4` |
| Copywriter | Violeta `#8b5cf6` |
| Creativo | Pink `#ec4899` |
| Aprobado | Emerald `#10b981` |
| Error | Rose `#f43f5e` |
| Glassmorphism | `rgba(255,255,255,0.04)` + `backdrop-filter: blur(12px)` + borde `rgba(255,255,255,0.08)` |
| Fuente UI | Plus Jakarta Sans (Google Fonts) |
| Fuente outputs | IBM Plex Mono (Google Fonts) |

---

## Estado Actual — Qué Está Hecho

### Base técnica
- [x] Setup React + Vite + Tailwind CSS
- [x] Proxy Vite → Anthropic (sin CORS)
- [x] Cliente Anthropic SDK con streaming en tiempo real
- [x] Hook `useWorkflow` con máquina de estado completa
- [x] 4 agentes con prompts reales de ACM Horizon
- [x] Flujo secuencial con aprobación por agente
- [x] Regeneración por agente sin afectar a los demás
- [x] Contexto acumulativo entre agentes
- [x] Build de producción sin errores
- [x] Repositorio en GitHub (`Abel-ca/ACM-Horizon-App`)

### Inteligencia y búsquedas
- [x] **Web search conectado a todos los agentes** — tool `web_search_20250305` activa en cada llamada; los 4 agentes tienen instrucciones de uso en sus prompts
- [x] **Meta Ads Library integrada via web search** — el Investigador tiene protocolo de 6 búsquedas: Facebook Ad Library (EC/CO/MX/PE), TikTok, YouTube/Google, Dropi/AliExpress, reviews, saturación regional
- [x] **Variables de entorno y despliegue en Vercel validados** — arquitectura sin variables de servidor requeridas; la API key la gestiona el usuario en localStorage; deploy directo desde GitHub

### Interfaz y diseño
- [x] Diseño dark world-class: blobs animados, glassmorphism, Plus Jakarta Sans
- [x] Layout fijo: header 64px + sidebar 220px + pipeline bar 104px + panel único
- [x] Streaming con skeleton loading y cursor parpadeante (▊)
- [x] Pipeline visual: nodos 72px con bounce al aprobar, conectores con partícula
- [x] Tooltips en pipeline, highlight en sidebar, fade entre paneles
- [x] Confetti al completar campaña (65 piezas deterministas)
- [x] Pantalla de campaña completa con export PDF
- [x] Historial de campañas en sidebar (hook `useCampaignHistory` + localStorage)
- [x] Métricas en header con count-up animado
- [x] Modal de API key con validación
- [x] Formateo de markdown en outputs (headers, bullets, bold, separadores)
- [x] Botón copiar al portapapeles por agente

---

## Qué Falta Por Hacer

### Inteligencia y datos
- [ ] **Google Trends via web search** — agregar búsqueda de tendencias de Google al protocolo del Investigador: `google trends [producto] latinoamérica 2025`
- [ ] **TikTok Trends via web search** — búsqueda sistemática en TikTok Creative Center y hashtags en tendencia para el producto analizado
- [ ] Comparación automática de múltiples productos en el mismo brief

### Interfaz
- [ ] **Responsive móvil** — el layout actual es desktop-only (sidebar 220px + pipeline fijo no colapsan en pantallas < 768px)
- [ ] **Exportar PDF mejorado** — el `window.open` + `window.print()` actual funciona pero es básico; considerar `jsPDF` o una Edge Function que genere PDF server-side con diseño fiel al de la app
- [ ] Colapsar/expandir outputs aprobados (acordeón en sidebar o vista compacta)
- [ ] Dark/light mode toggle

### Despliegue y operaciones
- [ ] **Configurar dominio propio** — conectar DNS en Vercel (SSL automático)
- [ ] Prueba end-to-end con producto real de Dropi en producción
- [ ] Prueba de error handling: API key inválida, timeout, error de red, cuota excedida
- [ ] Cross-browser (Chrome, Firefox, Edge, Safari)

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

El proyecto usa **Opción B — sin proxy serverless**:

1. La API key la ingresa el usuario → se guarda en su `localStorage` → viaja en el header de cada llamada
2. `dangerouslyAllowBrowser: true` ya configurado en `anthropicClient.js`
3. No hay variables de entorno requeridas en Vercel
4. Conectar repo `Abel-ca/ACM-Horizon-App` en [vercel.com](https://vercel.com) → deploy automático en cada push a `main`

```
GitHub push → Vercel build (npm run build) → deploy automático
```

---

*ACM Horizon App — v1.1 · React + Vite + Tailwind + Anthropic SDK + Web Search · github.com/Abel-ca/ACM-Horizon-App*
