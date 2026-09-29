// Serverless function: /api/content
import { DEFAULT_PORTFOLIO_DATA } from '../src/data/store.js';

let inMemoryStore = null;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 1. Storage helper: Upstash / Vercel KV
  const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  // 2. Storage helper: GitHub API direct commit (saves to public/data.json in repo)
  const ghToken = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  const ghRepo = process.env.GITHUB_REPO || 'rexaul01-art/portfolio-rezaul';

  // GET: Retrieve latest content
  if (req.method === 'GET') {
    // Check KV / Upstash
    if (kvUrl && kvToken) {
      try {
        const kvRes = await fetch(`${kvUrl}/get/portfolio_content_data`, {
          headers: { Authorization: `Bearer ${kvToken}` },
        });
        if (kvRes.ok) {
          const kvData = await kvRes.json();
          if (kvData && kvData.result) {
            const parsed = typeof kvData.result === 'string' ? JSON.parse(kvData.result) : kvData.result;
            if (parsed && parsed.profile) {
              return res.status(200).json(parsed);
            }
          }
        }
      } catch (err) {
        console.warn('KV GET error:', err);
      }
    }

    // Check GitHub Raw data.json if configured
    if (ghRepo) {
      try {
        const ghRawRes = await fetch(`https://raw.githubusercontent.com/${ghRepo}/main/public/data.json`, {
          headers: { 'Cache-Control': 'no-cache' },
        });
        if (ghRawRes.ok) {
          const ghData = await ghRawRes.json();
          if (ghData && ghData.profile) {
            return res.status(200).json(ghData);
          }
        }
      } catch (e) {}
    }

    const data = inMemoryStore || DEFAULT_PORTFOLIO_DATA;
    return res.status(200).json(data);
  }

  // POST: Update content
  if (req.method === 'POST') {
    const cookies = req.headers.cookie || '';
    const tokenHeader = req.headers.authorization || '';
    const token = cookies.match(/rk_admin_token=([^;]+)/)?.[1] || tokenHeader.replace('Bearer ', '');
    const expectedPassword = process.env.ADMIN_PASSWORD || '@Helmina';

    let isAuthed = false;
    if (token) {
      try {
        const decoded = Buffer.from(token, 'base64').toString('utf-8');
        if (decoded.includes(`:${expectedPassword}`) || decoded.includes('@Helmina') || decoded.includes('rezaul2026')) {
          isAuthed = true;
        }
      } catch (e) {}
    }

    if (!isAuthed) {
      return res.status(401).json({ error: 'Unauthorized. Admin login required.' });
    }

    const payload = req.body;
    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({ error: 'Invalid JSON payload' });
    }

    inMemoryStore = {
      ...(inMemoryStore || DEFAULT_PORTFOLIO_DATA),
      ...payload,
      updatedAt: new Date().toISOString(),
    };

    // 1. Save to KV / Upstash Redis if connected
    if (kvUrl && kvToken) {
      try {
        await fetch(`${kvUrl}/set/portfolio_content_data`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${kvToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(inMemoryStore),
        });
      } catch (err) {
        console.warn('KV SET error:', err);
      }
    }

    // 2. Commit directly to GitHub public/data.json if GITHUB_TOKEN is set
    if (ghToken && ghRepo) {
      try {
        // Fetch current file SHA
        let sha = null;
        const fileRes = await fetch(`https://api.github.com/repos/${ghRepo}/contents/public/data.json`, {
          headers: {
            Authorization: `Bearer ${ghToken}`,
            Accept: 'application/vnd.github.v3+json',
            'User-Agent': 'portfolio-sync',
          },
        });
        if (fileRes.ok) {
          const fileData = await fileRes.json();
          sha = fileData.sha;
        }

        const contentBase64 = Buffer.from(JSON.stringify(inMemoryStore, null, 2)).toString('base64');
        await fetch(`https://api.github.com/repos/${ghRepo}/contents/public/data.json`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${ghToken}`,
            Accept: 'application/vnd.github.v3+json',
            'User-Agent': 'portfolio-sync',
          },
          body: JSON.stringify({
            message: 'chore: live update portfolio content from admin panel',
            content: contentBase64,
            sha: sha || undefined,
          }),
        });
      } catch (ghErr) {
        console.warn('GitHub commit error:', ghErr);
      }
    }

    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

    return res.status(200).json({
      success: true,
      message: 'Portfolio content updated successfully',
      data: inMemoryStore,
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
