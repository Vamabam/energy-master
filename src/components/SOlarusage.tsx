import React from 'react';
import { IonCard, IonCardContent, IonText, IonCardTitle, IonCardHeader } from '@ionic/react';

interface RecentCardProps {
    solarPwr: number;
    circuit1Pwr: number;
    plugPwr: number;
}

export const Solarusage: React.FC<RecentCardProps> = ({ solarPwr, circuit1Pwr, plugPwr }) => {
    var usage = (circuit1Pwr + plugPwr) / solarPwr;
    if (usage > 1) {
        usage = 1;
    };

    return (
        <IonText>
            <h2>{(usage*100).toFixed(2)}%</h2>
        </IonText>
    );
  };
