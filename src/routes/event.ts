import express from 'express';
// import mongoose from '../db'
import Event from '../models/event';


const router = express.Router();

router.post('/create', async (req, res) => {
  const data = req.body;

    if (await Event.findOne({"id":data.id}).exec()) { //handles duplicate events
      return res.status(409).json({ 'message': 'Duplicate events not allowed'})
    }

    try {
      Event.create({
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

// router.get('/getAll', async (req, res) => {
//   const events = await Event.find().exec();
      
//   //need to connect to this with homepage and onload.
//   //right now homepage loops through dates not events
//   //maybe need helper method to convert formats from
//   //{event1, event2, event3} into
//   //today: {event1, event2}, tmmrw: {event3}
// });

router.put('/update/:eventId', async (req, res) => {
  const event = await Event.findOne({"id":req.params.eventId}).exec();
  const data = req.body;

  if (event) {
    try {
      Event.updateOne({"id":req.params.eventId}, {
        "id": data.id,
        "title": data.title,
        "startTime": data.startTime,
        "endTime": data.endTime,
        "loc": data.loc,
        "description": data.desc,
        "tags": data.tags,
        "image": data.img,
        "email": data.email,
      }).exec();

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