// src/pages/api/me.js
import { parse } from 'cookie';

export default function handler(req, res) {
  try {
    const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
    const role = cookies.userRole || null;
    return res.status(200).json({ role });
  } catch (err) {
    console.error('/api/me error', err);
    return res.status(500).json({ role: null });
  }
}
