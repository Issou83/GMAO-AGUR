import React, { useState } from 'react';
import RemainingTimeIndicator from '../RemainingTimeIndicator/RemainingTimeIndicator';
import './index.css';

const Intervention = ({ intervention, isPlanned, isCyclic, onDelete, onEdit, siteTotalHours }) => {
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
    const updatedHours = intervention.hours + hoursToAdd; // Ajoutez hoursToAdd aux heures actuelles
    const updatedRemainingHours = updatedHours - siteTotalHours;
    const updatedIntervention = { ...intervention, hours: updatedHours, remainingHours: updatedRemainingHours };
    onEdit(updatedIntervention._id, updatedIntervention);
  };
  
  const markAsDone = async () => {
    // Créer une nouvelle intervention réalisée basée sur l'intervention prévue
    const newRealizedIntervention = {
      ...intervention,
      interventionType: 'realized',
      date: new Date().toISOString().split('T')[0], // ajoute la date du jour
    };
    delete newRealizedIntervention._id; // Supprime l'_id
  
    // Faire une requête POST à l'API pour créer la nouvelle intervention
    let response = await fetch("http://localhost:5000/api/interventions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRealizedIntervention),
    });
  
    // L'API nous renvoie l'intervention créée avec son nouvel ID
    const savedRealizedIntervention = await response.json();
  
    // Utiliser l'ID de l'intervention créée pour mettre à jour l'état de l'application côté client
    onEdit(savedRealizedIntervention._id, savedRealizedIntervention);
  
    if (intervention.fromCyclic) {
      const newPlannedIntervention = {
        ...intervention,
        interventionType: 'planned',
        hours: siteTotalHours + Number(intervention.cycleHours),
      };
      // delete newPlannedIntervention._id; // Supprime l'_id
  
      // Faire une requête POST à l'API pour créer la nouvelle intervention
      response = await fetch("http://localhost:5000/api/interventions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPlannedIntervention),
      });
  
      // L'API nous renvoie l'intervention créée avec son nouvel ID
      const savedPlannedIntervention = await response.json();
  
      // Utiliser l'ID de l'intervention créée pour mettre à jour l'état de l'application côté client
      onEdit(savedPlannedIntervention._id, savedPlannedIntervention);
    }
  
    // Supprimer l'ancienne intervention prévue
    await fetch(`http://localhost:5000/api/interventions/${intervention._id}`, {
      method: "DELETE",
    });
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
    <div className={`intervention ${remainingHours < 0 && isPlanned ? "interventionAlerte" : ""}`}>    {isPlanned ? ("") : (<p>Date : {new Date(intervention.date).toLocaleDateString('fr-FR', frenchOptions)}</p>)}
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
            {isCyclic && <p>Cycle en heures : <b>{intervention.cycleHours}</b></p>}
            {!isCyclic && !isPlanned ? <p>Réalisée à {intervention.siteTotalHours} heures</p>:""}
          <button onClick={handleEdit}>Modifier</button>
          <button onClick={() => onDelete(intervention._id)}>Supprimer</button>
        </>
      )}
    </div>
  );
};

export default Intervention;
