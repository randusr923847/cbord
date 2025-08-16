import mongoose from '../db';
import { randomUUID } from 'crypto';

export default mongoose.model(
  'Event',
  new mongoose.Schema({
    id: {
      type: 'UUID',
      default: () => randomUUID()
    },
    accepted: {
      type: 'Boolean',
      default: 0
    },
    title: String,
    start: Date,
    end: Date,
    loc: String,
    description: String,
    tags: [String],
    image: String,
    org: String,
    email: String,
  }),
);
