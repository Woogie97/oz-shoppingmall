const pool = require('../config/db');

exports.createProduct = async (productData) => {
  const { name, description, price, imageUrl, stock, userId } = productData;
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(
      'INSERT INTO products (name, description, price, image_url, stock, user_id) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description || null, price, imageUrl || null, stock, userId]
    );
    return result.insertId;
  } finally {
    connection.release();
  }
};

exports.getProducts = async (page, limit) => {
  const connection = await pool.getConnection();
  try {
    const offset = (page - 1) * limit;

    // Query to get the total number of products
    const [[{ total }]] = await connection.query('SELECT COUNT(*) as total FROM products');

    // Query to get the products for the current page
    const [products] = await connection.query('SELECT * FROM products ORDER BY created_at DESC LIMIT ? OFFSET ?', [limit, offset]);
    
    return {
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalProducts: total
    };
  } finally {
    connection.release();
  }
};

exports.getProductById = async (productId) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query('SELECT * FROM products WHERE id = ?', [productId]);
    return rows[0] || null;
  } finally {
    connection.release();
  }
}; 

exports.updateProduct = async (productId, userId, productData) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query('SELECT user_id FROM products WHERE id = ?', [productId]);
    if (rows.length === 0) {
      throw new Error('Product not found');
    }

    const product = rows[0];
    if (product.user_id !== userId) {
      throw new Error('User not authorized');
    }

    const fieldsToUpdate = Object.keys(productData).filter(key => productData[key] !== undefined);
    if (fieldsToUpdate.length === 0) {
      const [currentProduct] = await connection.query('SELECT * FROM products WHERE id = ?', [productId]);
      return currentProduct[0];
    }
    
    const setClause = fieldsToUpdate.map(field => `${field} = ?`).join(', ');
    const values = fieldsToUpdate.map(field => productData[field]);
    values.push(productId);

    await connection.query(`UPDATE products SET ${setClause} WHERE id = ?`, values);

    const [updatedProductRows] = await connection.query('SELECT * FROM products WHERE id = ?', [productId]);
    return updatedProductRows[0];
  } finally {
    connection.release();
  }
};

exports.deleteProduct = async (productId, userId) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query('SELECT user_id FROM products WHERE id = ?', [productId]);
    if (rows.length === 0) {
      throw new Error('Product not found');
    }

    const product = rows[0];
    if (product.user_id !== userId) {
      throw new Error('User not authorized');
    }

    await connection.query('DELETE FROM products WHERE id = ?', [productId]);
    return true;
  } finally {
    connection.release();
  }
}; 