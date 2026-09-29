// Serverless function: /api/content
import { DEFAULT_PORTFOLIO_DATA } from '../src/data/store.js';

// Global memory cache for serverless invocation lifecycle
let memoryStore = null;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: Return current portfolio content
  if (req.method === 'GET') {
    const data = memoryStore || DEFAULT_PORTFOLIO_DATA;
    return res.status(200).json(data);
  }

  // POST: Update portfolio content (Requires Authentication)
  if (req.method === 'POST') {
    const cookies = req.headers.cookie || '';
    const tokenHeader = req.headers.authorization || '';
    const token = cookies.match(/rk_admin_token=([^;]+)/)?.[1] || tokenHeader.replace('Bearer ', '');
    const expectedPassword = process.env.ADMIN_PASSWORD || 'rezaul2026';

    let isAuthed = false;
    if (token) {
      try {
        const decoded = Buffer.from(token, 'base64').toString('utf-8');
        if (decoded.includes(`:${expectedPassword}`)) {
          isAuthed = true;
        }
      } catch (e) {}
    }

    if (!isAuthed) {
      return res.status(401).json({ error: 'Unauthorized. Admin authentication required.' });
    }

    const payload = req.body;
    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({ error: 'Invalid JSON payload' });
    }

    memoryStore = {
      ...(memoryStore || DEFAULT_PORTFOLIO_DATA),
      ...payload,
      updatedAt: new Date().toISOString(),
    };

    // Revalidate header response
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

    return res.status(200).json({
      success: true,
      message: 'Portfolio content updated successfully',
      data: memoryStore,
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
