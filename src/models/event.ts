import mongoose from '../db';

const event = new mongoose.Schema({
  id: { type: String },
  accepted: { type: Number },
  title: { type: String },
  org: { type: String },
  startTime: { type: Number },
  endTime: { type: Number },
  loc: { type: String },
  description: { type: String },
  tags: { type: [String] },
  image: { type: String },
  email: { type: String },
});

event.index({ accepted: -1, startTime: 1, endTime: 1 });

export default mongoose.model('Event', event);
