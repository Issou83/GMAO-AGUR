import mongoose from 'mongoose';

const SiteSchema = new mongoose.Schema({
  lat: {
    type: Number,
    required: true
  },
  lon: {
    type: Number,
    required: true
  },
  photo: {
    type: String,
    required: false
  },
});

const Site = mongoose.model('Site', SiteSchema);

export default Site;
