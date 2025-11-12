# 🛒 모두의 쇼핑몰

풀스택 쇼핑몰 웹 애플리케이션 프로젝트

## 🚀 빠른 시작

### 필수 요구사항
- Node.js 18+
- MySQL 8.0+
- npm 또는 yarn

### 설치 및 실행

1. **저장소 클론**
```bash
git clone <repository-url>
cd oz-shoppingmall
```

2. **백엔드 설정**
```bash
cd backend
npm install

# .env 파일 생성
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password_here
# DB_NAME=shopping_mall
# JWT_SECRET=your_super_secret_key_here
# PORT=3001

# 서버 실행
npm run dev
```

3. **프론트엔드 설정** (새 터미널)
```bash
cd frontend
npm install

# 서버 실행
npm run dev
```

4. **브라우저에서 접속**
- 프론트엔드: http://localhost:3002
- 백엔드 API: http://localhost:3001

## 📋 주요 기능

### 사용자 기능
- ✅ 회원가입 및 로그인 (JWT 인증)
- ✅ 상품 목록 조회
- ✅ 장바구니 관리 (추가, 수정, 삭제)
- ✅ 사용자 프로필 관리
- ✅ 반응형 디자인

### 기술 스택

**백엔드**
- Node.js
- Express.js
- MySQL
- JWT (jsonwebtoken)
- bcrypt (비밀번호 암호화)
- CORS

**프론트엔드**
- Next.js 15
- TypeScript
- Tailwind CSS
- Zustand (상태 관리)

## 🗂️ 프로젝트 구조

```
oz-shoppingmall/
├── backend/              # 백엔드 서버
│   ├── src/
│   │   ├── config/       # 데이터베이스 설정
│   │   ├── controllers/  # 요청 처리 로직
│   │   ├── middlewares/  # 미들웨어 (인증 등)
│   │   ├── routes/       # API 라우트
│   │   ├── services/     # 비즈니스 로직
│   │   └── index.js      # 서버 진입점
│   └── package.json
│
├── frontend/             # 프론트엔드
│   ├── src/
│   │   ├── app/          # Next.js 페이지
│   │   ├── components/   # React 컴포넌트
│   │   ├── lib/          # 유틸리티 함수
│   │   ├── store/        # Zustand 스토어
│   │   └── styles/       # 전역 스타일
│   └── package.json
│
├── Howtomake.md          # 프로젝트 가이드
├── PROJECT_COMPLETION.md # 완료 보고서
└── README.md             # 이 파일
```

## 🌐 API 엔드포인트

### 인증
- `POST /api/auth/signup` - 회원가입
- `POST /api/auth/login` - 로그인

### 상품
- `GET /api/products` - 상품 목록 조회
- `GET /api/products/:id` - 상품 상세 조회

### 장바구니 (인증 필요)
- `GET /api/cart` - 장바구니 조회
- `POST /api/cart` - 장바구니 추가
- `PUT /api/cart/:productId` - 수량 수정
- `DELETE /api/cart/:productId` - 상품 제거

### 사용자 (인증 필요)
- `GET /api/users/me` - 내 정보 조회
- `PUT /api/users/me` - 내 정보 수정

## 📱 페이지

- `/` - 홈페이지
- `/signup` - 회원가입
- `/login` - 로그인
- `/products` - 상품 목록
- `/cart` - 장바구니
- `/my-page` - 마이페이지

## 🔒 보안

- JWT 기반 인증
- bcrypt를 사용한 비밀번호 암호화
- CORS 설정
- SQL Injection 방어 (준비된 쿼리 사용)

## 📦 샘플 데이터

프로젝트 초기 실행 시 자동으로 샘플 상품이 추가됩니다:
1. 클래식 티셔츠 - 29,000원
2. 모던 진 - 89,000원
3. 러닝 슈즈 - 129,000원
4. 가죽 지갑 - 59,000원
5. 스마트 워치 - 199,000원
6. 캐주얼 스니커즈 - 79,000원

## 🧪 테스트

### API 테스트 (curl)

**회원가입**
```bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"홍길동","email":"hong@example.com","password":"password123"}'
```

**로그인**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"hong@example.com","password":"password123"}'
```

**상품 목록 조회**
```bash
curl http://localhost:3001/api/products
```

## 🎓 학습 포인트

이 프로젝트를 통해 다음을 학습할 수 있습니다:
- RESTful API 설계 및 구현
- JWT 기반 인증/인가
- 관계형 데이터베이스 설계
- React/Next.js를 활용한 SPA 개발
- TypeScript를 사용한 타입 안전성
- 전역 상태 관리 (Zustand)
- 반응형 웹 디자인 (Tailwind CSS)

## 🤝 기여

이 프로젝트는 학습 목적으로 제작되었습니다.

## 📝 라이센스

MIT License

## 👨‍💻 개발자

개발 완료일: 2025-10-20

---

**즐거운 쇼핑하세요! 🛍️**
