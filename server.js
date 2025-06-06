// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 서버 시작 로그
console.log('🛠 서버 초기화 중...');

//  라우터 파일들 불러오기
const commentsRouter = require('./routes/comments');
const authRouter = require('./routes/auth'); // 회원가입 + 로그인 + 결제정보 통합

//  미들웨어 설정
app.use(cors());
app.use(express.json());

//  라우터 등록
app.use('/api/comments', commentsRouter);
console.log('✅ 댓글 라우터 등록 완료: /api/comments');

app.use('/api/auth', authRouter);
console.log('✅ 인증 및 결제 라우터 등록 완료: /api/auth');

//  서버 실행
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});
