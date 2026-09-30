import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
  server: {
    port: 3000,
    open: true,
  },
  plugins: [
    {
      name: 'local-api-server',
      configureServer(server) {
        const rootDir = process.cwd();
        const dataJsonPath = path.join(rootDir, 'public', 'data.json');
        const uploadDirPath = path.join(rootDir, 'public', 'uploads');

        // Ensure directories exist
        if (!fs.existsSync(uploadDirPath)) {
          fs.mkdirSync(uploadDirPath, { recursive: true });
        }

        server.middlewares.use(async (req, res, next) => {
          if (!req.url.startsWith('/api/')) return next();

          res.setHeader('Content-Type', 'application/json');

          // POST /api/auth/login
          if (req.url === '/api/auth/login' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
              try {
                const { email, password } = JSON.parse(body || '{}');
                const expectedEmail = process.env.ADMIN_EMAIL || 'rexaul01@gmail.com';
                const expectedPassword = process.env.ADMIN_PASSWORD || '@Helmina';

                if (email && password && email.trim().toLowerCase() === expectedEmail.toLowerCase() && password === expectedPassword) {
                  const token = Buffer.from(`admin:${expectedEmail}:${Date.now()}:${expectedPassword}`).toString('base64');
                  res.setHeader('Set-Cookie', `rk_admin_token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`);
                  res.end(JSON.stringify({ success: true, token, email: expectedEmail }));
                } else {
                  res.statusCode = 401;
                  res.end(JSON.stringify({ error: 'Invalid admin credentials' }));
                }
              } catch (e) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Invalid request' }));
              }
            });
            return;
          }

          // GET /api/auth/me
          if (req.url === '/api/auth/me' && req.method === 'GET') {
            const cookie = req.headers.cookie || '';
            if (cookie.includes('rk_admin_token=')) {
              res.end(JSON.stringify({ authenticated: true, role: 'admin', email: 'rexaul01@gmail.com' }));
            } else {
              res.statusCode = 401;
              res.end(JSON.stringify({ authenticated: false }));
            }
            return;
          }

          // POST /api/auth/logout
          if (req.url === '/api/auth/logout' && req.method === 'POST') {
            res.setHeader('Set-Cookie', `rk_admin_token=; Path=/; HttpOnly; Max-Age=0`);
            res.end(JSON.stringify({ success: true }));
            return;
          }

          // GET /api/content
          if (req.url === '/api/content' && req.method === 'GET') {
            try {
              if (fs.existsSync(dataJsonPath)) {
                const raw = fs.readFileSync(dataJsonPath, 'utf-8');
                res.end(raw);
                return;
              }
            } catch (e) {}
            res.end(JSON.stringify({}));
            return;
          }

          // POST /api/content — WRITES DIRECTLY TO public/data.json ON DISK!
          if (req.url === '/api/content' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
              try {
                const data = JSON.parse(body || '{}');
                let current = {};
                if (fs.existsSync(dataJsonPath)) {
                  try {
                    current = JSON.parse(fs.readFileSync(dataJsonPath, 'utf-8'));
                  } catch (e) {}
                }
                const merged = { ...current, ...data };
                
                // Write directly to public/data.json
                fs.writeFileSync(dataJsonPath, JSON.stringify(merged, null, 2), 'utf-8');
                console.log(' [SAVED] Updated portfolio content saved to file:', dataJsonPath);

                res.end(JSON.stringify({ success: true, message: 'Saved to public/data.json', data: merged }));
              } catch (e) {
                console.error('Error writing to public/data.json:', e);
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Failed to write to file: ' + e.message }));
              }
            });
            return;
          }

          // POST /api/upload — WRITES UPLOADED IMAGE DIRECTLY TO public/uploads/ ON DISK!
          if (req.url === '/api/upload' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
              try {
                const { image, name } = JSON.parse(body || '{}');
                if (!image) {
                  res.statusCode = 400;
                  res.end(JSON.stringify({ error: 'No image provided' }));
                  return;
                }

                if (image.startsWith('data:')) {
                  const match = image.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
                  if (match) {
                    const ext = match[1] === 'jpeg' ? 'jpg' : match[1];
                    const base64Data = match[2];
                    const cleanName = (name || 'photo').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 30);
                    const fileName = `${cleanName}_${Date.now()}.${ext}`;
                    const filePath = path.join(uploadDirPath, fileName);
                    
                    fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
                    const publicUrl = `/uploads/${fileName}`;
                    console.log(' [SAVED] Uploaded image saved to file:', filePath);

                    res.end(JSON.stringify({ success: true, url: publicUrl, name: fileName }));
                    return;
                  }
                }

                res.end(JSON.stringify({ success: true, url: image, name }));
              } catch (e) {
                console.error('Upload write error:', e);
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'Upload save failed: ' + e.message }));
              }
            });
            return;
          }

          next();
        });
      }
    }
  ]
});
