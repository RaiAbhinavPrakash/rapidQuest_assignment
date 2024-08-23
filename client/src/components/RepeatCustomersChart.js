import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const RepeatCustomersChart = () => {
    const [interval, setInterval] = useState('daily');
    const [data, setData] = useState([]);
    const [labels, setLabels] = useState([]);
    const [chartData, setChartData] = useState({});

    useEffect(() => {
        axios.get(`https://rapidquest-assignment-server.onrender.com/api/repeat-customers?interval=${interval}`)
            .then(response => {
                const fetchedData = response.data;

                if (Array.isArray(fetchedData)) {
                    const newLabels = fetchedData.map(item => {
                        if (interval === 'daily') return `${item.interval.year}-${item.interval.month}-${item.interval.day}`;
                        if (interval === 'monthly') return `${item.interval.year}-${item.interval.month}`;
                        if (interval === 'quarterly') return `Q${item.interval.quarter} ${item.interval.year}`;
                        if (interval === 'yearly') return item.interval.year;
                        return ''; 
                    });

                    const newValues = fetchedData.map(item => item.repeatCustomers);

                    setLabels(newLabels);
                    setData(newValues);
                    setChartData({
                        labels: newLabels,
                        datasets: [
                            {
                                label: 'Repeat Customers',
                                data: newValues,
                                borderColor: 'rgba(75, 192, 192, 1)',
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            },
                        ],
                    });
                } else {
                    console.error('Fetched data is not an array:', fetchedData);
                    setLabels([]);
                    setData([]);
                    setChartData({
                        labels: [],
                        datasets: [],
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLabels([]);
                setData([]);
                setChartData({
                    labels: [],
                    datasets: [],
                });
            });
    }, [interval]);

    return (
        <div>
            <div>
                <h1>Repeat Customer Chart</h1>
                <label>Select Interval: </label>
                <select onChange={(e) => setInterval(e.target.value)} value={interval}>
                    <option value="yearly">Yearly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="monthly">Monthly</option>
                    <option value="daily">Daily</option>
                </select>
            </div>
            <div>
                {chartData.labels && chartData.labels.length > 0 ? (
                    <Line data={chartData} />
                ) : (
                    <p>No data available for the selected interval.</p>
                )}
            </div>
        </div>
    );
};

export default RepeatCustomersChart;
