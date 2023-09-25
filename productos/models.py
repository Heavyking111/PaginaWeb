from django.db import models

# Create your models here.
class Comida(models.Model):
    name = models.CharField(max_length=100)
    price = models.CharField(max_length=100)
    type = models.CharField(max_length=100)
    ingredients = models.TextField()
    imgUrl = models.CharField(max_length=100)
    id = models.CharField(max_length=10, primary_key=True)
    
    

