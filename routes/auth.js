const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// ✅ 회원가입
router.post('/signup', async (req, res) => {
  const { username, password, birth_year, recovery_email } = req.body;

  try {
    // 기존 유저 확인
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .maybeSingle();

    if (existingUser) {
      return res.status(400).json({ message: '이미 존재하는 아이디입니다.' });
    }

    // 신규 유저 등록
    const { data, error } = await supabase
      .from('users')
      .insert([{ username, password, birth_year, recovery_email }])
      .select()
      .maybeSingle();

    if (error) throw error;

    res.status(201).json({
      id: data.id,
      username: data.username,
      message: '회원가입 성공',
    });

  } catch (err) {
    console.error('❌ 회원가입 실패:', err.message);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// ✅ 로그인
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('password', password) // ⚠️ 개발용 평문 비교
      .maybeSingle();

    if (error) throw error;

    if (!user) {
      return res.status(401).json({ message: '아이디 또는 비밀번호가 틀렸습니다.' });
    }

    res.json({
      id: user.id,
      username: user.username,
      birth_year: user.birth_year,
      message: '로그인 성공',
    });

  } catch (err) {
    console.error('❌ 로그인 실패:', err.message);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// ✅ 결제 정보 및 멤버십 업데이트
router.patch('/update-payment', async (req, res) => {
  const {
    id,
    membership,
    payment_type,
    payment_bank,
    payment_info,
    payment_date,
    receipt_email
  } = req.body;

  try {
    const { data, error } = await supabase
      .from('users')
      .update({
        membership,
        payment_type,
        payment_bank,
        payment_info,
        payment_date,
        receipt_email
      })
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) throw error;

    res.json({ message: '✅ 결제 정보 업데이트 완료', data });

  } catch (err) {
    console.error('❌ 결제 정보 업데이트 실패:', err.message);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router;
