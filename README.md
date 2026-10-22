# Hazy Glow Games

Vite + TypeScript site with a full-viewport Kaji Canvas2D background.
The bundled Hazy Glow animation loops silently at 25% brightness, with centered
cover scaling. Reduced-motion preferences show a still frame. Its image and atlas
in `public/assets/images` come from Kaji 0.0.108; no audio asset is loaded.

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

## GitHub Pages

The workflow builds and deploys `dist/` when changes land on `main`.
Pages is configured to use **GitHub Actions**, and the repository Actions secret
`GH_PACKAGES_AUTH_TOKEN` provides access to the Kaji package. When rotating that
token, retain `read:packages` access. The custom domain is `hazyglow.games`, with
HTTPS enforced.

`public/CNAME` preserves the custom domain and is copied into the build output.
Vite's default root base matches this repository's root/custom-domain hosting.
