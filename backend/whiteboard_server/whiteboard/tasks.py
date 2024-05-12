from whiteboard.models import Canvas
from kafka import KafkaConsumer, TopicPartition, KafkaAdminClient
from iterators import TimeoutIterator
import json
def sync_boards_with_db():
    boards = Canvas.objects.all()
    for board in boards:
        lso = board.lso

        consumer = KafkaConsumer( bootstrap_servers='localhost:9092', api_version=(2,13,3), auto_offset_reset='earliest')
        consumer.assign([TopicPartition(board.id, 0)])
        consumer.seek(TopicPartition(board.id, 0), lso)
        fin_state = ""
        fin_offset = 0
        for msg in TimeoutIterator(consumer, timeout=0.5, sentinel=None):
            if msg is None:
              break
            json_msg = (json.loads(msg[6]))

            print(json_msg["state_delta"])
        
