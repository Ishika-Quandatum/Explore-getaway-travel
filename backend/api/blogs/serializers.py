from rest_framework import serializers
from .models import BlogArticle

class BlogArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogArticle
        fields = ('id', 'title', 'slug', 'summary', 'content', 'image_url', 'author', 'published_at')
