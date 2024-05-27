import React, { useEffect, useState } from 'react';
import { fetchConnections } from '../services/redisService';
import './ConnectionsList.css';
import { formatTime } from '../utils/timeUtils'; // Importar la función de formateo

const ConnectionsList = ({ onSelectApp }) => {
  const [connections, setConnections] = useState({});

  useEffect(() => {
    const getConnections = async () => {
      const data = await fetchConnections();

      // Ordenar los datos alfabéticamente por el nombre de la aplicación
      const sortedData = Object.keys(data).sort().reduce((acc, key) => {
        acc[key] = data[key];
        return acc;
      }, {});

      setConnections(sortedData);
    };

    getConnections();
    const intervalId = setInterval(getConnections, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleCardClick = (appName) => {
    onSelectApp(appName);
  };

  return (
    <div className="connections-container">
      <h1>Redis Connections</h1>
      <div className="cards-container">
        {Object.entries(connections).map(([appName, { active, inactive, ageAvg, idleAvg, totalConnections }]) => (
          <div key={appName} className="card" onClick={() => handleCardClick(appName)}>
            <h2>{appName}</h2>
            <div className="card-info">
              <p><strong>Total Connections:</strong> {totalConnections}</p>
              <p><strong>Active Connections:</strong> {active}</p>
              <p><strong>Inactive Connections:</strong> {inactive}</p>
              <p><strong>Average Age:</strong> {formatTime(parseFloat(ageAvg))}</p> {/* Usar la función de formateo */}
              <p><strong>Average Idle:</strong> {formatTime(parseFloat(idleAvg))}</p> {/* Usar la función de formateo */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConnectionsList;
