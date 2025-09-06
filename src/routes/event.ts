import express from 'express';
import Event from '../models/event';
import {
  validateCreateReq,
  orderByDate,
  EventObj,
  validateScraperEvents,
} from '../helpers/event';
import { v4 as uuid } from 'uuid';
import '../types/session';
import { hash } from 'crypto';

const router = express.Router();

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

router.post('/scrape', async (req, res) => {
  const events = validateScraperEvents(req.body.events);

  events.forEach(async (event) => {
    let id = `${event.title}${event.startTime}${event.endTime}${event.loc}`;
    id = hash('sha256', id);

    if (await Event.exists({ id: id })) {
      console.log(`Duplicate event with id: ${id}`);
      return 'Duplicate event';
    }

    event.id = id;

    await Event.create(event);

    console.log(`Event created with id: ${id}`);
  });

  if (events) {
    res.json({ success: true });
  }
});

router.post('/get/:start/:num/:skip', async (req, res) => {
  const limit = parseInt(req.params.num);
  const skip = parseInt(req.params.skip);

  const data = await Event.find({
    startTime: { $gt: new Date(parseInt(req.params.start)) },
    endTime: { $gt: Date.now() },
    accepted: 1,
  })
    .lean()
    .sort({ startTime: 1 })
    .skip(skip)
    .limit(limit)
    .exec();

  const events = orderByDate(data as EventObj[]);

  res.json({ success: true, events: events });
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

router.post('/accept', async (req, res) => {
  if (req.session.auth && req.body.id) {
    const result = await Event.updateOne({ id: req.body.id }, { accepted: 1 });
    res.json({ success: result.modifiedCount == 1 });
  } else {
    res.json({ success: false });
  }
});

router.post('/reject', async (req, res) => {
  if (req.session.auth && req.body.id) {
    const result = await Event.updateOne({ id: req.body.id }, { accepted: -1 });
    res.json({ success: result.modifiedCount == 1 });
  } else {
    res.json({ success: false });
  }
});

router.post('/hide', async (req, res) => {
  if (req.session.auth && req.body.id) {
    const result = await Event.updateOne({ id: req.body.id }, { accepted: 0 });
    res.json({ success: result.modifiedCount == 1 });
  } else {
    res.json({ success: false });
  }
});

export default router;
