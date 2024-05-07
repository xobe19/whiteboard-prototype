import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from utils import start_consumer
class BoardEventConsumer(WebsocketConsumer):
    def connect(self):
        session = self.scope["session"]
        board = str(self.scope["path"]).split("/")[-1]
        if session.get(board, False):
            self.board = board
            async_to_sync(self.channel_layer.group_add)("boards", self.channel_name)
            start_consumer() 
            self.accept()
        else:
            self.close()
    def disconnect(self, code):
            async_to_sync(self.channel_layer.group_discard)("boards", self.channel_name)
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        self.send(text_data=json.dumps({
            'message': message
        }))
    def board_change(self, event):
        print("fired")
        board_id = event["board_id"]
        if self.board != board_id:
            return
        self.send(text_data=json.dumps(event))
    
    

    