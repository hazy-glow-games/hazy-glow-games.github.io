import { makeGame, type GameAPI } from '@hazy-glow-games/kaji/2d'
import { getCanvas2DRenderer } from '@hazy-glow-games/kaji/hosts/renderers/canvas2d'
import { createBackground } from './background'
import './styles.css'

const pixelSize = 6 // CSS pixels per square render pixel.
const canvas = document.querySelector<HTMLCanvasElement>('#background')!
const motion = matchMedia('(prefers-reduced-motion: reduce)')
const listeners = new AbortController()
const { signal } = listeners
let game: GameAPI | undefined
let elapsedSeconds = 0
let pageVisible = true
let updates = Promise.resolve()
canvas.tabIndex = -1
canvas.style.position = 'fixed'

const inactive = () => document.hidden || !pageVisible || signal.aborted

async function update() {
  const state = game?.stop()
  if (inactive()) return
  const width = Math.max(1, Math.ceil(innerWidth / pixelSize))
  const height = Math.max(1, Math.ceil(innerHeight / pixelSize))

  // Kaji fixes logical width at startup, so resize needs a fresh runtime.
  if (!game || canvas.width !== width || canvas.height !== height) {
    elapsedSeconds += (state?.now ?? 0) / 1000
    const previous = game
    game = undefined
    await previous?.destroy()
    if (signal.aborted) return
    canvas.style.setProperty('--background-width', `${width * pixelSize}px`)
    canvas.style.setProperty('--background-height', `${height * pixelSize}px`)
    const { host } = getCanvas2DRenderer({ canvas, renderMode: 'pixel', pixelRatio: 1 })
    game = await makeGame(
      [createBackground(elapsedSeconds)],
      { id: 'loading', assets: {}, input: [], things: [], plugins: {} },
      { host, width, height },
    )
    await game.ready()
  }
  if (inactive()) return
  if (motion.matches) game.step(0)
  else game.start()
}

function scheduleUpdate() {
  game?.stop()
  updates = updates.then(update).catch(console.error)
}

motion.addEventListener('change', scheduleUpdate, { signal })
document.addEventListener('visibilitychange', scheduleUpdate, { signal })
window.addEventListener('resize', scheduleUpdate, { signal })
window.addEventListener('pageshow', () => {
  pageVisible = true
  scheduleUpdate()
}, { signal })
window.addEventListener('pagehide', (event) => {
  pageVisible = false
  game?.stop()
  if (!event.persisted) {
    listeners.abort()
    void updates.then(() => game?.destroy()).catch(console.error)
  }
}, { signal })
updates = update()
await updates
