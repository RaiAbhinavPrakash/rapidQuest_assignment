import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

function MonthlySalesChart() {
  const [data, setData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('https://rapidquest-assignment-server.onrender.com/api/total-sales/monthly');
        const chartData = {
          labels: response.data.map(
            (item) => `${item._id.year}-${item._id.month.toString().padStart(2, '0')}`
          ),
          datasets: [
            {
              label: 'Total Sales',
              data: response.data.map((item) => item.total_sales),
              borderColor: 'rgba(54, 162, 235, 1)',
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              pointBackgroundColor: 'rgba(54, 162, 235, 1)',
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              pointRadius: 5,
              fill: true,
            },
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
        labels: {
          color: '#333',
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.label || '';
            if (context.parsed !== null) {
              label += `: $${context.parsed.y.toLocaleString()}`;
            }
            return label;
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
            return `$${value.toLocaleString()}`;
          },
        },
      },
    },
  };

  return (
    <div style={{ width: '100%', height: '400px', padding: '20px' }}>
      <h1>Monthly Sales Chart</h1>
      <Line data={data} options={options} />
    </div>
  );
}

export default MonthlySalesChart;
