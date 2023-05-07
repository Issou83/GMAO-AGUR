import React, { useState } from 'react';

const InterventionForm = ({ site, onSubmit, isPlanned }) => {
//   const [siteName , setSiteName] = useState("")
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [agent, setAgent] = useState('');
  const [hours, setHours] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      siteName : site.name,
      date,
      description,
      agent, 
      hours: isPlanned ? Number(hours) : undefined,
    });
    setDate('');
    setDescription('');
    setAgent('');
    setHours('');
  };
  
  
  return (
    <form onSubmit={handleSubmit}>
       {isPlanned ? ("") : (
       <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />)}

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
