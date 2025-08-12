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
    'date': 'Today',
    'events': [
      {
        'img': 'test_flier.jpg',
        'title': 'BGR Event',
        'loc': 'Boiler Park',
        'time': '4:00 PM',
        'tags': [
          'Food',
          'Games',
          'Music',
        ],
      },
      {
        'img': 'test_flier2.jpg',
        'title': 'Philosophy Talk',
        'loc': 'ET 314',
        'time': '6:30 PM',
        'tags': [
          'Food',
          'Academic',
        ],
      },
    ],
  },
  {
    'date': 'Tomorrow',
    'events': [
      {
        'img': 'test_flier3.jpg',
        'title': 'Vinyl Tasting',
        'loc': 'CC 450',
        'time': '9:30 AM',
        'tags': [
          'Food',
          'Music',
          'Art',
        ],
      },
    ],
  },
];

// Routes
app.get('/', (_req, res) => {
  res.render('bord', { dates: dates });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
