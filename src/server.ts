import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';

import config from './config';
import eventRouter from './routes/event';
import Event from './models/event';
import { eventParser } from './helper/helper';

const app = express();
const PORT = config.server.port;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/static', express.static(path.join(__dirname, '/static')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

// Routes
app.get('/', (req, res) => {
  res.render('bord');
});

app.get('/create', (req, res) => {
  res.render('create');
});

app.get('/event/:eventId', async (req, res) => {
    const event = await Event.findOne({"id":req.params.eventId}).exec();
        
    if (event) {
      res.render('event', { event: eventParser(event) });
    }
    else {
      return res.status(404).json({'message': 'Event not found'}); //event not found
    }
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
