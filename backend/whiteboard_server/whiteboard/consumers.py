import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from whiteboard.utils import start_consuming_board, add_to_q
class BoardEventConsumer(WebsocketConsumer):
    def connect(self):
        session = self.scope["session"]
        board = str(self.scope["path"]).split("/")[-1]
        if session.get(board, False):
            self.board = board
            async_to_sync(self.channel_layer.group_add)(board, self.channel_name)
            start_consuming_board(board_id=board) 
            self.accept()
        else:
            self.close()
    def disconnect(self, code):
            async_to_sync(self.channel_layer.group_discard)(self.board, self.channel_name)
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        add_to_q(message)
    def board_change(self, event):
        print("fired")
        board_id = event["board_id"]
        if self.board != board_id:
            return
        self.send(text_data=json.dumps(event))
    
    

    