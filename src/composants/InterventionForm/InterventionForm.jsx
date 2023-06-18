import React, { useState } from 'react';
import "./index.css";
import { useParams } from "react-router-dom";

const InterventionForm = ({ site, onSubmit, isPlanned, isCyclic}) => {
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [agent, setAgent] = useState('');
  const [hours, setHours] = useState('');
  const [equipmentName, setEquipmentName] = useState('');  // Nouveau champ pour le nom de l'équipement
  const { zoneId } = useParams();
  const [cycleHours, setCycleHours] = useState(''); // Nouveau champ pour le cycle en heures


  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      siteName : site.name,
      date,
      description,
      agent, 
      equipmentName,  // Ajoutez le nom de l'équipement aux données envoyées lors de la soumission du formulaire
      hours: isPlanned ? Number(hours) : undefined,
      cycleHours,
      siteTotalHours : site.totalHours.toFixed(1),
    });
    setDate('');
    setDescription('');
    setAgent('');
    setHours('');
    setEquipmentName('');  // Réinitialisez le champ du nom de l'équipement après la soumission du formulaire
  };
  
  return (
    <form className='formulaires' onSubmit={handleSubmit}>
      {isPlanned || isCyclic ? ("") : (
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      )}
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        required
      />
      <input
        type="text"
        value={agent}
        onChange={(e) => setAgent(e.target.value)}
        placeholder="Agent"
        required
      />
      <input
        type="text"
        value={equipmentName}
        onChange={(e) => setEquipmentName(e.target.value)}
        placeholder="Nom de l'équipement"  
        required
      />
      {isPlanned && (
        zoneId === "reservoirs"
        ? ( <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />)
        : ( <input
          type="number"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          placeholder="Heures prévues"
          required
          />)
      
      )}
       {isCyclic && (
        zoneId === "reservoirs"
        ? ( <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />)
        : ( <input
          type="number"
          value={cycleHours}
          onChange={(e) => setCycleHours(e.target.value)}
          placeholder="Cycle en heures"
          required
          />)
      
      )}
      <br /><button type="submit">Ajouter</button>
    </form>
  );
};

export default InterventionForm;
