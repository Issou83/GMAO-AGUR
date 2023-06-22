import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import SiteDetails from "../composants/SiteDetails/SiteDetails";
import RemainingTimeIndicator from "../composants/RemainingTimeIndicator/RemainingTimeIndicator";
import SearchIntervention from "../composants/SearchIntervention/SearchIntervention"; // Assurez-vous que le chemin est correct
import Intervention from "../composants/Intervention/Intervention"; // Assurez-vous que le chemin est correct
import dataZones from "../../public/dataZones.json";
console.log(dataZones);


function ZonePage() {
  const { zoneId } = useParams();
  const [sites, setSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState(null);
  const [interventions, setInterventions] = useState([]);
  const [siteWithShortestIntervention, setSiteWithShortestIntervention] =
    useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [filteredInterventions, setFilteredInterventions] =
    useState(interventions);

  const generateJSONFromXLSX = async () => {
    const response = await fetch("/SMEP.xlsx");
    const arrayBuffer = await response.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);
    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonSheet = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    let jsonData = { production: [], surpressions: [] ,reservoirs: []};

    for (let col = 51; col <= 64; col++) {
      // if (col === 54 || col === 57 || col === 60) continue;
      const siteName = jsonSheet[6][col];
      const siteHours = jsonSheet.slice(9).map((row) => row[col]);
      const totalHours = siteHours
        .filter((hour) => hour)
        .reduce((acc, hour) => acc + hour, 0);
      jsonData.production.push({ name: siteName, totalHours });
    }

    for (let col = 20; col <= 46; col += 3) {
      const siteName = jsonSheet[4][col];
      const siteHours = jsonSheet.slice(9).map((row) => row[col]);
      const totalHours = siteHours
        .filter((hour) => hour)
        .reduce((acc, hour) => acc + hour, 0);
      jsonData.surpressions.push({ name: siteName, totalHours });
    }

    return jsonData;
  };

  const loadSites = async () => {
    const jsonData = await generateJSONFromXLSX();
    let sites = [];
  
    if (zoneId === "production") {
      sites = jsonData.production;
    } else if (zoneId === "surpressions") {
      sites = jsonData.surpressions;
    } else if (zoneId === "reservoirs") {
      sites = dataZones || [];
    }
  
    return sites;
  };

  useEffect(() => {
    const loadAndSetSites = async () => {
      const loadedSites = await loadSites();
      setSites(loadedSites);
    };

    loadAndSetSites();
  }, [zoneId]);

  // const handleSiteClick = (site) => {
  //   setSelectedSite(site);
  // };

  const loadInterventions = async () => {
    const response = await fetch("http://localhost:5000/api/interventions");
    const interventions = await response.json();
    return interventions;
  };

  // const [interventions, setInterventions] = useState([]);

  const updateShortestInterventions = () => {
    const shortestInterventions = {};
    for (let intervention of interventions) {
      if (intervention.interventionType !== "planned") {
        continue;
      }
      if (
        shortestInterventions[intervention.siteName] === undefined ||
        intervention.remainingHours <
          shortestInterventions[intervention.siteName].remainingHours
      ) {
        shortestInterventions[intervention.siteName] = intervention;
      }
    }

    let sitesWithShortestInterventions = sites.map((site) => {
      return {
        ...site,
        shortestIntervention: shortestInterventions[site.name],
      };
    });

    setSites(sitesWithShortestInterventions);
  };

  useEffect(() => {
    const loadAndSetInterventions = async () => {
      const loadedInterventions = await loadInterventions();
      setInterventions(loadedInterventions);
    };

    if (sites.length > 0) {
      loadAndSetInterventions();
    }
  }, [sites]); // Retirer 'interventions' de la liste des dépendances

  useEffect(() => {
    if (interventions.length > 0) {
      updateShortestInterventions();
    }
  }, [interventions]);

  const handleSiteClick = (site) => {
    setSelectedSite(site);
    setSiteWithShortestIntervention(site.shortestIntervention);
  };

  return (
    <main>
    <h2 className="titleZone">
  {zoneId === "production"
    ? "Mazères"
    : zoneId === "surpressions"
    ? "Surpressions"
    : "Réservoirs"}
</h2>
      <div>
      <button onClick={() => setSearchOpen(!searchOpen)}>
          {searchOpen ? "X" : "Rechercher"}
        </button>
        {searchOpen && (
          <>
            <SearchIntervention
              setFilteredInterventions={setFilteredInterventions}
            />
            {filteredInterventions.map((intervention) => (
              <Intervention key={intervention._id} intervention={intervention} />
            ))}
          </>
        )}
      </div>
      <div className="ZoneContent">
        <div className="sites">
          <div className="sectionButtonsSites">
          {sites.map((site, index) => (
  <div key={index}>
    {site.totalHours !== 0 && (
      <button
        className={`siteButton ${
          site.shortestIntervention &&
          (site.shortestIntervention.remainingHours < 0
            ? "siteButtonNegative"
            : site.shortestIntervention.remainingHours > 0 &&
              site.shortestIntervention.remainingHours <= 168
            ? "siteButtonEndTime"
            : "")
        }`}
        onClick={() => handleSiteClick(site)}
      >
        <p>{site.name}</p>
        {site.shortestIntervention && (
          <RemainingTimeIndicator
            remainingHours={site.shortestIntervention.remainingHours}
          />
        )}
      </button>
    )}
  </div>
))}

          </div>
        </div>
      </div>
      {selectedSite && (
        <SiteDetails
          site={selectedSite}
          shortestIntervention={siteWithShortestIntervention}
          interventions={interventions}
          zoneId={zoneId}
          
        />
      )}
    </main>
  );
}

export default ZonePage;
