import mongoose from '../db';
import { randomUUID } from 'crypto';

export default mongoose.model(
  'Event',
  new mongoose.Schema({
    id: {
      type: String,
      default: () => randomUUID().toString(),
    },
    accepted: { type: Boolean, default: 0 },
    title: { type: String, default: '' },
    start: { type: Date, default: '' },
    end: { type: Date, default: '' },
    loc: { type: String, default: '' },
    desc: { type: String, default: '' },
    tags: { type: [String], default: '' },
    image: { type: String, default: '' },
    org: { type: String, default: '' },
    email: { type: String, default: '' },
  }),
);
