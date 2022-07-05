from django.db import models

import datetime
from django.utils import timezone

# Create your models here.
class Question(models.Model):
    question_text = models.CharField(max_length=200)
    pub_date = models.DateTimeField('data published')
    def __str__(self):
        return self.question_text
    def was_published_recently(self):
        return self.pub_date >= timezone.now() - datetime.timedelta(days=1)
    
class Choice(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    choice_text = models.CharField(max_length=200)
    votes = models.IntegerField(default=0)
    def __str__(self):
        return self.choice_text
    
# from django.db import models
# from django.contrib.postgres.fields import ArrayField

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
    # child_id = ArrayField(models.IntegerField())
    type = models.CharField(max_length=200)
    link = models.CharField(max_length=200)
    def __str__(self):
        return self.title+" "+str(self.my_id)
    