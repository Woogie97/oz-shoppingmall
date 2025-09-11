// Express 웹 프레임워크 - 서버 구축을 위한 핵심 모듈
const express = require('express');
// 환경변수 관리 - .env 파일의 설정값들을 process.env로 사용할 수 있게 해줌
const dotenv = require('dotenv');
// CORS 설정 - 프론트엔드에서 백엔드 API 호출을 허용하기 위한 모듈
const cors = require('cors');

// 각 기능별 라우터들을 불러옴 - API 엔드포인트들을 모듈화하여 관리
const authRoutes = require('./routes/authRoutes');       // 인증 관련 API (/api/auth)
const productRoutes = require('./routes/productRoutes'); // 상품 관련 API (/api/products)
const userRoutes = require('./routes/userRoutes');       // 사용자 관련 API (/api/users)
const cartRoutes = require('./routes/cartRoutes');       // 장바구니 관련 API (/api/cart)

// 데이터베이스 초기 설정 함수 - 테이블 생성 및 샘플 데이터 삽입
const setupDatabase = require('./config/dbSetup');

// 환경변수 파일(.env) 로드 - DB 접속 정보, JWT 시크릿 등을 설정
dotenv.config();

// Express 앱 인스턴스 생성 - 서버의 핵심 객체
const app = express();

// CORS 미들웨어 - 프론트엔드(localhost:3000)에서 백엔드(localhost:3001) 호출 허용
app.use(cors());
// JSON 파싱 미들웨어 - 클라이언트가 보낸 JSON 데이터를 req.body로 파싱
app.use(express.json());

// API 라우터들을 각각의 경로에 연결
app.use('/api/auth', authRoutes);       // 인증: 회원가입, 로그인
app.use('/api/products', productRoutes); // 상품: 목록조회, 생성, 수정, 삭제
app.use('/api/users', userRoutes);       // 사용자: 프로필 조회
app.use('/api/cart', cartRoutes);        // 장바구니: 추가, 조회, 수정, 삭제

// 서버 포트 설정 - 환경변수에서 가져오거나 기본값 3001 사용
const port = process.env.PORT || 3001;

// 루트 경로 테스트용 엔드포인트 - 서버 동작 확인용
app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

// 서버 시작 함수 - 비동기로 데이터베이스 설정 후 서버 구동
const startServer = async () => {
  // 데이터베이스 테이블 생성 및 초기 데이터 설정
  await setupDatabase();
  
  // 지정된 포트에서 서버 시작
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

// 서버 실행
startServer(); 