from django.shortcuts import render
from django.http import HttpRequest, HttpResponse
import json
from whiteboard.models import Canvas
from hashlib import sha256
from whiteboard.tasks import sync_boards_with_db
from whiteboard.utils import add_to_q
# Create your views here.

def authenticated_boards(request: HttpRequest):
    auth_boards = request.session.get("authenticated_boards")
    return HttpResponse(auth_boards)

def create_whiteboard(request: HttpRequest):
    body = request.body.decode("utf-8")
    body_dict = json.loads(body)
    board_name = body_dict["name"] 
    board_passwd = body_dict["password"]
    board_passwd_hash = sha256(str(board_passwd).encode("utf-8")).hexdigest()
    if not board_name or not board_passwd:
        return HttpResponse("invalid request", status=400)
    boards = Canvas.objects.filter(id=board_name)
    if not boards:
        b = Canvas(id=board_name, password_hash=board_passwd_hash, board_state = "state placeholder")
        b.save()

    boards = Canvas.objects.filter(id=board_name)
    board = boards[0] 
    if board.password_hash != board_passwd_hash:
        return HttpResponse("wrong password", status=401)
    
    request.session[f"board_{board_name}"] = True

    return HttpResponse(body)

def test_view(request: HttpRequest):
      sync_boards_with_db() 
      return HttpResponse("debug test view ran")

def send_message(request: HttpRequest):
    msg = json.loads(request.body.decode("utf-8"))
    add_to_q(msg)
    return HttpResponse("done")
    
    