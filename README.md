
# Zlexy Website (Static, Netlify)

This repo contains the current Zlexy website. It’s a static site (HTML/CSS/JS) with Netlify forms and no build step.

## Quick start (local preview)

```bash
# macOS / Linux
python3 -m http.server 5173
# Windows (PowerShell)
python -m http.server 5173
```
Then open http://localhost:5173 in your browser.

## Put this into Git (GitHub example)

```bash
# 1) Initialize
git init
git branch -M main

# 2) Optional: set your identity (one-time)
git config user.name "Your Name"
git config user.email "you@example.com"

# 3) First commit
git add .
git commit -m "chore: import current site"

# 4) Create an empty repo on GitHub, then add the remote (choose one):
# SSH:
git remote add origin git@github.com:<your-org-or-user>/zlexy-site.git
# or HTTPS:
# git remote add origin https://github.com/<your-org-or-user>/zlexy-site.git

# 5) Push
git push -u origin main
```

## Connect Netlify to Git (Continuous Deployment)

1. In Netlify, **Add new site → Import from Git** and choose your repo.
2. Build settings:
   - **Base directory:** `.`
   - **Publish directory:** `.`
   - **Build command:** _leave empty_ (no build step for this static site)
3. Deploy Previews: enable for pull requests (recommended).
4. Branch deploys: optional (e.g., `develop` → staging site).

> `netlify.toml` already declares:
> ```toml
> [build]
>   publish = "."
> ```

## Editing guide (what to change where)

- **Home page:** `index.html`
  - Hero: markup in `index.html`; background image at `assets/img/hero-bg.png` (CSS path set relative to CSS).
  - Testimonials / Trusted by layout: `assets/css/main.css` (look for `.testimonial-view`, `.trust` blocks).
- **Styles:** `assets/css/main.css`
- **Scripts:** `assets/js/main.js` (language picker, testimonials controls, price calculator)
- **Logos (Trusted by):** drop into `assets/img/clients/` (PNG/SVG/WEBP etc.).
- **Services pages:** `/translation.html`, `/interpretation.html`, etc.
- **Industries pages:** `/medical-life-sciences.html`, `/legal.html`, etc.
- **Forms:** `contact.html`, `get-a-quote.html` (already Netlify-ready with honeypot + form-name).

## Common gotchas

- **Hero background not visible?** Make sure `assets/img/hero-bg.png` exists and CSS URL is `../img/hero-bg.png` (paths are relative to the CSS file location).
- **Forms not detected?** On first deploy, submit each form once so Netlify lists them under **Forms**.
- **Absolute vs relative URLs:** Use site-root relative (e.g., `/assets/...`) or CSS-relative (`../img/...`) consistently.

## Optional improvements

- Add a staging branch (e.g., `develop`) and enable **Branch deploys** in Netlify.
- Add Prettier/EditorConfig to keep formatting consistent.
- (Later) Migrate to a template engine (Eleventy/Astro) to avoid repeating header/footer across pages.
