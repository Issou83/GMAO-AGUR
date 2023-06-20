import React, { useState, useEffect } from "react";
import Interventions from "../Interventions/Interventions";
import InterventionForm from "../InterventionForm/InterventionForm";
import RemainingTimeIndicator from "../RemainingTimeIndicator/RemainingTimeIndicator";
import SiteDetailsForm from "../SiteDetailsForm/SiteDetailsForm"


import "./index.css";

const SiteDetails = ({ site, zoneId, shortestIntervention, interventions }) => {
  const [realizedInterventions, setRealizedInterventions] = useState([]);
  const [plannedInterventions, setPlannedInterventions] = useState([]);
  const [cyclicInterventions, setCyclicInterventions] = useState([]); // Nouvel état pour les interventions cycliques

  const fetchInterventions = async () => {
    const response = await fetch("http://localhost:5000/api/interventions");
    const interventions = await response.json();
    console.log("Fetched interventions:", interventions); // Log the fetched interventions
  
    if (interventions) {
      const filteredRealized = interventions.filter(
        (i) => i.interventionType === "realized" && i.siteName === site.name
      );
      const filteredPlanned = interventions.filter(
        (i) => i.interventionType === "planned" && i.siteName === site.name
      );
      const filteredCyclic = interventions.filter(
        (i) => i.interventionType === "cyclic" && i.siteName === site.name
      );
  
      setRealizedInterventions(filteredRealized);
      setPlannedInterventions(filteredPlanned);
      setCyclicInterventions(filteredCyclic);
    }
  };
  
  useEffect(() => {
    fetchInterventions();
  }, [site]);

  const handleInterventionEdit = async (id, updatedIntervention) => {
    try {
      // Ajouter la date du jour si mise à jour d'une intervention prévue en intervention réalisée
      if (updatedIntervention.interventionType === "realized") {
        const today = new Date();
        updatedIntervention.date = today.toISOString().split("T")[0]; // Format "YYYY-MM-DD"
      }

      const response = await fetch(
        `http://localhost:5000/api/interventions/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedIntervention),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update intervention");
      }

      const savedIntervention = await response.json();

      // Rechercher l'intervention d'origine dans les deux listes
      const originalIntervention = [
        ...realizedInterventions,
        ...plannedInterventions,
      ].find((i) => i._id === id);

      if (
        originalIntervention?.interventionType !==
        savedIntervention.interventionType
      ) {
        // Le type d'intervention a changé, donc nous devons l'actualiser dans les deux listes
        if (savedIntervention.interventionType === "realized") {
          setPlannedInterventions(
            plannedInterventions.filter((i) => i._id !== savedIntervention._id)
          );
          setRealizedInterventions([
            ...realizedInterventions,
            savedIntervention,
          ]);
        } else {
          setRealizedInterventions(
            realizedInterventions.filter((i) => i._id !== savedIntervention._id)
          );
          setPlannedInterventions([...plannedInterventions, savedIntervention]);
        }
      } else {
        // Le type d'intervention n'a pas changé, donc nous ne mettons à jour que la liste correspondante
        if (savedIntervention.interventionType === "realized") {
          setRealizedInterventions(
            realizedInterventions.map((i) =>
              i._id === id ? savedIntervention : i
            )
          );
        } else {
          setPlannedInterventions(
            plannedInterventions.map((i) =>
              i._id === id ? savedIntervention : i
            )
          );
        }
      }
    } catch (error) {
      console.error("Error updating intervention:", error);
    }
    fetchInterventions();
  };

  const handleInterventionSubmit = async (
    intervention,
    isPlanned,
    isCyclic
  ) => {
    console.log("Submitting intervention:", intervention);
    const newIntervention = {
      ...intervention,
      interventionType: isPlanned
        ? "planned"
        : isCyclic
        ? "cyclic"
        : "realized",
    };

    const response = await fetch("http://localhost:5000/api/interventions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newIntervention),
    });

    const savedIntervention = await response.json();

    if (isPlanned) {
      setPlannedInterventions([...plannedInterventions, savedIntervention]);
    } else if (isCyclic) {
      setCyclicInterventions([...cyclicInterventions, savedIntervention]);
    } else {
      setRealizedInterventions([...realizedInterventions, savedIntervention]);
    }

    fetchInterventions();

  };

  const handleInterventionDelete = async (id) => {
    await fetch(`http://localhost:5000/api/interventions/${id}`, {
      method: "DELETE",
    });

    setRealizedInterventions(realizedInterventions.filter((i) => i._id !== id));
    setPlannedInterventions(plannedInterventions.filter((i) => i._id !== id));
    setCyclicInterventions(cyclicInterventions.filter((i) => i._id !== id));
  };

  return (
    <div>
      <div className="siteDetailsTitle">
        <h2>{site.name}</h2>
        {zoneId === "reservoirs" ? (
          <p className="totalTime">
            Date du jour: {new Date().toLocaleDateString()}
          </p>
        ) : (
          <p className="totalTime">
            Temps total de fonctionnement (année en cours):{" "}
            {site.totalHours.toFixed(1)} heures
          </p>
        )}

        {/* {shortestIntervention && (
          <RemainingTimeIndicator remainingHours={shortestIntervention.remainingHours} />
        )} */}
        <SiteDetailsForm site={site}/>
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
            <Interventions
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
            <Interventions
              key={intervention._id}
              intervention={intervention}
              isPlanned={true}
              onDelete={handleInterventionDelete}
              onEdit={handleInterventionEdit}
              siteTotalHours={site.totalHours}
            />
          ))}
        </div>
        <div className="interventionCyclic">
          <h3>Interventions cycliques</h3>
          <InterventionForm
            onSubmit={(i) => handleInterventionSubmit(i, false, true)}
            isPlanned={false}
            isCyclic={true}
            site={site}
            siteTotalHours={site.totalHours.toFixed(1)}
          />
          {cyclicInterventions.map((intervention) => (
            <Interventions
              key={intervention._id}
              intervention={intervention}
              isPlanned={false}
              isCyclic={true}
              onDelete={handleInterventionDelete} // Assurez-vous que cette fonction est passée correctement
              onEdit={handleInterventionEdit}
              siteTotalHours={site.totalHours.toFixed(1)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SiteDetails;
