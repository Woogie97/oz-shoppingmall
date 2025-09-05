// 데이터베이스 연결 풀 가져오기 - 효율적인 DB 연결 관리를 위한 풀 사용
const pool = require('../config/db');

/**
 * 장바구니에 상품 추가 함수
 * @param {number} userId - 사용자 ID
 * @param {number} productId - 상품 ID  
 * @param {number} quantity - 수량 (기본값: 1)
 * @returns {boolean} - 성공 시 true 반환
 */
exports.addToCart = async (userId, productId, quantity = 1) => {
  let connection;
  try {
    // 데이터베이스 연결 풀에서 연결 가져오기
    connection = await pool.getConnection();
    
    // 1단계: 상품 존재 여부 및 재고 확인
    const [products] = await connection.query('SELECT stock FROM products WHERE id = ?', [productId]);
    if (products.length === 0) {
      throw new Error('상품을 찾을 수 없습니다.');
    }
    
    // 요청한 수량이 재고보다 많은지 확인
    if (products[0].stock < quantity) {
      throw new Error('재고가 부족합니다.');
    }

    // 2단계: 장바구니에 이미 같은 상품이 있는지 확인
    const [existingItems] = await connection.query(
      'SELECT * FROM cart WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );

    if (existingItems.length > 0) {
      // 이미 장바구니에 있는 경우: 기존 수량에 추가
      const newQuantity = existingItems[0].quantity + quantity;
      
      // 새로운 총 수량이 재고를 초과하는지 확인
      if (products[0].stock < newQuantity) {
        throw new Error('재고가 부족합니다.');
      }
      
      // 수량 업데이트
      await connection.query(
        'UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?',
        [newQuantity, userId, productId]
      );
    } else {
      // 새로운 상품인 경우: 장바구니에 새 항목 추가
      await connection.query(
        'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
        [userId, productId, quantity]
      );
    }

    return true;
  } finally {
    // 연결 해제 (메모리 누수 방지)
    if (connection) {
      connection.release();
    }
  }
};

/**
 * 사용자의 장바구니 항목들을 조회하는 함수
 * @param {number} userId - 사용자 ID
 * @returns {Array} - 장바구니 항목들의 배열 (상품 정보 포함)
 */
exports.getCartItems = async (userId) => {
  let connection;
  try {
    connection = await pool.getConnection();
    
    // 장바구니와 상품 테이블을 조인하여 상세 정보 조회
    // - 장바구니 ID, 수량, 상품 정보, 총 가격 계산
    const [items] = await connection.query(`
      SELECT 
        c.id as cart_id,                    -- 장바구니 항목 ID
        c.quantity,                         -- 수량
        p.id as product_id,                 -- 상품 ID
        p.name,                            -- 상품명
        p.price,                           -- 단가
        p.image_url,                       -- 상품 이미지 URL
        p.stock,                           -- 재고 수량
        (p.price * c.quantity) as total_price -- 해당 항목의 총 가격 (단가 × 수량)
      FROM cart c
      JOIN products p ON c.product_id = p.id  -- 상품 정보와 조인
      WHERE c.user_id = ?                     -- 특정 사용자의 장바구니만 조회
      ORDER BY c.created_at DESC              -- 최근 추가한 순서대로 정렬
    `, [userId]);
    
    return items;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

/**
 * 장바구니 항목의 수량을 수정하는 함수
 * @param {number} userId - 사용자 ID
 * @param {number} productId - 상품 ID
 * @param {number} quantity - 새로운 수량
 * @returns {boolean} - 성공 시 true 반환
 */
exports.updateCartItem = async (userId, productId, quantity) => {
  let connection;
  try {
    connection = await pool.getConnection();
    
    // 1단계: 상품의 재고 확인
    const [products] = await connection.query('SELECT stock FROM products WHERE id = ?', [productId]);
    if (products.length === 0) {
      throw new Error('상품을 찾을 수 없습니다.');
    }
    
    // 요청한 수량이 재고를 초과하는지 확인
    if (products[0].stock < quantity) {
      throw new Error('재고가 부족합니다.');
    }

    // 2단계: 장바구니 항목의 수량 업데이트
    const [result] = await connection.query(
      'UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?',
      [quantity, userId, productId]
    );

    // 업데이트된 행이 없으면 해당 장바구니 항목이 존재하지 않음
    if (result.affectedRows === 0) {
      throw new Error('장바구니 항목을 찾을 수 없습니다.');
    }

    return true;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

/**
 * 장바구니에서 특정 상품을 제거하는 함수
 * @param {number} userId - 사용자 ID
 * @param {number} productId - 제거할 상품 ID
 * @returns {boolean} - 성공 시 true 반환
 */
exports.removeFromCart = async (userId, productId) => {
  let connection;
  try {
    connection = await pool.getConnection();
    
    // 특정 사용자의 특정 상품을 장바구니에서 삭제
    const [result] = await connection.query(
      'DELETE FROM cart WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );

    // 삭제된 행이 없으면 해당 장바구니 항목이 존재하지 않음
    if (result.affectedRows === 0) {
      throw new Error('장바구니 항목을 찾을 수 없습니다.');
    }

    return true;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

/**
 * 사용자의 장바구니를 완전히 비우는 함수 (주문 완료 후 사용)
 * @param {number} userId - 사용자 ID
 * @returns {boolean} - 성공 시 true 반환
 */
exports.clearCart = async (userId) => {
  let connection;
  try {
    connection = await pool.getConnection();
    
    // 특정 사용자의 모든 장바구니 항목 삭제
    await connection.query('DELETE FROM cart WHERE user_id = ?', [userId]);
    return true;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}; 