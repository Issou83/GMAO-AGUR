import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ZonePage from './pages/ZonePage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/zone/:zoneId" element={<ZonePage />} />
      </Routes>
    </Router>
  );
}

export default App;

