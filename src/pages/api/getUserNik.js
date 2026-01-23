// backend/api/getUserNik.js
import db from '@/lib/db';
import { getPool } from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: 'userId is required' });
  }

  try {
    // Query untuk mendapatkan NIK berdasarkan userId
    // Sesuaikan dengan struktur tabel daftarpatients Anda
    const [rows] = await db.query(
      'SELECT nik FROM daftarpatients WHERE id = ?',
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      nik: rows[0].nik || null
    });
  } catch (error) {
    console.error('Error fetching NIK:', error);
    return res.status(500).json({ 
      message: 'Error fetching NIK', 
      error: error.message 
    });
  }
}