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
    // default: 0
    required: false,
  },
  interventionType: {
    type: String,
    enum: ['planned', 'realized'],
    default: 'planned',
  },
});

InterventionSchema.pre('save', function(next) {
  this.remainingHours = this.hours - this.siteTotalHours;
  if (this.remainingHours < 0) {
    this.interventionType = 'realized';
  }
  next();
});

const Intervention = mongoose.model('Intervention', InterventionSchema);
export default Intervention;
