from django.db import models
from django.contrib.postgres.fields import ArrayField

# proprties of a file
#  - names/title
#  - depth
#  - par_id
#  - id
#  - array of child_id
#  - type
#  - link if bookmark

class Item(models.Model):
    title = models.CharField(max_length=200)
    depth = models.IntegerField()
    par_id = models.IntegerField()
    my_id = models.IntegerField()
    child_id = ArrayField(models.IntegerField())
    type = models.CharField(max_length=200)
    link = models.CharField(max_length=200)