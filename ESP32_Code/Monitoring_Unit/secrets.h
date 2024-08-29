#include <pgmspace.h>
 
#define SECRET
#define THINGNAME "ESP8266_DHT11"                         
 
const char WIFI_SSID[] = "WIFI NAME";               
const char WIFI_PASSWORD[] = "WIFI PASSWORD";           
const char AWS_IOT_ENDPOINT[] = " AWS IOT ENPOINT";    
 
// Amazon Root CA 1
static const char AWS_CERT_CA[] PROGMEM = R"EOF(
-----BEGIN CERTIFICATE-----
AWS CA CERT
-----END CERTIFICATE-----
)EOF";
 
// Device Certificate                                              
static const char AWS_CERT_CRT[] PROGMEM = R"KEY(
-----BEGIN CERTIFICATE-----
AWS CRT CERT
-----END CERTIFICATE-----
 
 
)KEY";
 
// Device Private Key                                              
static const char AWS_CERT_PRIVATE[] PROGMEM = R"KEY(
-----BEGIN RSA PRIVATE KEY-----
AWS PRIV CERT
-----END RSA PRIVATE KEY-----
 
 
)KEY";