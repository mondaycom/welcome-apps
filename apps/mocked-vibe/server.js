const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5174;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.gz': 'application/gzip',
  '.tar.gz': 'application/gzip',
};

const server = http.createServer(async (req, res) => {
  console.log(`${req.method} ${req.url}`);

  // Proxy API requests to localhost:3310
  if (req.url.startsWith('/api/')) {
    const targetPath = req.url.replace('/api', '/internal');
    const targetUrl = `http://localhost:3310${targetPath}`;
    
    console.log(`Proxying to: ${targetUrl}`);
    
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const proxyReq = http.request(targetUrl, {
        method: req.method,
        headers: {
          ...req.headers,
          host: 'localhost:3310',
        },
      }, (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res);
      });
      
      proxyReq.on('error', (err) => {
        console.error('Proxy error:', err.message);
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      });
      
      if (body) proxyReq.write(body);
      proxyReq.end();
    });
    return;
  }

  // Proxy upload requests (for the GCS signed URL) - use curl for reliability
  if (req.url.startsWith('/upload/')) {
    const targetUrl = decodeURIComponent(req.url.replace('/upload/', ''));
    console.log(`Proxying upload to: ${targetUrl.substring(0, 120)}...`);
    
    // Collect the entire body first
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', async () => {
      const body = Buffer.concat(chunks);
      console.log(`Upload body size: ${body.length} bytes`);
      
      // Write body to temp file for curl
      const tempFile = '/tmp/upload_' + Date.now() + '.tar.gz';
      fs.writeFileSync(tempFile, body);
      
      // Use curl which handles GCS signed URLs correctly
      const { execSync } = require('child_process');
      try {
        const curlCmd = `curl -s -w "\\n%{http_code}" -X PUT -H "Content-Type: application/zip" --data-binary "@${tempFile}" "${targetUrl}"`;
        console.log(`Running curl...`);
        
        const result = execSync(curlCmd, { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 });
        const lines = result.trim().split('\n');
        const statusCode = parseInt(lines.pop(), 10);
        const responseBody = lines.join('\n');
        
        console.log(`GCS response: ${statusCode}`);
        if (statusCode >= 400) {
          console.log(`GCS error: ${responseBody}`);
        }
        
        // Cleanup temp file
        fs.unlinkSync(tempFile);
        
        res.writeHead(statusCode, {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'text/plain',
        });
        res.end(responseBody);
      } catch (err) {
        console.error('Curl error:', err.message);
        if (err.stdout) console.log('stdout:', err.stdout);
        if (err.stderr) console.log('stderr:', err.stderr);
        
        // Cleanup temp file
        try { fs.unlinkSync(tempFile); } catch(e) {}
        
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // Serve static files
  let filePath = req.url === '/' ? '/index.html' : req.url;
  filePath = path.join(__dirname, filePath);
  
  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  
  try {
    const data = fs.readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  } catch (err) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`\n🚀 Server running at http://localhost:${PORT}/\n`);
  console.log('Routes:');
  console.log('  - Static files: /*');
  console.log('  - API proxy:    /api/* → localhost:3310/internal/*');
  console.log('  - Upload proxy: /upload/* → external URL\n');
});
