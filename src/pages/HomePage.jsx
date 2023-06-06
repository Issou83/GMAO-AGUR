import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <main className='mainHome'>
      <h2>Maintenance</h2>
      <ul>
        <li>
          <Link to="/zone/production">
            <button className='siteButton'>
              <p>POMPAGES MAZERES</p>
            </button>
          </Link>
        </li>
        <li>
          <Link to="/zone/surpressions">
            <button className='siteButton'>
              <p>SURPRESSIONS</p>
            </button>
          </Link>
        </li>
        <li>
          <Link to="/zone/reservoirs">
            <button className='siteButton'>
              <p>RÉSERVOIRS</p>
            </button>
          </Link>
        </li>
        {/* Ajoutez ici d'autres boutons de zone en fonction de vos besoins */}
      </ul>
    </main>
  );
};

export default HomePage;
