int ledPin = 9; // Use um pino PWM (exemplo: 9)

void setup() {
  pinMode(ledPin, OUTPUT); // Configura o pino como saída
  Serial.begin(9600);      // Inicializa a comunicação serial
}

void loop() {
  if (Serial.available()) { // Verifica se há dados disponíveis na serial
      
    int brightness = Serial.parseInt(); // Lê um valor numérico da serial
    if (brightness >= 0 && brightness <= 255) {
      analogWrite(ledPin, brightness); // Ajusta o brilho do LED
    }

     char command = Serial.read(); 
    if (command == '1') {
      digitalWrite(13, HIGH); 
    } else if (command == '0') {
      digitalWrite(13, LOW); 
    }
  }
}
  




   

