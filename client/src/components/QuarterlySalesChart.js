import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import axios from 'axios';
import Chart from 'chart.js/auto';

function QuarterlySalesChart() {
  const [data, setData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('https://rapidquest-assignment-server.onrender.com/api/total-sales/quarterly');

        const chartData = {
          labels: response.data.map(item => `Q${item._id.quarter} ${item._id.year}`),
          datasets: [
            {
              label: 'Quarterly Sales',
              data: response.data.map(item => item.total_sales),
              backgroundColor: [
                'rgba(255,99,132,0.2)',
                'rgba(54,162,235,0.2)',
                'rgba(255,206,86,0.2)',
                'rgba(75,192,192,0.2)',
                'rgba(153,102,255,0.2)',
                'rgba(255,159,64,0.2)'
              ],
              borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54,162,235,1)',
                'rgba(255,206,86,1)',
                'rgba(75,192,192,1)',
                'rgba(153,102,255,1)',
                'rgba(255,159,64,1)'
              ],
              borderWidth: 1,
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
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.label || '';
            if (context.parsed !== null) {
              label += `: ${context.parsed} units`;
            }
            return label;
          },
        },
      },
    },
  };

  return (
    <div style={{ width: '500px', height: '500px' }}>
      <h1>Quarterly Sales Donut Chart</h1>
      <Doughnut data={data} options={options} />
    </div>
  );
}

export default QuarterlySalesChart;
