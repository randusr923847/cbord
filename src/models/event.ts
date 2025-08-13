import mongoose from '../db';

export default mongoose.model(
  'Event',
  new mongoose.Schema({
    id: String,
    title: String,
    startTime: Number,
    endTime: Number,
    loc: String,
    description: String,
    tags: [String],
    image: String,
    email: String,
  }),
);
