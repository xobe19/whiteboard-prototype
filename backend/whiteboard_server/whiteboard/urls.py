
from django.urls import path
import whiteboard.views as views
urlpatterns = [
  path("authenticated_boards/", views.authenticated_boards),
  path("create_whiteboard/", views.create_whiteboard),
  path("test/", views.test_view),
  path("send_message/", views.send_message)
]