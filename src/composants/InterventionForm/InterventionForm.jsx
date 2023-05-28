import React, { useState } from 'react';

const InterventionForm = ({ site, onSubmit, isPlanned }) => {
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [agent, setAgent] = useState('');
  const [hours, setHours] = useState('');
  const [equipmentName, setEquipmentName] = useState('');  // Nouveau champ pour le nom de l'équipement

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      siteName : site.name,
      date,
      description,
      agent, 
      equipmentName,  // Ajoutez le nom de l'équipement aux données envoyées lors de la soumission du formulaire
      hours: isPlanned ? Number(hours) : undefined,
    });
    setDate('');
    setDescription('');
    setAgent('');
    setHours('');
    setEquipmentName('');  // Réinitialisez le champ du nom de l'équipement après la soumission du formulaire
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {isPlanned ? ("") : (
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
        placeholder="Nom de l'équipement"  // Ajoutez le champ d'input pour le nom de l'équipement
        required
      />
      {isPlanned && (
        <input
          type="number"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          placeholder="Heures prévues"
          required
        />
      )}
      <button type="submit">Ajouter</button>
    </form>
  );
};

export default InterventionForm;
