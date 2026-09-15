// scripts/capture_walkthrough.mjs
import { chromium } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CORE_WALKTHROUGH_DIR = path.resolve(__dirname, '../../rexone-core/docs/images/walkthrough');

async function run() {
  console.log('🚀 Starting screenshot capture engine in Browser Dark Mode...');
  console.log('Target output directory:', CORE_WALKTHROUGH_DIR);

  // 1. Authenticate via Core API
  console.log('🔑 Authenticating with Core API on http://localhost:3000/signin as super@admin.com...');
  const signinRes = await fetch('http://localhost:3000/signin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user: {
        signin_key: 'super@admin.com',
        password: '111111',
      },
    }),
  });

  if (!signinRes.ok) {
    throw new Error(`Sign in failed with status ${signinRes.status}`);
  }

  const signinData = await signinRes.json();
  const { user, token } = signinData.data;
  console.log('✅ Authenticated successfully! User ID:', user.id, 'Email:', user.email);

  const browser = await chromium.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  });

  // 2. Capture Web App in Dark Mode (localhost:4000)
  const webContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    colorScheme: 'dark',
  });

  // Inject session state & dark mode theme before any page script executes
  await webContext.addInitScript(({ token, user }) => {
    localStorage.setItem('token', JSON.stringify(token));
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('theme', JSON.stringify('night'));
    document.documentElement.setAttribute('data-theme', 'night');
    document.documentElement.classList.add('dark');
  }, { token, user });

  const webPage = await webContext.newPage();

  const captureWeb = async (urlPath, outputPath) => {
    console.log(`📸 Capturing Web: http://localhost:4000${urlPath} -> ${outputPath}...`);
    await webPage.goto(`http://localhost:4000${urlPath}`, { waitUntil: 'networkidle' });
    await webPage.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'night');
      document.documentElement.classList.add('dark');
    });
    await webPage.waitForTimeout(1500); // Allow render animations/charts/tables to settle
    console.log(`   URL: ${webPage.url()}`);
    await webPage.screenshot({ path: path.join(CORE_WALKTHROUGH_DIR, outputPath), fullPage: false });
  };

  // AI Workspace
  await captureWeb('/ai', 'ai/ai01-web.png');

  // Profile
  await captureWeb('/profile', 'profile/p01-web.png');

  // Client Admin Pages (All Dashboards)
  await captureWeb('/admin/analytics', 'admin/ad01-web.png');
  await captureWeb('/admin/users', 'admin/ad02-web.png');
  await captureWeb('/admin/roles', 'admin/ad03-web.png');
  await captureWeb('/admin/roles/6aa362b8-ffeb-453e-98bb-0d585c1f5029', 'admin/ad-role-detail-web.png');
  await captureWeb('/admin/products', 'admin/ad04-web.png');
  await captureWeb('/admin/products/bin', 'admin/ad-products-bin-web.png');
  await captureWeb('/admin/accesses', 'admin/ad05-web.png');
  await captureWeb('/admin/notifications', 'admin/ad06-web.png');
  await captureWeb('/admin/versions', 'admin/ad07-web.png');
  await captureWeb('/admin/user-versions', 'admin/ad-user-versions-web.png');
  await captureWeb('/admin/chat/rooms', 'admin/ad08-web.png');
  await captureWeb('/admin/chat/messages', 'admin/ad-chat-messages-web.png');
  await captureWeb('/admin/feedback', 'admin/ad09-web.png');
  await captureWeb('/admin/logs', 'admin/ad-logs-web.png');
  await captureWeb('/admin/transactions', 'admin/ad-transactions-web.png');
  await captureWeb('/admin/subscriptions', 'admin/ad-subscriptions-web.png');
  await captureWeb('/admin/assets', 'admin/ad-assets-web.png');
  await captureWeb('/admin/assets', 'media/m01-web.png');
  await captureWeb('/admin/ai/profiles', 'admin/ad10-web.png');
  await captureWeb('/admin/ai/runs', 'admin/ad11-web.png');

  // Topbar Notification Center Open
  console.log('📸 Capturing Topbar Notification Center Open in Dark Mode...');
  await webPage.goto('http://localhost:4000/admin/analytics', { waitUntil: 'networkidle' });
  await webPage.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'night');
    document.documentElement.classList.add('dark');
  });
  await webPage.waitForTimeout(1500);
  await webPage.evaluate(() => {
    const btn = document.querySelector('header button[aria-label="Notifications"]') ||
                document.querySelector('header button[title="Notifications"]') ||
                document.querySelector('header button:has(svg.lucide-bell)') ||
                Array.from(document.querySelectorAll('header button')).find(b => b.innerHTML.includes('lucide-bell') || b.querySelector('svg'));
    if (btn) btn.click();
  });
  await webPage.waitForTimeout(1500);
  await webPage.screenshot({ path: path.join(CORE_WALKTHROUGH_DIR, 'notifications/n01-web.png'), fullPage: false });
  console.log('   Captured notifications/n01-web.png');

  await webContext.close();

  // 2.5 Capture Auth Flow: Passcode Dialog in Dark Mode (Unauthenticated)
  console.log('📸 Capturing Auth Flow Passcode Dialog in Dark Mode...');
  const unauthContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    colorScheme: 'dark',
  });

  await unauthContext.addInitScript(() => {
    localStorage.setItem('theme', JSON.stringify('night'));
    document.documentElement.setAttribute('data-theme', 'night');
    document.documentElement.classList.add('dark');
  });

  const unauthPage = await unauthContext.newPage();
  await unauthPage.goto('http://localhost:4000/?dialog=auth&step=signin-password&email=super%40admin.com', { waitUntil: 'networkidle' });
  await unauthPage.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'night');
    document.documentElement.classList.add('dark');
  });
  await unauthPage.waitForTimeout(1000);
  // Type 4 digits to show active PIN entry state without triggering 6-digit auto-submit
  await unauthPage.keyboard.type('1111');
  await unauthPage.waitForTimeout(600);
  await unauthPage.screenshot({ path: path.join(CORE_WALKTHROUGH_DIR, 'auth/a02-web.png'), fullPage: false });
  console.log('   Captured auth/a02-web.png');
  await unauthContext.close();

  // 3. Capture Rails Operations Center in Browser Dark Mode (localhost:3000)
  console.log('🔒 Connecting to Rails Operations Center on http://localhost:3000 with HTTP Basic Auth in Rexone Dark Theme...');
  const opsContext = await browser.newContext({
    viewport: { width: 1600, height: 900 },
    deviceScaleFactor: 2,
    colorScheme: 'dark',
    httpCredentials: {
      username: 'superadmin',
      password: '111111',
    },
  });

  const opsPage = await opsContext.newPage();

  const captureOps = async (urlPath, outputPath) => {
    console.log(`📸 Capturing Ops: http://localhost:3000${urlPath} -> ${outputPath}...`);
    try {
      await opsPage.goto(`http://localhost:3000${urlPath}`, { waitUntil: 'networkidle', timeout: 25000 });
      
      // Inject unified Rexone Dark Theme styling with hover glow and custom scrollbars
      await opsPage.addStyleTag({
        content: `
          :root {
            --rex-primary: #FF2238;
            --rex-primary-light: #FF5263;
            --rex-primary-dark: #CC1125;
            --rex-glow: rgba(255, 34, 56, 0.4);
            --rex-bg: #120c11;
            --rex-surface: #180f16;
            --rex-card: #20131d;
            --rex-card-hover: #291825;
            --rex-border: #381928;
            --rex-text: #ffffff;
            --rex-text-muted: #c9b8be;
          }

          body {
            background-color: #120c11 !important;
            color: #ffffff !important;
          }

          /* Administrate styling */
          .app-container, .main-content, .main-content__body {
            background-color: #120c11 !important;
          }
          .navigation {
            background-color: #180f16 !important;
            border-right: 1px solid #381928 !important;
          }
          .navigation__link {
            color: #c9b8be !important;
            border-radius: 0.5rem !important;
            transition: all 0.15s ease !important;
          }
          .navigation__link:hover {
            color: #ffffff !important;
            background: #20131d !important;
            border: 1px solid rgba(255, 34, 56, 0.3) !important;
            transform: translateX(2px) !important;
          }
          .navigation__link--active {
            color: #ffffff !important;
            background: linear-gradient(135deg, rgba(255, 34, 56, 0.22), rgba(204, 17, 37, 0.12)) !important;
            border: 1px solid #FF2238 !important;
            box-shadow: 0 0 12px rgba(255, 34, 56, 0.25) !important;
          }
          .main-content__header {
            background-color: #180f16 !important;
            border-bottom: 1px solid #381928 !important;
          }
          .table {
            background-color: #180f16 !important;
            border: 1px solid #381928 !important;
            border-radius: 0.75rem !important;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4) !important;
          }
          .table th {
            background-color: #20131d !important;
            color: #c9b8be !important;
            border-bottom: 1px solid #381928 !important;
          }
          .table td {
            background-color: #180f16 !important;
            color: #ffffff !important;
            border-bottom: 1px solid #381928 !important;
          }
          .table tr:hover td {
            background-color: #291825 !important;
          }
          .button, input[type="submit"] {
            background: linear-gradient(135deg, #FF2238, #CC1125) !important;
            color: #ffffff !important;
            border: 1px solid rgba(255, 255, 255, 0.15) !important;
            box-shadow: 0 2px 10px rgba(255, 34, 56, 0.3) !important;
          }
          .button:hover, input[type="submit"]:hover {
            background: linear-gradient(135deg, #FF5263, #FF2238) !important;
            box-shadow: 0 4px 18px rgba(255, 34, 56, 0.5) !important;
          }

          /* Solid Web UI styling */
          .solid-web-ui, [data-color-scheme] {
            background-color: #120c11 !important;
            color: #ffffff !important;
          }
          .swui-page, .swui-page__body {
            background-color: #120c11 !important;
          }
          .swui-page__header {
            background-color: #180f16 !important;
            border-bottom: 1px solid #381928 !important;
          }
          .swui-page__title {
            color: #ffffff !important;
            text-shadow: 0 0 16px rgba(255, 34, 56, 0.25) !important;
          }
          .swui-nav__link {
            color: #c9b8be !important;
            border-radius: 0.5rem !important;
            transition: all 0.18s ease !important;
          }
          .swui-nav__link:hover {
            color: #ffffff !important;
            background: #20131d !important;
            border: 1px solid rgba(255, 34, 56, 0.3) !important;
          }
          .swui-nav__link--active {
            color: #ffffff !important;
            background: linear-gradient(135deg, rgba(255, 34, 56, 0.22), rgba(204, 17, 37, 0.12)) !important;
            border: 1px solid #FF2238 !important;
            box-shadow: 0 0 12px rgba(255, 34, 56, 0.25) !important;
          }
          .swui-card, .swui-stat-card, .swui-chart-card {
            background-color: #180f16 !important;
            border: 1px solid #381928 !important;
            border-radius: 0.75rem !important;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4) !important;
            transition: all 0.2s ease !important;
          }
          .swui-card:hover, .swui-stat-card:hover {
            border-color: rgba(255, 34, 56, 0.45) !important;
            box-shadow: 0 6px 24px rgba(255, 34, 56, 0.18) !important;
          }
          .swui-table {
            background-color: #180f16 !important;
            border: 1px solid #381928 !important;
          }
          .swui-table th {
            background-color: #20131d !important;
            color: #c9b8be !important;
            border-bottom: 1px solid #381928 !important;
          }
          .swui-table td {
            background-color: #180f16 !important;
            color: #ffffff !important;
            border-bottom: 1px solid #381928 !important;
          }
          .swui-table tr:hover td {
            background-color: #291825 !important;
          }
          .swui-badge--success {
            background: rgba(16, 185, 129, 0.18) !important;
            color: #34D399 !important;
            border: 1px solid rgba(16, 185, 129, 0.35) !important;
          }
          .swui-badge--failed, .swui-badge--error {
            background: rgba(255, 34, 56, 0.18) !important;
            color: #FF5263 !important;
            border: 1px solid rgba(255, 34, 56, 0.35) !important;
          }
          .swui-refresh-bar {
            background-color: #180f16 !important;
            border: 1px solid #381928 !important;
            color: #c9b8be !important;
          }

          /* Swagger UI */
          body, .swagger-ui { background-color: #120c11 !important; color: #e0e0e0 !important; }
          .swagger-ui .topbar { background-color: #180f16 !important; border-bottom: 1px solid #381928 !important; }
          .swagger-ui .info .title, .swagger-ui .info p, .swagger-ui .opblock-tag, .swagger-ui .opblock-summary-description { color: #e0e0e0 !important; }
          .swagger-ui select, .swagger-ui input { background-color: #1e131d !important; color: #fff !important; border-color: #381928 !important; }
          .swagger-ui .scheme-container { background-color: #180f16 !important; box-shadow: none !important; border-bottom: 1px solid #381928 !important; }
          .swagger-ui section.models { border: 1px solid #381928 !important; background-color: #180f16 !important; }
          .swagger-ui section.models.is-open h4 { border-bottom: 1px solid #381928 !important; }
        `,
      });

      await opsPage.waitForTimeout(2000);
      await opsPage.screenshot({ path: path.join(CORE_WALKTHROUGH_DIR, outputPath), fullPage: false });
    } catch (err) {
      console.error(`❌ Failed capturing ${urlPath}:`, err.message);
    }
  };

  await captureOps('/admin', 'operations/o01-administrate.png');
  await captureOps('/admin/pulse', 'operations/o02-pulse.png');
  await captureOps('/admin/red', 'operations/o03-red.png');
  await captureOps('/admin/queue', 'operations/o04-solid-queue.png');
  await captureOps('/admin/cache', 'operations/o05-solid-cache.png');
  await captureOps('/admin/cable', 'operations/o06-solid-cable.png');
  await captureOps('/api-docs', 'operations/o07-swagger.png');

  await opsContext.close();
  await browser.close();

  // Clean up temporary test file if present
  console.log('🎉 All visual walkthrough captures in dark mode completed successfully!');
}

run().catch((err) => {
  console.error('Fatal error during capture:', err);
  process.exit(1);
});
