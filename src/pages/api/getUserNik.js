// backend/api/getUserNik.js
import db from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { nik } = req.query;

  if (!nik) {
    return res.status(400).json({ message: 'NIK is required' });
  }

  try {
    // Query untuk mendapatkan data berdasarkan NIK dari tabel users
    const [rows] = await db.query(
      'SELECT role, username FROM users WHERE nik = ?',
      [nik]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'NIK not found' });
    }

    return res.status(200).json({
      nik: rows[0].nik || null,
      nama_lengkap: rows[0].nama_lengkap || null
    });
  } catch (error) {
    console.error('Error fetching NIK:', error);
    return res.status(500).json({ 
      message: 'Error fetching NIK', 
      error: error.message 
    });
  }
}