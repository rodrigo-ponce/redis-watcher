import React, { useRef } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import './ConnectionsChart.css';

const ConnectionsChart = ({ appName, data }) => {
  const chartRef = useRef();

   
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Active Connections',
        data: data.activeConnections,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
      {
        label: 'Inactive Connections',
        data: data.inactiveConnections,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
      },
    ],
  };

  return (
    <div>
      <h3>Connections Over Time</h3>
        <Line data={chartData} ref={chartRef} />
    </div>
  );
};

export default ConnectionsChart;
