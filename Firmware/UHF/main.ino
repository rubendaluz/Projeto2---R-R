#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

// Conexão a rede WiFi
// const char* ssid = "";
// const char* password = "";

// Configurações do broker MQTT
const char* mqtt_server = "broker.hivemq.com";
const int mqtt_port = 1883;
const char* mqtt_topic = "detection_p2";

WiFiClient espClient;
PubSubClient client(espClient);

void setup_wifi() {
  delay(10);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }
}

String createJsonMessage(const char* timestamp, const char* detection_type, const char* object_id, const char* room_id) {
  StaticJsonDocument<200> doc;
  doc["timestamp"] = timestamp;
  doc["detection_type"] = detection_type;
  doc["object_id"] = object_id;
  doc["room_id"] = room_id;

  String jsonMessage;
  serializeJson(doc, jsonMessage);
  return jsonMessage;
}

void reconnect() {
  while (!client.connected()) {
    if (client.connect("Client")) {
      // Cria a mensagem JSON com os parâmetros desejados
      String jsonMessage = createJsonMessage("21-05-2024:11:13", "UHF", "38985398893ujfrfo3", "1");

      // Publica a mensagem JSON no tópico
      client.publish(mqtt_topic, jsonMessage.c_str());
    } else {
      delay(5000);
    }
  }
}

void setup() {
  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
}
