import express from 'express';
import cors from 'cors';
import path from 'path';

import config from './config';
// import mongoose from './db';

const app = express();
const PORT = config.server.port;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/static', express.static(path.join(__dirname, '/static')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

// Test Data
const dates = [
  {
    date: 'Today',
    events: [
      {
        id: '0',
        img: 'test_flier.jpg',
        title: 'BGR Event',
        org: 'Purdue',
        loc: 'Boiler Park',
        time: '4:00 PM',
        tags: ['Food', 'Games', 'Music'],
      },
      {
        id: '1',
        img: 'test_flier2.jpg',
        title: 'Philosophy Talk',
        org: 'Socratic Club',
        loc: 'ET 314',
        time: '6:30 PM',
        tags: ['Food', 'Academic'],
      },
    ],
  },
  {
    date: 'Tomorrow',
    events: [
      {
        id: '2',
        img: 'test_flier3.jpg',
        title: 'Vinyl Tasting',
        org: 'Music Club',
        loc: 'CC 450',
        time: '9:30 AM',
        tags: ['Food', 'Music', 'Art'],
      },
    ],
  },
];

const events = [
  {
    id: '0',
    img: 'test_flier.jpg',
    title: 'BGR Event',
    org: 'Purdue',
    loc: 'Boiler Park',
    date: 'Aug 12',
    start: '4:00 PM',
    end: '6:00 PM',
    desc: 'Sed quis eros interdum, eleifend mauris vitae, porta neque. Aenean ut dolor urna\
    . Nulla quis lacus vehicula, rutrum dolor a, commodo lectus. Nullam accumsan sapien sit\
     amet vestibulum elementum. Maecenas laoreet justo vitae augue tempus, at porttitor urn\
     a tincidunt. Proin justo nulla, tempus vel sapien vel, facilisis molestie nisl. Orci v\
     arius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Orci \
     varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. ',
    tags: ['Food', 'Games', 'Music'],
  },
  {
    id: '1',
    img: 'test_flier2.jpg',
    title: 'Philosophy Talk',
    org: 'Socratic Club',
    loc: 'ET 314',
    date: 'Aug 13',
    start: '6:30 PM',
    end: '7:30 PM',
    desc: 'Maecenas facilisis tortor ac lectus gravida, et tincidunt tellus bibendum. Pelle\
    ntesque sodales nulla lacus, congue feugiat mi aliquet eu. Nunc imperdiet enim et nibh \
    tincidunt dapibus. Nam ornare felis at consequat condimentum. Nam vulputate sollicitudi\
    n consequat. Fusce pulvinar eu ex sit amet facilisis. Nunc molestie sem non ultricies e\
    uismod. ',
    tags: ['Free', 'Academic'],
  },
  {
    id: '2',
    img: 'test_flier3.jpg',
    title: 'Vinyl Tasting',
    org: 'Music Club',
    loc: 'CC 450',
    date: 'Aug 5',
    start: '9:30 AM',
    end: '11:30 AM',
    desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean eget nunc arcu. \
    Ut elementum rhoncus turpis ac blandit. Aliquam id odio ac odio tincidunt ullamcorper v\
    tae nec ligula. Curabitur maximus justo id arcu finibus viverra at quis arcu. Duis frin\
    gilla lectus sed leo fringilla pretium. Mauris in nulla porta, luctus eros eu, vestibul\
    um leo. Sed et quam sagittis, auctor mi eget, auctor elit. Duis luctus posuere ligula a\
    c laoreet. Cras vulputate malesuada congue. Cras nec justo at nisl pulvinar auctor. Nul\
    lam sed nisl blandit, consectetur tellus aliquam, bibendum tortor. Aliquam lacinia elem\
    entum lectus, et tincidunt risus lobortis sit amet. In convallis risus a justo convalli\
    s, at scelerisque sapien feugiat. Ut at justo lacinia, interdum diam et, sodales diam. \
    Etiam ut tristique magna, tempus venenatis eros. Maecenas imperdiet malesuada arcu non \
    accumsan. ',
    tags: ['Vibe', 'Music', 'Art'],
  },
];

// Routes
app.get('/', (_req, res) => {
  res.render('bord', { dates: dates });
});

app.get('/events/:eventId', (req, res) => {
  let foundEvent = false;

  for (var val of events) {
    if (val.id == req.params.eventId) { //checks if the event exists
      foundEvent = true;
      res.render('event', {event: val}); //renders the event
      break;
    }
  }

  if (foundEvent != true) {
    res.send('Event not found'); //event not found
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
