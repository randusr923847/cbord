import express, { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';

import config from './config';
import eventRouter from './routes/event';
import { create_data, EVENTS_PER_LOAD } from './helpers/consts';
import {
  eventParser,
  getEvents,
  getAdminEvents,
  EventObj,
} from './helpers/event';
import { newState } from './helpers/crypto';
import { verifyAuth } from './helpers/auth';
import { checkMod } from './helpers/mod';
import './types/session';
import { clientPromise } from './db';
import Event from './models/event';

import fs from 'fs';
import https from 'https';

const app = express();
const PORT = config.server.port;

// Middleware
app.use(cors());
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        scriptSrcAttr: ["'self'", "'unsafe-inline'"],
      },
    },
  }),
);
app.use(morgan(config.server.log_level));
app.use(express.json({ limit: '1000kb' }));
app.use(
  session({
    secret: config.server.session_secret,
    proxy: process.env.NODE_ENV == 'production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
    },
    store: MongoStore.create({
      clientPromise: clientPromise,
      dbName: 'bord',
      stringify: false,
      autoRemove: 'interval',
      autoRemoveInterval: 10,
    }),
  }),
);
app.use('/static', express.static(path.join(__dirname, '/static')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

// Routes
app.get('/', async (req, res) => {
  const dates = await getEvents(EVENTS_PER_LOAD);
  res.render('bord', { dates: dates, events_per_load: EVENTS_PER_LOAD });
});

app.get('/create', (req, res) => {
  res.render('create', { data: create_data });
});

app.get('/event/:eventId', async (req, res) => {
  const event = (await Event.findOne({
    id: req.params.eventId,
  }).exec()) as EventObj | null;

  if (event) {
    if (event.accepted == 1) {
      res.render('event', { event: eventParser(event) });
    } else {
      res.render('pending', { id: event.id });
    }
  } else {
    res.render('404');
  }
});

app.get('/admin', async (req, res) => {
  if (await verifyAuth(req)) {
    if (await checkMod(req.session.usr as string)) {
      const events = await getAdminEvents();
      res.render('admin', { events: events, site_email: config.email });
    } else {
      res.render('404');
    }
  } else {
    const state = newState();
    req.session.state = state;
    res.redirect(
      `https://mystauth.com/auth/?rid=${config.auth.rid}&img=x-nVoti8RKw&state=${state}&ref=${config.server.domain}/admin/#login`,
    );
  }
});

app.post('/api/logout', (req, res) => {
  req.session.auth = false;
  req.session.usr = undefined;

  res.json({ success: true });
});

app.use('/api/event', eventRouter);

app.use('/{*any}', (req, res) => {
  res.render('404');
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

if (process.env.NODE_ENV == 'development') {
  const key = fs.readFileSync('./key.pem');
  const cert = fs.readFileSync('./cert.pem');

  const server = https.createServer({ key: key, cert: cert }, app);

  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
} else {
  app.set('trust proxy', true);
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
