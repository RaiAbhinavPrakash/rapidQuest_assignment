import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

function YearlySalesChart() {
  const [data, setData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('https://rapidquest-assignment-server.onrender.com/api/total-sales/yearly');
        const chartData = {
          labels: response.data.map(item => item._id.year), 
          datasets: [
            {
              label: 'Yearly Sales',
              data: response.data.map(item => item.total_sales), 
              borderColor: 'rgba(255,159,64,1)',
              backgroundColor: 'rgba(255,159,64,0.2)',
              fill: true,
            }
          ],
        };
        setData(chartData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.label || '';
            if (context.parsed !== null) {
              label += `: ${context.parsed.y} units`;
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: true,
          maxRotation: 90,
          minRotation: 45,
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ width: '100%', height: '800px', padding: '20px' }}>
      <h1>Yearly Sales Chart</h1>
      <Line data={data} options={options} />
    </div>
  );
}

export default YearlySalesChart;
