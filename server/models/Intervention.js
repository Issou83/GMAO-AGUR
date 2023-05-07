import mongoose from 'mongoose';

const interventionSchema = new mongoose.Schema({
  siteName: { type: String, required: false },
  date: { type: Date, required: false },
  description: { type: String, required: true },
  agent: { type: String, required: true },
  hours: { type: Number, required: false },
  interventionType: { type: String, required: false },
});

const Intervention = mongoose.model('Intervention', interventionSchema);

export default Intervention;
