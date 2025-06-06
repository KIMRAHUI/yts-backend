// routes/comments.js
const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// 댓글 가져오기 (특정 영화 ID 기준)
router.get('/:movie_id', async (req, res) => {
  const { movie_id } = req.params;

  try {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('movie_id', movie_id)
      .order('created_at', { ascending: false });

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

// 댓글 작성 (로그인된 사용자만 가능, user_id, username 서버에서 처리하는 것을 가정)
router.post('/', async (req, res) => {
  const { user_id, username, movie_id, content, rating } = req.body;

  try {
    // 필수 필드 검증
    if (!user_id || !username || !movie_id || !content || rating == null) {
      return res.status(400).json({ error: '필수 필드 누락' });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'rating은 1에서 5 사이여야 합니다.' });
    }

    const { data, error } = await supabase
      .from('comments')
      .insert([{ user_id, username, movie_id, content, rating }])
      .select()
      .single();

    if (error) {
      console.error('댓글 작성 오류:', error);
      return res.status(500).json({ error: '댓글 작성 실패' });
    }

    res.status(201).json(data);
  } catch (err) {
    console.error('서버 예외 오류:', err);
    res.status(500).json({ error: '서버 오류 발생' });
  }
});

// 댓글 수정 (본인 댓글만 수정 가능, user_id 매칭은 프론트 또는 인증 미들웨어에서 검증 필요)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { user_id, content, rating } = req.body;

  try {
    if (rating != null && (rating < 1 || rating > 5)) {
      return res.status(400).json({ error: 'rating은 1에서 5 사이여야 합니다.' });
    }

    // 댓글이 본인 것인지 확인
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

    res.json(data);
  } catch (err) {
    console.error('서버 예외 오류:', err);
    res.status(500).json({ error: '서버 오류 발생' });
  }
});

// 댓글 삭제 (본인 댓글만 삭제 가능, user_id 매칭은 프론트 또는 인증 미들웨어에서 검증 필요)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body; // 삭제 요청 시 본인 id 전달받아야 함

  try {
    // 댓글 소유자 확인
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

    const { error } = await supabase.from('comments').delete().eq('id', id);

    if (error) {
      console.error('댓글 삭제 오류:', error);
      return res.status(500).json({ error: '댓글 삭제 실패' });
    }

    res.status(204).end();
  } catch (err) {
    console.error('서버 예외 오류:', err);
    res.status(500).json({ error: '서버 오류 발생' });
  }
});

module.exports = router;
