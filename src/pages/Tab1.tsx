import React, { useEffect, useRef, useState } from 'react';
import { IonContent, IonHeader, IonListHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonGrid, IonRow, IonCol } from '@ionic/react';
import { Chart } from 'chart.js/auto'; // Import from 'chart.js/auto' for the latest version
import './Tab1.css';
import useChart from "./useChart";
import RecentCard from '../components/recentDataCard';

export interface MostRecent {
  recentData: number;
}

const Tab1: React.FC = () => {
  // Sets up graph and live data referene for each dataset
  const [plugPower, setPlugPower] = useState<MostRecent>({ recentData: 10 });
  const plug1Chart = useRef<HTMLCanvasElement | null>(null);
  const plug1chartInstance = useRef<Chart<'line'> | null>(null);
  useChart(plug1Chart, plug1chartInstance, "Plug1", setPlugPower);

  const [solarPower, setSolarPower] = useState<MostRecent>({ recentData: 10 });
  const solarChart = useRef<HTMLCanvasElement | null>(null);
  const SolarchartInstance = useRef<Chart<'line'> | null>(null);
  useChart(solarChart, SolarchartInstance, "CurrentSensor1", setSolarPower);

  const [mainsPower, setMainsPower] = useState<MostRecent>({ recentData: 4 });
  const mainsChart = useRef<HTMLCanvasElement | null>(null);
  const mainschartInstance = useRef<Chart<'line'> | null>(null);
  useChart(mainsChart, mainschartInstance, "CurrentSensor2", setMainsPower);

  const [circuitPower, setCircuitPower] = useState<MostRecent>({ recentData: 0 });
  const circuitChart = useRef<HTMLCanvasElement | null>(null);
  const circuitchartInstance = useRef<Chart<'line'> | null>(null);
  useChart(circuitChart, circuitchartInstance, "CurrentSensor3", setCircuitPower);

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
            <IonCardSubtitle>Power Generated (milliWatts)</IonCardSubtitle>
            <IonCardTitle>Solar Array</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonGrid>
              <IonRow>
                <IonCol size="9">
                  <canvas ref={solarChart}></canvas>
                </IonCol>
                <IonCol size="3">
                  <RecentCard number={solarPower.recentData.toFixed(2)} />
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>
        <IonCard>
          <IonCardHeader>
            <IonCardSubtitle>Power Draw (milliWatts)</IonCardSubtitle>
            <IonCardTitle>Mains From Grid</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonGrid>
              <IonRow>
                <IonCol size="9">
                  <canvas ref={mainsChart}></canvas>
                </IonCol>
                <IonCol size="3">
                  <RecentCard number={mainsPower.recentData.toFixed(2)} />
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>
        <IonCard>
          <IonCardHeader>
            <IonCardSubtitle>Power Usage (Watts)</IonCardSubtitle>
            <IonCardTitle>Smart Plug</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonGrid>
              <IonRow>
                <IonCol size="9">
                  <canvas ref={plug1Chart}></canvas>
                </IonCol>
                <IonCol size="3">
                  <RecentCard number={plugPower.recentData.toFixed(2)} />
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>
        <IonCard>
          <IonCardHeader>
            <IonCardSubtitle>Power Usage (milliWatts)</IonCardSubtitle>
            <IonCardTitle>Circuit</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonGrid>
              <IonRow>
                <IonCol size="9">
                  <canvas ref={circuitChart}></canvas>
                </IonCol>
                <IonCol size="3">
                  <RecentCard number={circuitPower.recentData.toFixed(2)} />
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Energy Master</IonTitle>
          </IonToolbar>
        </IonHeader>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
