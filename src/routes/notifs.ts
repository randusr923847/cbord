import express from 'express';
import Email from '../models/email';

const router = express.Router();

router.post('/subscribe', async (req, res) => {
  console.log(req.body.email);
  if (req.body.email) {
    await Email.findOneAndUpdate(
      { email: req.body.email },
      {},
      { upsert: true },
    );
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

router.post('/unsubscribe', async (req, res) => {
  if (req.body.email) {
    await Email.deleteOne({ email: req.body.email });
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

export default router;
