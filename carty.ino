const int sig[] = {13, 10, 7, 4}; // White
const int power[] = {12, 9, 6, 3}; // Red
const int ground[] = {11, 8, 5, 2}; // Black

// Mins and maxes
const int minJaguar = 20;
const int maxJaguar = 74;
const int neturalJaguar = 47;

const int minJoystick = 0;
const int maxJoystick = 255;

// Misc
int output[] = {0, 0, 0, 0};
int joyX = 0;
int joyY = 0;

int i;

void setup() {
  // for loop is more efficent than setting up each pin
  for (i = 0; i < 4; i = i + 1) {
    //Setup pins
    pinMode(sig[i], OUTPUT);
    pinMode(power[i], OUTPUT);
    pinMode(ground[i], OUTPUT);

    // Output power for Jaguars
    digitalWrite(power[i], HIGH);
    digitalWrite(ground[i], LOW);

    // Make Jaguars start in 'friendly' state
    analogWrite(sig[i], neturalJaguar);
  }
}

void loop() {
  // Get and map joystick values
  //joyx = joystick.getX()
  //joyy = joystick.getY()

  joyX = map(joyX, minJoystick, maxJoystick, minJaguar, maxJaguar);
  joyY = map(joyY, minJoystick, maxJoystick, minJaguar, maxJaguar);


  // Calculate outputs
  output[0] = joyY - joyX;
  output[1] = - joyY - joyX;
  output[2] = - joyY - joyX;
  output[3] = joyY - joyX;

  // Run motors
  for (i = 0; i < 4; i = i + 1) {
    analogWrite(sig[i], output[i]);
  }
}
