import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Intervention from './models/Intervention.js';
import { MONGO_URI } from './config.js';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({
  path: ".env",
});


const app = express();

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

app.get('/api/interventions', async (req, res) => {
  const interventions = await Intervention.find();
  res.json(interventions);
});

app.post('/api/interventions', async (req, res) => {
  console.log("Received intervention data:", req.body); // Log the received data

  const intervention = new Intervention(req.body);
  const savedIntervention = await intervention.save();
  console.log("Saved intervention data:", savedIntervention); // Log the saved data

  res.json(savedIntervention);
});


app.put('/api/interventions/:id', async (req, res) => {
  const { id } = req.params;
  const update = req.body;

  try {
    const updatedIntervention = await Intervention.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, runValidators: true }
    );
    res.json(updatedIntervention);
  } catch (error) {
    console.error('Error updating intervention:', error);
    res.status(500).json({ message: 'Error updating intervention' });
  }
});


app.delete('/api/interventions/:id', async (req, res) => {
  await Intervention.findByIdAndDelete(req.params.id);
  res.json({ message: 'Intervention deleted' });
});

const PORT = process.env.PORT || 5001;


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

