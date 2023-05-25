import React from 'react';

function Intervention({ intervention }) {
  return (
    <div>
      <h2>{intervention.description}</h2>
      <p>Agent: {intervention.agent}</p>
      <p>Date: {new Date(intervention.date).toLocaleDateString()}</p>
      <p>Site: {intervention.siteName}</p>
    </div>
  );
}

export default Intervention;
