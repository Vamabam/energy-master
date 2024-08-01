import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonPage, IonRow, IonText, IonTitle, IonToolbar } from '@ionic/react';
import {Solarusage} from '../components/SOlarusage';
import './Tab3.css';
import {useChart} from "./useChart";
import React, { useRef, useState } from 'react';
import { Chart } from 'chart.js/auto';
import {MostRecent, MostRecentCurrVolt} from './Tab1' ;


const Tab3: React.FC = () => {
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

const [plugVoltCur, setPlugvoltCur] = useState<MostRecentCurrVolt>({ Voltage: 0, Current:0 });
const [plugPower, setPlugPower] = useState<MostRecent>({ recentData: 0 });
const plug1Chart = useRef<HTMLCanvasElement | null>(null);
const plug1chartInstance = useRef<Chart<'line'> | null>(null);
useChart(plug1Chart, plug1chartInstance, "Plug1", setPlugPower,setPlugvoltCur);

 
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Energy Master</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Data Insights</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Data Insights</IonCardTitle>
          </IonCardHeader>
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonCard>
                  <IonCardHeader>
                    <IonCardTitle>Solar Percent Usage</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <Solarusage solarPwr={solarPower.recentData} circuit1Pwr={circuitPower.recentData} plugPwr={plugPower.recentData}></Solarusage>  
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
