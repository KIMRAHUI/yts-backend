// ✅ 댓글 관련 라우터 정의
const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// ✅ [GET] /:movie_id
// 특정 영화의 댓글 목록을 조회
// movie_id로 필터링하여 최신순으로 반환
router.get('/:movie_id', async (req, res) => {
  const { movie_id } = req.params;

  try {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('movie_id', movie_id)
      .order('created_at', { ascending: false }); // 최신순 정렬

    if (error) {
      console.error('댓글 조회 오류:', error);
      return res.status(500).json({ error: '댓글 조회 실패' });
    }

    res.json(data);
  } catch (err) {
    console.error('서버 예외 오류:', err);
    res.status(500).json({ error: '서버 오류 발생' });
  }
});

// ✅ [POST] /
// 댓글 작성 – 로그인한 사용자만 가능
// 필수 필드(user_id, username, movie_id, content, rating)를 검증한 후 DB에 삽입
router.post('/', async (req, res) => {
  const { user_id, username, movie_id, content, rating } = req.body;

  try {
    // ⚠️ 필수 필드 확인
    if (!user_id || !username || !movie_id || !content || rating == null) {
      return res.status(400).json({ error: '필수 필드 누락' });
    }

    // ⚠️ rating 범위 검증 (1~5 사이)
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'rating은 1에서 5 사이여야 합니다.' });
    }

    // 📩 Supabase에 댓글 삽입
    const { data, error } = await supabase
      .from('comments')
      .insert([{ user_id, username, movie_id, content, rating }])
      .select()
      .single();

    if (error) {
      console.error('댓글 작성 오류:', error);
      return res.status(500).json({ error: '댓글 작성 실패' });
    }

    res.status(201).json(data); // 작성된 댓글 반환

  } catch (err) {
    console.error('서버 예외 오류:', err);
    res.status(500).json({ error: '서버 오류 발생' });
  }
});

// ✅ [PUT] /:id
// 댓글 수정 – 본인 댓글만 가능
// user_id로 본인 댓글 여부를 검증 후 수정
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { user_id, content, rating } = req.body;

  try {
    // ⚠️ rating 값 유효성 검사
    if (rating != null && (rating < 1 || rating > 5)) {
      return res.status(400).json({ error: 'rating은 1에서 5 사이여야 합니다.' });
    }

    // 🔍 댓글이 본인 것인지 확인
    const { data: existingComment, error: fetchError } = await supabase
      .from('comments')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('댓글 조회 오류:', fetchError);
      return res.status(500).json({ error: '댓글 조회 실패' });
    }

    if (!existingComment || existingComment.user_id !== user_id) {
      return res.status(403).json({ error: '본인 댓글만 수정할 수 있습니다.' });
    }

    // ✏️ 댓글 내용/별점 수정
    const { data, error } = await supabase
      .from('comments')
      .update({ content, rating })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('댓글 수정 오류:', error);
      return res.status(500).json({ error: '댓글 수정 실패' });
    }

    res.json(data); // 수정된 댓글 반환

  } catch (err) {
    console.error('서버 예외 오류:', err);
    res.status(500).json({ error: '서버 오류 발생' });
  }
});

// ✅ [DELETE] /:id
// 댓글 삭제 – 본인 댓글만 가능
// user_id로 댓글 소유 여부 확인 후 삭제 처리
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;

  try {
    // 🔍 댓글 소유자 확인
    const { data: existingComment, error: fetchError } = await supabase
      .from('comments')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('댓글 조회 오류:', fetchError);
      return res.status(500).json({ error: '댓글 조회 실패' });
    }

    if (!existingComment || existingComment.user_id !== user_id) {
      return res.status(403).json({ error: '본인 댓글만 삭제할 수 있습니다.' });
    }

    // 🗑️ 댓글 삭제
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('댓글 삭제 오류:', error);
      return res.status(500).json({ error: '댓글 삭제 실패' });
    }

    res.status(204).end(); // No Content (성공 응답)

  } catch (err) {
    console.error('서버 예외 오류:', err);
    res.status(500).json({ error: '서버 오류 발생' });
  }
});

module.exports = router;
