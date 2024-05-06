from kafka import KafkaProducer, KafkaConsumer
import time
producer = KafkaProducer(bootstrap_servers='localhost:9092', api_version=(2,13,3))
producer.send('sample', b'hehe')
producer.flush()
producer.close()
    
consumer = KafkaConsumer("sample", bootstrap_servers='localhost:9092', api_version=(2,13,3), auto_offset_reset='earliest', group_id=None)
# 
for msg in consumer:
  print(msg)
