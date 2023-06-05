import React, { useState } from 'react';
import RemainingTimeIndicator from '../RemainingTimeIndicator/RemainingTimeIndicator';
import './index.css';

const Intervention = ({ intervention, isPlanned, onDelete, onEdit, siteTotalHours }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedIntervention, setEditedIntervention] = useState(intervention);
  const [isPlannedState, setIsPlannedState] = useState(isPlanned);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEditedIntervention({ ...editedIntervention, [name]: value });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsEditing(false);
    onEdit(editedIntervention._id, editedIntervention);
  };

  const handleTimeUpdate = async (hoursToAdd) => {
    const updatedHours = intervention.hours + hoursToAdd;
    const updatedRemainingHours = updatedHours - siteTotalHours;
    const updatedIntervention = { ...intervention, hours: updatedHours, remainingHours: updatedRemainingHours };
    onEdit(updatedIntervention._id, updatedIntervention);
  };

  const markAsDone = () => {
    const updatedIntervention = { ...intervention, interventionType: 'realized' };
    onEdit(updatedIntervention._id, updatedIntervention);
    setIsPlannedState(false);
  };
  
  const remainingHours = intervention.hours - siteTotalHours;

  const getTimeRemainingString = (remainingHours) => {
    if (remainingHours < 0) {
      return `Temps de fonctionnement dépassé de plus de ${(remainingHours.toFixed(0))} Heures`;}


    if (remainingHours < 168) {
      return `Soit un temps de fonctionnement de plus de ${(remainingHours / 24).toFixed(1)} jours`;
    } else if (remainingHours < 720) {
      return `Soit un temps de fonctionnement de plus de ${(remainingHours / 168).toFixed(1)} semaines`;
    } else {
      return `Soit un temps de fonctionnement de plus de ${(remainingHours / 720).toFixed(1)} mois`;
    }
  };

  const frenchOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

  return (
    <div className={`intervention ${remainingHours < 0 ? "interventionAlerte" : ""}`}>    {isPlanned ? ("") : (<p>Date : {new Date(intervention.date).toLocaleDateString('fr-FR', frenchOptions)}</p>)}
    <p>Equipement concerné : <b>{intervention.equipmentName}</b></p>
    <p>Description : <b>{intervention.description}</b></p>
    <p>Agent : <b>{intervention.agent}</b></p>
      {isEditing ? (
        <>
          <input
          className='descript'
            type="text"
            name="description"
            value={editedIntervention.description}
            onChange={handleChange}
          />
          <input
            type="text"
            name="agent"
            value={editedIntervention.agent}
            onChange={handleChange}
          />
          <input
            type="text"
            name="equipementName"
            value={editedIntervention.equipmentName}
            onChange={handleChange}
          />
          <input
            type="number"
            name="hours"
            value={editedIntervention.hours}
            onChange={handleChange}
          />
          <button onClick={handleSave}>Valider</button>
        </>
      ) : (
        <>
          {isPlannedState && (
            <>
              <p>Heures prévues : <b>{intervention.hours}</b> heures</p>
              <p>Heures restantes avant l'intervention : <b>{remainingHours.toFixed(2)}</b> heures</p>
              <p>({getTimeRemainingString(remainingHours)})</p>
              <RemainingTimeIndicator key={intervention._id} remainingHours={remainingHours} /><br></br>
              <div className='supply'>
                <button className='supply-BtnWeek' onClick={() => handleTimeUpdate(168)}>+</button>
                <p>Semaine</p>
                <button className='supply-BtnWeek' onClick={() => handleTimeUpdate(-168)}>-</button>
              </div>
              <div className='supply'>
                <button className='supply-BtnMonth' onClick={() => handleTimeUpdate(720)}>+</button>
                <p>Mois</p>
                <button className='supply-BtnMonth' onClick={() => handleTimeUpdate(-720)}>-</button>
              </div>
              <button onClick={markAsDone}>Réalisée</button>
            </>
          )}
          <button onClick={handleEdit}>Modifier</button>
          <button onClick={() => onDelete(intervention._id)}>Supprimer</button>
        </>
      )}
    </div>
  );
};

export default Intervention;
