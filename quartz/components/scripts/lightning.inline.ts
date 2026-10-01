// Lightning Visual Effects for Lightning System Page
let canvas: HTMLCanvasElement | null = null
let ctx: CanvasRenderingContext2D | null = null
let animId: number | null = null
let ambientTimer: any = null
let isInitialized = false

interface Segment {
  x1: number
  y1: number
  x2: number
  y2: number
  width: number
}

interface Bolt {
  segments: Segment[]
  alpha: number
  color: string
  coreColor: string
  decay: number
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  decay: number
  size: number
  color: string
}

let activeBolts: Bolt[] = []
let activeParticles: Particle[] = []
let flashAlpha = 0

function isLightningPage(): boolean {
  const p = window.location.pathname.toLowerCase()
  return p.includes("lightning") || p.includes("lightning-system")
}

function initCanvas(): boolean {
  if (canvas && document.body.contains(canvas)) return true

  canvas = document.createElement("canvas")
  canvas.id = "lightning-fx-canvas"
  canvas.style.position = "fixed"
  canvas.style.top = "0"
  canvas.style.left = "0"
  canvas.style.width = "100vw"
  canvas.style.height = "100vh"
  canvas.style.pointerEvents = "none"
  canvas.style.zIndex = "99999"
  document.body.appendChild(canvas)

  ctx = canvas.getContext("2d")
  resizeCanvas()
  window.removeEventListener("resize", resizeCanvas)
  window.addEventListener("resize", resizeCanvas)
  return true
}

function resizeCanvas() {
  if (!canvas) return
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

function removeCanvas() {
  if (canvas && canvas.parentNode) {
    canvas.parentNode.removeChild(canvas)
  }
  canvas = null
  ctx = null
  if (animId) {
    cancelAnimationFrame(animId)
    animId = null
  }
  if (ambientTimer) {
    clearTimeout(ambientTimer)
    ambientTimer = null
  }
  activeBolts = []
  activeParticles = []
  isInitialized = false
}

// Generate fractal lightning bolt
function createBoltSegments(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  width: number,
  branches: number = 2,
): Segment[] {
  const segments: Segment[] = []

  function subdivide(
    sx: number,
    sy: number,
    ex: number,
    ey: number,
    curW: number,
    branchProb: number,
  ) {
    const dist = Math.hypot(ex - sx, ey - sy)
    if (dist < 14) {
      segments.push({ x1: sx, y1: sy, x2: ex, y2: ey, width: Math.max(curW, 1) })
      return
    }

    const midX = (sx + ex) / 2
    const midY = (sy + ey) / 2

    // Perpendicular vector
    const dx = ex - sx
    const dy = ey - sy
    const normalX = -dy / dist
    const normalY = dx / dist

    // Normal jitter displacement
    const jitter = (Math.random() - 0.5) * dist * 0.38
    const mx = midX + normalX * jitter
    const my = midY + normalY * jitter

    subdivide(sx, sy, mx, my, curW, branchProb)
    subdivide(mx, my, ex, ey, curW, branchProb)

    // Optional fork branch
    if (branchProb > 0 && Math.random() < branchProb) {
      const angle = (Math.random() - 0.5) * 0.7
      const branchDist = dist * (0.35 + Math.random() * 0.35)
      const cosA = Math.cos(angle)
      const sinA = Math.sin(angle)
      const bx = mx + (dx * cosA - dy * sinA) * (branchDist / dist)
      const by = my + (dx * sinA + dy * cosA) * (branchDist / dist)
      subdivide(mx, my, bx, by, curW * 0.65, branchProb * 0.4)
    }
  }

  subdivide(x1, y1, x2, y2, width, branches > 0 ? 0.35 : 0)
  return segments
}

function spawnSparks(x: number, y: number, count: number = 20) {
  const colors = ["#38bdf8", "#7dd3fc", "#ffffff", "#34d399", "#fcd34d"]
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2
    const speed = 2 + Math.random() * 8
    activeParticles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1.5,
      life: 1.0,
      decay: 0.025 + Math.random() * 0.035,
      size: 1.5 + Math.random() * 2.5,
      color: colors[Math.floor(Math.random() * colors.length)],
    })
  }
}

function strike(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  isMajor: boolean = false,
) {
  if (!initCanvas()) return

  // Double flash effect
  flashAlpha = isMajor ? 0.45 : 0.28
  setTimeout(() => {
    flashAlpha = isMajor ? 0.25 : 0.12
  }, 60)
  setTimeout(() => {
    flashAlpha = 0
  }, 140)

  // Primary Bolt
  const segments = createBoltSegments(x1, y1, x2, y2, isMajor ? 3.5 : 2.5, isMajor ? 3 : 2)
  activeBolts.push({
    segments,
    alpha: 1.0,
    color: "#38bdf8",
    coreColor: "#ffffff",
    decay: isMajor ? 0.045 : 0.065,
  })

  // Secondary echo bolt for realism
  if (isMajor) {
    setTimeout(() => {
      const echoSegments = createBoltSegments(x1 + (Math.random() - 0.5) * 30, y1, x2, y2, 2.0, 1)
      activeBolts.push({
        segments: echoSegments,
        alpha: 0.85,
        color: "#67e8f9",
        coreColor: "#ffffff",
        decay: 0.07,
      })
    }, 70)
  }

  // Sparks at impact point
  spawnSparks(x2, y2, isMajor ? 35 : 18)

  if (!animId) {
    animLoop()
  }
}

function animLoop() {
  if (!ctx || !canvas) return

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // 1. Sky Flash
  if (flashAlpha > 0.01) {
    ctx.fillStyle = `rgba(186, 230, 253, ${flashAlpha})`
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    flashAlpha *= 0.82
  }

  // 2. Draw Lightning Bolts
  for (let i = activeBolts.length - 1; i >= 0; i--) {
    const bolt = activeBolts[i]
    if (bolt.alpha <= 0.02) {
      activeBolts.splice(i, 1)
      continue
    }

    // Outer Aura Glow
    ctx.save()
    ctx.strokeStyle = bolt.color
    ctx.shadowColor = bolt.color
    ctx.shadowBlur = 16
    ctx.globalAlpha = bolt.alpha * 0.7
    ctx.beginPath()
    for (const seg of bolt.segments) {
      ctx.lineWidth = seg.width * 2.8
      ctx.moveTo(seg.x1, seg.y1)
      ctx.lineTo(seg.x2, seg.y2)
    }
    ctx.stroke()
    ctx.restore()

    // Inner Hot Core
    ctx.save()
    ctx.strokeStyle = bolt.coreColor
    ctx.shadowColor = "#ffffff"
    ctx.shadowBlur = 8
    ctx.globalAlpha = bolt.alpha
    ctx.beginPath()
    for (const seg of bolt.segments) {
      ctx.lineWidth = Math.max(seg.width * 0.9, 1.2)
      ctx.moveTo(seg.x1, seg.y1)
      ctx.lineTo(seg.x2, seg.y2)
    }
    ctx.stroke()
    ctx.restore()

    bolt.alpha -= bolt.decay
  }

  // 3. Draw Spark Particles
  for (let i = activeParticles.length - 1; i >= 0; i--) {
    const p = activeParticles[i]
    p.x += p.vx
    p.y += p.vy
    p.vy += 0.2 // Gravity
    p.life -= p.decay

    if (p.life <= 0.02) {
      activeParticles.splice(i, 1)
      continue
    }

    ctx.save()
    ctx.fillStyle = p.color
    ctx.shadowColor = p.color
    ctx.shadowBlur = 6
    ctx.globalAlpha = p.life
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  // Continue loop if active elements exist
  if (activeBolts.length > 0 || activeParticles.length > 0 || flashAlpha > 0.01) {
    animId = requestAnimationFrame(animLoop)
  } else {
    animId = null
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }
}

// Entry Strike: Strike title with thunder
function strikeTitle() {
  const title = document.querySelector("article h1, .article-title, h1")
  if (!title) return

  const rect = title.getBoundingClientRect()
  const targetX = rect.left + rect.width / 2
  const targetY = rect.top + rect.height / 2
  const startX = targetX + (Math.random() - 0.5) * 180

  strike(startX, -10, targetX, targetY, true)

  // Electric Charge Glow on title
  title.classList.add("lightning-charged")
  setTimeout(() => {
    title.classList.remove("lightning-charged")
  }, 2200)
}

// Ambient Storm Lightning Scheduler (Frequent & Natural)
function scheduleAmbientLightning() {
  if (ambientTimer) clearTimeout(ambientTimer)
  if (!isLightningPage()) return

  // Random delay between 3.0s and 5.5s for frequent storm feel
  const nextDelay = 3000 + Math.random() * 2500

  ambientTimer = setTimeout(() => {
    if (!isLightningPage()) return

    const w = window.innerWidth
    const h = window.innerHeight
    const type = Math.random()

    if (type < 0.5) {
      // 1. Forked strike down into page
      const startX = w * (0.15 + Math.random() * 0.7)
      const endX = startX + (Math.random() - 0.5) * 200
      const endY = h * (0.35 + Math.random() * 0.45)
      strike(startX, -15, endX, endY, Math.random() > 0.6)
    } else if (type < 0.8) {
      // 2. Horizontal cloud-to-cloud arc
      const startX = w * (0.1 + Math.random() * 0.3)
      const endX = startX + w * (0.3 + Math.random() * 0.4)
      const startY = 15 + Math.random() * 40
      const endY = 35 + Math.random() * 70
      strike(startX, startY, endX, endY, false)
    } else {
      // 3. Heavy thunderbolt with double flash
      const startX = w * (0.25 + Math.random() * 0.5)
      const endX = startX + (Math.random() - 0.5) * 160
      const endY = h * (0.4 + Math.random() * 0.35)
      strike(startX, -10, endX, endY, true)
    }

    scheduleAmbientLightning()
  }, nextDelay)
}

// Setup Page
function setupLightning() {
  if (!isLightningPage()) {
    removeCanvas()
    return
  }

  initCanvas()

  // Small delay so layout/fonts settle before striking title
  setTimeout(() => {
    if (isLightningPage()) {
      strikeTitle()
    }
  }, 280)

  // Start frequent ambient storm
  scheduleAmbientLightning()
}

// Listen to Quartz SPA navigation
document.addEventListener("nav", () => {
  setupLightning()
})

// Also run on DOMContentLoaded / initial load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupLightning)
} else {
  setupLightning()
}
