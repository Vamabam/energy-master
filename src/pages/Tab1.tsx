import React, { useEffect, useRef } from 'react';
import { IonContent, IonHeader, IonListHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent } from '@ionic/react';
import { Chart } from 'chart.js/auto'; // Import from 'chart.js/auto' for the latest version
import './Tab1.css';
import createChart from "./Graphs";

const Tab1: React.FC = () => {
  const powerChart = useRef<HTMLCanvasElement | null>(null); // Correctly typed useRef
  const chartInstance = useRef<Chart<'line'> | null>(null); // Ref to hold the Chart instance
  createChart(powerChart, chartInstance);
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Power Usage</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonListHeader color="light">Device Power Data</IonListHeader>
        <IonCard>
          <IonCardHeader>
            <IonCardSubtitle>Power Usage (Watts)</IonCardSubtitle>
            <IonCardTitle>Smart Plug</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
          <canvas ref={powerChart}></canvas>
          </IonCardContent>
        </IonCard>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Power Usage</IonTitle>
          </IonToolbar>
        </IonHeader>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;