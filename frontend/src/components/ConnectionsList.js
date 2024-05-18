import React, { useEffect, useState } from 'react';
import { fetchConnections } from '../services/redisService';
import './ConnectionsList.css';

const ConnectionsList = () => {
  const [connections, setConnections] = useState({});

  useEffect(() => {
    const getConnections = async () => {
      const data = await fetchConnections();
      setConnections(data);
    };

    // Llamar a getConnections inmediatamente y luego cada 1 segundo
    getConnections();
    const intervalId = setInterval(getConnections, 1000);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="connections-container">
      <h1>Redis Connections</h1>
      <div className="cards-container">
        {Object.entries(connections).map(([appName, { active, inactive, ageAvg, idleAvg, totalConnections }]) => (
          <div key={appName} className="card">
            <h2>{appName}</h2>
            <div className="card-info">
              <p><strong>Total Connections:</strong> {totalConnections}</p>
              <p><strong>Active Connections:</strong> {active}</p>
              <p><strong>Inactive Connections:</strong> {inactive}</p>
              <p><strong>Average Age:</strong> {ageAvg} seconds</p>
              <p><strong>Average Idle:</strong> {idleAvg} seconds</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConnectionsList;
