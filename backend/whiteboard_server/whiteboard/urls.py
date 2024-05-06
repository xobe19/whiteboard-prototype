
from django.urls import path
import whiteboard.views as views
urlpatterns = [
  path("/authenticated_boards", views.authenticated_boards)
]