import { useEffect } from 'react';
import { Chart } from 'chart.js/auto';
import * as queries from '../graphql/queries';
import { generateClient } from 'aws-amplify/api';
import { Amplify } from 'aws-amplify';
import config from '../amplifyconfiguration.json';
import { MostRecent, MostRecentCurrVolt } from './Tab1';
import { plugStatus } from './Tab2';
Amplify.configure(config);
const client = generateClient();

// Gets all power, voltage and Current data for specified device
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
  //console.log(pwrData);
  const label = pwrData.map(data => data.dataTime);
  const value = pwrData.map(data => data.Power);
  const current = pwrData.map(data => data.Irms);
  const voltage = pwrData.map(data => data.Vrms);
  const plugStatus = pwrData.map(data => data.plugStatus)
  return { label, value, current, voltage, plugStatus };
}


export function useChart(
  powerChart: React.RefObject<HTMLCanvasElement>,
  chartInstance: React.MutableRefObject<Chart<'line'> | null>,
  deviceName: string,
  setRecentData: React.Dispatch<React.SetStateAction<MostRecent>>,
  setRecentCurrVolData: React.Dispatch<React.SetStateAction<MostRecentCurrVolt>>
) {
  useEffect(() => {
    //let chartInstance: Chart<'line'> | null = null;

    const fetchData = async () => {
      try {
        const { label: labels, value: values, voltage, current } = await fetchDevicePowerData(deviceName);
        setRecentData({ recentData: values.at(-1) }); // Update state with last value in array
        setRecentCurrVolData({Voltage: voltage.at(-1), Current: current.at(-1)});
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
    },  [deviceName, setRecentData, setRecentCurrVolData, powerChart]);
       

}

export function useChart_withPlugstatus(
    powerChart: React.RefObject<HTMLCanvasElement>,
    chartInstance: React.MutableRefObject<Chart<'line'> | null>,
    deviceName: string,
    setRecentData: React.Dispatch<React.SetStateAction<MostRecent>>,
    setRecentCurrVolData: React.Dispatch<React.SetStateAction<MostRecentCurrVolt>>,
    setPlugStatus: React.Dispatch<React.SetStateAction<plugStatus>>
  ) {
    useEffect(() => {
      //let chartInstance: Chart<'line'> | null = null;
  
      const fetchData = async () => {
        try {
          const { label: labels, value: values, voltage, current, plugStatus } = await fetchDevicePowerData(deviceName);
          // Update state of realtime variables with last value in array
          setRecentData({ recentData: values.at(-1) }); 
          setRecentCurrVolData({Voltage: voltage.at(-1), Current: current.at(-1)});
          console.log(plugStatus);
          setPlugStatus({plugStatus: plugStatus.at(-1)});
          
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
      },  [deviceName, setRecentData, setRecentCurrVolData, setPlugStatus ,powerChart]);
         
  
  }