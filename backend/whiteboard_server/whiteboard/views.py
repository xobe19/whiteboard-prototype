from django.shortcuts import render
from django.http import HttpRequest, HttpResponse

# Create your views here.

def authenticated_boards(request: HttpRequest):
    auth_boards = request.session.get("authenticated_boards")
    return HttpResponse(auth_boards)