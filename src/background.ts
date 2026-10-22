import type { Scene } from '@hazy-glow-games/kaji/2d'
import { hazyglow } from '@hazy-glow-games/kaji/scenes'

export function createBackground(): Scene {
  const splash = hazyglow((state) => ({ state }))

  // Kaji 0.0.108 initializes the animation in its first enter hook;
  // the second hook plays the sound. Keep only the visual lifecycle.
  return {
    id: 'background',
    assets: { images: splash.assets.images, extras: splash.assets.extras },
    input: [],
    things: [],
    plugins: {
      scene: { enter: splash.plugins.scene?.enter?.slice(0, 1) },
      render: {
        things: splash.plugins.render?.things,
        // Omit the splash's fade and completion hooks so it loops forever.
        ui: { during: splash.plugins.render?.ui?.during },
      },
    },
  }
}
