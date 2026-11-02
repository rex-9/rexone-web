# RexOne Web: Production Deployment Guide

> **Target Platform:** Coolify + Nginx on Contabo VPS
> **Container:** Multi-stage Dockerfile (`node:22-alpine` build + `nginx:alpine` runtime)
> **Port:** 80 (Internal) / 443 (Traefik SSL edge)
> **Master Infrastructure Guide:** For complete VPS hardening, `/etc/docker/daemon.json` build cache protection, and automated maintenance cron, see **[RexOne Core: Production Deployment Guide](https://github.com/rex-9/rexone-core/blob/dev/docs/DEPLOYMENT.md)**.

---

## 1. Production Architecture

The web application is packaged into a high-performance, minimal static container using `nginx:alpine`:

- Static React Web assets are served directly from `/usr/share/nginx/html`.
- SPA deep links fallback cleanly to `/index.html` via `try_files $uri $uri/ /index.html;`.
- Static assets (`.js`, `.css`, fonts, images) are compressed with `gzip` and cached for 1 year with immutable cache headers.
- Total memory footprint: **~15MB RAM** (versus 300MB+ for Node.js development server).

---

## 2. Coolify Deployment Steps

1. In Coolify, navigate to your **`prod-rexone`** (or `uat-rexone`) Project.
2. Click **New Resource** → **Docker Compose Application** (or Git Repository).
3. Set the repository URL to `rexone-web` and branch to `main` (or `dev` for UAT).
4. Compose File Path: `docker-compose.yaml`.
5. Under **Environment Variables**, provide the build arguments:

| Variable                            | Production Value (e.g. RexOne) | UAT Value                   | Demo Value                   | Dev Value                   |
| :---------------------------------- | :----------------------------- | :-------------------------- | :--------------------------- | :-------------------------- |
| `WEB_CONTAINER_NAME`                | `prod-rexone-web`              | `uat-rexone-web`            | `demo-rexone-web`            | `dev-rexone-web`            |
| `DOCKER_NETWORK`                    | `prod-rexone-net`              | `uat-rexone-net`            | `demo-rexone-net`            | `dev-rexone-net`            |
| `VITE_REACT_APP_NAME`               | `rexone.me`                    | `uat.rexone.me`             | `rexone.rex9.me`             | `dev.rexone.me`             |
| `VITE_REACT_APP_SERVER_BASE_URL`    | `https://api.rexone.me`        | `https://uat.api.rexone.me` | `https://api.rexone.rex9.me` | `https://dev.api.rexone.me` |
| `VITE_REACT_APP_CLIENT_BASE_URL`    | `https://rexone.me`            | `https://uat.rexone.me`     | `https://rexone.rex9.me`     | `https://dev.rexone.me`     |
| `VITE_REACT_APP_SERVER_WS_BASE_URL` | `wss://api.rexone.me`          | `wss://uat.api.rexone.me`   | `wss://api.rexone.rex9.me`   | `wss://dev.api.rexone.me`   |
| `VITE_REACT_APP_GOOGLE_CLIENT_ID`   | `<Google_Client_ID>`           | `<Google_Client_ID>`        | `<Google_Client_ID>`         | `<Google_Client_ID>`        |

6. In the Traefik Domains section, assign your domain:
   - Production: `https://rexone.me` (or `<product>.<tld>`)
   - UAT: `https://uat.rexone.me` (or `https://uat.<product>.<tld>`)
   - Dev: `https://dev.rexone.me` (or `https://dev.<product>.<tld>`)
   - Demo: `https://rexone.rex9.me`

---

## 3. Alternative: Coolify Static Site Deployment

Coolify also supports deploying `rexone-web` directly as a **Static Application**:

- Build Pack: `Nixpacks` or `Static`
- Build Command: `npm run build`
- Publish Directory: `dist`
- SPA Mode: Enable SPA checkbox in Coolify settings.

---

## 4. Local Production Smoke Testing

Before deploying to Coolify or creating release tags, verify the exact production Docker image and Nginx configuration locally:

```bash
# Full production multi-stage build + Nginx container test (port 8080):
./scripts/test_prod.sh
# (or via npm:)
npm run test:prod

# Custom port:
./scripts/test_prod.sh -p 8081

# Lightweight Vite preview without Docker:
./scripts/test_prod.sh --preview
```

This verifies:
1. **TypeScript & Bundling**: Strict type check (`tsc -b`) and asset minification pass without errors.
2. **Nginx SPA Fallback**: Deep links (e.g. `http://localhost:8080/privacy`) resolve to `index.html` without returning 404s.
3. **Container Healthcheck**: `http://localhost:8080/health` responds with HTTP 200.
4. **Headers & Compression**: Gzip compression and security headers are active.

