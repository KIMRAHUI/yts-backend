// routes/comments.js
const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

//댓글 가져오기
router.get('/:movie_id', async (req, res) => {
  const { movie_id } = req.params;

  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('movie_id', movie_id)
    .order('created_at', { ascending: false });

  if (error) {
    return res.status(500).json({ error: '댓글 조회 실패' });
  }

  res.json(data);
});

//댓글 작성
router.post('/', async (req, res) => {
  const { user_id, username, movie_id, content, rating } = req.body;

  const { data, error } = await supabase.from('comments').insert([
    { user_id, username, movie_id, content, rating },
  ]).select().single();

  if (error) {
    return res.status(500).json({ error: '댓글 작성 실패' });
  }

  res.status(201).json(data);
});

//댓글 수정
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { content, rating } = req.body;

  const { data, error } = await supabase
    .from('comments')
    .update({ content, rating })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: '댓글 수정 실패' });
  }

  res.json(data);
});

// 댓글 삭제
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from('comments').delete().eq('id', id);

  if (error) {
    return res.status(500).json({ error: '댓글 삭제 실패' });
  }

  res.status(204).end();
});

module.exports = router;
