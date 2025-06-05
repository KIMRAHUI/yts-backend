const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// ✅ 회원가입 API
router.post('/signup', async (req, res) => {
  const { username, password, birth_year, recovery_email } = req.body;

  try {
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .maybeSingle();

    if (existingUser) {
      return res.status(400).json({ message: '이미 존재하는 아이디입니다.' });
    }

    const { data, error } = await supabase
      .from('users')
      .insert([{ username, password, birth_year, recovery_email }])
      .select()
      .maybeSingle();

    if (error) throw error;

    res.json({ id: data.id }); // Supabase UUID 반환

  } catch (err) {
    console.error('❌ 회원가입 실패:', err.message);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router;
