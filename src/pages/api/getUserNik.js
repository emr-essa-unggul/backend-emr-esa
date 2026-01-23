// backend/api/getUserNik.js
import db from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { nik } = req.query;

  if (!nik) {
    return res.status(400).json({ message: 'username is required' });
  }

  try {
    // Query untuk mendapatkan data berdasarkan username dari tabel users
    const [rows] = await db.query(
      'SELECT role, username FROM users WHERE username = ?',
      [nik]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'username not found' });
    }

    return res.status(200).json({
      role: rows[0].role || null,
      username: rows[0].username || null
    });
  } catch (error) {
    console.error('Error fetching username:', error);
    return res.status(500).json({ 
      message: 'Error fetching username', 
      error: error.message 
    });
  }
}