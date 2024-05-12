from django.db import models

# Create your models here.

class Canvas(models.Model):
    id = models.CharField(primary_key=True)
    password_hash = models.CharField()
    board_state = models.JSONField()
    lso = models.IntegerField(default=0)