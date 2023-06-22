import React, { useState, useEffect } from "react";
import Interventions from "../Interventions/Interventions";
import InterventionForm from "../InterventionForm/InterventionForm";
import RemainingTimeIndicator from "../RemainingTimeIndicator/RemainingTimeIndicator";
import SiteDetailsForm from "../SiteDetailsForm/SiteDetailsForm";

import "./index.css";

const SiteDetails = ({ site, zoneId, shortestIntervention, interventions }) => {
  const [realizedInterventions, setRealizedInterventions] = useState({
    data: [],
    show: false,
  });
  const [plannedInterventions, setPlannedInterventions] = useState({
    data: [],
    show: false,
  });
  const [cyclicInterventions, setCyclicInterventions] = useState({
    data: [],
    show: false,
  });

  const toggleRealized = () =>
    setRealizedInterventions((prevState) => ({
      ...prevState,
      show: !prevState.show,
    }));
  const togglePlanned = () =>
    setPlannedInterventions((prevState) => ({
      ...prevState,
      show: !prevState.show,
    }));
  const toggleCyclic = () =>
    setCyclicInterventions((prevState) => ({
      ...prevState,
      show: !prevState.show,
    }));

  const fetchInterventions = async () => {
    const response = await fetch("http://localhost:5000/api/interventions");
    const interventions = await response.json();
    console.log("Fetched interventions:", interventions);

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

      setRealizedInterventions({
        data: filteredRealized,
        show: realizedInterventions.show,
      });
      setPlannedInterventions({
        data: filteredPlanned,
        show: plannedInterventions.show,
      });
      setCyclicInterventions({
        data: filteredCyclic,
        show: cyclicInterventions.show,
      });
    }
  };

  useEffect(() => {
    fetchInterventions();
  }, [site]);

  const handleInterventionEdit = async (id, updatedIntervention) => {
    try {
      if (updatedIntervention.interventionType === "realized") {
        const today = new Date();
        updatedIntervention.date = today.toISOString().split("T")[0];
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

      const originalIntervention = [
        ...realizedInterventions.data,
        ...plannedInterventions.data,
      ].find((i) => i._id === id);

      if (
        originalIntervention?.interventionType !==
        savedIntervention.interventionType
      ) {
        if (savedIntervention.interventionType === "realized") {
          setPlannedInterventions({
            data: plannedInterventions.data.filter(
              (i) => i._id !== savedIntervention._id
            ),
            show: plannedInterventions.show,
          });
          setRealizedInterventions({
            data: [...realizedInterventions.data, savedIntervention],
            show: realizedInterventions.show,
          });
        } else {
          setRealizedInterventions({
            data: realizedInterventions.data.filter(
              (i) => i._id !== savedIntervention._id
            ),
            show: realizedInterventions.show,
          });
          setPlannedInterventions({
            data: [...plannedInterventions.data, savedIntervention],
            show: plannedInterventions.show,
          });
        }
      } else {
        if (savedIntervention.interventionType === "realized") {
          setRealizedInterventions({
            data: realizedInterventions.data.map((i) =>
              i._id === id ? savedIntervention : i
            ),
            show: realizedInterventions.show,
          });
        } else {
          setPlannedInterventions({
            data: plannedInterventions.data.map((i) =>
              i._id === id ? savedIntervention : i
            ),
            show: plannedInterventions.show,
          });
        }
      }

      fetchInterventions();
    } catch (error) {
      console.log("Failed to update intervention", error);
    }
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

  let shownInterventions = 0;
  if (realizedInterventions.show) shownInterventions++;
  if (plannedInterventions.show) shownInterventions++;
  if (cyclicInterventions.show) shownInterventions++;

  return (
    <div className="sectionInterventions">
      <div className="siteDetailsTitle">
        <h2 className="siteTitle">{site.name}</h2>

        {/* {shortestIntervention && (
          <RemainingTimeIndicator remainingHours={shortestIntervention.remainingHours} />
        )} */}
        <SiteDetailsForm site={site} />
        <div>
          {zoneId === "reservoirs" ? (
            <p className="totalTime">
              Date du jour: {new Date().toLocaleDateString()}
            </p>
          ) : (
            <span className="countHours">
              <b>{site.totalHours.toFixed(1)}</b>
              <p></p>
              <p> heures de fonctionnement (année en cours)</p>
            </span>
          )}
        </div>
      </div>
      <h2>INTERVENTIONS</h2>
      <div className="showIntervention">
        <button onClick={toggleRealized} className="btnInterventions" >Réalisées</button>
        <button onClick={togglePlanned} className="btnInterventions" >Prévues</button>
        <button onClick={toggleCyclic} className="btnInterventions" >Cycliques</button>
      </div>
      <div
        className={`interventionsAll interventionsCount-${shownInterventions}`}
      >
        <div
          className={`interventionRealized ${
            realizedInterventions.show ? "show" : "hide"
          }`}
        >
          <h3>Interventions réalisées</h3>
          <InterventionForm
            onSubmit={(i) => handleInterventionSubmit(i, false)}
            isPlanned={false}
            site={site}
          />
          {realizedInterventions.show &&
            realizedInterventions.data.map((intervention) => (
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
        <div
          className={`interventionPlanned ${
            plannedInterventions.show ? "show" : "hide"
          }`}
        >
          <h3>Interventions prévues</h3>
          <InterventionForm
            onSubmit={(i) => handleInterventionSubmit(i, true)}
            isPlanned={true}
            site={site}
          />

          {plannedInterventions.show &&
            plannedInterventions.data.map((intervention) => (
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
        <div
          className={`interventionCyclic ${
            cyclicInterventions.show ? "show" : "hide"
          }`}
        >
          <h3>Interventions cycliques</h3>
          <InterventionForm
            onSubmit={(i) => handleInterventionSubmit(i, false, true)}
            isPlanned={false}
            isCyclic={true}
            site={site}
            siteTotalHours={site.totalHours.toFixed(1)}
          />

          {cyclicInterventions.show &&
            cyclicInterventions.data.map((intervention) => (
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
