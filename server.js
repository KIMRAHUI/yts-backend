// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 서버 시작 로그
console.log('🛠 서버 초기화 중...');

// 라우터 파일들 불러오기
const commentsRouter = require('./routes/comments');
const authRouter = require('./routes/auth'); // 회원가입 + 로그인 + 결제정보 통합

// 미들웨어 설정 - CORS 옵션 명시적으로 설정
app.use(cors({
  origin: [
    'http://localhost:5173',                 // 로컬 개발 환경
    'https://your-frontend-production.com'  // 배포된 프론트 주소 (필요시 교체/추가)
  ],
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true, // 인증 관련 요청 시 true로 설정할 수도 있음
}));

app.use(express.json());

// 라우터 등록
app.use('/api/comments', commentsRouter);
console.log('✅ 댓글 라우터 등록 완료: /api/comments');

app.use('/api/auth', authRouter);
console.log('✅ 인증 및 결제 라우터 등록 완료: /api/auth');

// 서버 실행
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});
