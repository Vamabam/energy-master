import React from 'react';
import { IonCard, IonCardContent, IonText, IonCardTitle, IonCardHeader } from '@ionic/react';

interface RecentCardProps {
  number: number;
}

const RecentCard: React.FC<RecentCardProps> = ({ number }) => {
  return (
    <IonCard>
        <IonCardHeader>
            <IonCardTitle>Current Power Data</IonCardTitle> 
        </IonCardHeader>
      <IonCardContent>
        <IonText>
          <h2>{number}mW</h2>
        </IonText>
      </IonCardContent>
    </IonCard>
  );
};

export default RecentCard;