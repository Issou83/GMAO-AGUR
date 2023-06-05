import mongoose from 'mongoose';

const InterventionSchema = new mongoose.Schema({
  siteName: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
    required: true,
  },
  agent: {
    type: String,
    required: true,
  },
  equipmentName: {
    type: String,
    required: false,
  },
  hours: {
    type: Number,
    default: 0,
  },
  siteTotalHours: {
    type: Number,
    default: 0,
  },
  remainingHours: {
    type: Number,
    required: false,
  },
  interventionType: {
    type: String,
    enum: ['planned', 'realized'],
    default: 'planned',
  },
});

const Intervention = mongoose.model('Intervention', InterventionSchema);
export default Intervention;
