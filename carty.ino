const int jagsigpin = 12; //pwm connection on pin 9
const int jagpwrpin = 11;//using pin 7 as the pwm power reference
const int jaggndpin = 10;//using pin 8 as the pwm ground reference

const int sig[] = {13, 10, 7, 4};
const int power[] = {12, 9, 6, 3};
const int ground[] = {11, 8, 5, 2};

int i;

void setup() {
  for (i = 0; i < 4; i = i + 1) {
    pinMode(sig[i], OUTPUT);
    pinMode(power[i], OUTPUT);
    pinMode(ground[i], OUTPUT);
  }

  for (i = 0; i < 4; i = i + 1) {
    digitalWrite(power[i], HIGH);
    digitalWrite(ground[i], LOW);
  }
}

void loop() {

}
