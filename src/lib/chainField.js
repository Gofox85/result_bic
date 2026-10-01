// The chain, running underneath the page.
//
// A faint field of blocks (squares) joined by links (straight rules). Transactions travel the links, and every
// couple of seconds a block is mined: its hash churns, it seals amber with its block number, and the news is
// broadcast to its peers hop by hop. It's the story the club site's peer mesh tells, told quietly behind
// everything else.
//
// One <canvas> and no DOM. The resting field (links and blocks) is drawn once per size onto a layer kept off
// screen; each frame (at most 24 a second) only the small patches the moving parts covered last frame are copied
// back from it, and the moving parts are drawn again on top. It pauses while off screen or in a
// background tab, and draws one still frame when reduced motion is requested.
//
// Hard geometry, like the rest of the system: squares and straight rules, every state switches hard, nothing
// fades. The colours are solid tints of the section's own background, never transparency.
//
// The same file lives in both BIC/REC sites (the club site and the results site). Keep the two copies identical.

const TONES = {
  // Bone stepped towards ink, for bone sections.
  bone: { ground: '#EDE6D8', link: '#D7D1C4', node: '#C8C2B6', packet: '#9F998F', label: '#807C73', block: '#D9A441' },
  // Ink stepped towards bone, for ink sections.
  ink: { ground: '#14110E', link: '#2A2622', node: '#3B3732', packet: '#625E57', label: '#807C73', block: '#D9A441' },
}

const GENESIS = Date.UTC(2025, 7, 1) // the club's first block, as in the club site footer's block clock
const BLOCK_TIME = 12_000

const FRAME_MS = 1000 / 24
const NODE = 14 // block size, px
const PACKET = 6 // transaction size, px
const RULE = 2 // the system's thinnest rule
const DENSITY = 0.42 // share of grid points holding a block
const SPEED = 0.07 // px per ms for a transaction in flight
const MINE_MS = 900 // the hash churns this long before the block seals
const HOP_MS = 560 // one link of a broadcast
const HOLD_MS = 1600 // the sealed block and its peers stay lit this long after the last hop
const HOPS = 2
const MAX_EVENTS = 3
const HEX = '0123456789abcdef'
const LABEL_FONT = '500 11px "IBM Plex Mono", ui-monospace, Menlo, Consolas, monospace'

const EVENT_MS = MINE_MS + HOPS * HOP_MS + HOLD_MS

// Small seeded generator, so a given size always lays out the same field.
function seeded(seed) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function buildField(width, height) {
  const cell = width < 640 ? 92 : 128
  const cols = Math.floor(width / cell) + 2
  const rows = Math.floor(height / cell) + 2
  const left = Math.round((width - (cols - 1) * cell) / 2)
  const top = Math.round((height - (rows - 1) * cell) / 2)
  const rand = seeded(cols * 7919 + rows * 104729)

  const grid = new Map()
  const nodes = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (rand() >= DENSITY) continue
      const node = { id: nodes.length, x: left + c * cell, y: top + r * cell, links: [] }
      nodes.push(node)
      grid.set(`${c},${r}`, node)
    }
  }

  // Each block links to the next block along its row and down its column, if one is near enough.
  const links = []
  const join = (a, b) => {
    const link = { a, b, length: Math.abs(a.x - b.x) + Math.abs(a.y - b.y) }
    links.push(link)
    a.links.push({ to: b, link })
    b.links.push({ to: a, link })
  }
  for (const [key, node] of grid) {
    const [c, r] = key.split(',').map(Number)
    for (const [dc, dr] of [[1, 0], [0, 1]]) {
      for (let step = 1; step <= 2; step++) {
        const next = grid.get(`${c + dc * step},${r + dr * step}`)
        if (next) {
          if (rand() < 0.8) join(node, next)
          break
        }
      }
    }
  }

  return { nodes: nodes.filter((node) => node.links.length > 0), links }
}

function churn(id, now) {
  const tick = Math.floor(now / 70)
  const pick = (i) => HEX[(Math.imul(id + 1, 2654435761) + tick * 40503 + i * 97) >>> 0 & 15]
  return `0x${pick(1)}${pick(2)}${pick(3)}…${pick(4)}${pick(5)}${pick(6)}`
}

const chainHeight = (now) => Math.max(0, Math.floor((now - GENESIS) / BLOCK_TIME))

const LABEL_WIDTH = 160 // room a block's readout needs beside it

// Elements that make a spot busy: anything carrying its own text, and controls.
const BUSY_TAGS = new Set(['A', 'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT', 'LABEL', 'IMG', 'SVG', 'VIDEO', 'CANVAS'])
const hasOwnText = (el) => Array.from(el.childNodes).some((n) => n.nodeType === 3 && n.textContent.trim())

const isOpaque = (style) => {
  const bg = style.backgroundColor
  return Boolean(bg) && bg !== 'transparent' && !bg.endsWith(', 0)')
}

// Does any ruled edge of `el` (a section divider, a ledger row, a boxed list) cross `box`?
function crossesRule(el, style, box) {
  const r = el.getBoundingClientRect()
  const acrossX = r.right >= box.left && r.left <= box.right
  const acrossY = r.bottom >= box.top && r.top <= box.bottom
  const inY = (y) => y >= box.top && y <= box.bottom
  const inX = (x) => x >= box.left && x <= box.right
  return (
    (parseFloat(style.borderTopWidth) > 0 && acrossX && inY(r.top)) ||
    (parseFloat(style.borderBottomWidth) > 0 && acrossX && inY(r.bottom)) ||
    (parseFloat(style.borderLeftWidth) > 0 && acrossY && inX(r.left)) ||
    (parseFloat(style.borderRightWidth) > 0 && acrossY && inX(r.right))
  )
}

// Starts the field on `canvas` and returns a function that stops it. `tone` is the section it sits on;
// `animate: false` draws a single still frame.
export function startChainField(canvas, { tone = 'bone', animate = true } = {}) {
  const colors = TONES[tone] ?? TONES.bone
  const ctx = canvas.getContext('2d')
  if (!ctx) return () => {}

  const layer = document.createElement('canvas')
  const layerCtx = layer.getContext('2d')

  let width = 0
  let height = 0
  let field = { nodes: [], links: [] }
  let packets = []
  let events = []
  const busy = new Set()
  let nextEventAt = 0
  let tip = chainHeight(Date.now()) // the last block number handed out
  let frame = 0
  let last = 0
  let inView = true
  let resizeTimer = 0
  let dpr = 1
  // Patches drawn over the resting field last frame, as [x, y, w, h] in CSS px: next frame copies just these back.
  let dirty = []

  function nextHeight() {
    tip = Math.max(tip + 1, chainHeight(Date.now()))
    return tip
  }

  function setUp() {
    const rect = canvas.getBoundingClientRect()
    width = Math.round(rect.width)
    height = Math.round(rect.height)
    if (!width || !height) return false

    dpr = Math.min(window.devicePixelRatio || 1, 2)
    for (const c of [canvas, layer]) {
      c.width = Math.round(width * dpr)
      c.height = Math.round(height * dpr)
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    layerCtx.setTransform(dpr, 0, 0, dpr, 0, 0)

    field = buildField(width, height)
    drawRestingField()
    ctx.drawImage(layer, 0, 0, width, height)
    dirty = []

    busy.clear()
    events = []
    const count = Math.max(4, Math.round(field.links.length / 6))
    packets = Array.from({ length: Math.min(count, field.links.length) }, () => launchPacket(performance.now(), true))
    nextEventAt = performance.now() + 500
    return true
  }

  function drawRestingField() {
    const g = layerCtx
    g.fillStyle = colors.ground
    g.fillRect(0, 0, width, height)
    g.lineWidth = RULE
    g.strokeStyle = colors.link
    g.beginPath()
    for (const { a, b } of field.links) {
      g.moveTo(a.x, a.y)
      g.lineTo(b.x, b.y)
    }
    g.stroke()
    for (const node of field.nodes) block(g, node, colors.ground, colors.node)
  }

  function mark(x, y, w, h) {
    dirty.push([x, y, w, h])
  }

  function restore(patches) {
    for (const [px, py, pw, ph] of patches) {
      const x = Math.max(0, Math.floor(px) - 1)
      const y = Math.max(0, Math.floor(py) - 1)
      const w = Math.min(width, Math.ceil(px + pw) + 1) - x
      const h = Math.min(height, Math.ceil(py + ph) + 1) - y
      if (w > 0 && h > 0) ctx.drawImage(layer, x * dpr, y * dpr, w * dpr, h * dpr, x, y, w, h)
    }
  }

  function block(g, node, fill, stroke) {
    const x = node.x - NODE / 2
    const y = node.y - NODE / 2
    if (g === ctx) mark(x - RULE, y - RULE, NODE + RULE * 2, NODE + RULE * 2)
    g.fillStyle = fill
    g.fillRect(x, y, NODE, NODE)
    g.lineWidth = RULE
    g.strokeStyle = stroke
    g.strokeRect(x, y, NODE, NODE)
  }

  function square(x, y, size, color) {
    const left = Math.round(x - size / 2)
    const top = Math.round(y - size / 2)
    mark(left, top, size, size)
    ctx.fillStyle = color
    ctx.fillRect(left, top, size, size)
  }

  function label(node, text) {
    ctx.font = LABEL_FONT
    const w = Math.ceil(ctx.measureText(text).width)
    const pad = 4
    let x = node.x + NODE / 2 + 8
    if (x + w + pad > width - 8) x = node.x - NODE / 2 - 8 - w
    const y = node.y
    mark(x - pad, y - 9, w + pad * 2, 17)
    ctx.fillStyle = colors.ground
    ctx.fillRect(x - pad, y - 9, w + pad * 2, 17)
    ctx.fillStyle = colors.label
    ctx.textBaseline = 'middle'
    ctx.fillText(text, x, y + 0.5)
  }

  // A transaction heading down one link. `scatter` starts it part-way along, so the field doesn't open with every
  // packet leaving a block at once.
  function launchPacket(now, scatter = false, from = null, came = null) {
    let node = from
    let options = node ? node.links.filter((l) => l.link !== came) : []
    if (!node || options.length === 0) {
      if (node) options = node.links
      else {
        const link = field.links[Math.floor(Math.random() * field.links.length)]
        node = Math.random() < 0.5 ? link.a : link.b
        options = node.links
      }
    }
    const { to, link } = options[Math.floor(Math.random() * options.length)]
    const duration = link.length / SPEED
    return { from: node, to, link, start: now - (scatter ? Math.random() * duration : 0), duration }
  }

  // Is this stretch of the page empty enough to mine a block in? The field sits behind the page, so a block
  // mined under a paragraph or a panel would be hidden or read as part of the content. Looks at what is on top
  // across the block and its readout, and at every element above that, for text, controls, opaque boxes and
  // ruled edges running through.
  function isClear(node, withLabel) {
    const rect = canvas.getBoundingClientRect()
    const right = node.x + NODE / 2 + 8 + LABEL_WIDTH <= width - 8
    const room = withLabel ? 8 + LABEL_WIDTH : 12
    const x0 = right || !withLabel ? node.x - NODE / 2 - (withLabel ? 0 : 12) : node.x - NODE / 2 - room
    const x1 = right || !withLabel ? node.x + NODE / 2 + room : node.x + NODE / 2
    const box = {
      left: rect.left + x0 - 8,
      right: rect.left + x1 + 8,
      top: rect.top + node.y - 16,
      bottom: rect.top + node.y + 16,
    }
    if (box.left < 0 || box.top < 0 || box.right > window.innerWidth || box.bottom > window.innerHeight) return false

    const root = canvas.parentElement
    const checked = new Set()
    for (const fx of [0.02, 0.35, 0.68, 0.98]) {
      for (const fy of [0.1, 0.5, 0.9]) {
        const el = document.elementFromPoint(box.left + (box.right - box.left) * fx, box.top + (box.bottom - box.top) * fy)
        if (!el) return false
        if (BUSY_TAGS.has(el.tagName.toUpperCase()) || hasOwnText(el)) return false
        for (let n = el; n && n !== root && n !== document.body && n !== document.documentElement; n = n.parentElement) {
          if (checked.has(n)) continue
          checked.add(n)
          const style = getComputedStyle(n)
          if (isOpaque(style) || crossesRule(n, style, box)) return false
        }
      }
    }
    return true
  }

  function mine(now, checkClear = true) {
    const margin = 48
    const candidates = field.nodes.filter(
      (n) =>
        n.links.length >= 2 &&
        !busy.has(n) &&
        n.x > margin &&
        n.x < width - margin &&
        n.y > margin &&
        n.y < height - margin,
    )
    // Try spots at random: first for a block with its readout, then (on a crowded page, like most pages on a
    // phone) for the block alone. If nothing is clear, skip this block rather than mine it under the page.
    let origin = null
    let labelled = true
    for (const withLabel of [true, false]) {
      const pool = candidates.slice()
      for (let attempt = 0; attempt < 12 && pool.length; attempt++) {
        const pick = pool.splice(Math.floor(Math.random() * pool.length), 1)[0]
        if (!checkClear || isClear(pick, withLabel)) {
          origin = pick
          labelled = withLabel
          break
        }
      }
      if (origin) break
    }
    if (!origin) return null

    const seen = new Set([origin])
    const hops = []
    let frontier = [origin]
    for (let h = 0; h < HOPS; h++) {
      const hop = []
      const next = []
      for (const from of frontier) {
        for (const { to } of from.links) {
          if (seen.has(to)) continue
          seen.add(to)
          hop.push({ from, to })
          next.push(to)
        }
      }
      hops.push(hop)
      frontier = next
    }
    for (const node of seen) busy.add(node)
    return { origin, start: now, height: nextHeight(), hops, nodes: seen, labelled }
  }

  function step(now) {
    for (let i = 0; i < packets.length; i++) {
      const p = packets[i]
      if (now - p.start >= p.duration) packets[i] = launchPacket(p.start + p.duration, false, p.to, p.link)
    }

    events = events.filter((ev) => {
      if (now - ev.start < EVENT_MS) return true
      for (const node of ev.nodes) busy.delete(node)
      return false
    })

    if (now >= nextEventAt && events.length < MAX_EVENTS) {
      const ev = mine(now)
      if (ev) events.push(ev)
      nextEventAt = now + 1500 + Math.random() * 1000
    }
  }

  function draw(now) {
    const previous = dirty
    dirty = []
    restore(previous)

    for (const p of packets) {
      const k = Math.min(1, (now - p.start) / p.duration)
      square(p.from.x + (p.to.x - p.from.x) * k, p.from.y + (p.to.y - p.from.y) * k, PACKET, colors.packet)
    }

    for (const ev of events) {
      const t = now - ev.start
      if (t < MINE_MS) {
        block(ctx, ev.origin, colors.ground, colors.packet)
        if (ev.labelled) label(ev.origin, `mining · ${churn(ev.origin.id, now)}`)
        continue
      }

      // The broadcast: a packet crosses each link of a hop, the link it crossed stays marked, and each peer it
      // reaches fills in until the block's round is over.
      ctx.lineWidth = RULE
      ctx.strokeStyle = colors.node
      ev.hops.forEach((hop, i) => {
        const k = (t - MINE_MS - i * HOP_MS) / HOP_MS
        if (k < 0) return
        ctx.beginPath()
        for (const { from, to } of hop) {
          const e = Math.min(k, 1)
          const x = from.x + (to.x - from.x) * e
          const y = from.y + (to.y - from.y) * e
          mark(Math.min(from.x, x) - RULE, Math.min(from.y, y) - RULE, Math.abs(x - from.x) + RULE * 2, Math.abs(y - from.y) + RULE * 2)
          ctx.moveTo(from.x, from.y)
          ctx.lineTo(x, y)
        }
        ctx.stroke()
        for (const { from, to } of hop) {
          if (k >= 1) block(ctx, to, colors.node, colors.node)
          else square(from.x + (to.x - from.x) * k, from.y + (to.y - from.y) * k, PACKET, colors.block)
        }
      })
      block(ctx, ev.origin, colors.block, colors.packet)
      if (ev.labelled) label(ev.origin, `block #${ev.height} · sealed`)
    }
  }

  // Coming back from a background tab or from off screen: carry on from where it stopped rather than replaying
  // (or skipping) everything that would have happened meanwhile.
  function resume(gap) {
    for (const p of packets) p.start += gap
    for (const ev of events) ev.start += gap
    nextEventAt += gap
  }

  function tick(now) {
    frame = requestAnimationFrame(tick)
    if (now - last < FRAME_MS) return
    if (last && now - last > 500) resume(now - last - FRAME_MS)
    last = now
    step(now)
    draw(now)
  }

  function play() {
    if (frame || !animate || !inView || document.hidden || !width) return
    frame = requestAnimationFrame(tick)
  }

  function pause() {
    cancelAnimationFrame(frame)
    frame = 0
  }

  function still() {
    // One block sealed and heard by its peers, held: the field at rest still says what it is.
    const now = performance.now()
    events = []
    const ev = mine(now)
    if (ev) {
      ev.start = now - (MINE_MS + HOPS * HOP_MS + 1)
      events.push(ev)
    }
    packets = []
    draw(now)
  }

  function render() {
    pause()
    last = 0
    if (!setUp()) return
    if (animate) {
      draw(performance.now())
      play()
    } else {
      still()
    }
  }

  // Only a real change of size lays the field out again (the observer also fires once on start).
  const resizer = new ResizeObserver(() => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => {
      const rect = canvas.getBoundingClientRect()
      if (Math.round(rect.width) !== width || Math.round(rect.height) !== height) render()
    }, 150)
  })
  resizer.observe(canvas)

  const watcher = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting
    if (inView) play()
    else pause()
  })
  watcher.observe(canvas)

  const onVisibility = () => (document.hidden ? pause() : play())
  document.addEventListener('visibilitychange', onVisibility)

  render()

  return () => {
    pause()
    clearTimeout(resizeTimer)
    resizer.disconnect()
    watcher.disconnect()
    document.removeEventListener('visibilitychange', onVisibility)
  }
}
