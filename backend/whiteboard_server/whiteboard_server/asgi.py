"""
ASGI config for whiteboard_server project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter 
from channels.security.websocket import AllowedHostsOriginValidator
from channels.sessions import SessionMiddlewareStack
from django.urls import path
from whiteboard.consumers import BoardEventConsumer 
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'whiteboard_server.settings')



django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter({
  "http": django_asgi_app,
 "websocket": SessionMiddlewareStack(URLRouter([
path("board_ws/<name>",  BoardEventConsumer.as_asgi())
 ]))
})