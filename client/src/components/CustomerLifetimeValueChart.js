import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale);

const CustomerLifetimeValueChart = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/customer-lifetime-value');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        if (data.length === 0) {
          throw new Error('No data available');
        }

        const labels = data.map(customer => customer.email);
        const values = data.map(customer => customer.totalSpent);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Total Spent',
              data: values,
              borderColor: 'rgba(75,192,192,1)',
              backgroundColor: 'rgba(75,192,192,0.2)',
              fill: true,
            }
          ]
        });
      } catch (error) {
        console.error('Error fetching customer lifetime value:', error);
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Customer Lifetime Value</h1>
      {error ? <p>Error: {error}</p> : <Line data={chartData} />}
    </div>
  );
};

export default CustomerLifetimeValueChart;
