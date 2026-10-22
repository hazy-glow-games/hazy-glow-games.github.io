import type { RenderPlugin, Scene } from '@hazy-glow-games/kaji/2d'

// Inspired by https://beta.dwitter.net/d/36406 and https://beta.dwitter.net/d/36458
const terrain = {
  farDepth: 18,
  depthStep: 0.25,
  speed: 5,
  perspective: 2000,
  heightScale: 400,
  horizonY: -5, // Render pixels from the top; negative moves the horizon offscreen.
}
const ribbon = { speed: 0.6, width: 0.12, strength: 0.9 }
const colors = {
  sky: '#0c101b',
  hills: {
    hue: 185,
    saturation: [65, 40], // [near, far], in percent.
    lightness: [0, 20],
  },
  ribbon: {
    halo: '#2382ff',
    core: '#b4e1ff',
    haloOpacity: 0.35,
    coreOpacity: 1,
  },
} as const

// Fixed projection: wider windows reveal more terrain instead of stretching it.
const referenceWidth = 128
const scale = referenceWidth / 1926
const farthestDepth = terrain.farDepth - terrain.depthStep
const horizonOffset = terrain.horizonY - scale * terrain.perspective / farthestDepth

const mix = ([near, far]: readonly [number, number], distance: number) => near + (far - near) * distance

function hillColor(depth: number) {
  const { hue, saturation, lightness } = colors.hills
  const distance = depth / terrain.farDepth
  return `hsl(${hue}, ${mix(saturation, distance)}%, ${mix(lightness, distance)}%)`
}

function sampleHeight(x: number, z: number) {
  return Math.sin(x) + Math.cos(z) + Math.cos(x * 2 + z)
}

function sampleGlow(x: number, z: number, seconds: number) {
  const phase = seconds * ribbon.speed
  let distortion = 0
  for (let frequency = 1; frequency <= 32; frequency *= 2) {
    distortion += Math.sin(x * frequency + phase + Math.sin(z * frequency - phase)) / frequency
  }
  const field = (x + distortion) / ribbon.width
  return ribbon.strength / (1 + field * field)
}

export function createBackground(elapsedSeconds = 0): Scene {
  const landscape: RenderPlugin = (state, { render }) => {
    const { width, height } = state.camera
    const seconds = elapsedSeconds + state.now / 1000
    const renderables = [render.fillRect({ x: 0, y: 0, width, height }, colors.sky)]
    const strip = (x: number, y: number, length: number, color: string, opacity = 1) => {
      renderables.push(render.fillRect(
        { x, y, width: 1, height: Math.min(length, height - y) }, color, { opacity },
      ))
    }

    // Draw far to near, so foreground hills cover both terrain and light behind them.
    for (let depth = farthestDepth; depth > 0; depth -= terrain.depthStep) {
      const z = depth + seconds * terrain.speed
      const color = hillColor(depth)
      const capHeight = Math.max(1, Math.round(scale * 24 / depth))

      for (let column = 0; column < width; column++) {
        const x = (column - width / 2) * 2 / referenceWidth * depth
        const wave = sampleHeight(x, z)
        const y = Math.floor(horizonOffset + scale * (terrain.perspective + wave ** 2 * terrain.heightScale) / depth)
        if (y >= height) continue

        strip(column, y, height - y, color)
        const glow = sampleGlow(x, z, seconds)
        if (glow < 0.02) continue
        strip(column, y, capHeight * 3, colors.ribbon.halo, glow * colors.ribbon.haloOpacity)
        strip(column, y, capHeight, colors.ribbon.core, glow * colors.ribbon.coreOpacity)
      }
    }
    return { renderables }
  }

  return {
    id: 'background', assets: {}, input: [], things: [],
    plugins: { render: { map: { after: [landscape] } } },
  }
}
