// Serverless function: /api/upload
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Auth verification
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

  try {
    const { image, name } = req.body || {};
    if (!image) {
      return res.status(400).json({ error: 'No image payload provided' });
    }

    // Return the persistent data URL or cloud URL
    const imageUrl = image.startsWith('data:') ? image : `data:image/png;base64,${image}`;

    return res.status(200).json({
      success: true,
      url: imageUrl,
      name: name || 'uploaded-image.png',
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
