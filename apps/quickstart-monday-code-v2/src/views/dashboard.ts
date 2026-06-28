interface EndpointItem {
  path: string;
  label: string;
  desc: string;
}

interface EndpointCategory {
  category: string;
  items: EndpointItem[];
}

export const DASHBOARD_ENDPOINTS: EndpointCategory[] = [
  {
    category: "Health & Status",
    items: [
      { path: "/health", label: "Health Check", desc: "Basic health status" },
      { path: "/super-health", label: "Super Health", desc: "Comprehensive health + logging test" },
      { path: "/long?time=5000", label: "Long Request (5s)", desc: "Timeout testing" },
      { path: "/error", label: "Error Test", desc: "Returns 500 error" },
    ],
  },
  {
    category: "Debug & Testing",
    items: [
      { path: "/networking", label: "Networking", desc: "External connectivity test" },
      { path: "/storage-test", label: "Storage Test", desc: "Full storage API test" },
      { path: "/storage-test?shortTest=true", label: "Storage Test (Short)", desc: "Quick storage test" },
      { path: "/documentdb", label: "DocumentDB Health", desc: "Check DocumentDB connection" },
      { path: "/agent/webhook", label: "Agent Webhook", desc: "Monday agent webhook — changes item status" },
      { path: "/agent/create-item", label: "Agent Create Item", desc: "Monday agent — creates a new board item" },
    ],
  },
];

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  :root {
    --bg-primary: #0a0a12;
    --bg-card: rgba(20, 20, 35, 0.7);
    --accent-1: #6366f1;
    --accent-2: #8b5cf6;
    --accent-3: #a855f7;
    --accent-4: #ec4899;
    --success: #10b981;
    --text-primary: #ffffff;
    --text-secondary: #94a3b8;
    --text-muted: #64748b;
    --border: rgba(139, 92, 246, 0.15);
    --border-hover: rgba(139, 92, 246, 0.4);
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: var(--bg-primary);
    color: var(--text-primary);
    min-height: 100vh;
    padding: 2rem;
    overflow-x: hidden;
  }
  .bg-gradient {
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: linear-gradient(125deg, #0a0a12 0%, #1a0a2e 25%, #0a1628 50%, #1a0a2e 75%, #0a0a12 100%);
    background-size: 400% 400%;
    animation: gradientFlow 15s ease infinite;
    z-index: 0;
  }
  @keyframes gradientFlow { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
  .orb { position: fixed; border-radius: 50%; filter: blur(80px); opacity: 0.5; pointer-events: none; z-index: 1; }
  .orb-1 { width: 600px; height: 600px; background: radial-gradient(circle, var(--accent-2) 0%, transparent 70%); top: -200px; left: -200px; animation: orbFloat1 20s ease-in-out infinite; }
  .orb-2 { width: 500px; height: 500px; background: radial-gradient(circle, var(--accent-4) 0%, transparent 70%); bottom: -150px; right: -150px; animation: orbFloat2 25s ease-in-out infinite; }
  .orb-3 { width: 400px; height: 400px; background: radial-gradient(circle, var(--accent-1) 0%, transparent 70%); top: 50%; left: 50%; transform: translate(-50%, -50%); animation: orbFloat3 18s ease-in-out infinite; }
  @keyframes orbFloat1 { 0%, 100% { transform: translate(0, 0) scale(1); } 33% { transform: translate(100px, 50px) scale(1.1); } 66% { transform: translate(50px, 100px) scale(0.9); } }
  @keyframes orbFloat2 { 0%, 100% { transform: translate(0, 0) scale(1); } 33% { transform: translate(-80px, -40px) scale(1.15); } 66% { transform: translate(-40px, -80px) scale(0.85); } }
  @keyframes orbFloat3 { 0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; } 50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.5; } }
  .particles { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 2; overflow: hidden; }
  .particle { position: absolute; width: 4px; height: 4px; background: var(--accent-2); border-radius: 50%; opacity: 0; animation: particleFloat 8s ease-in-out infinite; }
  @keyframes particleFloat { 0% { transform: translateY(100vh) scale(0); opacity: 0; } 10% { opacity: 0.8; } 90% { opacity: 0.8; } 100% { transform: translateY(-100px) scale(1); opacity: 0; } }
  .container { max-width: 1200px; margin: 0 auto; position: relative; z-index: 10; }
  header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3rem; padding-bottom: 2rem; border-bottom: 1px solid var(--border); animation: fadeInDown 0.8s ease; }
  @keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
  h1 { font-size: 2rem; font-weight: 800; display: flex; align-items: center; gap: 1rem; background: linear-gradient(135deg, #fff 0%, #e0e7ff 30%, #c4b5fd 60%, #f0abfc 100%); background-size: 200% 200%; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; animation: textShimmer 5s ease infinite; }
  @keyframes textShimmer { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
  .logo { width: 42px; height: 42px; background: linear-gradient(135deg, var(--accent-1), var(--accent-3), var(--accent-4)); background-size: 200% 200%; border-radius: 12px; box-shadow: 0 0 20px rgba(139,92,246,0.4), 0 0 40px rgba(236,72,153,0.3); animation: logoSpin 8s ease infinite, logoPulse 2s ease-in-out infinite; }
  @keyframes logoSpin { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
  @keyframes logoPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
  .badge { display: inline-flex; align-items: center; gap: 0.6rem; padding: 0.7rem 1.4rem; background: var(--bg-card); backdrop-filter: blur(20px); border-radius: 9999px; font-size: 0.9rem; font-weight: 600; border: 1px solid var(--border); }
  .badge-dot { width: 10px; height: 10px; background: var(--success); border-radius: 50%; animation: badgePulse 2s ease-in-out infinite; box-shadow: 0 0 15px var(--success); }
  @keyframes badgePulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.2); } }
  .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; }
  .card { background: var(--bg-card); backdrop-filter: blur(20px); border-radius: 20px; padding: 1.75rem; border: 1px solid var(--border); transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); box-shadow: 0 4px 30px rgba(0,0,0,0.3); animation: cardSlideUp 0.6s ease backwards; }
  .card:nth-child(1) { animation-delay: 0.1s; } .card:nth-child(2) { animation-delay: 0.2s; } .card:nth-child(3) { animation-delay: 0.3s; } .card:nth-child(4) { animation-delay: 0.4s; }
  @keyframes cardSlideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
  .card:hover { transform: translateY(-8px) scale(1.02); border-color: var(--border-hover); box-shadow: 0 20px 40px rgba(0,0,0,0.4), 0 0 60px rgba(139,92,246,0.15); }
  .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
  .card h2 { font-size: 0.75rem; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.12em; }
  .card-value { font-size: 2rem; font-weight: 800; background: linear-gradient(135deg, var(--accent-1) 0%, var(--accent-3) 50%, var(--accent-4) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; line-height: 1.2; }
  .section-title { font-size: 1.5rem; font-weight: 700; margin: 3rem 0 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 0.75rem; }
  .endpoints-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem; }
  .endpoint-category { background: var(--bg-card); backdrop-filter: blur(20px); border-radius: 20px; padding: 1.5rem; border: 1px solid var(--border); transition: all 0.3s ease; }
  .endpoint-category:hover { border-color: var(--border-hover); }
  .endpoint-category h3 { font-size: 0.8rem; font-weight: 700; background: linear-gradient(135deg, var(--accent-2), var(--accent-4)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 1.25rem; text-transform: uppercase; letter-spacing: 0.1em; }
  .endpoint-list { display: flex; flex-direction: column; gap: 0.75rem; }
  .endpoint-btn { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; background: rgba(15,15,26,0.6); border: 1px solid var(--border); border-radius: 14px; color: var(--text-primary); text-decoration: none; font-size: 0.9rem; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); position: relative; overflow: hidden; }
  .endpoint-btn:hover { background: linear-gradient(135deg, var(--accent-1), var(--accent-3)); border-color: transparent; transform: translateX(8px) scale(1.02); box-shadow: 0 8px 25px rgba(99,102,241,0.4); }
  .endpoint-btn .path { font-family: 'JetBrains Mono', 'SF Mono', Monaco, monospace; font-weight: 600; }
  .endpoint-btn .arrow { opacity: 0.5; transition: all 0.3s ease; font-size: 1.2rem; }
  .endpoint-btn:hover .arrow { opacity: 1; transform: translateX(4px); }
  .collapsible-section { background: var(--bg-card); backdrop-filter: blur(20px); border-radius: 16px; margin-top: 1.5rem; border: 1px solid var(--border); overflow: hidden; }
  .collapsible-header { display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 1.5rem; cursor: pointer; user-select: none; background: rgba(15,15,26,0.5); transition: all 0.3s ease; }
  .collapsible-header:hover { background: rgba(139,92,246,0.1); }
  .collapsible-header h3 { font-size: 0.9rem; font-weight: 600; display: flex; align-items: center; gap: 0.5rem; }
  .collapsible-content { display: none; padding: 1.25rem 1.5rem; max-height: 400px; overflow-y: auto; }
  .collapsible-content.open { display: block; }
  .chevron { transition: transform 0.3s ease; color: var(--accent-2); }
  .chevron.open { transform: rotate(180deg); }
  pre { background: rgba(10,10,18,0.8); padding: 1.25rem; border-radius: 12px; overflow-x: auto; font-size: 0.8rem; line-height: 1.6; font-family: 'JetBrains Mono', 'SF Mono', Monaco, monospace; border: 1px solid var(--border); }
  .timestamp { text-align: center; color: var(--text-muted); font-size: 0.8rem; margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid var(--border); }
  ::-webkit-scrollbar { width: 8px; height: 8px; }
  ::-webkit-scrollbar-track { background: var(--bg-primary); border-radius: 4px; }
  ::-webkit-scrollbar-thumb { background: var(--accent-2); border-radius: 4px; }
  @media (max-width: 768px) { body { padding: 1rem; } h1 { font-size: 1.4rem; } .card-value { font-size: 1.5rem; } header { flex-direction: column; gap: 1rem; text-align: center; } }
`;

const SCRIPT = `
  function toggleSection(header) {
    const content = header.nextElementSibling;
    const chevron = header.querySelector('.chevron');
    content.classList.toggle('open');
    chevron.classList.toggle('open');
  }
  function createParticles() {
    const container = document.querySelector('.particles');
    const colors = ['#6366f1', '#8b5cf6', '#a855f7', '#ec4899', '#f472b6'];
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 8 + 's';
      particle.style.animationDuration = (Math.random() * 4 + 6) + 's';
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];
      particle.style.width = (Math.random() * 4 + 2) + 'px';
      particle.style.height = particle.style.width;
      container.appendChild(particle);
    }
  }
  document.addEventListener('DOMContentLoaded', createParticles);
`;

function renderEndpoints(endpoints: EndpointCategory[]): string {
  return endpoints
    .map((cat) => `
      <div class="endpoint-category">
        <h3>${cat.category}</h3>
        <div class="endpoint-list">
          ${cat.items.map((ep) => `
            <a href="${ep.path}" class="endpoint-btn" title="${ep.desc}">
              <span class="path">${ep.path.split("?")[0]}</span>
              <span class="arrow">→</span>
            </a>
          `).join("")}
        </div>
      </div>
    `).join("");
}

function renderCollapsible(icon: string, title: string, count: number, data: Record<string, unknown>): string {
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

export interface DashboardData {
  region: string;
  revisionTag: string;
  secretsObject: Record<string, unknown>;
  envsObject: Record<string, unknown>;
  processEnv: Record<string, string | undefined>;
  timestamp: string;
  endpoints?: EndpointCategory[];
}

export function generateDashboardHtml(data: DashboardData): string {
  const { region, revisionTag, secretsObject, envsObject, processEnv, timestamp, endpoints = DASHBOARD_ENDPOINTS } = data;

  const regionDisplay = region.toUpperCase();
  const secretsCount = Object.keys(secretsObject).length;
  const envsCount = Object.keys(envsObject).length;
  const processEnvCount = Object.keys(processEnv).length;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>monday-code Dashboard</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <style>${STYLES}</style>
</head>
<body>
  <div class="bg-gradient"></div>
  <div class="orb orb-1"></div>
  <div class="orb orb-2"></div>
  <div class="orb orb-3"></div>
  <div class="particles"></div>
  <div class="container">
    <header>
      <h1><div class="logo"></div> Welcome to your monday-code backend!</h1>
      <div class="badge"><span class="badge-dot"></span><span>${regionDisplay}</span></div>
    </header>
    <div class="grid">
      <div class="card"><div class="card-header"><h2>Region</h2></div><div class="card-value">${regionDisplay}</div></div>
      <div class="card"><div class="card-header"><h2>Revision Tag</h2></div><div class="card-value" style="font-size: 1rem; word-break: break-all;">${revisionTag}</div></div>
      <div class="card"><div class="card-header"><h2>Secrets Count</h2></div><div class="card-value">${secretsCount}</div></div>
      <div class="card"><div class="card-header"><h2>Env Vars Count</h2></div><div class="card-value">${envsCount}</div></div>
    </div>
    <h2 class="section-title">Available Endpoints</h2>
    <div class="endpoints-grid">${renderEndpoints(endpoints)}</div>
    ${renderCollapsible("Secrets", "Secrets", secretsCount, secretsObject as Record<string, unknown>)}
    ${renderCollapsible("Env", "Environment Variables", envsCount, envsObject as Record<string, unknown>)}
    ${renderCollapsible("Proc", "Process Env", processEnvCount, processEnv as Record<string, unknown>)}
    <p class="timestamp">Generated at ${timestamp}</p>
  </div>
  <script>${SCRIPT}</script>
</body>
</html>`.trim();
}
