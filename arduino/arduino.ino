/*
  Control for the Arduino Uno BarBot.
  
  Created by Aaron Roth on 5/6/2012.
*/

const int rightValve = 8;
const int leftValve = 11;

void setup() {
 pinMode(8, OUTPUT);
 pinMode(11, OUTPUT);
}

void loop() {
  digitalWrite(rightValve, HIGH);
  digitalWrite(leftValve, HIGH);
  delay(1000);
  digitalWrite(rightValve, LOW);
  digitalWrite(leftValve, LOW);
  delay(1000);
}
