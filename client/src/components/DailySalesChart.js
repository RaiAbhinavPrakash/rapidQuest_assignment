import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import Chart from "chart.js/auto";
import zoomPlugin from 'chartjs-plugin-zoom'; 

Chart.register(zoomPlugin);

function DailySalesChart() {
  const [data, setData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/total-sales/daily"
        );
        const chartData = {
          labels: response.data.map((item) => {
            const { year, month, day } = item._id;
            return `${year}-${month.toString().padStart(2, "0")}-${day
              .toString()
              .padStart(2, "0")}`;
          }),
          datasets: [
            {
              label: "Daily Sales",
              data: response.data.map((item) => item.total_sales),
              borderColor: "rgba(75,192,192,1)",
              backgroundColor: "rgba(75,192,192,0.5)", 
              borderWidth: 2, 
              hoverBackgroundColor: "rgba(75,192,192,0.7)", 
            },
          ],
        };
        setData(chartData);
      } catch (error) {
        console.error("Error fetching data:", error);
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
            return `${context.label}: $${context.raw.toLocaleString()}`;
          },
        },
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleColor: '#fff',
        bodyColor: '#fff',
      },
      zoom: {
        pan: {
          enabled: true,
          mode: 'x',
        },
        zoom: {
          enabled: true,
          mode: 'x',
        },
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
      <h1>Daily Sales Chart</h1>
      <Bar data={data} options={options} />
    </div>
  );
}

export default DailySalesChart;
