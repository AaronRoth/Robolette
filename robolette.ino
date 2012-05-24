// Copyright (c) 2012 Aaron Roth
// See the file license.txt for copying permission.
//

const int pour_time = 1000;
const int baud_rate = 9600;
const int buffer_size = 2;
const int left_valve = 11;
const int right_valve = 8;

// Buffer and variables to store incoming valve pour states.
int buffer[buffer_size];
int left_v_state;
int right_v_state;

void setup()
{
  Serial.begin(baud_rate);
  pinMode(11, OUTPUT);
  pinMode(8, OUTPUT);
}

void loop()
{
  if (Serial.available())
  {
    memset(buffer, '\0', buffer_size);
    
    for (int i = 0; i < 2; i++)
    {
      buffer[i] = int(Serial.read()) - 48;
      delay(5);
    }
    
    left_v_state = buffer[0];
    right_v_state = buffer[1];
    
    if (left_v_state == 1 && right_v_state == 0)
    {
      digitalWrite(left_valve, HIGH);
      delay(pour_time);
      digitalWrite(left_valve, LOW);
    }
    else if (left_v_state == 0 && right_v_state == 1)
    {
      digitalWrite(right_valve, HIGH);
      delay(pour_time);
      digitalWrite(right_valve, LOW);
    }
    else if (left_v_state == 1 && right_v_state == 1)
    {
      digitalWrite(left_valve, HIGH);
      digitalWrite(right_valve, HIGH);
      delay(pour_time);
      digitalWrite(left_valve, LOW);
      digitalWrite(right_valve, LOW);
    }
  }
}
