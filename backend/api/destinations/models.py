from django.db import models

class Destination(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    subtitle = models.CharField(max_length=200, blank=True, null=True)
    image_url = models.TextField()
    description = models.TextField(blank=True, null=True)
    is_popular = models.BooleanField(default=True)

    def __str__(self):
        return self.name
