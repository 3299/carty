# Import the PCA9685 module.
import Adafruit_PCA9685

# Initialise the PCA9685 using the default address (0x40).
pwm = Adafruit_PCA9685.PCA9685()

# Configure min and max servo pulse lengths
jaguarMin = 130  # Min pulse length out of 4096
jagaurMax = 650  # Max pulse length out of 4096

# Set frequency to 60hz, good for servos.
pwm.set_pwm_freq(60)

'''
Remaping function
'''
def remap( x, oMin, oMax, nMin, nMax ): # thanks stackoverflow.com/a/15537393
    #range check
    if oMin == oMax:
        print("Warning: Zero input range")
        return None

    if nMin == nMax:
        print("Warning: Zero output range")
        return None

    #check reversed input range
    reverseInput = False
    oldMin = min( oMin, oMax )
    oldMax = max( oMin, oMax )
    if not oldMin == oMin:
        reverseInput = True

    #check reversed output range
    reverseOutput = False
    newMin = min( nMin, nMax )
    newMax = max( nMin, nMax )
    if not newMin == nMin :
        reverseOutput = True

    portion = (x-oldMin)*(newMax-newMin)/(oldMax-oldMin)
    if reverseInput:
        portion = (oldMax-x)*(newMax-newMin)/(oldMax-oldMin)

    result = portion + newMin
    if reverseOutput:
        result = newMax - portion

    return result

'''
Webapp-based driving.
'''
def drive(value):
    print(value)
    if (value == 'FORWARD'):
        pwm.set_pwm(0, 0, jagaurMax)
        pwm.set_pwm(0, 1, jagaurMax)
        pwm.set_pwm(0, 2, jagaurMax)
        pwm.set_pwm(0, 3, jagaurMax)
    elif (value == 'BACKWARD'):
        pwm.set_pwm(0, 0, jagaurMin)
        pwm.set_pwm(0, 1, jagaurMin)
        pwm.set_pwm(0, 2, jagaurMin)
        pwm.set_pwm(0, 3, jagaurMin)
    else:
        pwm.set_pwm(0, 0, 390)
        pwm.set_pwm(0, 1, 390)
        pwm.set_pwm(0, 2, 390)
        pwm.set_pwm(0, 3, 390)

from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket

class Log(WebSocket):
    def handleMessage(self):
        print(self.data)
        #drive(self.data)
    def handleConencted(self):
        print(self.address, 'connected')
    def handleClose(self):
        print(self.address, 'closed')

server = SimpleWebSocketServer('', 8000, Log)
server.serveforever()
