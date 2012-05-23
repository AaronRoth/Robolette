/*
Copyright (c) 2012 Aaron Roth

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

const int baud_rate = 9600;
const int buffer_size = 2;
const int right_valve = 8;
const int left_valve = 11;
const int pour_time = 1000;

// Buffer and variables to store incoming valve pour states.
int buffer[buffer_size];
int right_v_state;
int left_v_state;

void setup()
{
  Serial.begin(baud_rate);
  pinMode(8, OUTPUT);
  pinMode(11, OUTPUT);
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
    
    right_v_state = buffer[0];
    left_v_state = buffer[1];
    
    if (right_v_state == 1 && left_v_state == 0)
    {
      digitalWrite(right_valve, HIGH);
      delay(pour_time);
      digitalWrite(right_valve, LOW);
    }
    else if (right_v_state == 0 && left_v_state == 1)
    {
      digitalWrite(left_valve, HIGH);
      delay(pour_time);
      digitalWrite(left_valve, LOW);
    }
    else if (right_v_state == 1 && left_v_state == 1)
    {
      digitalWrite(right_valve, HIGH);
      digitalWrite(left_valve, HIGH);
      delay(pour_time);
      digitalWrite(right_valve, LOW);
      digitalWrite(left_valve, LOW);
    }
  }
}