import { useEffect } from 'react';
import { Chart } from 'chart.js/auto';
import * as queries from '../graphql/queries';
import { generateClient } from 'aws-amplify/api';
import { Amplify } from 'aws-amplify';
import config from '../amplifyconfiguration.json';
import { MostRecent } from './Tab1';

Amplify.configure(config);
const client = generateClient();

// Gets all power data for specified device
async function fetchDevicePowerData(device_name: string) {
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

  const pwrData = allpowerData.data.listMonitoringRecords.items;
  pwrData.sort((a, b) => new Date(a.dataTime).getTime() - new Date(b.dataTime).getTime());
  
  const label = pwrData.map(data => data.dataTime);
  const value = pwrData.map(data => data.Power);
  return { label, value };
}

function useChart(
  powerChart: React.RefObject<HTMLCanvasElement>,
  chartInstance: React.MutableRefObject<Chart<'line'> | null>,
  deviceName: string,
  setRecentData: React.Dispatch<React.SetStateAction<MostRecent>>
) {
  useEffect(() => {
    //let chartInstance: Chart<'line'> | null = null;

    const fetchData = async () => {
      try {
        const { label: labels, value: values } = await fetchDevicePowerData(deviceName);
        setRecentData({ recentData: values.at(-1) }); // Update state with last value in array
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
                labels: labels,
                datasets: [
                {
                  label: 'Power (mW)',
                  data: values,
                  borderColor: 'rgba(75, 192, 192, 1)',
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
    },  [deviceName, setRecentData, powerChart]);
       

}

export default useChart;
