import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';

import config from './config';
import eventRouter from './routes/event';
// import mongoose from './db';

const app = express();
const PORT = config.server.port;

// //mongo
// console.log(mongoose.connection) //just checking

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
        id: 1,
        img: 'test_flier.jpg',
        title: 'BGR Event',
        org: 'Purdue',
        loc: 'Boiler Park',
        time: '4:00 PM',
        tags: ['Food', 'Games', 'Music'],
      },
      {
        id: 2,
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
        id: 3,
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

// Routes
app.get('/', (req, res) => {
  res.render('bord', { dates: dates });
});

app.get('/create', (req, res) => {
  res.render('create');
});

app.use('/api/event', eventRouter);

app.use('/{*any}', (req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
