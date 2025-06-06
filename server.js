const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

//  라우터 파일들 불러오기
const commentsRouter = require('./routes/comments');
const authRouter = require('./routes/auth'); // 회원가입 + 로그인 통합


app.use(cors());
app.use(express.json());

//  라우터 등록
app.use('/api/comments', commentsRouter);
app.use('/api/auth', authRouter);


//  서버 실행
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});
