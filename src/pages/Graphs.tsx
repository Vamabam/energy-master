import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto'; // Import from 'chart.js/auto' for the latest version
import * as queries from '../graphql/queries'

import { generateClient } from 'aws-amplify/api';
import { Amplify } from 'aws-amplify';
import config from '../amplifyconfiguration.json';

Amplify.configure(config);
const client = generateClient();

// Gets all power data for specified device
async function fetchDevicePowerData(device_name:string) {
  // To implement this if all data is uploaded at once use if statements to diffferentiate between filters
  const deviceFilter = {
    limit: 10000,
    filter: {
      device_id: {
        eq: device_name
      }
    }
  };
  
  const allpowerData = await client.graphql({ 
    query: queries.listPwrData,
    variables: deviceFilter
  });

  var pwrData  = allpowerData.data.listMonitoringRecords.items;
  //pwrData.sort((a, b) => a.dataTime- b.dataTime);
  pwrData.sort((a, b) => new Date(a.dataTime).getTime() - new Date(b.dataTime).getTime());
  // Look into converting time stamps to normal values
  var label = pwrData.map(data => data.dataTime);
  var value = pwrData.map(data => data.Power);
  return {label, value}
}

function createChart(powerChart: React.MutableRefObject<HTMLCanvasElement | null>, chartInstance: React.MutableRefObject<Chart<'line'> | null>) {
  useEffect(() => {
    const fetchData = async () => {
      try {
        var { label: pluglabels, value: values } = await fetchDevicePowerData("Plug1");
        console.log("Plug Data:", pluglabels, values);
        const { label: sensor1Labels, value: sensor1Values } = await fetchDevicePowerData("CurrentSensor1");
        console.log("Sensor 1 Data:", sensor1Labels, sensor1Values);
        const { label: sensor2Labels, value: sensor2Values } = await fetchDevicePowerData("CurrentSensor2");
        //console.log("Sensor 2 Data:", sensor2Labels, sensor2Values);
        if (powerChart.current) {
          // Destroy existing chart if it exists
          if (chartInstance.current) {
            chartInstance.current.destroy();
          }
          const ctx = powerChart.current.getContext('2d');
          chartInstance.current = new Chart(ctx, {
            type: 'line',
            data: {
              //plugLabels,
              labels: sensor1Labels,
              datasets: [
              {
                label: 'Plug',
                data: values,//plugValues,
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false,
              },
              {
                label: 'Current Sensor 1',
                data: sensor1Values,
                borderColor: 'rgba(255, 99, 132, 1)',
                fill: false,
              },
              {
                label: 'Current Sensor 2',
                data: sensor2Values,
                borderColor: 'rgba(54, 162, 235, 1)',
                fill: false,
              }
            ],
          },
            options: {
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            },
          });
        }
      } catch (error) {
        console.error("Error fetching device power data:", error);
      }
    };

    fetchData();
    // Set interval to fetch new data every 5 seconds
    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    // Cleanup function to destroy chart when component unmounts
    return () => {
      clearInterval(interval);
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []); // Empty dependency array ensures useEffect runs only once on initial mount
}

export default createChart;
