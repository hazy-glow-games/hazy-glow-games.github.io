# Hazy Glow Games

A small static landing page for Hazy Glow Games.

Live site: https://hazy-glow-games.github.io/

## Edit and preview

Edit `index.html` and `styles.css`. The page includes the name, a short description, the Thorge itch.io widget, and a GitHub link. No local JavaScript, dependencies, analytics, or build step.

From this folder, run `python3 -m http.server 8000 --bind 127.0.0.1` and open http://127.0.0.1:8000/.

## Publish

GitHub repository **Settings → Pages → Deploy from a branch → main → / (root)**. Commits on `main` publish through GitHub's built-in Pages deployment. `.nojekyll` keeps these static files unchanged. The repository contains only material intended for public access.

## Connect tomodachi.games later

The custom domain has not been configured. When ready:

1. In organization **Settings → Pages**, add and verify `tomodachi.games` using GitHub's generated TXT record. Keep that verification record.
2. In this repository's **Settings → Pages → Custom domain**, save `tomodachi.games` **before** pointing DNS at Pages. GitHub adds `CNAME` to the publishing branch; pull that commit before your next edit.
3. At your DNS provider, set apex (`@`) **A** records to all four addresses below. Replace conflicting apex web records only; preserve unrelated mail and verification records. Alternatively, use an apex ALIAS/ANAME pointing to `tomodachi-games.github.io` if supported.

   ```text
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```

4. Recommended: set `www` **CNAME** to `tomodachi-games.github.io` (no scheme or path). GitHub redirects `www` to the selected apex domain. Do not use wildcard records.
5. Allow DNS and certificate provisioning to complete (up to 24 hours), then enable **Enforce HTTPS** in repository Pages settings. Check both `https://tomodachi.games` and `https://www.tomodachi.games` and confirm the page and styles load.

Verify apex records with `dig tomodachi.games A +short` and the optional alias with `dig www.tomodachi.games CNAME +short`.

Official GitHub instructions, checked 2026-10-07: [branch publishing](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site), [domain verification](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages), and [custom domain / DNS](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site). Recheck the DNS documentation when connecting the domain.
