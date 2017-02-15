#!/usr/bin/python

from pwmDriver import PWM
import time

# Initialise the PWM device using the default address
pwm = PWM(0x40)

servoMin = 150  # Min pulse length out of 4096
servoMax = 600  # Max pulse length out of 4096

'''
def setServoPulse(channel, pulse):
  pulseLength = 1000000                   # 1,000,000 us per second
  pulseLength /= 60                       # 60 Hz
  print "%d us per period" % pulseLength
  pulseLength /= 4096                     # 12 bits of resolution
  print "%d us per bit" % pulseLength
  pulse *= 1000
  pulse /= pulseLength
  pwm.setPWM(channel, 0, pulse)
'''

pwm.setPWMFreq(122) # 122 Hz

while (True):
  # calibration procedure
  pwm.setPWM(0, 0, 4095)
  time.sleep(1)
  pwm.setPWM(0, 0, 2047)
  time.sleep(1)
  pwm.setPWM(0, 0, 0)
  time.sleep(40)
