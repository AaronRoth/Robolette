#!/usr/bin/env python
#
# Copyright (c) 2012 Aaron Roth
# See the file license.txt for copying permission.
#

import getopt
import serial
import sys
import time
import urllib2

pour_time = 10

def usage():
  print 'usage: ' + sys.argv[0] + ' -p <port>'

def main():
  # Read in command line arguments.
  try:
    opts, args = getopt.getopt(sys.argv[1:], 'hp:', ['help', 'port='])
  except getopt.GetoptError:
    usage()
    sys.exit(2)
  
  port = None
  
  # Specify a port.
  for opt, arg in opts:
    if opt in ('-h', '--help'):
      usage()
      sys.exit(0)
    if opt in ('-p', '--port'):
      port = arg
  
  # Make sure a serial port was specified.
  if not port:
    usage()
    sys.exit(2)
  
  # Open the specified serial port.
  try:
    ser = serial.Serial(port=port, baudrate=9600, timeout=1)
  except serial.SerialException:
    print 'error: unable to open the specified serial port'
    sys.exit(1)
  
  # Request drink statuses from the server and send to the Arduino.
  while True:
    # Get and parse current drink values.
    request_object = urllib2.urlopen('http://findaaron.nfshost.com/Robolette/server/get_counts.php')
    pour_states_str = request_object.read()
    pour_states_list = pour_states_str.split('|')
    
    team_one_state = int(pour_states_list[0])
    team_two_state = int(pour_states_list[1])
    
    # Decide which valves to open if any.
    if team_one_state > 0 and team_two_state == 0:
      ser.write('10')
      time.sleep(pour_time)
    elif team_one_state == 0 and team_two_state > 0:
      ser.write('01')
      time.sleep(pour_time)
    elif team_one_state > 0 and team_two_state > 0:
      ser.write('11')
      time.sleep(pour_time)

if __name__ == '__main__':
  main()