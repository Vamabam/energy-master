import React, { useEffect, useRef } from 'react';
import { IonContent, IonHeader, IonListHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent } from '@ionic/react';
import { Chart } from 'chart.js/auto'; // Import from 'chart.js/auto' for the latest version
import './Tab1.css';
import createChart from "./Graphs";

const Tab1: React.FC = () => {
  const powerChart = useRef<HTMLCanvasElement | null>(null); // Correctly typed useRef
  const chartInstance = useRef<Chart<'bar'> | null>(null); // Ref to hold the Chart instance
  createChart(powerChart, chartInstance);
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 1</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonListHeader color="light">Vertical Bar Chart</IonListHeader>
        <IonCard>
          <IonCardHeader>
            <IonCardSubtitle>Number of Viewers per season for</IonCardSubtitle>
            <IonCardTitle>Game of Thrones</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
          <canvas ref={powerChart}></canvas>
          </IonCardContent>
        </IonCard>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 1</IonTitle>
          </IonToolbar>
        </IonHeader>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
/*
 // Current Chart
  const CurrentChart = useRef<HTMLCanvasElement | null>(null); // Correctly typed useRef
  useEffect(() => {
    if (CurrentChart.current) {
      const ctx = CurrentChart.current.getContext('2d');
      if (ctx) {
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'],
            datasets: [{
              label: 'Viewers in millions',
              data: [, 3.8, 5, 6.9, 6.9, 7.5, 10, 17],
              backgroundColor: 'rgb(38, 194, 129)', // array should have same number of elements as number of dataset
              borderColor: 'rgb(38, 194, 129)', // array should have same number of elements as number of dataset
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
  }, []); // Empty dependency array ensures useEffect runs only once
*/