import mongoose from '../db';

export default mongoose.model(
  'Event',
  new mongoose.Schema({
    id: { type: String },
    accepted: { type: Boolean },
    title: { type: String },
    org: { type: String },
    startTime: { type: Number },
    endTime: { type: Number },
    loc: { type: String },
    description: { type: String },
    tags: { type: [String] },
    image: { type: String },
    email: { type: String },
  }),
);
