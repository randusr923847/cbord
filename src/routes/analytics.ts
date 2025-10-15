import express from 'express';
import { countView } from '../helpers/analytics';

const router = express.Router();

router.post('/', async (req, res) => {
  await countView(req);
  res.json({ success: true });
});

export default router;
