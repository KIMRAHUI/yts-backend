const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const commentsRouter = require('./routes/comments'); // 댓글 라우트 불러올 예정

app.use(cors());
app.use(express.json());

app.use('/api/comments', commentsRouter); // 댓글 API 라우트 등록

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});
