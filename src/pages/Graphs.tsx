import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto'; // Import from 'chart.js/auto' for the latest version
import { create } from 'ionicons/icons';

function createChart(powerChart:React.MutableRefObject<HTMLCanvasElement | null>, chartInstance:React.MutableRefObject<Chart<'bar'> | null>) {
  
    useEffect(() => {
      if (powerChart.current) {
        // Destroy existing chart if it exists
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }
  
        const ctx = powerChart.current.getContext('2d');
        if (ctx) {
          chartInstance.current = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'],
              datasets: [{
                label: 'Viewers in millions',
                data: [2.5, 3.8, 5, 6.9, 6.9, 7.5, 10, 17],
                backgroundColor: 'rgb(38, 194, 129)',
                borderColor: 'rgb(38, 194, 129)',
                borderWidth: 1
              }]
            },
            options: {
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }
          });
        }
      }
  
      // Cleanup function to destroy chart when component unmounts
      return () => {
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }
      };
    }, []); // Empty dependency array ensures useEffect runs only once on initial mount
};

export default createChart;
