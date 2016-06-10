#include <Servo.h>

const int sig[] = {11, 6, 5, 3}; // (look at top shield)
const int power[] = {4, 2};

// Mins and maxes
int minJaguar = 670;
int maxJaguar = 2330;

// Misc
int output[] = {1500, 1500, 1500, 1500};

boolean calibrating = true;

int joyX, joyY, joyT;
int maxX = 155;
int minX = 155;
int maxY = 155;
int minY = 155;

int i;

// Motors
Servo flM, frM, blM, brM;


//
// Stuff for joystick
//
#include <usbhid.h>
#include <hiduniversal.h>
#include <usbhub.h>

#include "le3dp_rptparser.h"

// Satisfy the IDE, which needs to see the include statment in the ino too.
#ifdef dobogusinclude
#include <spi4teensy3.h>
#include <SPI.h>
#endif

USB                                             Usb;
USBHub                                          Hub(&Usb);
HIDUniversal                                    Hid(&Usb);
JoystickEvents                                  JoyEvents;
JoystickReportParser                            Joy(&JoyEvents);

void setup() {
  TCCR1B = TCCR1B & 0b11111000 | 0x04; // PWM Freq. at 122Hz

  // for loop is more efficent than setting up each pin
  for (i = 0; i < 4; i = i + 1) {
    //Setup pins
    pinMode(sig[i], OUTPUT);

    // +5v is not absolutely essential to control the Jaguars but is included here for completeness
    if (i < 3) {
      pinMode(power[i], OUTPUT);
      digitalWrite(power[i], HIGH);
    }
  }

  flM.attach(sig[0], minJaguar, maxJaguar);
  frM.attach(sig[1], minJaguar, maxJaguar);
  blM.attach(sig[2], minJaguar, maxJaguar);
  brM.attach(sig[3], minJaguar, maxJaguar);

  Serial.begin(9600);

  delay(200);

  // Joystick
  Serial.println("Start");

  if (Usb.Init() == -1)
    Serial.println("OSC did not start.");

  if (!Hid.SetReportParser(0, &Joy))
    ErrorMessage<uint8_t>(PSTR("SetReportParser"), 1  );
}

void loop() {
  // Get joystick values
  Usb.Task();
  joyX = (int) JoyEvents.X;
  joyY = (int) JoyEvents.Y;
  joyT = (int) JoyEvents.trigger;

  // Prevents movement on startup when joystick values haven't been received yet
  if (joyX == 0 && joyY == 0) {
    flM.writeMicroseconds(output[0]);
    frM.writeMicroseconds(output[1]);
    blM.writeMicroseconds(output[2]);
    brM.writeMicroseconds(output[3]);
    Serial.println("Waiting for joystick...");
  }
  else {
    if (calibrating == true) { // Calibration
      if (joyX > maxX) {
        maxX = joyX;
      }
      if (joyX < minX) {
        minX = joyX;
      }
      if (joyY > maxY) {
        maxY = joyY;
      }
      if (joyY < minY) {
        minY = joyY;
      }
      if (joyT == 1) {
        calibrating == false;
      }
    }
    else { // Normal operation
      joyX = map(joyX, minX, maxX, 0, 255);
      joyY = map(joyY, minY, minY, 0, 255);

      // Calculate outputs
      if (joyT == 0) { // forward, backward, and turning
        output[0] = joyY + joyX;
        output[1] = 0 - joyX + joyY;
        output[2] = 0 - joyX + joyY;
        output[3] = joyY + joyX;

        output[0] = map(output[0], 0, 510, minJaguar, maxJaguar);
        output[1] = map(output[1], -255, 255, minJaguar, maxJaguar);
        output[2] = map(output[2], -255, 255, minJaguar, maxJaguar);
        output[3] = map(output[3], 0, 510, minJaguar, maxJaguar);
      }
      else if (joyT == 1) { // Trigger is pulled -> sideways
        output[0] = joyX;
        output[1] = joyX;
        output[2] = 0 - joyX;
        output[3] = 0 - joyX;

        output[0] = map(output[0], 0, 255, minJaguar, maxJaguar);
        output[1] = map(output[1], 0, 255, minJaguar, maxJaguar);
        output[2] = map(output[2], -255, 0, minJaguar, maxJaguar);
        output[3] = map(output[3], -255, 0, minJaguar, maxJaguar);
      }

      // Run motors
      flM.writeMicroseconds(output[0]);
      frM.writeMicroseconds(output[1]);
      blM.writeMicroseconds(output[2]);
      brM.writeMicroseconds(output[3]);
    }
  }
}
