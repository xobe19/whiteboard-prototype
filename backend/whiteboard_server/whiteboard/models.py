from django.db import models

# Create your models here.

class Canvas:
    id = models.CharField()
    password_hash = models.CharField()
    board_state = models.JSONField()