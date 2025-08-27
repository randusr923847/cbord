import mongoose from '../db';

export default mongoose.model(
  'Mod',
  new mongoose.Schema({
    nameh: { type: String },
  }),
);
