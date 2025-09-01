import mongoose from '../db';

export default mongoose.model(
  'Email',
  new mongoose.Schema({
    email: { type: String },
  }),
);
