from django.db import models

class BlogArticle(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    summary = models.TextField()
    content = models.TextField()
    image_url = models.TextField()
    author = models.CharField(max_length=100, default="Admin")
    published_at = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.title
