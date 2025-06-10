# 🎬 YTS 영화 플랫폼 - Backend

영화 탐색 및 후기 기능을 지원하는 YTS 기반 영화 플랫폼의 백엔드입니다.  
Express + Supabase 기반으로 구축되었으며, 댓글 시스템, 로그인/회원가입, 마이페이지 결제 정보 연동 등의 기능을 제공합니다.

---

## 🚀 프로젝트 개요

- YTS API 기반 프론트엔드와 연결되는 백엔드 API 서버
- 사용자 회원가입/로그인 및 마이페이지 정보 관리
- 영화 후기 등록/수정/삭제 기능 제공
- Supabase PostgreSQL 기반 DB 연동

---

## 🛠️ 기술 스택

- Backend Framework: Express.js
- Database: Supabase (PostgreSQL)
- Deployment: Render
- Language: Node.js (CommonJS)

---

## 📌 주요 기능

- ✅ 회원가입 / 로그인 (username, password 기반)
- ✅ 사용자 정보 조회 및 결제 정보 수정
- ✅ 영화별 댓글(후기) 등록 / 수정 / 삭제
- ✅ 마이페이지 연동 API (후기 리스트 제공)
- ✅ rating 범위 검증, 댓글 소유자 확인 기능 포함

---

## 📁 디렉토리 구조
```
yts-backend/
├── routes/
│ ├── auth.js # 회원가입, 로그인, 유저 정보, 결제 수정
│ └── comments.js # 영화 댓글 CRUD 라우터
├── supabaseClient.js # Supabase 초기화
├── server.js # 서버 실행 및 라우터 연결
├── .env # 환경변수 (SUPABASE_URL, SUPABASE_KEY)
├── package.json
└── README.md
```

---

## 📡 주요 API 엔드포인트

### ✅ Auth 관련 (`/api/auth`)
| Method | Endpoint             | 설명 |
|--------|----------------------|------|
| POST   | `/signup`            | 회원가입 |
| POST   | `/login`             | 로그인 |
| GET    | `/user/:id`          | 유저 정보 조회 |
| PATCH  | `/update-payment`    | 결제 및 멤버십 정보 수정 |

### ✅ Comments 관련 (`/api/comments`)
| Method | Endpoint             | 설명 |
|--------|----------------------|------|
| GET    | `/:movie_id`         | 영화별 댓글 목록 조회 |
| POST   | `/`                  | 댓글 작성 |
| PUT    | `/:id`               | 댓글 수정 |
| DELETE | `/:id`               | 댓글 삭제 |

---

## 🌐 배포 방법 (Render 기준)

1. GitHub 저장소에 백엔드 푸시
2. Render에서 `Web Service` 생성
3. 환경변수 설정:(Settings → Environment Variables)
SUPABASE_URL=https://gdisuhsgtxpcvxvlemuv.supabase.co
SUPABASE_KEY=서비스 역할 키 (절대 공개 금지) 

## 🔐 보안 및 향후 개선점

| 항목 | 설명 |
|------|------|
| 🔐 비밀번호 | 현재는 평문 저장 → bcrypt 해싱 적용 예정 |
| 🔐 인증     | JWT 인증 도입 가능 (현재는 간단 로그인) |
| ✅ 유효성   | rating 범위 및 필드 검증 수행 |
| ⛔ 댓글 보호 | 프론트에서 user_id 비교 → 추후 미들웨어에서 인증 검증 추천 |

---

## 💡 어필 포인트

- Supabase 실시간 DB 연동 기반 풀스택 백엔드 구현 경험
- rating 제한 및 사용자 권한 기반 CRUD 로직 구현
- 마이페이지 연동 및 결제 정보 수정 등 실제 서비스 구조 반영
- 실용성과 학습 목적을 모두 만족하는 구조

---

## 🧷 데이터베이스 초기화 SQL 
sqld/supabase.sql: Supabase 전용 스키마 및 초기 데이터
sqld/mysql.sql: 로컬 개발 환경(MySQL/MariaDB)에서 테스트용 사용 가능

