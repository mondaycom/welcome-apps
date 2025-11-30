// =============================================================================
// Dashboard HTML Template
// =============================================================================

/**
 * Available endpoints configuration for the dashboard navigation.
 */
export const DASHBOARD_ENDPOINTS = [
  {
    category: "Health & Status",
    items: [
      { path: "/health", label: "Health Check", desc: "Basic health status" },
      { path: "/error", label: "Error Test", desc: "Returns 500 error" },
      { path: "/mongo", label: "MongoDB Health", desc: "Check MongoDB connection" },
    ],
  },
  {
    category: "Debug & Testing",
    items: [
      {
        path: "/super-health",
        label: "Super Health",
        desc: "Comprehensive health + logging test",
      },
      {
        path: "/long?time=5000",
        label: "Long Request (5s)",
        desc: "Timeout testing",
      },
      {
        path: "/networking",
        label: "Networking",
        desc: "External connectivity test",
      },
      {
        path: "/storage-test",
        label: "Storage Test",
        desc: "Full storage API test",
      },
      {
        path: "/storage-test?shortTest=true",
        label: "Storage Test (Short)",
        desc: "Quick storage test",
      },
    ],
  },
];

/**
 * CSS styles for the dashboard.
 */
const DASHBOARD_STYLES = `
  :root {
    --bg-primary: #0f0f0f;
    --bg-secondary: #1a1a1a;
    --bg-card: #242424;
    --accent: #6161ff;
    --accent-hover: #7878ff;
    --success: #00ca72;
    --warning: #fdab3d;
    --text-primary: #ffffff;
    --text-secondary: #9ca3af;
    --border: #333;
  }
  
  * { box-sizing: border-box; margin: 0; padding: 0; }
  
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: var(--bg-primary);
    color: var(--text-primary);
    min-height: 100vh;
    padding: 2rem;
  }
  
  .container { max-width: 1200px; margin: 0 auto; }
  
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid var(--border);
  }
  
  h1 {
    font-size: 1.75rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  
  .logo {
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, var(--accent), #ff6b6b);
    border-radius: 8px;
  }
  
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: var(--bg-card);
    border-radius: 9999px;
    font-size: 0.875rem;
    border: 1px solid var(--border);
  }
  
  .badge-dot {
    width: 8px;
    height: 8px;
    background: var(--success);
    border-radius: 50%;
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  
  .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; }
  
  .card {
    background: var(--bg-card);
    border-radius: 12px;
    padding: 1.5rem;
    border: 1px solid var(--border);
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  
  .card h2 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  .card-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--accent);
  }
  
  .section-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 2rem 0 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--border);
  }
  
  .endpoints-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1rem;
  }
  
  .endpoint-category {
    background: var(--bg-secondary);
    border-radius: 12px;
    padding: 1.25rem;
    border: 1px solid var(--border);
  }
  
  .endpoint-category h3 {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--accent);
    margin-bottom: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  .endpoint-list { display: flex; flex-direction: column; gap: 0.5rem; }
  
  .endpoint-btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text-primary);
    text-decoration: none;
    font-size: 0.875rem;
    transition: all 0.2s;
  }
  
  .endpoint-btn:hover {
    background: var(--accent);
    border-color: var(--accent);
    transform: translateX(4px);
  }
  
  .endpoint-btn .path {
    font-family: 'SF Mono', Monaco, monospace;
    font-weight: 500;
  }
  
  .endpoint-btn .arrow { opacity: 0.5; transition: opacity 0.2s; }
  .endpoint-btn:hover .arrow { opacity: 1; }
  
  .collapsible-section {
    background: var(--bg-card);
    border-radius: 12px;
    margin-top: 1.5rem;
    border: 1px solid var(--border);
    overflow: hidden;
  }
  
  .collapsible-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    cursor: pointer;
    user-select: none;
    background: var(--bg-secondary);
  }
  
  .collapsible-header:hover { background: var(--bg-card); }
  .collapsible-header h3 { font-size: 0.875rem; font-weight: 600; }
  .collapsible-content { display: none; padding: 1rem 1.5rem; max-height: 400px; overflow-y: auto; }
  .collapsible-content.open { display: block; }
  .chevron { transition: transform 0.2s; }
  .chevron.open { transform: rotate(180deg); }
  
  pre {
    background: var(--bg-primary);
    padding: 1rem;
    border-radius: 8px;
    overflow-x: auto;
    font-size: 0.75rem;
    line-height: 1.5;
  }
  
  .timestamp {
    text-align: center;
    color: var(--text-secondary);
    font-size: 0.75rem;
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border);
  }
`;

/**
 * JavaScript for the dashboard interactivity.
 */
const DASHBOARD_SCRIPT = `
  function toggleSection(header) {
    const content = header.nextElementSibling;
    const chevron = header.querySelector('.chevron');
    content.classList.toggle('open');
    chevron.classList.toggle('open');
  }
`;

/**
 * Renders the endpoint navigation section.
 */
function renderEndpointsSection(endpoints) {
  return endpoints
    .map(
      (cat) => `
      <div class="endpoint-category">
        <h3>${cat.category}</h3>
        <div class="endpoint-list">
          ${cat.items
            .map(
              (ep) => `
            <a href="${ep.path}" class="endpoint-btn" title="${ep.desc}">
              <span class="path">${ep.path.split("?")[0]}</span>
              <span class="arrow">→</span>
            </a>
          `
            )
            .join("")}
        </div>
      </div>
    `
    )
    .join("");
}

/**
 * Renders a collapsible section with JSON data.
 */
function renderCollapsibleSection(icon, title, count, data) {
  return `
    <div class="collapsible-section">
      <div class="collapsible-header" onclick="toggleSection(this)">
        <h3>${icon} ${title} (${count} keys)</h3>
        <span class="chevron">▼</span>
      </div>
      <div class="collapsible-content">
        <pre>${JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  `;
}

/**
 * Generates the complete HTML dashboard.
 *
 * @param {Object} data - Dashboard data
 * @param {string} data.region - Current region
 * @param {string} data.revisionTag - Revision/deployment tag
 * @param {Object} data.secretsObject - Secrets key-value pairs
 * @param {Object} data.envsObject - Environment variables from SDK
 * @param {Object} data.processEnv - Process environment variables
 * @param {string} data.timestamp - Current timestamp
 * @param {Array} [data.endpoints] - Optional custom endpoints array
 * @returns {string} Complete HTML string
 */
export function generateDashboardHtml(data) {
  const {
    region,
    revisionTag,
    secretsObject,
    envsObject,
    processEnv,
    timestamp,
    endpoints = DASHBOARD_ENDPOINTS,
  } = data;

  const regionDisplay = region.toUpperCase();
  const secretsCount = Object.keys(secretsObject).length;
  const envsCount = Object.keys(envsObject).length;
  const processEnvCount = Object.keys(processEnv).length;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>monday-code Dashboard</title>
  <style>${DASHBOARD_STYLES}</style>
</head>
<body>
  <div class="container">
    <header>
      <h1><div class="logo"></div> monday-code Dashboard</h1>
      <div class="badge">
        <span class="badge-dot"></span>
        <span>${regionDisplay}</span>
      </div>
    </header>

    <div class="grid">
      <div class="card">
        <div class="card-header">
          <h2>Region</h2>
        </div>
        <div class="card-value">${regionDisplay}</div>
      </div>
      <div class="card">
        <div class="card-header">
          <h2>Revision Tag</h2>
        </div>
        <div class="card-value" style="font-size: 1rem; word-break: break-all;">${revisionTag}</div>
      </div>
      <div class="card">
        <div class="card-header">
          <h2>Secrets Count</h2>
        </div>
        <div class="card-value">${secretsCount}</div>
      </div>
      <div class="card">
        <div class="card-header">
          <h2>Env Vars Count</h2>
        </div>
        <div class="card-value">${envsCount}</div>
      </div>
    </div>

    <h2 class="section-title">🚀 Available Endpoints</h2>
    <div class="endpoints-grid">
      ${renderEndpointsSection(endpoints)}
    </div>

    ${renderCollapsibleSection("📦", "Secrets", secretsCount, secretsObject)}
    ${renderCollapsibleSection("🔧", "Environment Variables", envsCount, envsObject)}
    ${renderCollapsibleSection("⚙️", "Process Env", processEnvCount, processEnv)}

    <p class="timestamp">Generated at ${timestamp}</p>
  </div>

  <script>${DASHBOARD_SCRIPT}</script>
</body>
</html>
  `.trim();
}

