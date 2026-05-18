# CONTEXTO DEL PROYECTO — ACM Horizon App

---

## ¿Qué es ACM Horizon?

ACM Horizon es una mini agencia de IA especializada en dropshipping en Ecuador. Opera bajo el modelo **contra-entrega** (cash-on-delivery) y usa **Dropi** como plataforma de proveedores, **Meta Ads** y **TikTok Ads** como canales de publicidad, y **Freepik AI** para producción de creativos.

La agencia está operada por una sola persona (el CEO). La app es su **centro de comando**: ingresa un producto, y cuatro agentes de IA trabajan en secuencia para entregar un brief de campaña completo listo para lanzar.

---

## Los 4 Agentes

### 1. Director de Marketing — ORQUESTADOR · color dorado #f0b429
- **Rol:** Socio estratégico del CEO. Valida el producto, evalúa viabilidad para el mercado ecuatoriano y crea el brief estratégico maestro para los demás agentes.
- **Incluye:** Benchmarks del Método ACM (CPA ≤ $3, ROAS > 2, Margen > 50%), sistema de testeo de 3 fases, 7 leyes de creatividad en 3 pilares, protocolo de delegación.
- **Prompt:** `src/agents/agentConfig.js` → id: `director`

### 2. Investigador de Productos — RESEARCH · color cyan #00d4ff
- **Rol:** Especialista en inteligencia de mercado. Analiza el producto con las 15 lentes de ángulo, detecta dolores del comprador, contexto de compra, competencia y saturación del mercado ecuatoriano.
- **Modos:** A (producto específico) / B (descubrimiento en un nicho)
- **Prompt:** `src/agents/agentConfig.js` → id: `researcher`

### 3. Copywriter de Conversión — COPY · color violeta #a855f7
- **Rol:** Convierte el research en copy listo para Meta y TikTok. Genera mínimo 5 hooks, copy principal en formato PAS o AIDA, variaciones para testeo A/B, CTAs contra-entrega y caption.
- **Reglas clave:** Nunca pedir tarjeta en CTAs, lenguaje ecuatoriano natural, prueba social.
- **Prompt:** `src/agents/agentConfig.js` → id: `copywriter`

### 4. Director Creativo Visual — CREATIVO · color rose #f43f5e
- **Rol:** Define la dirección visual y genera prompts listos para Freepik AI. Entrega brief visual completo: concepto, dirección de arte, pacing de video, prompts en inglés y checklist de producción.
- **Formatos:** 9:16 (TikTok/Stories/Reels) y 1:1 (feed Meta).
- **Prompt:** `src/agents/agentConfig.js` → id: `creative`

---

## Flujo de la Aplicación

```
Usuario ingresa producto
        ↓
Director de Marketing genera brief estratégico
        ↓  [Aprobar / Regenerar]
Investigador de Productos genera research
        ↓  [Aprobar / Regenerar]
Copywriter de Conversión genera paquete de copy
        ↓  [Aprobar / Regenerar]
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
├── package.json                    # Dependencias
├── vite.config.js                  # Vite + proxy a Anthropic API
├── tailwind.config.js              # Tokens de diseño
├── postcss.config.js
├── .gitignore
├── CONTEXTO_PROYECTO.md            # Este archivo
│
└── src/
    ├── main.jsx                    # Bootstrap React
    ├── App.jsx                     # Layout principal + estado global
    ├── index.css                   # Estilos globales + custom classes
    │
    ├── agents/
    │   └── agentConfig.js          # 4 agentes: prompts reales, colores, iconos
    │
    ├── lib/
    │   └── anthropicClient.js      # SDK Anthropic con streaming
    │
    ├── hooks/
    │   └── useWorkflow.js          # Máquina de estado del pipeline
    │
    └── components/
        ├── Header.jsx              # Barra superior con logo y API key
        ├── ApiKeyModal.jsx         # Modal de ingreso de API key
        ├── ProductInput.jsx        # Input del producto con ejemplos
        ├── PipelineProgress.jsx    # Tracker visual del pipeline
        ├── AgentOutputCard.jsx     # Card por agente con streaming y botones
        └── CampaignComplete.jsx    # Pantalla final de campaña completa
```

---

## Tecnologías Usadas

| Tecnología | Versión | Uso |
|---|---|---|
| React | 18.3.x | UI y gestión de estado |
| Vite | 6.x | Bundler + dev server + proxy Anthropic |
| Tailwind CSS | 3.4.x | Estilos utilitarios |
| @anthropic-ai/sdk | 0.96.x | Cliente oficial con streaming |
| lucide-react | 0.469.x | Iconos |
| Google Fonts | — | Syne (UI) + IBM Plex Mono (outputs) |

**Modelo IA:** `claude-sonnet-4-6`

---

## Decisiones Técnicas Clave

### Proxy Vite → Anthropic
`vite.config.js` redirige `/api/anthropic/*` → `https://api.anthropic.com/*`. Resuelve CORS: el browser habla con localhost, Vite hace la llamada server-side. La API key viaja en el header `x-api-key`.

### dangerouslyAllowBrowser: true
El SDK está configurado con esta opción para permitir llamadas desde el browser. Combinado con el proxy de Vite, es seguro en desarrollo local.

### Anti-stale closure con useRef
`useWorkflow.js` usa `statesRef` y `productRef` para evitar closures obsoletos en callbacks async. El estado React se sincroniza con los refs en cada actualización.

### API key en localStorage
Se guarda bajo `acm_api_key`. El modal aparece automáticamente si no hay key guardada.

### Streaming SSE
`anthropicClient.js` usa `client.messages.stream()` e itera eventos con `for await`. Los chunks se acumulan en el estado del agente en tiempo real.

---

## Diseño Visual

| Elemento | Valor |
|---|---|
| Fondo | `#06070f` navy-black con grid 48px y scanline sweep |
| Director | Dorado `#f0b429` |
| Investigador | Cyan `#00d4ff` |
| Copywriter | Violeta `#a855f7` |
| Creativo | Rose `#f43f5e` |
| Aprobado | Emerald `#10b981` |
| Fuente UI | Syne (Google Fonts) |
| Fuente outputs | IBM Plex Mono (Google Fonts) |

---

## Estado Actual — Qué Está Hecho

- [x] Setup React + Vite + Tailwind CSS
- [x] Proxy Vite → Anthropic (sin CORS)
- [x] Cliente Anthropic SDK con streaming en tiempo real
- [x] Hook useWorkflow con máquina de estado completa
- [x] 4 agentes con prompts reales de ACM Horizon
- [x] Flujo secuencial con aprobación por agente
- [x] Regeneración por agente sin afectar a los demás
- [x] Contexto acumulativo entre agentes
- [x] Diseño oscuro profesional con colores únicos por agente
- [x] Streaming con cursor parpadeante
- [x] Tracker visual del pipeline con nodos animados
- [x] Modal de API key con localStorage
- [x] Pantalla de campaña completa
- [x] Formateo de markdown en outputs
- [x] Build de producción sin errores
- [x] Repositorio en GitHub (Abel-ca/ACM-Horizon-App)

---

## Qué Falta Por Hacer

### Despliegue
- [ ] **Subir a Vercel** — conectar repo GitHub a Vercel para deploy automático
- [ ] **Configurar dominio** — conectar dominio propio (DNS + SSL automático)
- [ ] **Proxy en producción** — el proxy de Vite solo funciona en dev; para producción crear una Edge Function o serverless function en Vercel

### Ajustes de Interfaz
- [ ] Botón de copiar output al portapapeles por agente
- [ ] Exportar campaña completa (PDF o texto)
- [ ] Colapsar outputs aprobados (acordeón)
- [ ] Historial de campañas en localStorage
- [ ] Responsive móvil

### Pruebas Finales
- [ ] Prueba end-to-end con producto real de Dropi
- [ ] Prueba de error handling (API key inválida, timeout, error de red)
- [ ] Prueba de regeneración en distintos puntos del flujo
- [ ] Cross-browser (Chrome, Firefox, Edge, Safari)

---

## Cómo Correr el Proyecto Localmente (Git Bash)

### Requisitos previos
- Node.js 18+ instalado
- API key de Anthropic desde console.anthropic.com/account/keys

### Pasos

```bash
# Clonar el repositorio
git clone https://github.com/Abel-ca/ACM-Horizon-App.git
cd ACM-Horizon-App

# Instalar dependencias
npm install

# Correr en desarrollo
npm run dev
```

Abrir **http://localhost:5173** en el navegador. El modal pide la API key al primer uso.

### Otros comandos

```bash
# Build de producción
npm run build

# Preview del build
npm run preview
```

---

## Deploy en Vercel (cuando esté listo)

### Opción A — Con proxy serverless (recomendada)
1. Crear `api/chat.js` (Edge Function) que haga de proxy a Anthropic con la API key como variable de entorno de Vercel
2. Cambiar `anthropicClient.js` para llamar a `/api/chat`
3. Push → Vercel hace deploy automático

### Opción B — Sin proxy (más simple)
1. `dangerouslyAllowBrowser: true` ya está configurado
2. La API key la ingresa el usuario en el modal → queda en su localStorage
3. Conectar repo en vercel.com → deploy automático → configurar dominio

---

*ACM Horizon App — v1.0 · React + Vite + Tailwind + Anthropic SDK · github.com/Abel-ca/ACM-Horizon-App*
