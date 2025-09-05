// MySQL 데이터베이스 연결을 위한 모듈 (Promise 기반)
const pool = require('./db');
// MySQL 직접 연결을 위한 모듈 (데이터베이스 생성용)
const mysql = require('mysql2/promise');

// 사용자 정보를 저장할 테이블 생성 쿼리
// - 일반 로그인과 소셜 로그인 모두 지원하도록 설계
const usersTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,              -- 사용자 고유 ID (자동 증가)
    email VARCHAR(255) NULL UNIQUE,                 -- 이메일 (소셜로그인 시 NULL 가능)
    password VARCHAR(255) NULL,                     -- 비밀번호 (소셜로그인 시 NULL)
    name VARCHAR(255) NOT NULL,                     -- 사용자 이름 (필수)
    provider VARCHAR(50) NOT NULL DEFAULT 'local',  -- 로그인 방식 (local/google)
    provider_id VARCHAR(255) NULL,                  -- 소셜 로그인 제공자의 사용자 ID
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 계정 생성 시간
    UNIQUE KEY provider_unique (provider, provider_id) -- 같은 제공자의 같은 ID 중복 방지
  );
`;

// 상품 정보를 저장할 테이블 생성 쿼리
const productsTableQuery = `
  CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,              -- 상품 고유 ID
    user_id INT NOT NULL,                          -- 상품 등록자 ID (현재는 관리자)
    name VARCHAR(255) NOT NULL,                    -- 상품명
    description TEXT,                              -- 상품 설명
    price DECIMAL(10, 2) NOT NULL,                 -- 가격 (소수점 2자리까지)
    image_url VARCHAR(255),                        -- 상품 이미지 URL
    stock INT NOT NULL DEFAULT 0,                  -- 재고 수량
    category VARCHAR(100) DEFAULT 'general',       -- 상품 카테고리
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 등록 시간
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE -- 사용자 삭제 시 상품도 함께 삭제
  );
`;

// 장바구니 정보를 저장할 테이블 생성 쿼리
const cartTableQuery = `
  CREATE TABLE IF NOT EXISTS cart (
    id INT AUTO_INCREMENT PRIMARY KEY,              -- 장바구니 항목 고유 ID
    user_id INT NOT NULL,                          -- 사용자 ID
    product_id INT NOT NULL,                       -- 상품 ID
    quantity INT NOT NULL DEFAULT 1,               -- 수량
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 장바구니 추가 시간
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,     -- 사용자 삭제 시 장바구니도 삭제
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE, -- 상품 삭제 시 장바구니에서도 삭제
    UNIQUE KEY user_product (user_id, product_id)  -- 같은 사용자가 같은 상품을 중복 추가 방지
  );
`;

// 데이터베이스 및 테이블 설정 함수
const setupDatabase = async () => {
  let connection;
  try {
    // 1단계: 데이터베이스가 존재하지 않으면 생성
    // 데이터베이스를 지정하지 않고 MySQL 서버에 연결
    const tempConnection = await mysql.createConnection({
        host: process.env.DB_HOST,     // MySQL 서버 주소
        user: process.env.DB_USER,     // MySQL 사용자명
        password: process.env.DB_PASSWORD, // MySQL 비밀번호
    });
    
    // 데이터베이스가 없으면 생성 (IF NOT EXISTS로 중복 생성 방지)
    await tempConnection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
    await tempConnection.end(); // 임시 연결 종료

    // 2단계: 생성된 데이터베이스에 연결하여 테이블 생성
    connection = await pool.getConnection();
    console.log('Connected to the database.');

    // 사용자 테이블 생성
    await connection.query(usersTableQuery);
    console.log('Users table is ready.');

    // 3단계: 샘플 사용자 데이터 삽입 (테이블이 비어있을 경우에만)
    const [users] = await connection.query('SELECT COUNT(*) as count FROM users');
    if (users[0].count === 0) {
      // 테스트용 사용자 계정 생성 (실제 운영에서는 해시된 비밀번호 사용 필요)
      await connection.query(
        "INSERT INTO users (email, password, name) VALUES (?, ?, ?)",
        ['test@example.com', 'hashedpassword', 'Test User']
      );
      console.log('Sample user inserted.');
    }

    // 상품 테이블 생성
    await connection.query(productsTableQuery);
    console.log('Products table is ready.');

    // 장바구니 테이블 생성
    await connection.query(cartTableQuery);
    console.log('Cart table is ready.');

    // 4단계: 샘플 상품 데이터 삽입 (테이블이 비어있을 경우에만)
    const [products] = await connection.query('SELECT COUNT(*) as count FROM products');
    if (products[0].count === 0) {
      // 샘플 사용자 ID 조회 (상품 등록자로 사용)
      const [sampleUser] = await connection.query("SELECT id FROM users WHERE email = 'test@example.com'");
      const userId = sampleUser[0].id;
      
      // 다양한 카테고리의 샘플 상품들 정의
      const sampleProducts = [
        {
          user_id: userId,
          name: '클래식 티셔츠',
          description: '편안하고 스타일리시한 클래식 티셔츠입니다.',
          price: 29000,
          image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
          stock: 100,
          category: 'clothing'
        },
        {
          user_id: userId,
          name: '모던 진',
          description: '고품질 모던 핏 청바지입니다.',
          price: 89000,
          image_url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
          stock: 50,
          category: 'clothing'
        },
        {
          user_id: userId,
          name: '러닝 슈즈',
          description: '가볍고 편안한 러닝화입니다.',
          price: 129000,
          image_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
          stock: 75,
          category: 'shoes'
        },
        {
          user_id: userId,
          name: '가죽 지갑',
          description: '고급 가죽으로 만든 지갑입니다.',
          price: 59000,
          image_url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400',
          stock: 30,
          category: 'accessories'
        },
        {
          user_id: userId,
          name: '스마트 워치',
          description: '최신 기능을 갖춘 스마트 워치입니다.',
          price: 199000,
          image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
          stock: 25,
          category: 'accessories'
        },
        {
          user_id: userId,
          name: '캐주얼 스니커즈',
          description: '일상에서 편안하게 신을 수 있는 스니커즈입니다.',
          price: 79000,
          image_url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400',
          stock: 60,
          category: 'shoes'
        }
             ];

      // 각 샘플 상품을 데이터베이스에 삽입
      for (const product of sampleProducts) {
        await connection.query(
          'INSERT INTO products (user_id, name, description, price, image_url, stock, category) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [product.user_id, product.name, product.description, product.price, product.image_url, product.stock, product.category]
        );
      }
      console.log('Sample products inserted.');
    }

  } catch (error) {
    // 에러 발생 시 로그 출력 후 프로세스 종료
    console.error('Error setting up the database:', error);
    process.exit(1); // 에러 코드와 함께 프로세스 종료
  } finally {
    // 연결이 존재하면 반드시 해제 (메모리 누수 방지)
    if (connection) {
      connection.release();
      console.log('Database connection released.');
    }
  }
};

// 다른 파일에서 이 함수를 import할 수 있도록 내보내기
module.exports = setupDatabase; 