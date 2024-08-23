import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const NewCustomersChart = () => {
  const [interval, setInterval] = useState('monthly');
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/new-customers?interval=${interval}`);
        const data = await response.json();
        setChartData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [interval]);

  const options = {
    chart: {
      type: 'column', 
    },
    title: {
      text: 'New Customers',
      style: {
        fontSize: '18px',
        fontWeight: 'bold',
      },
    },
    xAxis: {
      categories: chartData.map(item => item._id),
      title: {
        text: 'Date',
        style: {
          fontSize: '14px',
        },
      },
      labels: {
        style: {
          fontSize: '12px',
        },
      },
      tickInterval: Math.max(1, Math.floor(chartData.length / 10)), 
    },
    yAxis: {
      title: {
        text: 'Number of New Customers',
        style: {
          fontSize: '14px',
        },
      },
      labels: {
        style: {
          fontSize: '12px',
        },
      },
      gridLineWidth: 1,
      gridLineColor: '#e0e0e0',
    },
    series: [{
      name: 'New Customers',
      data: chartData.map(item => item.newCustomers),
      color: '#007bff', 
      dataLabels: {
        enabled: true, 
        format: '{point.y}', 
        style: {
          fontSize: '12px',
          color: '#000000',
        },
      },
    }],
    legend: {
      itemStyle: {
        fontSize: '12px',
      },
    },
    tooltip: {
      pointFormat: '<b>{point.y}</b>',
      headerFormat: '<b>{series.name}</b><br/>',
    },
  };

  return (
    <div  style={{ width: '100%', height: '400px', padding: '20px' }}>
      <h1>New Customer Chart</h1>
      <div>
        <button onClick={() => setInterval('yearly')}>Yearly</button>
        <button onClick={() => setInterval('monthly')}>Monthly</button>
        <button onClick={() => setInterval('daily')}>Daily</button>
      </div>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
      />
    </div>
  );
};

export default NewCustomersChart;
