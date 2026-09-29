// Serverless function: /api/auth/login
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body || {};
    const expectedEmail = process.env.ADMIN_EMAIL || 'rexaul01@gmail.com';
    const expectedPassword = process.env.ADMIN_PASSWORD || '@Helmina';

    if (!email || !password || email.trim().toLowerCase() !== expectedEmail.toLowerCase() || password !== expectedPassword) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    // Set secure cookie or token
    const token = Buffer.from(`admin:${expectedEmail}:${Date.now()}:${expectedPassword}`).toString('base64');
    
    // Set HTTP-only Cookie
    res.setHeader('Set-Cookie', `rk_admin_token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`);

    return res.status(200).json({
      success: true,
      token,
      email: expectedEmail,
      message: 'Authenticated successfully',
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
