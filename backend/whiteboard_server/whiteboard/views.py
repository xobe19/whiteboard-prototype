from django.shortcuts import render
from django.http import HttpRequest, HttpResponse
import json
from whiteboard.models import Canvas

# Create your views here.

def authenticated_boards(request: HttpRequest):
    auth_boards = request.session.get("authenticated_boards")
    return HttpResponse(auth_boards)

def create_whiteboard(request: HttpRequest):
    body = request.body.decode("utf-8")
    body_dict = json.loads(body)
    board_name = body_dict["name"] 
    board_passwd = body_dict["password"]
    if not board_name or not board_passwd:
        return HttpResponse("invalid request", status=400)
    board = Canvas.objects.filter(id=board_name)
    print(type(board))
    print(board)
    if not board:
        b = Canvas(id=board_name, password_hash=board_passwd, board_state = "state placeholder")
        b.save()
    print(board[0])
    return HttpResponse(body)

    