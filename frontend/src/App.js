import React, { useState } from 'react';
import ConnectionsList from './components/ConnectionsList';
import ConnectionsChart from './components/ConnectionsChart';
import './App.css';

const App = () => {
  const [selectedApp, setSelectedApp] = useState(null); // Estado para la app seleccionada

  const handleSelectApp = (appName) => {
    setSelectedApp(appName);
  };

  return (
    <div className="app-container">
      <ConnectionsList onSelectApp={handleSelectApp} />
      {selectedApp && (
        <ConnectionsChart appName={selectedApp} />
      )}
    </div>
  );
};

export default App;
