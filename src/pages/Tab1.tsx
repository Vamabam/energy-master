import React, { useRef, useState } from 'react';
import { IonContent, IonHeader, IonListHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonGrid, IonRow, IonCol } from '@ionic/react';
import { Chart } from 'chart.js/auto'; // Import from 'chart.js/auto' for the latest version
import './Tab1.css';
import { useChart } from "./useChart";
import {RecentCard, CurrnetCard} from '../components/recentDataCard';

export interface MostRecent {
  recentData: number;
}

export interface MostRecentCurrVolt {
  Current: number;
  Voltage: number;
}

const Tab1: React.FC = () => {
  // Sets up graph and live data referene for each dataset
  const [solarCur, setSolarCur] = useState<MostRecentCurrVolt>({ Voltage: 0, Current:0 });
  const [solarPower, setSolarPower] = useState<MostRecent>({ recentData: 0 });
  const solarChart = useRef<HTMLCanvasElement | null>(null);
  const SolarchartInstance = useRef<Chart<'line'> | null>(null);
  useChart(solarChart, SolarchartInstance, "CurrentSensor1", setSolarPower, setSolarCur);
 
  const [mainsCur, setMainsCur] = useState<MostRecentCurrVolt>({ Voltage: 0, Current:0 });
  const [mainsPower, setMainsPower] = useState<MostRecent>({ recentData: 0 });
  const mainsChart = useRef<HTMLCanvasElement | null>(null);
  const mainschartInstance = useRef<Chart<'line'> | null>(null);
  useChart(mainsChart, mainschartInstance, "CurrentSensor3", setMainsPower,setMainsCur);
 
  
  const [circuit1, setCircuit1] = useState<MostRecentCurrVolt>({ Voltage: 0, Current:0 });
  const [circuitPower, setCircuitPower] = useState<MostRecent>({ recentData: 0 });
  const circuitChart = useRef<HTMLCanvasElement | null>(null);
  const circuitchartInstance = useRef<Chart<'line'> | null>(null);
  useChart(circuitChart, circuitchartInstance, "CurrentSensor2", setCircuitPower, setCircuit1);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Energy Master</IonTitle>
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
                  <CurrnetCard voltage={solarCur.Voltage.toFixed(2)} current={solarCur.Current.toFixed(2)} />
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
                  <CurrnetCard voltage={mainsCur.Voltage.toFixed(2)} current={mainsCur.Current.toFixed(2)} />
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
                  <CurrnetCard voltage={circuit1.Voltage.toFixed(2)} current={circuit1.Current.toFixed(2)} />
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
