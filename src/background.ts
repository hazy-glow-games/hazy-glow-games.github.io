import type { Scene } from '@hazy-glow-games/kaji/2d'

// Edit this scene to experiment. Coordinates use a 1000-unit-wide viewport;
// Kaji adjusts the camera height to match the browser's aspect ratio.
export const background: Scene = {
  id: 'background',
  assets: {},
  input: [],
  things: [],
  plugins: {
    render: {
      map: {
        during: [
          function clearBg(state, { render: { fillRect } }) {
            const { width, height } = state.camera
            return { renderables: [fillRect({ x: 0, y: 0, width, height }, '#000')] }
          }
        ],
        after: [
          function lines(state, { render: {
            line,
          } }) {
            const { width, height } = state.camera
            const t = state.now / 1000
            const rows = 32
            const segments = 64

            const point = (row: number, segment: number) => {
              const x = segment / segments * width
              const phase = x / width * Math.PI
              return {
                x,
                y: Math.sin(phase * 2 * row + t) +
                  Math.cos(phase * 2 * segment - t)
                  * x / width * Math.PI + 32
              }
            }

            return {
              renderables: [
                ...Array.from({ length: rows }, (_, row) =>
                  Array.from({ length: segments }, (_, segment) => line(
                    point(row, segment),
                    point(row, segment + 1),
                    {
                      color: `hsla(${175 + row * 3}, 70%, 65%, 0.24)`,
                      lineWidth: 0.1,
                    }
                  ))
                ).flat(),
              ]
            }
          }
        ]
      },
    },
  },
}
