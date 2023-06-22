import mongoose from "mongoose";

const siteDetailsSchema = new mongoose.Schema({
  siteName: { type: String, required: true },
  gpsCoordinates: [
    {
      type: Number,
      required: true,
    },
  ],
  image: { type: String },
});

const SiteDetails = mongoose.model("SiteDetails", siteDetailsSchema);

export default SiteDetails;
