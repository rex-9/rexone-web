# Port Configuration Guide

## Port Scheme

Meritbox uses different ports for different environments:

- **Production**: Port `4000`
- **UAT**: Port `4001`
- **Local Development**: Port `4002` (default)

## Configuration

### Local Development (Port 4002)

Default configuration in `.env`:

```bash
PORT=4002
VITE_REACT_APP_CLIENT_BASE_URL=http://localhost:4002
VITE_REACT_APP_PORT_MAP=4002:4002
```

### UAT Environment (Port 4001)

To deploy to UAT, update `.env`:

```bash
NODE_ENV=uat
PORT=4001
VITE_REACT_APP_CLIENT_BASE_URL=https://uat.meritbox.me
VITE_REACT_APP_PORT_MAP=4001:4001
```

### Production Environment (Port 4000)

To deploy to production, update `.env`:

```bash
NODE_ENV=production
PORT=4000
VITE_REACT_APP_CLIENT_BASE_URL=https://meritbox.me
VITE_REACT_APP_PORT_MAP=4000:4000
```

## Running Locally

The app will automatically use port 4002 for local development:

```bash
# Using Docker
sh run_dev.sh

# Or directly with npm/yarn
npm run dev
```

The port is configured in:

- `vite.config.ts` - Reads from `VITE_PORT` or `PORT` env variable
- `docker-compose.dev.yaml` - Uses `VITE_REACT_APP_PORT_MAP`
- `.env` - Contains port configuration

## Port Availability

Ports 4000, 4001, and 4002 are safe to use on macOS and don't conflict with system services.
