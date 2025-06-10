const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// ✅ [POST] /signup - 회원가입 처리
// 사용자가 아이디(username), 비밀번호(password), 출생년도(birth_year), 복구 이메일을 제공하면
// → 기존 아이디 중복 체크 후 → Supabase에 새로운 유저 데이터 삽입
router.post('/signup', async (req, res) => {
  const { username, password, birth_year, recovery_email } = req.body;

  try {
    // 🔎 동일 username 존재 여부 확인
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .maybeSingle(); // 결과 없으면 null 반환

    if (existingUser) {
      return res.status(400).json({ message: '이미 존재하는 아이디입니다.' });
    }

    // 📝 신규 유저 등록
    const { data, error } = await supabase
      .from('users')
      .insert([{ username, password, birth_year, recovery_email }])
      .select()
      .maybeSingle();

    if (error) throw error;

    // ✅ 성공 응답 반환
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

// ✅ [POST] /login - 로그인 처리
// 사용자 아이디(username)와 비밀번호(password)를 확인하여 로그인 허용
// 현재는 개발용으로 평문 비교 사용 (보안 강화 필요)
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // 🔎 아이디/비번으로 유저 조회
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('password', password) // ⚠️ 현재는 평문 저장/비교 (실서비스에서는 해싱 필요)
      .maybeSingle();

    if (error) throw error;

    if (!user) {
      return res.status(401).json({ message: '아이디 또는 비밀번호가 틀렸습니다.' });
    }

    // ✅ 로그인 성공 응답
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

// ✅ [PATCH] /update-payment - 결제 및 멤버십 정보 업데이트
// 마이페이지에서 결제 수단, 날짜, 이메일 등 입력 후 사용자 정보를 업데이트함
router.patch('/update-payment', async (req, res) => {
  const {
    id, // 사용자 id (primary key)
    membership,
    payment_type,
    payment_bank,
    payment_info,
    payment_date,
    receipt_email
  } = req.body;

  try {
    // 🔄 users 테이블에서 해당 id의 정보 업데이트
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

    // ✅ 성공 응답
    res.json({ message: '✅ 결제 정보 업데이트 완료', data });

  } catch (err) {
    console.error('❌ 결제 정보 업데이트 실패:', err.message);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// ✅ [GET] /user/:id - 유저 정보 단일 조회
// 마이페이지 진입 시 Supabase에서 사용자 정보 로드
router.get('/user/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // 🔍 유저 정보 조회
    const { data, error } = await supabase
      .from('users')
      .select(`
        id,
        username,
        birth_year,
        membership,
        payment_type,
        payment_bank,
        payment_info,
        payment_date,
        receipt_email,
        recovery_email
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    // ✅ 조회 성공 응답
    res.json(data);

  } catch (err) {
    console.error('❌ 유저 조회 실패:', err.message);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router;
