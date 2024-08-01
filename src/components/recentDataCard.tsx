import React from 'react';
import { IonCard, IonCardContent, IonText, IonCardTitle, IonCardHeader } from '@ionic/react';

interface RecentCardProps {
  number: number;
}
interface CurrentVoltageProp {
    current: number;
    voltage:number;
}
interface plugStatusProp {
    plugStatus: number;
}

export const RecentCard: React.FC<RecentCardProps> = ({ number }) => {
  return (
    <IonCard>
        <IonCardHeader>
            <IonCardTitle>Most Recent Power</IonCardTitle> 
        </IonCardHeader>
      <IonCardContent>
        <IonText>
          <h2>{number}mW</h2>
        </IonText>
      </IonCardContent>
    </IonCard>
  );
};

export const CurrnetCard: React.FC<CurrentVoltageProp> = ({ voltage, current }) => {
    return (
      <IonCard>
          <IonCardHeader>
              <IonCardTitle>Most Recent Voltage and Current</IonCardTitle> 
          </IonCardHeader>
        <IonCardContent>
          <IonText>
            <h2>{voltage}V, {current}mA</h2>
          </IonText>
        </IonCardContent>
      </IonCard>
    );
};

export const Card: React.FC<plugStatusProp> = ({plugStatus}) => {
    return (
        <IonCard>
            <IonCardHeader>
                <IonCardTitle>Plug Status 1 = OFF, 0 = ON</IonCardTitle> 
            </IonCardHeader>
          <IonCardContent>
            <IonText>
              <h2>{plugStatus}</h2>
            </IonText>
          </IonCardContent>
        </IonCard>
      );
    /*
    if (plugStatus == 1) {
        return (
            <IonCard>
                <IonCardHeader>
                    <IonCardTitle>Plug Status</IonCardTitle> 
                </IonCardHeader>
              <IonCardContent>
                <IonText>
                  <h2>Plug is</h2>
                </IonText>
              </IonCardContent>
            </IonCard>
          );
   } else {
        return (
            <IonCard>
                <IonCardHeader>
                    <IonCardTitle>Plug Status</IonCardTitle> 
                </IonCardHeader>
              <IonCardContent>
                <IonText>
                  <h2>Plug is OFF</h2>
                </IonText>
              </IonCardContent>
            </IonCard>
          );
    }*/
};