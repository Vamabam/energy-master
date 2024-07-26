import React, { useState } from 'react';
import { IonItem, IonLabel, IonToggle } from '@ionic/react';

const ExampleComponent: React.FC = () => {
  const [toggleState, setToggleState] = useState<boolean>(false);

  const toggleChanged = () => {
    console.log('Toggle state changed:', toggleState);
    // You can perform any actions here based on the toggle state
    if (toggleState) {
      // Toggle is ON
      doSomethingWhenToggleIsOn();
    } else {
      // Toggle is OFF
      doSomethingWhenToggleIsOff();
    }
  };

  const doSomethingWhenToggleIsOn = () => {
    console.log('Toggle is ON');
    // Perform actions when the toggle is ON
  };

  const doSomethingWhenToggleIsOff = () => {
    console.log('Toggle is OFF');
    // Perform actions when the toggle is OFF
  };
}
