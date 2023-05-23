import mongoose from 'mongoose';
import moment from 'moment';

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
  hours: {
    type: Number,
    default: 0,
    required: false,
  },
  remainingHours: {
    type: Number,
    default: 0,
    required: false,
  },
  interventionType: {
    type: String,
    enum: ['planned', 'realized'],
    default: 'planned',
    required: false,
  },
});

InterventionSchema.pre('save', function(next) {
  if (this.remainingHours <= 0) {
    this.interventionType = 'realized';
    this.date = moment().format();
  }
  next();
});

export default mongoose.model('Intervention', InterventionSchema);
