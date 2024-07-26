import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar} from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import { useState } from 'react';
import { IonToggle } from '@ionic/react';
import './Tab2.css';

import {switchOn, switchOff} from './PubSubButton'
import { fetchAuthSession } from 'aws-amplify/auth';

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

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 2</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 2</IonTitle>
          </IonToolbar>
        </IonHeader>
      </IonContent>
      <IonContent>
        <IonToggle labelPlacement="stacked" alignment="center" name='Plug1Toggle' 
          onIonChange={handleToggleChange}>
          
          Aligned to the Center
        </IonToggle>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
