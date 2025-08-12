import mongoose from 'mongoose';
import config from './config';

let db_url = 'mongodb://';

if (config.db.username && config.db.password) {
  db_url += `${config.db.username}:${config.db.password}@`;
}

db_url += `${config.db.host}:${config.db.port}/${config.db.database}`;

// MongoDB Connection
mongoose
  .connect(db_url)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

const db = mongoose.connection;
db.on('error', function (e) {
  console.log('Error with MongoDB: ' + e);
  process.exit(1);
});

db.once('open', function () {
  console.log(`Successfully connected to MongoDB on port ${config.db.port}`);
});

export default mongoose;
