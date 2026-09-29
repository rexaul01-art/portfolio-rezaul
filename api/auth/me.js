// Serverless function: /api/auth/me
export default async function handler(req, res) {
  const cookies = req.headers.cookie || '';
  const tokenHeader = req.headers.authorization || '';
  const token = cookies.match(/rk_admin_token=([^;]+)/)?.[1] || tokenHeader.replace('Bearer ', '');

  const expectedEmail = process.env.ADMIN_EMAIL || 'rexaul01@gmail.com';
  const expectedPassword = process.env.ADMIN_PASSWORD || '@Helmina';

  if (!token) {
    return res.status(401).json({ authenticated: false });
  }

  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    if (decoded.startsWith('admin:') && decoded.includes(`:${expectedPassword}`)) {
      return res.status(200).json({ authenticated: true, role: 'admin', email: expectedEmail });
    }
  } catch (e) {}

  return res.status(401).json({ authenticated: false });
}
