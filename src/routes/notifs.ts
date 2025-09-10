import express from 'express';
import Email from '../models/email';
import { checkMod } from '../helpers/mod';
import '../types/session';

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

router.get('/list', async (req, res) => {
  if (req.session.auth && (await checkMod(req.session.usr as string))) {
    const data = await Email.find({}).lean();
    const list = data.map((o) => o.email);
    const out = list.join(',');
    res.json({ data: out });
  } else {
    res.render('404');
  }
});

export default router;
