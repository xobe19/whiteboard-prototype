import json
from channels.generic.websocket import WebsocketConsumer
class BoardEventConsumer(WebsocketConsumer):
    def connect(self):
        session = self.scope["session"]
        board = str(self.scope["path"]).split("/")[-1]
        if session.get(board, False):
            self.accept()
        else:
            self.close()
    def disconnect(self, code):
        pass
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        self.send(text_data=json.dumps({
            'message': message
        }))
    