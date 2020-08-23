#!/usr/bin/python2

import RPi.GPIO as GPIO
import time
import paho.mqtt.client as mqtt
import logging

# initalize logging, remember to touch the logfile beforehand
logging.basicConfig(level=logging.INFO, filename='/var/log/mansen-rykasy.log')

# Raspberry Pi GPIO pins for Player 1 and 2
sensor_p1 = 26 # GPIO26
sensor_p2 = 19 # GPIO19

# GPIO mode is BCM, notice the pin numbering
GPIO.setmode(GPIO.BCM)

# Setup the pins as input and activate builtin pull-up resistors
GPIO.setup(sensor_p1, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(sensor_p2, GPIO.IN, pull_up_down=GPIO.PUD_UP)

# Initialize counters for both players
counter_p1 = 1
counter_p2 = 1

# This function executes when backend connects to MQTT broker
def on_connect(client, userdata, flags, rc):
  s = client.subscribe("kerhosprint_commands")
  logging.info("Subscribe to command topic results with: %s" % s[0])

def on_message(client, userdata, msg):
  if (msg.topic == "kerhosprint_commands") and (msg.payload == "start_race"):
    global counter_p1
    global counter_p2
    counter_p1 = 1
    counter_p2 = 1
    # Add events to call detect functions when magnet is detected
    GPIO.add_event_detect(sensor_p1, GPIO.FALLING, callback=sensor1_detect)
    GPIO.add_event_detect(sensor_p2, GPIO.FALLING, callback=sensor2_detect)
    logging.info("start_race received, initialize callbacks")

def sensor1_detect(channel):
  global counter_p1
  client.publish("p1", counter_p1)
  counter_p1 += 1
#  logging.info("p1")

def sensor2_detect(channel):
  global counter_p2
  client.publish("p2", counter_p2)
  counter_p2 += 1
#  logging.info("p2")

# Initialize MQTT Client and callback functions
client = mqtt.Client(client_id="backend", clean_session=True, transport="websockets")
client.on_connect = on_connect
client.on_message = on_message

# Connect to MQTT Broker and start loop
logging.info("connect to mqtt broker")
client.connect("localhost", port=9001)
client.loop_forever()

