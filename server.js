const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

const commentsRouter = require('./routes/comments');
const authRouter = require('./routes/auth'); 

app.use(cors());
app.use(express.json());

app.use('/api/comments', commentsRouter);
app.use('/api/users', authRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});
