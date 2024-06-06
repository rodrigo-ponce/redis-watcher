import React, { useEffect, useState, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import './ConnectionsChart.css';
import { fetchConnections } from '../services/redisService';
import PropTypes from 'prop-types';

const ConnectionsChart = ({ appName }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    activeConnections: [],
    inactiveConnections: []
  });
  const chartRef = useRef();

  useEffect(() => {
    const updateChartData = async () => {
      const data = await fetchConnections();

      if (data[appName]) {
        setChartData(prevData => {
          const newLabels = [...prevData.labels, new Date().toLocaleTimeString()];
          const newActiveConnections = [...prevData.activeConnections, data[appName].active];
          const newInactiveConnections = [...prevData.inactiveConnections, data[appName].inactive];

          if (newLabels.length > 20) {
            newLabels.shift();
            newActiveConnections.shift();
            newInactiveConnections.shift();
          }

          return {
            labels: newLabels,
            activeConnections: newActiveConnections,
            inactiveConnections: newInactiveConnections
          };
        });
      }
    };

    const intervalId = setInterval(updateChartData, 1000);

    return () => clearInterval(intervalId);
  }, [appName]);

  const chartDataConfig = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Active Connections',
        data: chartData.activeConnections,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
      {
        label: 'Inactive Connections',
        data: chartData.inactiveConnections,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
      },
    ],
  };

  return (
    <div className="chart-card">
      <h3>{appName} Connections Over Time</h3>
      <div className="chart-container">
        <Line data={chartDataConfig} ref={chartRef} />
      </div>
    </div>
  );
};

ConnectionsChart.propTypes = {
  appName: PropTypes.string.isRequired,
};

export default ConnectionsChart;
