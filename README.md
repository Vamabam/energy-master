
# Energy Master

Smart energy monitoring system prototype, utilising a smart plug, monitoring unit and webapp for access to sensor readings and control of devices.

This was project was developed in pairs for a self-directed university project based subject.
![image](https://github.com/user-attachments/assets/58e2d262-97c9-4270-b7c1-9c00f2080213) ![image](https://github.com/user-attachments/assets/2e820629-43bb-4d06-8773-d9d48506b822)

## Monitoring Unit
The monitoring device measures the amount of current the desired circuits are using and the amount of current both the mains and PV inverter (If the user has one) are supplying the system with. This data is then transmitted to an AWS IoT core webserver over Wi-Fi using the MQTT protocol this will be elaborated upon in the App Subsystem Section.

For powering this device, a DC lab-supply at 3.3V connected through a DC jack was used, in reality an off the shelf 240v to 3.3V AC to DC power adapter could be used and plug directly into the jack. 

![20240731_113444 (1)](https://github.com/user-attachments/assets/506a79db-865d-486e-8a75-32539c14031e)

### Data Collection
The ESP32 also has 2 12Bit Analog to Digital Converters allowing for up to 18 measurement channels, which exceeds our current requirements and allows for expansion of the inputs to include more than 3 current clamps. 

To get the actual RMS value of the current we take a window of samples, with a higher number of samples there is an increase in the accuracy of the reading though also an increase in time taken to collecting and calculating datapoints. Taking this into account we chose 500 samples to ensure the ESP had enough time to transmit and receive messages from the server and plug.  Once the points are taken, we first apply digital low pass filtering to find the DC offset, and remove it from the values, squaring this value and summing it over all crossings. With this value the RMS is then found by taking the sum of all the squared values divided by number of crossings multiplied by a calibration coefficient. 

This is all done by the openEnergyMonitor EmonLib library found here: https://github.com/openenergymonitor/EmonLib

### Data Transmission
The ESP32 was chosen also as due to its ability to utilise ESP-NOW which allows for easy transmission between 2 different ESP devices through peer-to-peer communication. This is in conjunction with its ability to connect to Wi Fi easily. This is as the Monitoring unit acts as a master device collecting all the data from the smart plug then sending it to the DynamoDB. 

Wi-Fi and ESP-Now can be connected at the same time if both protocols are using the same channel on the 2.4 GHz range as they both use the inbuilt Antenna. Details for syncing channels is included within the smart plug sub-system. Even though they can be connected at the same time transmission cannot occur simultaneously as they use the same antenna. Thus, synchronisation of this unit transmitting to the database and receiving from the plug was required. This was coordinated by this ESP sending a timing message which included the most recent relay control data, once this was received the plug would transmit back the voltage, current and relay-status data. With this synchronisation it ensured there was a no packet collision. 

The timing message is sent after this ESP had collected all data from each clamp and transmitted the data over Wi Fi to the AWS backend part of this message is shown in figure below. This transmission cycle occurred every 5 seconds ensuring there was enough time for accurate data collection and time for this unit to receive updates of the relay (On / Off) from the web-app.

### Current Clamp Array
Current Transformers are used to measure the current of different circuits within the switchboard, such as Solar Inverter, Mains from grid and different circuit loads such as Hot Water Systems or Air Conditioning circuits. 

SCT-013-000 with an output of 0-1V were used as they breakout to a 3.5mm jack and interface with the ESP32 through a voltage divider that level shifts the signal to be centred at 1.65V with 2 10k Ohm resistors. This analogue signal is then converted to digital values using the analogue to digital coverter. 

For more accurate readings choose a current clamp that rated measruement range is closest to the expected measured values. Such as if measuring a 20Amp breaker a 0 - 30amp clamp will give most accurate readings compared to a 0 - 100 Amp.

SCT-013 clamps can also come as the current output type, these require the use of a burden resistor within the circuit for more info on this look at this project which was a great help during this project: https://github.com/danpeig/ESP32EnergyMonitor/tree/main?tab=readme-ov-file 

![image](https://github.com/user-attachments/assets/1e1b0c55-5f9a-4abb-b0e3-e87506bbfd76)
## Smart Plug
The smart plug has 3 functions, measure voltage of the household to be used in calculations, measure the current of the connected device and to be able to wirelessly turn on and off the device through the relay.

![image](https://github.com/user-attachments/assets/05dc6d5f-2fff-45e8-bf4a-fc4090e50a7c) ![image](https://github.com/user-attachments/assets/1dec1b0f-a7ad-498b-8323-2c2f8de7300b)

### Voltage Sensor
For voltage measurement a ZMPT101B voltage transformer module was chosen as it supports our range of 240V RMS mains, this will be connected in parallel with the load thus its current limit of 2mA will not be an issue as will be able to draw as much or little as it needs. As this is a prototype this module was chosen which includes the supporting electrical components including a potentiometer for calibration to the correct voltage ranges by adjusting the burden resistance. This sensor’s analogue output was passed to the ADS1115 16 Bit Analogue to Digital converter to rather than the ESP32’s onboard 12-bit ADC to improve the accuracy at labs lower voltage range of 0 – 7v RMS. 

The voltage sensor is connected in parallel to the AC mains input to be able to measure the voltage of the house.

![image](https://github.com/user-attachments/assets/fb66c3a0-129d-4ae9-88dc-fe6b5abcb440)

### Current Sensor
For current measurement an ACS712 hall effect current sensor module is used. This has a 30A max current rating as well, which exceeds the general max current limit of single-phase devices plugged into an outlet. The ADS1115 16 Bit ADC was also utilised to improve measurement accuracy.

The Current sensor is placed in series with the mains supply, after the relay to measure the current passing through the plug to the connected load.

![image](https://github.com/user-attachments/assets/89e1f3ed-75c5-4db9-8c98-6b9baa5c4878)

### Relay Circuit
For the actual control of turning on and off the plug a SRD-05VDC-SL-C high power relay is used. This is as it supports 240V and up to 30 Amps flowing through it meaning it can support our full current draw without limitations. The 5V nominal voltage comes from the 5V output of the power supply. The relay will be used in normally closed mode to ensure that if there is no power then the plug is still able to provide power to the device its connected to.

To provide the input signal for the switching of the relay, a BC548 BJT is used to act as a voltage-controlled switch. This connects the 5V Vcc to the relay switching it on. The ESP32 will provide the HIGH/LOW signal to the BJT to switch it on/off. This is necessary as the ESP32 can only output a max of 3.3V from its I/O pins, and the relay requires 5V, thus the BJT level shifts the voltages and as it connects Vcc to the relay ensures there are no current limitations. A 1n4007 diode is connected in parallel with the relays inductor pins to provide protection against self-inductance.

A physical switch will also be used as a manual override to turn the relay on and off, this will be placed between the 5V supply and the relay input allowing it to bypass the logic and microprocessor, in the case of any logic failures. An LED also provides the status of the relay visible from the case.

In series with the mains connection there is also a 10 Amp fuse to provide a maximum current limit ensuring overcurrent protection. This fuse is 3A sized ensuring that users are easily able to replace them / increase or decrease the current rating if required. 

![image](https://github.com/user-attachments/assets/fe3585b8-57ea-41c0-849d-8e0c28367f3e)

### Power 
For powering this device, a 5V DC supply was used, in reality an integrated power circuit from 240v to 5v would be used. The plug was implemented on our custom PCB and requires both 3.3V and 5V supply domains thus with 5V supply an AMS1117 5v to 3.3v LDO was used to provide a stable voltage for the ESP32.

![image](https://github.com/user-attachments/assets/5abd3228-4e81-4c7f-a42c-f9ac7399906a)

### Plug Code Notes
Both the current and voltage sensor utilise the ADS1115 16 Bit ADC and thus utilise the same process for data collection and filtering on the ESP. The analogue points are collected using the ADS’s inbuilt library, these are stored within a statistics object of the Arduino filters library where a moving average is taken multiplying values by the calibration coefficient to output the peak measured value, this is then divided by sqrt (2) to get the RMS value of the voltage and current.

![image](https://github.com/user-attachments/assets/b842e42a-7d74-4954-a3e4-7e077324e240)

For the relay circuit, the ESP sets the pin connected to the BJT to digital logic HIGH or LOW which outputs 3.3V at High and 0 at low., When the relay pin is set HIGH, the relay is disconnected, and it is connected when low as the relay is normally closed. 

To synchronize the transmission between the monitoring unit of the plug and plug the plug must be on the same channel as the Wi Fi to utilise ESP-NOW simultaneously. To ensure they are on the same channel, the plug must know the SSID of the network and will then read the channel of the network and change accordingly. Once connected the plug transmits the sensor readings and the status of the plug over ESP-NOW in the form of a JSON doc
## Ionic App

### Data Pipline
![image](https://github.com/user-attachments/assets/c5dfc93a-c60d-46ab-9973-cb32f01ed940)

### App Interface
Once all the sensor readings from the plug and monitoring unit are collected at the monitoring unit it compiles them into a JSON document which contains the device name, time, current, voltage and power data. This is then published to over MQTT to an AWS Topic, once the message is received by this topic an IoT rule is activated which formats the data within the JSON file and inputs it into the DynamoDB (AWS database system) table. The time that is uploaded ensures that the sensor readings are associated with the most accurate time, this is established on startup of the ESP by fetching the real-world time from an NTP (Network Time Protocol) server. 

Once the data is saved within the table, it is able to be accessed in the app via a GraphQL API. All the data for each device is collected every 5 seconds and displayed on the app via line graphs.

For the control of the relay the app publishes to a different AWS Topic through the IoT API that the monitoring unit ESP32 is checking, it receives either an On or Off message that updates the status of the relay being sent to the smart plug, turning it on/off.

For the app it was decided to create an Ionic app as it is easily deployed onto IOS, Android and web-browsers simultaneously. A breakdown of the different tabs is shown below:

![image](https://github.com/user-attachments/assets/eec93cbb-4248-4945-bf76-402f4180c952)
This is an example of one of the cards, within this project 3 were used one for each current clamp.

![image](https://github.com/user-attachments/assets/630eae9d-1ccc-4e4d-a1e7-89fc2a51e9cf)
Similar to the monitoring tab though also includes the control toggle for the smart plug

![image](https://github.com/user-attachments/assets/84704c4b-53ea-43e8-a6e8-ca895cc20304)

This was not fully implemented within this project though it desiplays the results of real-time updated calculations based on the collected data.

Currently only shows Solar Percent Usage

