#include "secrets.h"
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <WiFi.h>
#include <esp_now.h>
#include "UUID.h" // For generating Unique primaryIDS for table
#include "EmonLib.h" // Include Emon Library
#include "time.h"

#define ESP32
#define I1 32  // Current 100amp Pin
#define I2 35  // Current 5amp Pin
#define I3 33  // Currnet 100Amp Pin

#define CI1 23103 // 100amp sensor in milliamps
#define CI2 5120 // 5amp sensor in milliamps
#define CI3 23053 // 100amp sensor in milliamps
// Loop COunter
int LoopNum = 0;
// For ESP NOW 
uint8_t broadcastAddress[] = {0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF}; // PUT PLUG MAC ADDRESS

// Variables for storing power and current data of sensors
float Vrms;
float Isensor1;
float Isensor2;
float Isensor3;

float Circuit1_Power;
float Circuit2_Power;
float Circuit3_Power;

float Iplug1;
float Plug1_Power;
int Plug1_status;
// On and Off for comparison with AWS message
const char* On = "On\0";
const char* Off = "Off\0"; 

// Variable to store if sending data was successful
String success;
// Incoming data struct
typedef struct incoming_message {
    int plugId;
    int switch_status;  // 1 is HIGH 0 is LOW
    float voltage;      // Voltage from plug
    float current;      // Current from plug
} incoming_message;

// Incoming message data struct
typedef struct outgoing_message {
  int new_switch_status;
} outgoing_message;

// Create a outgoiong_message to hold readings.
outgoing_message update_switch;

// Create an icnoking_message to hold recieved message
incoming_message received_mess;

esp_now_peer_info_t peerInfo;

// EMON stuff
EnergyMonitor emon1;
EnergyMonitor emon2;
EnergyMonitor emon3;

// Settings seeds for UUIDS for table Ids  
UUID uuid1;
UUID uuid2;
UUID uuid3;
UUID uuid4;

// FOR TIME
const long  gmtOffset_sec = 36000;
const int   daylightOffset_sec = 0;
const char* ntpServer = "pool.ntp.org";

unsigned long previousMillis = 0;   // Stores last time temperature was published
const long interval = 5000;        // Interval at which to publish sensor readings


// AWS TOPICS for sending and receiving data from server
#define AWS_IOT_PUBLISH_TOPIC   "Example/pub"
#define AWS_IOT_SUBSCRIBE_TOPIC "Example/sub"
 
WiFiClientSecure net = WiFiClientSecure();
PubSubClient client(net);

// Callback function for status when data is sent
void OnDataSent(const uint8_t *mac_addr, esp_now_send_status_t status) {
  Serial.print("\r\nLast Packet Send Status:\t");
  Serial.println(status == ESP_NOW_SEND_SUCCESS ? "Delivery Success" : "Delivery Fail");
  if (status ==0){
    success = "Delivery Success :)";
  }
  else{
    success = "Delivery Fail :(";
  }
}

// Callback when data is received
void OnDataRecv(const uint8_t * mac, const uint8_t *incomingData, int len) {
  memcpy(&received_mess, incomingData, sizeof(received_mess));
  Serial.print("Bytes received: ");
  Serial.println(len);
  Vrms = received_mess.voltage;
  Plug1_status = received_mess.switch_status;
  Iplug1 = received_mess.current;
}

// Connects wifi and to AWS
void connectAWS()
{
  WiFi.mode(WIFI_AP_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
 
  Serial.println("Connecting to Wi-Fi");
 
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
 
  // Configure WiFiClientSecure to use the AWS IoT device credentials
  net.setCACert(AWS_CERT_CA);
  net.setCertificate(AWS_CERT_CRT);
  net.setPrivateKey(AWS_CERT_PRIVATE);
 
  // Connect to the MQTT broker on the AWS endpoint we defined earlier
  client.setServer(AWS_IOT_ENDPOINT, 8883);
 
  // Create a message handler
  client.setCallback(messageHandler);
 
  Serial.println("Connecting to AWS IOT");
 
  while (!client.connect(THINGNAME))
  {
    Serial.print(".");
    delay(100);
  }
 
  if (!client.connected())
  {
    Serial.println("AWS IoT Timeout!");
    return;
  }
 
  // Subscribe to a topic
  client.subscribe(AWS_IOT_SUBSCRIBE_TOPIC);
 
  Serial.println("AWS IoT Connected!");
}
// Formats time to be sent via AWS
String formatTimestamp(struct tm *timeinfo) {
  char buffer[80];
  strftime(buffer, sizeof(buffer), "%B %d %Y %H:%M:%S", timeinfo);
  return String(buffer);
}   
// publishes data to AWS
void publishMessage() {
  //Init and get the time
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
  struct tm timeinfo;
  if(!getLocalTime(&timeinfo)){
    Serial.println("Failed to obtain time");
    return;
  }
  String time = formatTimestamp(&timeinfo);

  // Formats JSON DOC in correct form for Iot Rule
  // Sensor 1
  uuid1.generate();
  StaticJsonDocument<200> sensor1Doc;
  sensor1Doc["id"] = uuid1;
  sensor1Doc["device_id"] = "CurrentSensor1";
  sensor1Doc["Vrms"] = Vrms;
  sensor1Doc["Irms"] = Isensor1;
  sensor1Doc["Power"] = Circuit1_Power;
  sensor1Doc["dataTime"] = time;
  
  char sensor1Buffer[512];
  serializeJson(sensor1Doc, sensor1Buffer);
  client.publish(AWS_IOT_PUBLISH_TOPIC, sensor1Buffer);

  // Sensor 2
  uuid2.generate();
  StaticJsonDocument<200> sensor2Doc;
  sensor2Doc["id"] = uuid2;
  sensor2Doc["device_id"] = "CurrentSensor2";
  sensor2Doc["Vrms"] = Vrms;
  sensor2Doc["Irms"] = Isensor2;
  sensor2Doc["Power"] = Circuit2_Power;
  sensor2Doc["dataTime"] = time;

  char sensor2Buffer[512];
  serializeJson(sensor2Doc, sensor2Buffer);
  client.publish(AWS_IOT_PUBLISH_TOPIC, sensor2Buffer);

  // Sensor 3
  uuid4.generate();
  StaticJsonDocument<200> sensor3Doc;
  sensor3Doc["id"] = uuid4;
  sensor3Doc["device_id"] = "CurrentSensor3";
  sensor3Doc["Vrms"] = Vrms;
  sensor3Doc["Irms"] = Isensor3;
  sensor3Doc["Power"] = Circuit3_Power;
  sensor3Doc["dataTime"] = time;

  char sensor3Buffer[512];
  serializeJson(sensor3Doc, sensor3Buffer);
  client.publish(AWS_IOT_PUBLISH_TOPIC, sensor3Buffer);

  // Plug 1
  uuid3.generate();
  StaticJsonDocument<200> plug1Doc;
  plug1Doc["id"] = uuid3;
  plug1Doc["device_id"] = "Plug1";
  plug1Doc["Vrms"] = Vrms;
  plug1Doc["Irms"] = Iplug1;
  plug1Doc["Power"] = Plug1_Power;
  plug1Doc["plugStatus"] = update_switch.new_switch_status;
  plug1Doc["dataTime"] = time;

  char plug1Buffer[512];
  serializeJson(plug1Doc, plug1Buffer);
  client.publish(AWS_IOT_PUBLISH_TOPIC, plug1Buffer);
}

// Sends the new plug status over ESPNow and to AWS
void sendPlugStatus() {
  // Send message via ESP-NOW
  esp_err_t result = esp_now_send(broadcastAddress, (uint8_t *) &update_switch, sizeof(update_switch));
  if (result == ESP_OK) {
    Serial.println("Sent with success");
  }
  else {
    Serial.println("Error sending the data");
  }
}

// Message received from AWS
void messageHandler(char* topic, byte* payload, unsigned int length)
{
  Serial.print("incoming: ");
  Serial.println(topic);
 
  StaticJsonDocument<200> doc;
  deserializeJson(doc, payload);
  const char* message = doc["message"];
  if (strcmp(message, On) == 0) {
    Serial.println(message);
    update_switch.new_switch_status = LOW;
    sendPlugStatus();
  } else if(strcmp(message, Off) == 0) {
    Serial.println(message);
    update_switch.new_switch_status = HIGH;
    sendPlugStatus();
  }
}
// Connects to other ESP
void connectESPNow() {
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
  peerInfo.channel = WiFi.channel();
  peerInfo.encrypt = false;
  
  // Add peer  
  if (esp_now_add_peer(&peerInfo) != ESP_OK){
    Serial.println("Failed to add peer");
    return;
  }
  // Register for a callback function that will be called when data is received
  esp_now_register_recv_cb(esp_now_recv_cb_t(OnDataRecv));
}

void setup()
{
  Serial.begin(115200);
  WiFi.mode(WIFI_AP_STA);
  connectAWS();
  connectESPNow();

  // Inputs digital attenuation for EMON library and current calibration coefficiet and pin
  analogSetPinAttenuation(I1, ADC_0db);
  emon1.current(I1, CI1); // Apply constants to current  
  // Initialise current clamp 2
  analogSetPinAttenuation(I2, ADC_0db);
  emon2.current(I2, CI2); // Apply constants to current 
  // Initialise current clamp 3
  analogSetPinAttenuation(I3, ADC_0db);
  emon3.current(I3, CI3); // Apply constants to current 
  
  // For AWS table IDS
  uuid1.seed(12931, 1231231);
  uuid1.setRandomMode();
  uuid2.seed(7, 11);
  uuid2.setRandomMode();
  uuid3.seed(1, 12);
  uuid3.setRandomMode();
  uuid4.seed(3, 9);
  uuid4.setRandomMode();
}
 
void loop()
{
  unsigned long currentMillis = millis();
  if (currentMillis - previousMillis >= interval) {
    // Save the last time a new reading was published
    previousMillis = currentMillis;
    emon1.calcVI(200, 1000); // Calculate all. No.of half wavelengths (crossings), time-out
    emon2.calcVI(200, 1000); // Calculate all. No.of half wavelengths (crossings), time-out
    emon3.calcVI(200, 1000); // Calculate all. No.of half wavelengths (crossings), time-out
    Isensor1 = emon1.Irms; 
    Isensor2 = emon2.Irms;
    Isensor3 = emon3.Irms;

    Circuit1_Power = Isensor1 * Vrms;
    Circuit2_Power = Isensor2 * Vrms;
    Circuit3_Power = Isensor3 * Vrms;
    Plug1_Power = Iplug1 * Vrms;

    // Prints Current, voltage and Power to serial monitor for debugging
    Serial.print(F("Voltage: "));
    Serial.println(Vrms);
    Serial.print(F("CurrentSensor1: "));
    Serial.print(Isensor1);
    Serial.print(F("A"));
    Serial.print(F("  Circuit1Power: "));
    Serial.print(Circuit1_Power);
    Serial.println(F("mW"));
    // Curictur 2
    Serial.print(F("CurrentSensor2: "));
    Serial.print(Isensor2);
    Serial.print(F("A"));
    Serial.print(F("  Circuit2Power: "));
    Serial.print(Circuit2_Power);
    Serial.println(F("mW"));
    // Circuit 3
    Serial.print(F("CurrentSensor3: "));
    Serial.print(Isensor3);
    Serial.print(F("A"));
    Serial.print(F("  Circuit3Power: "));
    Serial.print(Circuit3_Power);
    Serial.println(F("mW"));

    // Prints plug current and power
    Serial.print(F("Iplug1: "));
    Serial.print(Iplug1);
    Serial.print(F("A"));
    Serial.print(F("  PlugPower: "));
    Serial.print(Plug1_Power);
    Serial.println(F("mW"));
    // Prints status of plug
    Serial.print(F("Plug1Satus: "));
    Serial.print(update_switch.new_switch_status);

    sendPlugStatus();
  }

  if (LoopNum > 5) {
    publishMessage();
  };
  client.loop();
  LoopNum++;
}