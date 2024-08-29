#include <esp_now.h>
#include <esp_wifi.h>
#include <WiFi.h>
// ADC Librarys
#include <Filters.h> //This library does a massive work check it's .cpp file
#include <Adafruit_ADS1X15.h>
#define ESP32
#define V1 33     // Voltage Pin
#define CV1 460   // Voltage Coefficient
#define relay 32   // Pin of Relay
#define BOARD_ID 1

#define ACS_Pin A0 //Sensor data pin on A0 analog input
float Irms; // Temp
int mesRecv = 0; // 1 means start reading and sending, 0 is wait for begin message 

// ADS - ANALOG TO DIGITAL STUFF
Adafruit_ADS1115 ads;
float ACS_Value; //Here we keep the raw data valuess
float testFrequency = 50; // test signal frequency (Hz)
float windowLength = 55.0/testFrequency; // how long to average the signal, for statistist

float intercept_current = 0; // to be adjusted based on calibration testing
float slope_current = 0.0281; // to be adjusted based on calibration testing

float intercept_voltage = 0; // to be adjusted based on calibration testin
float slope_voltage = 0.73;

float Amps_TRMS; // estimated actual current in amps
float Volts_TRMS; // Measured Voltage
float voltCali; // Voltage calibrated
// ADC Pins
int16_t adc0; 
int16_t adc2;

unsigned long printPeriod = 5000; // in milliseconds
// Track time in milliseconds since last reading
unsigned long prevMillis = 0;

// ESPNOW CONFIGS
// REPLACE WITH THE MAC Address of your receiver 
uint8_t broadcastAddress[] = {0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF}; // SENDING TO Monitor unit

unsigned long previousMillis = 0;   // Stores last time temperature was published
const long interval = 5000;        // Interval at which to publish sensor readings
unsigned int readingId = 0;
int loopIter = 0;

// Insert your SSID
constexpr char WIFI_SSID[] = "#######"; // Insert WiFI SSID

// Need to get Wifi channel as needs to be transmitting on the same channel for ESPNOW
int32_t getWiFiChannel(const char *ssid) {
  if (int32_t n = WiFi.scanNetworks()) {
      for (uint8_t i=0; i<n; i++) {
          if (!strcmp(ssid, WiFi.SSID(i).c_str())) {
              return WiFi.channel(i);
          }
      }
  }
  return 0;
}

int incoming_switch_status;

// Variable to store if sending data was successful
String success;

// Outgoign data struct
typedef struct outgoing_message {
    int plugId;
    int switch_status;
    float voltage;
    float current;
} outgoing_message;

// Incoming message data struct
typedef struct incoming_message {
  int new_switch_status;
} incoming_message;

// Create a outgoiong_message to hold readings.
outgoing_message sensorReadings;

// Create an icnoking_message to hold recieved message
incoming_message received_mess;

esp_now_peer_info_t peerInfo;

void OnDataSent(const uint8_t *mac_addr, esp_now_send_status_t status) {
  Serial.print("\r\nLast Packet Send Status:\t");
  Serial.println(status == ESP_NOW_SEND_SUCCESS ? "Delivery Success" : "Delivery Fail");
  if (status == 0){
    success = "Delivery Success :)";
  }
  else{
    success = "Delivery Fail :(";
    delay(2000);// Delay to attempt to get onto the correct clock cylce
  }
}

// Callback when data is received
void OnDataRecv(const uint8_t * mac, const uint8_t *incomingData, int len) {
  memcpy(&received_mess, incomingData, sizeof(received_mess));
  Serial.print("Bytes received: ");
  Serial.println(len);
  incoming_switch_status = received_mess.new_switch_status;
  Serial.println(incoming_switch_status);
  int relay_currentstate = digitalRead(relay);
  Serial.println(relay_currentstate);
  if (incoming_switch_status == HIGH) {
    // Turn Switch ON
    digitalWrite(relay, HIGH);
    relay_currentstate = digitalRead(relay);
    Serial.println(relay_currentstate);
  } else if(incoming_switch_status == LOW) {
    // Turn Switch OFF
    digitalWrite(relay, LOW);
    relay_currentstate = digitalRead(relay);
    Serial.println(relay_currentstate);
  }
  mesRecv = 1;
}

void setup () {
  // Init Serial Monitor
  Serial.begin(115200);

  // Set device as a Wi-Fi Station
  WiFi.mode(WIFI_STA);

  int32_t channel = getWiFiChannel(WIFI_SSID);

  WiFi.printDiag(Serial); // Uncomment to verify channel number before
  esp_wifi_set_promiscuous(true);
  esp_wifi_set_channel(channel, WIFI_SECOND_CHAN_NONE);
  esp_wifi_set_promiscuous(false);
  WiFi.printDiag(Serial); // Uncomment to verify channel change after

  // Init ESP-NOW
  if (esp_now_init() != ESP_OK) {
    Serial.println("Error initializing ESP-NOW");
    return;
  }
  
  // Once ESPNow is successfully Init, we will register for Send CB to
  // get the status of Trasnmitted packet
  esp_now_register_send_cb(OnDataSent);
  
  // Register peer
  memcpy(peerInfo.peer_addr, broadcastAddress, 6);
  peerInfo.encrypt = false;
  
  // Add peer  
  if (esp_now_add_peer(&peerInfo) != ESP_OK){
    Serial.println("Failed to add peer");
    return;
  }
  // Register for a callback function that will be called when data is received
  esp_now_register_recv_cb(esp_now_recv_cb_t(OnDataRecv));

  // Sets relay pin to output
  pinMode(relay, OUTPUT);

  // Initialise ADS for Current Sensor  
  ads.setGain(GAIN_TWOTHIRDS);  // 2/3x gain +/- 6.144V  1 bit = 3mV      0.1875mV (default)
  if (!ads.begin()) {
    Serial.println("Failed to initialize ADS.");
    while (1);
  }
}

void loop() {
  // Current 
  RunningStatistics currStats; // create statistics to look at the raw current signal
  currStats.setWindowSecs( windowLength ); //Set the window length
  // Voltage
  RunningStatistics voltStats; // create statistics to look at the raw voltage signal
  currStats.setWindowSecs( windowLength ); //Set the window length
  
  // 5 Seconds must have passed and timing message received
  unsigned long currentMillis = millis();
  if (currentMillis - previousMillis >= interval && mesRecv == 1) {
    // Save the last time a new reading was published
    previousMillis = currentMillis;
    // Take 3000 points
    int i = 0;
    while(i < 3000) {
      i++;
      // Initialises ADC for new current reading
      //int16_t adc0;
      float volts0;
      adc0 = ads.readADC_SingleEnded(0);
      volts0 = ads.computeVolts(adc0);
      // Initialise Current Reading
      ACS_Value = analogRead(ACS_Pin); // read the analog from pin A0
      currStats.input(adc0); // log to Stats function

      // Initialise for voltage measurement 
      adc2 = ads.readADC_SingleEnded(2); // Read from A2
      voltStats.input(adc2); // log to Stats function

      if((unsigned long)(millis() - prevMillis) >= printPeriod && i > 200) { //every 5s we do the calculation
        prevMillis = millis(); // update time
        // Calculates Irms 
        Amps_TRMS = intercept_current + slope_current  * currStats.sigma();
        Amps_TRMS = (Amps_TRMS/20);
        // Calculates Vrms 
        Volts_TRMS = intercept_voltage + slope_voltage * voltStats.sigma();
        voltCali = Volts_TRMS/(24*1.414);
        // Remove outliears from sensor
        if (Amps_TRMS*1000 <= 150 && loopIter > 5) {
          // Compile data into message to be sent
          sensorReadings.plugId = BOARD_ID;  
          sensorReadings.switch_status = digitalRead(relay);
          sensorReadings.voltage = voltCali;
          sensorReadings.current = Amps_TRMS*1000;
          
          // Send message over ESPNOW
          esp_err_t result = esp_now_send(broadcastAddress, (uint8_t *) &sensorReadings, sizeof(sensorReadings));

          if (result == ESP_OK) {
            Serial.println("Sent with success");
          }
          else {
            Serial.println("Error sending the data");
          }
        }
      }
    }
    // Reset loop and mesRecv
    i = 0;
    mesRecv = 0;
  }
  loopIter++;
}