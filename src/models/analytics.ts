import mongoose from '../db';

export default mongoose.model(
  'View',
  new mongoose.Schema({
    page: { type: [String] },
    iph: { type: String },
    loc: { type: String },
    ua: { type: String },
    sid: { type: String },
    tss: { type: [Number] },
    delay: { type: [Number] },
  }),
);
