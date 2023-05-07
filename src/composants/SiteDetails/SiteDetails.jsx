import React, { useState, useEffect } from "react";
import Intervention from "../Intervention/Intervention";
import InterventionForm from "../InterventionForm/InterventionForm";
import "./index.css";

const SiteDetails = ({ site }) => {
  const [realizedInterventions, setRealizedInterventions] = useState([]);
  const [plannedInterventions, setPlannedInterventions] = useState([]);

  useEffect(() => {
    const fetchInterventions = async () => {
      const response = await fetch("http://localhost:5000/api/interventions");
      const interventions = await response.json();
      const filteredRealized = interventions.filter(
        (i) => i.interventionType === "realized" && i.siteName === site.name
      );
      const filteredPlanned = interventions.filter(
        (i) => i.interventionType === "planned" && i.siteName === site.name
      );
      setRealizedInterventions(filteredRealized);
      setPlannedInterventions(filteredPlanned);
    };
    fetchInterventions();
  }, [site]);

  const handleInterventionDelete = async (id) => {
    await fetch(`http://localhost:5000/api/interventions/${id}`, {
      method: "DELETE",
    });

    setRealizedInterventions(realizedInterventions.filter((i) => i._id !== id));
    setPlannedInterventions(plannedInterventions.filter((i) => i._id !== id));
  };

  const handleInterventionEdit = async (id, updatedIntervention) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/interventions/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedIntervention),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update intervention');
      }

      const savedIntervention = await response.json();
      if (updatedIntervention.interventionType === "planned") {
        setPlannedInterventions(
          plannedInterventions.map((intervention) =>
            intervention._id === id ? savedIntervention : intervention
          )
        );
      } else {
        setRealizedInterventions(
          realizedInterventions.map((intervention) =>
            intervention._id === id ? savedIntervention : intervention
          )
        );
      }
    } catch (error) {
      console.error('Error updating intervention:', error);
    }
  };

  const handleInterventionSubmit = async (intervention, isPlanned) => {
    const newIntervention = {
      ...intervention,
      interventionType: isPlanned ? "planned" : "realized",
    };

    const response = await fetch("http://localhost:5000/api/interventions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newIntervention),
    });

    const savedIntervention = await response.json();

    if (isPlanned) {
      setPlannedInterventions([...plannedInterventions, savedIntervention]);
    } else {
      setRealizedInterventions([...realizedInterventions, savedIntervention]);
    }
  };

  return (
    <div>
      <div className="siteDetailsTitle">
        <h2>{site.name}</h2>
        <p className="totalTime">
          Temps total de fonctionnement (année en cours): {site.totalHours.toFixed(1)} heures
        </p>
      </div>
      <div className="interventionsAll">
        <div className="interventionRealized">
          <h3>Interventions réalisées</h3>
          <InterventionForm
            onSubmit={(i) => handleInterventionSubmit(i, false)}
            isPlanned={false}
            site={site}
          />
          {realizedInterventions.map((intervention) => (
            <Intervention
              key={intervention._id}
              intervention={intervention}
              isPlanned={false}
              onDelete={handleInterventionDelete}
              onEdit={handleInterventionEdit}
              siteTotalHours={site.totalHours}
            />
          ))}
        </div>
        <div className="interventionPlanned">
          <h3>Interventions prévues</h3>
          <InterventionForm
            onSubmit={(i) => handleInterventionSubmit(i, true)}
            isPlanned={true}
            site={site}
          />
          {plannedInterventions.map((intervention) => (
            <Intervention
              key={intervention._id}
              intervention={intervention}
              isPlanned={true}
              onDelete={handleInterventionDelete}
              onEdit={handleInterventionEdit}
              siteTotalHours={site.totalHours}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SiteDetails;
