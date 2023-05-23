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
    if (updatedRemainingHours <= 0) {
      updatedIntervention.interventionType = 'realized';
      setIsPlannedState(false); // Update state if intervention is realized
    }
    onEdit(updatedIntervention._id, updatedIntervention);
  };
  
  const remainingHours = intervention.hours - siteTotalHours;

  const getTimeRemainingString = (remainingHours) => {
    if (remainingHours < 168) {
      return `Soit un temps de fonctionnement de ${(remainingHours / 24).toFixed(0)} jours`;
    } else if (remainingHours < 720) {
      return `Soit un temps de fonctionnement de ${(remainingHours / 168).toFixed(0)} semaines`;
    } else {
      return `Soit un temps de fonctionnement de ${(remainingHours / 720).toFixed(0)} mois`;
    }
  };


  const frenchOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

  return (
     <div className='intervention'>
    {isPlanned ? ("") : (<p>Date : {new Date(intervention.date).toLocaleDateString('fr-FR', frenchOptions)}</p>)}
    <p>Description : {intervention.description}</p>
    <p>Agent : {intervention.agent}</p>
      {isEditing ? (
        <>
          <input
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
            type="number"
            name="hours"
            value={editedIntervention.hours}
            onChange={handleChange}
          />
          <button onClick={handleSave}>Valider</button>
        </>
      ) : (
        <>
          {isPlanned && (
            <>
              <p>Heures prévues : {intervention.hours} heures</p>
              <p>Heures restantes avant l'intervention : {remainingHours.toFixed(2)} heures</p>
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
