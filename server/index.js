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

  // Si l'intervention est cyclique, créer une nouvelle intervention prévue
  if (savedIntervention.interventionType === 'cyclic') {
    let newId = new mongoose.Types.ObjectId();
    while (await Intervention.findById(newId)) {
      newId = new mongoose.Types.ObjectId();
    }
    
    const plannedIntervention = new Intervention({
      ...savedIntervention._doc,
      _id: newId,
      interventionType: 'planned',
      hours: savedIntervention.siteTotalHours + savedIntervention.cycleHours,
      isFromCyclic: true,
    });
    const savedPlannedIntervention = await plannedIntervention.save();
    console.log("Saved planned intervention data:", savedPlannedIntervention); // Log the saved data
  }

  res.json(savedIntervention);
});

app.put('/api/interventions/:id', async (req, res) => {
  const { id } = req.params;
  const update = req.body;

  try {
    let updatedIntervention = await Intervention.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, runValidators: true }
    );

    if (!updatedIntervention) {
      console.error('No intervention found with this id:', id);
      return res.status(404).json({message: 'No intervention found with this id' });
    }

    // Si l'intervention est issue d'une intervention cyclique, créer une nouvelle intervention prévue
    if (updatedIntervention.isFromCyclic && updatedIntervention.interventionType === 'realized') {
      let newPlannedIntervention = { ...updatedIntervention._doc };
      delete newPlannedIntervention._id; // Supprime l'_id

      const plannedIntervention = new Intervention({
        ...newPlannedIntervention,
        interventionType: 'planned',
        hours: updatedIntervention.siteTotalHours + updatedIntervention.cycleHours,
        isFromCyclic: true,
      });
  
      const savedPlannedIntervention = await plannedIntervention.save();
      console.log("Saved planned intervention data:", savedPlannedIntervention); // Log the saved data
    }

    res.json(updatedIntervention);
  } catch (error) {
    console.error('Error updating intervention:', error);
    res.status(500).json({message: 'Error updating intervention' });
  }
});











app.delete('/api/interventions/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedIntervention = await Intervention.findByIdAndDelete(id);
    res.json(deletedIntervention);
  } catch (error) {
    console.error('Error deleting intervention:', error);
    res.status(500).json({ message: 'Error deleting intervention' });
  }
});

app.use(express.static(path.join(path.resolve(), '/client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve('client', 'build', 'index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
