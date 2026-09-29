import { defineConfig } from 'vite';

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
        let devContentStore = null;

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

          // GET/POST /api/content
          if (req.url === '/api/content') {
            if (req.method === 'GET') {
              res.end(JSON.stringify(devContentStore || {}));
              return;
            }
            if (req.method === 'POST') {
              let body = '';
              req.on('data', chunk => { body += chunk; });
              req.on('end', () => {
                try {
                  const data = JSON.parse(body || '{}');
                  devContentStore = { ...devContentStore, ...data };
                  res.end(JSON.stringify({ success: true, data: devContentStore }));
                } catch (e) {
                  res.statusCode = 400;
                  res.end(JSON.stringify({ error: 'Invalid JSON' }));
                }
              });
              return;
            }
          }

          // POST /api/upload
          if (req.url === '/api/upload' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
              try {
                const { image, name } = JSON.parse(body || '{}');
                const url = image && image.startsWith('data:') ? image : `data:image/png;base64,${image}`;
                res.end(JSON.stringify({ success: true, url, name }));
              } catch (e) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Upload failed' }));
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
