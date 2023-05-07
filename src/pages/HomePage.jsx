import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <main className='mainHome'>
        {/* <h2>Maintenance</h2> */}
        <ul>
          <li>
            <Link to="/zone/production"><button className='siteButton'><p>POMPAGES MAZERES</p></button></Link>
          </li>
          <li>
            <Link to="/zone/surpressions"><button className='siteButton'><p>SURPRESSIONS</p></button></Link>
          </li>
          <li>
            <Link to="/zone/surpressions"><button className='siteButton'><p>RESERVOIRS</p></button></Link>
          </li>
        </ul>
    </main>
  );
};

export default HomePage;
