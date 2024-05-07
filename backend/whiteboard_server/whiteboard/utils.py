from kafka import KafkaProducer, KafkaConsumer
from channels.layers import get_channel_layer 
from asgiref.sync import async_to_sync
import json

producer = KafkaProducer(bootstrap_servers='localhost:9092', api_version=(2,13,3))
consumer = KafkaConsumer("whiteboard", bootstrap_servers='localhost:9092', api_version=(2,13,3), auto_offset_reset='earliest', group_id=None)
channel_layer = get_channel_layer()

def add_to_q(msg):
    producer.send("whiteboard", json.dumps(msg))

consumer_running = False

def start_consumer():
    if not consumer_running:
        consumer_running = True
    else:
        return
    for msg in consumer:
        data = json.loads(msg["value"])
        board_id = data["board_id"]    
        state_delta = data["state_delta"]
        async_to_sync(channel_layer.group_send)("boards", {
          "type": "board.change",
          "board_id": board_id,
          "state_delta": state_delta
        })