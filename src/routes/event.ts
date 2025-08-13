import express from 'express';

const router = express.Router();

router.post('/create', (req, res) => {
  res.json({ success: false });
});

export default router;
