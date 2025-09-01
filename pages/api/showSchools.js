import { getConnection } from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const connection = await getConnection();
    const [rows] = await connection.execute(
      'SELECT id, name, address, city,state, contact, email_id, image FROM schools ORDER BY id DESC'
    );
    await connection.end();
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Database fetch error', error });
  }
}
