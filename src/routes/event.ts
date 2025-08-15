import express from 'express';
// import mongoose from '../db'
import Event from '../models/event';


const router = express.Router();

router.post('/create', (req, res) => {
  // console.log(req.body);

  const data = req.body

  const results = Event.create({
    "id": data.id,
    "title": data.title,
    "startTime": data.startTime,
    "endTime": data.endTime,
    "loc": data.loc,
    "description": data.desc,
    "tags": data.tags,
    "image": data.img,
    "email": data.email,
  });

  res.status(201).json({ 'success': "New event created" });
  // res.json({ success: false });
});

export default router;