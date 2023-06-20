import React, { useState, useEffect } from "react";
import "./index.css"

const SiteDetailsForm = ({ site }) => {
  const [details, setDetails] = useState(null);
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      const response = await fetch(
        `http://localhost:5000/api/site-details/${site.name}`
      );
      const details = await response.json();
      setDetails(details);

      if (details) {
        setIsUpdateMode(true);
      }
    };

    fetchDetails();
  }, [site]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      siteName: site.name,
      gpsCoordinates:
        details?.gpsCoordinates.map((coord) => parseFloat(coord.trim())) || [],
      image: details?.image || "",
    };

    const options = {
      method: isUpdateMode ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    };

    const url = isUpdateMode
      ? `http://localhost:5000/api/site-details/${site.name}`
      : "http://localhost:5000/api/site-details";

    const response = await fetch(url, options);
    const savedDetails = await response.json();
    setDetails(savedDetails);
    setIsUpdateMode(true);
  };

  const handleDelete = async () => {
    const response = await fetch(
      `http://localhost:5000/api/site-details/${site.name}`,
      {
        method: "DELETE",
      }
    );

    const deletedDetails = await response.json();
    setDetails(null);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  const openGoogleMaps = () => {
    const gpsURL = `https://www.google.com/maps/search/?api=1&query=${details.gpsCoordinates.join(
      ","
    )}`;
    window.open(gpsURL);
  };

  return (
    <form onSubmit={handleSubmit}>
        <div className="siteInfos">
      {details?.image && <img src={details.image} className="siteImage" alt="Site" />}{" "}
      <button type="button" onClick={openGoogleMaps}>GPS</button>
      </div>
      {/* <h3>Site Details</h3> */}
      <div>
        <label>Localisation GPS:</label>
        <input
          type="text"
          value={details?.gpsCoordinates.join(", ") || ""}
          onChange={(e) =>
            setDetails({
              ...details,
              gpsCoordinates: e.target.value.split(","),
            })
          }
        />
      </div>
      <div>
        <label>Image URL:</label>
        <input
          type="text"
          value={details?.image || ""}
          onChange={(e) => setDetails({ ...details, image: e.target.value })}
        />
      </div>
      <button type="submit">
        {isUpdateMode ? "Mettre à jour" : "Créer"} 
      </button>
      {details && (
        <button type="button" onClick={handleDelete}>
          Effacer
        </button>
      )}
    </form>
  );
};

export default SiteDetailsForm;
