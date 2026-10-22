# Hazy Glow Games

Vite + TypeScript site with a full-viewport Kaji Canvas2D background.

## Development

Use Node 22.12+ and Yarn 4 (pinned in `package.json`):

```sh
corepack enable
export GH_PACKAGES_AUTH_TOKEN=your_github_packages_read_token
yarn install
yarn dev
```

Kaji is a private GitHub package. The token needs `read:packages` and access to
`@hazy-glow-games/kaji`; keep it in your shell environment, never in source files.
If your system still resolves Yarn Classic, use `corepack yarn` in place of `yarn`.

```sh
yarn typecheck
yarn build
yarn preview
```

## Creative coding

Edit `src/background.ts`. Its scene returns Kaji drawing commands each frame;
`state.now` is animation time in milliseconds, and `state.camera` provides the
current drawing dimensions. The logical width is 1000 units and height follows
the viewport aspect ratio. Add lines, circles, polygons, or other Kaji renderables
inside the scene's render hook. Browser setup lives in `src/main.ts`.

The canvas stays fixed behind the page, fills the viewport on resize, and lets
pointer and keyboard input reach page content. Animation stops in hidden tabs;
reduced-motion preferences produce a still frame, including after resizing.

## GitHub Pages

The workflow builds and deploys `dist/` when changes land on `main`.
Pages is configured to use **GitHub Actions**, and the repository Actions secret
`GH_PACKAGES_AUTH_TOKEN` provides access to the Kaji package. When rotating that
token, retain `read:packages` access. The custom domain is `hazyglow.games`, with
HTTPS enforced.

`public/CNAME` preserves the custom domain and is copied into the build output.
Vite's default root base matches this repository's root/custom-domain hosting.
