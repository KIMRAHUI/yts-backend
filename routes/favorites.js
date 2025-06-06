const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// ✅ 찜 추가
router.post('/', async (req, res) => {
  const { user_id, movie_id } = req.body;

  if (!user_id || !movie_id) {
    return res.status(400).json({ error: 'user_id와 movie_id가 필요합니다.' });
  }

  const { data, error } = await supabase
    .from('favorites')
    .insert([{ user_id, movie_id }]);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// ✅ 찜 목록 조회
router.get('/', async (req, res) => {
  const { user_id } = req.query;

  if (!user_id) return res.status(400).json({ error: 'user_id가 필요합니다.' });

  const { data, error } = await supabase
    .from('favorites')
    .select('movie_id, added_at')
    .eq('user_id', user_id)
    .order('added_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// ✅ 찜 삭제
router.delete('/', async (req, res) => {
  const { user_id, movie_id } = req.body;

  if (!user_id || !movie_id) {
    return res.status(400).json({ error: 'user_id와 movie_id가 필요합니다.' });
  }

  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', user_id)
    .eq('movie_id', movie_id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

module.exports = router;
