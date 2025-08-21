import express from 'express';
import Event from '../models/event';
import { validateCreateReq, EventObj } from '../helpers/event';
import { v4 as uuid } from 'uuid';

const router = express.Router();
router.use(express.json());

router.post('/create', async (req, res) => {
  const obj = validateCreateReq(req.body);

  if (typeof obj === 'string') {
    console.log(`Event creation aborted because: ${obj}`);
    res.json({ success: false, reason: obj });
  } else {
    let id = uuid();

    while (await Event.exists({ id: id })) {
      id = uuid();
    }

    obj.id = id;

    await Event.create(obj);

    console.log(`Event created with id: ${id}`);
    res.json({ success: true, id: id });
  }
});

// Adapted from https://stackoverflow.com/a/28440633
router.get('/img/:eventId', async (req, res) => {
  const event = (await Event.findOne({
    id: req.params.eventId,
  }).exec()) as EventObj | null;

  if (event) {
    const data = event.image;

    if (data.includes('|')) {
      const dataArr = data.split('|');
      const img = Buffer.from(dataArr[1], 'base64');

      res.writeHead(200, {
        'Content-Type': dataArr[0],
        'Content-Length': img.length,
      });
      res.end(img);
    } else {
      res.redirect(data);
    }
  } else {
    res.json({ success: false, reason: '404 not found' });
  }
});

export default router;
