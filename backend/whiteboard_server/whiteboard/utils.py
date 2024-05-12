from kafka import KafkaProducer, KafkaConsumer
from channels.layers import get_channel_layer 
from asgiref.sync import async_to_sync
import json

producer = KafkaProducer(bootstrap_servers='localhost:9092', api_version=(2,13,3))

def add_to_q(msg):
    print(f"Message added: ${msg}")
    producer.send(msg["board_id"], str(json.dumps(msg)).encode('utf-8'))


def start_consuming_board(board_id):

    consumer = KafkaConsumer("whiteboard", bootstrap_servers='localhost:9092', api_version=(2,13,3), auto_offset_reset='earliest', group_id=None)
    channel_layer = get_channel_layer()
    for msg in consumer:
        data = json.loads(msg["value"])
        state_delta = data["state_delta"]
        async_to_sync(channel_layer.group_send)("boards", {
          "type": "board.change",
          "board_id": board_id,
          "state_delta": state_delta
        })