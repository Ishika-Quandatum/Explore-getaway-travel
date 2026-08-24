from rest_framework import serializers
from .models import Category

class CategorySerializer(serializers.ModelSerializer):
    display_label_text = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ('id', 'name', 'slug', 'image_url', 'description', 'display_label', 'display_label_text', 'is_active')

    def get_display_label_text(self, obj):
        return obj.get_display_label_display()
