import { IonCard, IonCardContent, IonCardHeader, IonContent, IonHeader, IonPage, IonTitle, IonToolbar,  IonCardSubtitle, IonCardTitle, IonRow, IonGrid, IonCol} from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import React, { useRef, useState }  from 'react';
import { IonToggle } from '@ionic/react';
import './Tab2.css';
import {switchOn, switchOff} from './PubSubButton'
import {useChart_withPlugstatus} from "./useChart";
import {RecentCard, CurrnetCard, Card} from '../components/recentDataCard';
import { Chart } from 'chart.js/auto';
import {MostRecent, MostRecentCurrVolt} from './Tab1' ;

export interface plugStatusInter { // 0 Is relay OFF , 1 is relay ON
  plugStatus: number;
}

const Tab2: React.FC = () => {
  const [isChecked, setIsChecked] = useState(false);
  
  const handleToggleChange = (event) => {
    const checked = event.detail.checked;
    setIsChecked(checked);
    if (checked) {
      switchOn();
    } else {
      switchOff();
    };
  };
  const [plugVoltCur, setPlugvoltCur] = useState<MostRecentCurrVolt>({ Voltage: 0, Current:0 });
  const [plugPower, setPlugPower] = useState<MostRecent>({ recentData: 0 });
  const [plugStatus, setPlugStatus] = useState<plugStatusInter>({ plugStatus: 0 }); 
  const plug1Chart = useRef<HTMLCanvasElement | null>(null);
  const plug1chartInstance = useRef<Chart<'line'> | null>(null);
  useChart_withPlugstatus(plug1Chart, plug1chartInstance, "Plug1", setPlugPower,setPlugvoltCur, setPlugStatus);

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
            <IonTitle size="large">Plug</IonTitle>
          </IonToolbar>
        </IonHeader>
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
                  <CurrnetCard voltage={plugVoltCur.Voltage.toFixed(2)} current={plugVoltCur.Current.toFixed(2)} />
                  <IonCard>
                    <IonCardHeader> Smart Plug Control</IonCardHeader>
                    <IonCardContent>
                      <IonGrid>
                        <IonRow className="ion-justify-content-center ion-align-items-center">
                          <IonCol size="12" className="ion-text-center">
                          <IonToggle labelPlacement="stacked" alignment="center" name='Plug1Toggle' 
                            onIonChange={handleToggleChange}>
                            On / Off
                          </IonToggle>
                          <Card plugStatus={plugStatus.plugStatus}/>
                          </IonCol>
                        </IonRow>
                      </IonGrid>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
