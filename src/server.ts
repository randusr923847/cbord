import express from 'express';
import cors from 'cors';
import path from 'path';

import config from './config';
import mongoose from './db';

const app = express();
const PORT = config.server.port;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/static', express.static(path.join(__dirname, '/static')))

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

// Routes
app.get('/', (_req, res) => {
  res.render('bord', {port: PORT});
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
