import db from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ message: 'username is required' });
  }

  try {
    const [rows] = await db.query(
      'SELECT role, username FROM users WHERE username = ?',
      [username]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      role: rows[0].role,
      nik: rows[0].username // ← kalau username = NIK
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({
      message: 'Error fetching user',
      error: error.message
    });
  }
}
