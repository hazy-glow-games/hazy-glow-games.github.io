import { makeGame } from '@hazy-glow-games/kaji/2d'
import { getCanvas2DRenderer } from '@hazy-glow-games/kaji/hosts/renderers/canvas2d'
import { background } from './background'
import './styles.css'

const canvas = document.querySelector<HTMLCanvasElement>('#background')!
const motion = matchMedia('(prefers-reduced-motion: reduce)')
const { host } = getCanvas2DRenderer({
  canvas,
  renderMode: 'pixel',
  // pixelRatio: Math.min(devicePixelRatio, 2),
})
// The background must never receive keyboard focus or intercept page input.
canvas.tabIndex = -1
canvas.style.position = 'fixed'

const game = await makeGame(
  [background],
  { id: 'loading', assets: {}, input: [], things: [], plugins: {}, },
  { host, width: 128 },
)
await game.ready()

function syncPlayback() {
  game.stop()
  if (document.hidden) return
  if (motion.matches) game.step(0)
  else game.start()
}

const resize = new ResizeObserver(() => {
  // Let the host update its camera before drawing a still frame.
  if (motion.matches && !document.hidden) requestAnimationFrame(() => game.step(0))
})
resize.observe(canvas)
motion.addEventListener('change', syncPlayback)
document.addEventListener('visibilitychange', syncPlayback)
window.addEventListener('pageshow', syncPlayback)
window.addEventListener('pagehide', (event) => {
  game.stop()
  if (!event.persisted) {
    resize.disconnect()
    motion.removeEventListener('change', syncPlayback)
    document.removeEventListener('visibilitychange', syncPlayback)
    window.removeEventListener('pageshow', syncPlayback)
    void game.destroy()
  }
})
syncPlayback()
