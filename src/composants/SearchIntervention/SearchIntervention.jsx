import React, { useState, useEffect } from 'react';

function SearchIntervention({ setFilteredInterventions }) {
  const [interventions, setInterventions] = useState([]);
  const [agents, setAgents] = useState([]);
  const [sites, setSites] = useState([]);
  const [filter, setFilter] = useState({
    agent: '',
    description: '',
    date: '',
    site: ''
  });

  useEffect(() => {
    const getInterventions = async () => {
      const response = await fetch('http://localhost:5000/api/interventions');
      const data = await response.json();
      setInterventions(data);
      setAgents([...new Set(data.map(i => i.agent))]);
      setSites([...new Set(data.map(i => i.siteName))]);
    };

    getInterventions();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    let filtered = interventions;

    if (filter.agent) {
      filtered = filtered.filter(i => i.agent === filter.agent);
    }

    if (filter.description) {
      filtered = filtered.filter(i => i.description.includes(filter.description));
    }

    if (filter.date) {
      filtered = filtered.filter(i => new Date(i.date).toLocaleDateString() === new Date(filter.date).toLocaleDateString());
    }

    if (filter.site) {
      filtered = filtered.filter(i => i.siteName === filter.site);
    }

    setFilteredInterventions(filtered);
  };

  const handleChange = (e) => {
    setFilter({
      ...filter,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Agent :
        <select name='agent' onChange={handleChange}>
          <option value=''>Tous</option>
          {agents.map(agent => (
            <option key={agent} value={agent}>
              {agent}
            </option>
          ))}
        </select>
      </label>
      <label>
        Description :
        <input type='text' name='description' onChange={handleChange} />
      </label>
      <label>
        Date :
        <input type='date' name='date' onChange={handleChange} />
      </label>
      <label>
        Site :
        <select name='site' onChange={handleChange}>
          <option value=''>Tous</option>
          {sites.map(site => (
            <option key={site} value={site}>
              {site}
            </option>
          ))}
        </select>
      </label>
      <button type='submit'>Rechercher</button>
    </form>
  );
}

export default SearchIntervention;
