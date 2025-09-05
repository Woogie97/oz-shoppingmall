const pool = require('../config/db');

exports.getUserById = async (userId) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT id, email, name, provider FROM users WHERE id = ?', [userId]);
    return rows[0] || null;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}; 