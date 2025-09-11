# 🛒 쇼핑몰 프로젝트 실습 가이드

> **📌 이 폴더는 완성된 정답지입니다!**  
> 막힐 때마다 참고하되, 직접 코드를 작성해보는 것이 중요합니다.

## 📋 목차
1. [실습 개요](#실습-개요)
2. [개발 환경 준비](#개발-환경-준비)
3. [프로젝트 구조 만들기](#프로젝트-구조-만들기)
4. [1단계: 백엔드 기본 설정](#1단계-백엔드-기본-설정)
5. [2단계: 데이터베이스 연동](#2단계-데이터베이스-연동)
6. [3단계: 사용자 인증 시스템](#3단계-사용자-인증-시스템)
7. [4단계: 상품 관리 시스템](#4단계-상품-관리-시스템)
8. [5단계: 프론트엔드 기본 구조](#5단계-프론트엔드-기본-구조)
9. [6단계: 로그인/회원가입 페이지](#6단계-로그인회원가입-페이지)
10. [7단계: 상품 목록 페이지](#7단계-상품-목록-페이지)
11. [8단계: 장바구니 기능](#8단계-장바구니-기능)
12. [9단계: 마이페이지](#9단계-마이페이지)
13. [10단계: 스타일링 완성](#10단계-스타일링-완성)

---

## 🎯 실습 개요

### 무엇을 만들까요?
완전한 쇼핑몰 웹사이트를 처음부터 끝까지 직접 구현합니다.

### 최종 결과물
- 회원가입/로그인 시스템
- 상품 목록 조회
- 장바구니 기능
- 사용자 프로필 관리
- 반응형 웹 디자인

### 기술 스택
**백엔드**: Node.js + Express.js + MySQL + JWT  
**프론트엔드**: Next.js + TypeScript + Tailwind CSS + Zustand

### 실습 방법
1. **각 단계별로 직접 코드 작성**
2. **막히면 정답지 폴더의 해당 파일 참고**
3. **복사 붙여넣기 금지! 직접 타이핑하며 이해**
4. **에러가 나도 당황하지 말고 차근차근 해결**

### 초보자를 위한 팁
- **터미널 2개 사용**: 하나는 백엔드(3001포트), 하나는 프론트엔드(3000포트)
- **브라우저 개발자 도구 활용**: F12 → Network 탭에서 API 호출 확인
- **Postman 설치**: API 테스트용 (https://www.postman.com/)
- **에러 메시지 꼼꼼히 읽기**: 대부분의 해답이 에러 메시지에 있습니다

---

## 🔧 개발 환경 준비

### 1. 필수 프로그램 설치

```bash
# Node.js 설치 확인 (v18 이상)
node --version
npm --version

# MySQL 설치 및 실행
# macOS: brew install mysql && brew services start mysql
# Windows: https://dev.mysql.com/downloads/installer/
```

### 2. 새 프로젝트 디렉토리 생성

```bash
# 실습용 새 폴더 생성
mkdir my-shopping-mall
cd my-shopping-mall

# 백엔드와 프론트엔드 폴더 생성
mkdir backend frontend
```

### 3. VS Code 확장 프로그램 설치
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint
- Auto Rename Tag

---

## 📁 프로젝트 구조 만들기

### 목표 구조
```
my-shopping-mall/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── services/
│   │   └── index.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── app/
    │   ├── components/
    │   ├── lib/
    │   └── store/
    └── package.json
```

### 실습: 폴더 구조 생성
```bash
# 백엔드 폴더 구조
cd backend
mkdir src
cd src
mkdir config controllers middlewares routes services
touch index.js

# 프론트엔드 폴더 구조  
cd ../../frontend
mkdir src
cd src
mkdir app components lib store
```

---

## 🔙 1단계: 백엔드 기본 설정

### 목표
Express.js 서버를 만들고 기본 API 응답을 확인합니다.

### 실습 1-1: package.json 생성

```bash
cd my-shopping-mall/backend
npm init -y
```

### 실습 1-2: 필요한 패키지 설치

```bash
npm install express cors dotenv mysql2 jsonwebtoken bcrypt bcryptjs
npm install -D nodemon
```

> **📌 주의**: bcrypt와 bcryptjs 둘 다 설치합니다 (정답지에서 bcrypt 사용)

### 실습 1-3: package.json scripts 수정

**직접 작성해보세요!**
```json
{
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js"
  }
}
```

### 실습 1-4: 기본 서버 만들기 (src/index.js)

**스스로 작성해보세요!** 막히면 정답지의 `backend/src/index.js` 참고

**힌트:**
```javascript
// 필요한 모듈들 import
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// 환경변수 로드
dotenv.config();

// Express 앱 생성
const app = express();

// 미들웨어 설정
app.use(cors());
app.use(express.json());

// 테스트 라우트
app.get('/', (req, res) => {
  res.json({ message: 'Hello Shopping Mall!' });
});

// 서버 시작
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
```

### 실습 1-5: 환경변수 설정 (.env)

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=shopping_mall
JWT_SECRET=your_super_secret_key_here
PORT=3001
```

### 실습 1-6: 서버 실행 테스트

```bash
npm run dev
```

브라우저에서 `http://localhost:3001` 접속하여 "Hello Shopping Mall!" 메시지 확인

**✅ 체크포인트**: 서버가 정상적으로 실행되고 응답이 오나요?

---

## 🗄️ 2단계: 데이터베이스 연동

### 목표
MySQL 데이터베이스에 연결하고 테이블을 생성합니다.

### 실습 2-1: 데이터베이스 연결 설정 (src/config/db.js)

**직접 작성해보세요!**

**힌트:**
```javascript
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
```

### 실습 2-2: 데이터베이스 초기 설정 (src/config/dbSetup.js)

**이 파일은 복잡하니 정답지를 참고하면서 단계별로 작성하세요!**

**작성할 내용:**
1. 데이터베이스 생성
2. users 테이블 생성 (이메일, 비밀번호, 이름, 전화번호, 주소 등)
3. products 테이블 생성 (상품명, 설명, 가격, 이미지URL, 재고, 카테고리 등)
4. cart 테이블 생성 (사용자ID, 상품ID, 수량 등)
5. 샘플 데이터 삽입

**정답지 위치**: `backend/src/config/dbSetup.js`

> **💡 초보자 팁**: 
> - 테이블 생성 쿼리는 매우 중요합니다
> - AUTO_INCREMENT, PRIMARY KEY, FOREIGN KEY 개념을 이해하세요
> - UNIQUE 제약조건으로 중복 방지

### 실습 2-3: index.js에 DB 설정 추가

```javascript
// index.js 상단에 추가
const setupDatabase = require('./config/dbSetup');

// 서버 시작 함수 수정
const startServer = async () => {
  await setupDatabase();
  
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

startServer();
```

### 실습 2-4: 데이터베이스 연결 테스트

```bash
npm run dev
```

**✅ 체크포인트**: 콘솔에 데이터베이스 연결 성공 메시지가 나타나나요?

---

## 🔐 3단계: 사용자 인증 시스템

### 목표
회원가입과 로그인 API를 구현합니다.

### 실습 3-1: 인증 서비스 만들기 (src/services/authService.js)

**직접 작성해보세요!**

**구현할 함수들:**
```javascript
const pool = require('../config/db');
const bcrypt = require('bcrypt');  // 정답지에서는 bcrypt 사용
const jwt = require('jsonwebtoken');

// 회원가입
exports.signup = async (email, password, name) => {
  const connection = await pool.getConnection();
  try {
    // 1. 이메일 중복 확인
    const [rows] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length > 0) {
      throw new Error('User with this email already exists');
    }

    // 2. 비밀번호 해시화 (saltRounds: 10)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. 사용자 데이터베이스에 저장
    const [result] = await connection.query(
      'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
      [email, hashedPassword, name]
    );

    // 4. 사용자 ID 반환
    return result.insertId;
  } finally {
    connection.release(); // 연결 해제 필수!
  }
};

// 로그인
exports.login = async (email, password) => {
  const connection = await pool.getConnection();
  try {
    // 1. 이메일로 사용자 조회
    const [rows] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      throw new Error('Invalid email or password');
    }

    const user = rows[0];

    // 2. 비밀번호 검증
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    // 3. JWT 토큰 생성 및 반환
    const payload = {
      userId: user.id,
      email: user.email,
      name: user.name
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    return token;
  } finally {
    connection.release(); // 연결 해제 필수!
  }
};
```

> **💡 초보자 팁**:
> - `connection.release()`는 반드시 finally 블록에서 호출
> - bcrypt.hash()의 두 번째 매개변수는 salt rounds (10이 적당)
> - JWT payload에는 민감하지 않은 정보만 포함

**막히면 정답지 참고**: `backend/src/services/authService.js`

### 실습 3-2: 인증 컨트롤러 만들기 (src/controllers/authController.js)

**직접 작성해보세요!**

**구현할 함수들:**
```javascript
// 회원가입 처리
exports.signup = async (req, res) => {
  // 1. 요청 데이터 검증
  // 2. authService.signup 호출
  // 3. 응답 반환
};

// 로그인 처리  
exports.login = async (req, res) => {
  // 1. 요청 데이터 검증
  // 2. authService.login 호출
  // 3. 토큰 응답
};
```

### 실습 3-3: 인증 라우트 만들기 (src/routes/authRoutes.js)

**직접 작성해보세요!**

```javascript
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/signup
router.post('/signup', authController.signup);

// POST /api/auth/login
router.post('/login', authController.login);

module.exports = router;
```

### 실습 3-4: index.js에 라우트 연결

```javascript
// 라우트 import
const authRoutes = require('./routes/authRoutes');

// 라우트 연결
app.use('/api/auth', authRoutes);
```

### 실습 3-5: JWT 미들웨어 만들기 (src/middlewares/authMiddleware.js)

**직접 작성해보세요!**

**힌트:**
```javascript
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  // 1. Authorization 헤더에서 토큰 추출
  // 2. 토큰 검증
  // 3. 사용자 정보를 req.user에 저장
  // 4. next() 호출
};

module.exports = { authenticateToken };
```

### 실습 3-6: Postman으로 API 테스트

**회원가입 테스트:**
```
POST http://localhost:3001/api/auth/signup
Content-Type: application/json

{
  "name": "테스트 사용자",
  "email": "test@test.com", 
  "password": "123456"
}
```

**로그인 테스트:**
```
POST http://localhost:3001/api/auth/login
Content-Type: application/json

{
  "email": "test@test.com",
  "password": "123456"
}
```

**✅ 체크포인트**: 회원가입과 로그인이 정상적으로 작동하고 JWT 토큰이 반환되나요?

---

## 📦 4단계: 상품 관리 시스템

### 목표
상품 목록 조회 API를 구현합니다.

### 실습 4-1: 상품 서비스 만들기 (src/services/productService.js)

**직접 작성해보세요!**

```javascript
exports.getAllProducts = async () => {
  // 모든 상품 조회
};

exports.getProductById = async (id) => {
  // ID로 특정 상품 조회
};
```

### 실습 4-2: 상품 컨트롤러 만들기 (src/controllers/productController.js)

**직접 작성해보세요!**

### 실습 4-3: 상품 라우트 만들기 (src/routes/productRoutes.js)

**직접 작성해보세요!**

### 실습 4-4: 장바구니 시스템 구현

**다음 파일들을 차례로 구현하세요:**
- `src/services/cartService.js`
- `src/controllers/cartController.js` 
- `src/routes/cartRoutes.js`

**정답지 참고**: `backend/src/services/cartService.js` 등

### 실습 4-5: 사용자 관리 시스템 구현

**다음 파일들을 구현하세요:**
- `src/services/userService.js`
- `src/controllers/userController.js`
- `src/routes/userRoutes.js`

**✅ 체크포인트**: 모든 API가 Postman에서 정상 작동하나요?

---

## 🎨 5단계: 프론트엔드 기본 구조

### 목표
Next.js 프로젝트를 생성하고 기본 구조를 만듭니다.

### 실습 5-1: Next.js 프로젝트 생성

```bash
cd my-shopping-mall/frontend
npx create-next-app@latest . --typescript --tailwind --app --src-dir --import-alias "@/*"
```

> **📌 주의**: `--src-dir` 옵션을 사용해야 src 폴더가 생성됩니다!

### 실습 5-2: 추가 패키지 설치

```bash
npm install zustand
```

### 실습 5-3: 폴더 구조 정리

```bash
# Next.js는 이미 src 폴더를 생성했습니다
# 추가로 필요한 폴더만 생성
mkdir src/lib src/store
```

> **📌 주의**: Next.js 15에서는 이미 src 폴더와 app 폴더가 생성됩니다!

### 실습 5-4: 기본 레이아웃 만들기 (src/app/layout.tsx)

**직접 작성해보세요!**

> **📌 중요**: layout.tsx를 수정한 후에는 Navbar와 Footer 컴포넌트를 만들어야 합니다!

**힌트:**
```typescript
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
// import Navbar from "../components/layout/Navbar";  // 나중에 만들 예정
// import Footer from "../components/layout/Footer";  // 나중에 만들 예정

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono", 
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "모두의 쇼핑몰",
  description: "최고의 품질과 합리적인 가격의 온라인 쇼핑몰",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="min-h-screen flex flex-col">
          {/* <Navbar /> 나중에 추가 */}
          <main className="flex-1">
            {children}
          </main>
          {/* <Footer /> 나중에 추가 */}
        </div>
      </body>
    </html>
  );
}
```

> **📌 주의**: 
> - CSS 파일 경로는 `../styles/globals.css`입니다
> - Navbar와 Footer는 나중에 만들 예정이므로 주석 처리
> - Next.js에서 제공하는 폰트와 메타데이터 설정 포함

### 실습 5-5: 홈페이지 만들기 (src/app/page.tsx)

**직접 작성해보세요!**

**구현할 내용:**
- Hero 섹션
- 기능 소개 섹션
- "지금 쇼핑하기" 버튼

**정답지 참고**: `frontend/src/app/page.tsx`

**✅ 체크포인트**: `npm run dev`로 프론트엔드가 정상 실행되나요?

---

## 🔑 6단계: 로그인/회원가입 페이지

### 목표
사용자가 회원가입하고 로그인할 수 있는 페이지를 만듭니다.

### 실습 6-1: API 유틸리티 만들기 (src/lib/api.ts)

**직접 작성해보세요!**

**구현할 내용:**
```typescript
// API 기본 설정
const API_BASE_URL = 'http://localhost:3001/api';

// 인증 헤더 생성 함수
export const getAuthHeaders = () => {
  // localStorage에서 토큰 가져오기
};

// 공통 API 요청 함수
export const apiRequest = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
  // fetch 요청 구현
};

// 인증 API
export const authApi = {
  login: (credentials) => { /* 구현 */ },
  signup: (userData) => { /* 구현 */ }
};
```

**정답지 참고**: `frontend/src/lib/api.ts`

### 실습 6-2: 헬퍼 함수 만들기 (src/lib/helpers.ts)

**직접 작성해보세요!**

**구현할 내용:**
- 토큰 관리 함수들
- 유효성 검사 함수들
- 에러 메시지 처리 함수

### 실습 6-3: 재사용 가능한 UI 컴포넌트 만들기

**Button 컴포넌트** (src/components/ui/Button.tsx)
```typescript
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  // 더 많은 props...
}

const Button: React.FC<ButtonProps> = ({ ... }) => {
  // 구현
};
```

**Input 컴포넌트** (src/components/ui/Input.tsx)
**직접 구현해보세요!**

### 실습 6-4: 로그인 폼 만들기 (src/components/forms/LoginForm.tsx)

**직접 작성해보세요!**

**구현할 기능:**
- 이메일/비밀번호 입력
- 폼 검증
- API 호출
- 로딩 상태 표시
- 에러 처리
- 로그인 성공 시 토큰 저장

### 실습 6-5: 회원가입 폼 만들기 (src/components/forms/SignupForm.tsx)

**직접 작성해보세요!**

### 실습 6-6: 로그인 페이지 만들기 (src/app/login/page.tsx)

**직접 작성해보세요!**

```typescript
import LoginForm from '@/components/forms/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">로그인</h1>
        <LoginForm />
      </div>
    </div>
  );
}
```

### 실습 6-7: 회원가입 페이지 만들기 (src/app/signup/page.tsx)

**직접 작성해보세요!**

**✅ 체크포인트**: 로그인/회원가입이 정상적으로 작동하나요?

---

## 🛍️ 7단계: 상품 목록 페이지

### 목표
상품들을 카드 형태로 보여주는 페이지를 만듭니다.

### 실습 7-1: 상품 API 함수 추가 (src/lib/api.ts)

**api.ts에 추가할 내용:**
```typescript
// 상품 타입 정의
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock: number;
  category: string;
}

// 상품 API
export const productApi = {
  getAll: () => apiRequest<{ products: Product[] }>('/products')
};
```

### 실습 7-2: 상품 카드 컴포넌트 만들기 (src/components/ui/ProductCard.tsx)

**직접 작성해보세요!**

**구현할 내용:**
- 상품 이미지
- 상품명, 설명
- 가격 표시
- 재고 정보
- "장바구니 담기" 버튼

**정답지 참고**: `frontend/src/components/ui/ProductCard.tsx`

### 실습 7-3: 상품 목록 클라이언트 컴포넌트 만들기 (src/components/pages/ProductsClient.tsx)

**직접 작성해보세요!**

**구현할 기능:**
- useEffect로 상품 데이터 로드
- 로딩 상태 관리
- 에러 처리
- 상품 카드들을 그리드로 배치

### 실습 7-4: 상품 목록 페이지 만들기 (src/app/products/page.tsx)

**직접 작성해보세요!**

```typescript
import ProductsClient from '@/components/pages/ProductsClient';

export default function ProductsPage() {
  return <ProductsClient />;
}
```

### 실습 7-5: 네비게이션 바 만들기 (src/components/layout/Navbar.tsx)

**직접 작성해보세요!**

**구현할 내용:**
- 로고/홈 링크
- 상품 목록 링크  
- 로그인/로그아웃 버튼
- 장바구니 링크
- 반응형 메뉴 (모바일 햄버거 메뉴)

**정답지 참고**: `frontend/src/components/layout/Navbar.tsx`

> **💡 초보자 팁**:
> - `'use client'` 지시어 필요 (상태 관리 때문)
> - useState로 모바일 메뉴 열림/닫힘 상태 관리
> - localStorage에서 토큰 확인하여 로그인 상태 판단

**✅ 체크포인트**: 상품 목록이 예쁘게 표시되나요?

---

## 🛒 8단계: 장바구니 기능

### 목표
상품을 장바구니에 담고 관리할 수 있는 기능을 구현합니다.

### 실습 8-1: 장바구니 상태 관리 만들기 (src/store/cartStore.ts)

**직접 작성해보세요!**

**구현할 기능:**
```typescript
interface CartState {
  items: CartItem[];
  total: number;
  loading: boolean;
  
  addItem: (productId: number, quantity: number) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  fetchCart: () => Promise<void>;
}
```

**정답지 참고**: `frontend/src/store/cartStore.ts`

### 실습 8-2: 장바구니 API 함수 추가 (src/lib/api.ts)

**api.ts에 추가할 내용:**
```typescript
export const cartApi = {
  getCart: () => { /* 구현 */ },
  addItem: (productId: number, quantity: number) => { /* 구현 */ },
  updateItem: (productId: number, quantity: number) => { /* 구현 */ },
  removeItem: (productId: number) => { /* 구현 */ }
};
```

### 실습 8-3: 장바구니 클라이언트 컴포넌트 만들기 (src/components/pages/CartClient.tsx)

**직접 작성해보세요!**

**구현할 내용:**
- 장바구니 아이템 목록
- 수량 변경 버튼
- 아이템 삭제 버튼
- 총 금액 계산
- 빈 장바구니 상태 처리

### 실습 8-4: 장바구니 페이지 만들기 (src/app/cart/page.tsx)

**직접 작성해보세요!**

### 실습 8-5: 상품 카드에 장바구니 담기 기능 추가

**ProductCard 컴포넌트와 ProductsClient 컴포넌트를 수정하여 장바구니 담기 기능을 추가하세요.**

**✅ 체크포인트**: 장바구니에 상품을 담고 수정/삭제할 수 있나요?

---

## 👤 9단계: 마이페이지

### 목표
사용자 정보를 보고 수정할 수 있는 페이지를 만듭니다.

### 실습 9-1: 사용자 API 함수 추가 (src/lib/api.ts)

**api.ts에 추가할 내용:**
```typescript
export const authApi = {
  // 기존 함수들...
  getProfile: () => apiRequest<User>('/users/me'),
  updateProfile: (userData: UpdateUserRequest) => 
    apiRequest<User>('/users/me', { method: 'PUT', body: JSON.stringify(userData) })
};
```

### 실습 9-2: 마이페이지 클라이언트 컴포넌트 만들기 (src/components/pages/MyPageClient.tsx)

**직접 작성해보세요!**

**구현할 기능:**
- 사용자 정보 표시
- 정보 수정 모드
- 폼 검증
- 저장 기능

**정답지 참고**: `frontend/src/components/pages/MyPageClient.tsx`

### 실습 9-3: 마이페이지 만들기 (src/app/my-page/page.tsx)

**직접 작성해보세요!**

### 실습 9-4: 인증 상태 관리 추가 (src/store/authStore.ts)

**직접 작성해보세요!**

**구현할 기능:**
- 로그인 상태 관리
- 사용자 정보 저장
- 자동 로그인 체크
- 로그아웃 기능

**✅ 체크포인트**: 마이페이지에서 정보를 수정할 수 있나요?

---

## 🎨 10단계: 스타일링 완성

### 목표
Tailwind CSS로 반응형 디자인을 완성합니다.

### 실습 10-1: 전역 스타일 설정 (src/styles/globals.css)

**Tailwind CSS 기본 설정과 커스텀 스타일을 추가하세요.**

> **📌 주의**: 파일 경로는 `src/styles/globals.css`입니다!

### 실습 10-2: 반응형 네비게이션 완성

**모바일에서도 잘 작동하는 햄버거 메뉴를 구현하세요.**

### 실습 10-3: 푸터 컴포넌트 만들기 (src/components/layout/Footer.tsx)

**직접 작성해보세요!**

### 실습 10-4: 로딩 및 에러 상태 UI 개선

**로딩 스피너, 에러 메시지 등을 예쁘게 만들어보세요.**

### 실습 10-5: 최종 디자인 검토

**모든 페이지가 일관된 디자인을 가지고 있는지 확인하세요.**

**✅ 체크포인트**: 모든 기능이 완성되고 디자인이 만족스러운가요?

---

## 🚀 최종 점검 및 배포 준비

### 기능 체크리스트

- [ ] 회원가입/로그인
- [ ] 상품 목록 조회
- [ ] 장바구니 담기/수정/삭제
- [ ] 사용자 정보 수정
- [ ] 반응형 디자인
- [ ] 에러 처리
- [ ] 로딩 상태 표시

### 테스트 시나리오

1. **신규 사용자 플로우**
   - 회원가입 → 로그인 → 상품 둘러보기 → 장바구니 담기

2. **기존 사용자 플로우**
   - 로그인 → 마이페이지 확인 → 장바구니 확인

3. **반응형 테스트**
   - 모바일, 태블릿, 데스크톱에서 모든 기능 확인

### 성능 최적화 (선택사항)

- 이미지 최적화
- API 응답 캐싱
- 코드 스플리팅
- SEO 최적화

---

## 🎉 수고하셨습니다!

### 배운 것들

- **백엔드**: Node.js, Express.js, MySQL, JWT 인증
- **프론트엔드**: Next.js, React, TypeScript, Tailwind CSS
- **상태 관리**: Zustand
- **API 통신**: fetch, REST API
- **보안**: 비밀번호 암호화, JWT 토큰
- **데이터베이스**: SQL, 관계형 DB 설계

### 다음 단계 추천

- 결제 시스템 추가
- 관리자 페이지 구현
- 상품 검색/필터링
- 실시간 알림
- 이메일 인증
- 소셜 로그인
- 배포 (Vercel, Heroku 등)

### 추가 학습 자료

- **Next.js 공식 문서**: https://nextjs.org/docs
- **Express.js 가이드**: https://expressjs.com/
- **MySQL 튜토리얼**: https://www.mysqltutorial.org/
- **Tailwind CSS**: https://tailwindcss.com/docs

---

## 💡 자주 발생하는 문제와 해결법

### CORS 오류
```
Access to fetch at 'http://localhost:3001/api/products' from origin 'http://localhost:3000' has been blocked by CORS policy
```
**해결법**: 백엔드에서 CORS 설정 확인
```javascript
// 현재 정답지에서는 모든 origin 허용
app.use(cors());

// 더 안전한 방법 (운영 환경에서 권장)
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

### JWT 토큰 오류
```typescript
// 토큰 형식 확인
Authorization: Bearer ${token}
```

### 데이터베이스 연결 오류
```bash
# MySQL 서비스 상태 확인
brew services list | grep mysql
```

### 환경 변수 오류
```bash
# .env 파일 위치와 내용 확인
cat backend/.env
```

---

**🎯 목표**: 이 가이드를 통해 풀스택 개발의 전체 플로우를 이해하고, 스스로 웹 애플리케이션을 만들 수 있게 되는 것!

**화이팅! 🚀** 