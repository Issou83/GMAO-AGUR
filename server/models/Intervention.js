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
    required: false,
  },
  remainingHours: {
    type: Number,
    required: false,
  },
  interventionType: {
    type: String,
    enum: ['planned', 'realized', 'cyclic'], // Ajouter le type 'cyclic'
    default: 'planned',
  },
  cycleHours: {
    type: Number, // Nouveau champ pour le cycle en heures
    default: 0,
  },
  isFromCyclic: {
    type: Boolean,
    default: false,
  },
});

const Intervention = mongoose.model('Intervention', InterventionSchema);
export default Intervention;
