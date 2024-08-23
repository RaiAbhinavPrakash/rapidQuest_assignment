import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

function MonthlyGrowthRateChart() {
  const [data, setData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('http://localhost:8000/api/sales-growth-rate');
        const data = response.data;

        const allGrowthRates = data.map(item => ({
          label: `${item.year} - Month ${item.month}`,
          growthRate: item.growthRate
        }));

        const chartData = {
          labels: allGrowthRates.map(item => item.label),
          datasets: [
            {
              label: 'Monthly Growth Rate (%)',
              data: allGrowthRates.map(item => item.growthRate),
              borderColor: 'rgba(54, 162, 235, 1)',
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
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
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.raw.toFixed(2)}%`;
          },
        },
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleColor: '#fff',
        bodyColor: '#fff',
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          autoSkip: true,
          maxRotation: 45,
          minRotation: 0,
          color: '#333',
        },
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          beginAtZero: true,
          color: '#333',
          callback: function (value) {
            return `${value.toFixed(2)}%`;
          },
        },
      },
    },
  };

  return (
    <div style={{ width: '100%', height: '400px', padding: '20px' }}>
      <h1>Monthly Sales Growth Rate</h1>
      <Line data={data} options={options} />
    </div>
  );
}

export default MonthlyGrowthRateChart;
