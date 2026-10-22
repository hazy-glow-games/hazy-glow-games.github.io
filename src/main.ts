import { makeGame } from '@hazy-glow-games/kaji/2d'
import { getCanvas2DRenderer } from '@hazy-glow-games/kaji/hosts/renderers/canvas2d'
import { createBackground } from './background'
import './styles.css'

const canvas = document.querySelector<HTMLCanvasElement>('#background')!
canvas.tabIndex = -1
canvas.style.position = 'fixed'

const { host } = getCanvas2DRenderer({ canvas, renderMode: 'pixel', pixelRatio: 1 })
const game = await makeGame(
  [createBackground()],
  { id: 'loading', assets: {}, input: [], things: [], plugins: {} },
  { host, width: 64, height: 64 },
)
const motion = matchMedia('(prefers-reduced-motion: reduce)')
const listeners = new AbortController()
const { signal } = listeners
let ready = false
let pageVisible = true

function update() {
  game.stop()
  if (!ready || document.hidden || !pageVisible || signal.aborted) return
  if (motion.matches) game.step(0)
  else game.start()
}

motion.addEventListener('change', update, { signal })
document.addEventListener('visibilitychange', update, { signal })
window.addEventListener('pageshow', () => {
  pageVisible = true
  update()
}, { signal })
window.addEventListener('pagehide', (event) => {
  pageVisible = false
  game.stop()
  if (!event.persisted) {
    listeners.abort()
    void game.destroy().catch(console.error)
  }
}, { signal })

await game.ready()
ready = true
update()
