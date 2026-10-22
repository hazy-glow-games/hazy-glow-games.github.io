import { makeGame, type GameAPI } from '@hazy-glow-games/kaji/2d'
import { getCanvas2DRenderer } from '@hazy-glow-games/kaji/hosts/renderers/canvas2d'
import { createBackground } from './background'
import './styles.css'

const canvas = document.querySelector<HTMLCanvasElement>('#background')!
const motion = matchMedia('(prefers-reduced-motion: reduce)')
const listeners = new AbortController()
const { signal } = listeners
let game: GameAPI | undefined
let pageVisible = true
let updates = Promise.resolve()
canvas.tabIndex = -1
canvas.style.position = 'fixed'

const inactive = () => document.hidden || !pageVisible || signal.aborted

async function update() {
  game?.stop()
  if (inactive()) return
  const width = 64
  const height = 64

  // The authored scene stays 64×64; CSS covers any viewport.
  if (!game) {
    if (signal.aborted) return
    const { host } = getCanvas2DRenderer({ canvas, renderMode: 'pixel', pixelRatio: 1 })
    game = await makeGame(
      [createBackground()],
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
