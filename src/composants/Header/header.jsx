import React from "react";
import Logo from "../../assets/logoAgur.png";
import "./index.css";
import Navigation from "../Navigation/Navigation";

const header = () => {
  return (
    <header>
      <div className="headerContent">
        <div className="logoAgur">
          <img src={Logo} alt="logo Agur" />
        </div>
        <div className="titleHeader">
          <h1><span>Agence de Jurançon<span/></span><br/><span className="sousTitre">GMAO</span></h1>
        </div>
        <Navigation/>
      </div>
    </header>
  );
};

export default header;
