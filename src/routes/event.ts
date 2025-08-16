import express from 'express';
// import mongoose from '../db'
import Event from '../models/event';


const router = express.Router();

router.post('/create', async (req, res) => {
  const data = req.body;

    //will live with duplicates for now
    // if (await Event.findOne({"title":data.title, "startTime": data.startTime}).exec()) { //handles duplicate events
    //   return res.status(409).json({ 'message': 'Duplicate events not allowed'})
    // }

    try {
      Event.create({
        title: data.title,
        start: data.startTime,
        end: data.endTime,
        loc: data.loc,
        description: data.desc,
        tags: data.tags,
        image: data.img,
        org: data.org,
        email: data.email,
      });

      return res.status(201).json({ 'success': "New event created" });
    } catch (err) {
      return res.status(500).json({ 'message': err});
    }
});

router.get('/get/:eventId', async (req, res) => {
  const event = await Event.findOne({"id":req.params.eventId}).exec();
      
  if (event) {
    return res.render('event', {event: event}); //renders the event
  }
  else {
    return res.status(404).json({'message': 'Event not found'}); //event not found
  }
});

//for loading more events just increment num
router.get('/getevents/:startDate/:num', async (req, res) => { 
  const events = await Event.find({
    start: { $gt: new Date(req.params.startDate) },
  })
    .limit(parseInt(req.params.num))
    .exec();

  return res.json(events);
});

router.put('/update/:eventId', async (req, res) => {
  const event = await Event.findOne({"id":req.params.eventId}).exec();
  const data = req.body;

  if (event) {
    try {
      Event.updateOne(
        { id: req.params.eventId },
        {
          title: data.title,
          start: data.startTime,
          end: data.endTime,
          loc: data.loc,
          description: data.desc,
          tags: data.tags,
          image: data.img,
          org: data.org,
          email: data.email,
        },
      ).exec();

      return res.status(201).json({ 'success': "Event updated" });
    } catch (err) {
      return res.status(500).json({ 'message': err});
    }
  }
  else {
    return res.status(404).json({'message': 'Event not found'}); //event not found
  }
});

router.delete('/delete/:eventId', async (req, res) => {
  try {
    await Event.deleteOne({"id":req.params.eventId}).exec();
    return res.status(201).json({'message': 'Event deleted'});
  } catch (err) {
    return res.status(404).json({'message': `Event not deleted because of ${err}`}); //event not found
  }
});

export default router;