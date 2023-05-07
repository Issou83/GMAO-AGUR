import React from "react";
import "./index.css";
import LogoAcceuil from "../../assets/acceuil.png"

const Navigation = () => {
  return (
    <nav> 
          <a href="/"><img className="logoAcceuil" src={LogoAcceuil} alt="Acceuil" /></a>
    </nav>
  );
};

export default Navigation;
