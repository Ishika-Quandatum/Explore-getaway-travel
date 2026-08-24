from rest_framework import serializers
from .models import Destination

class DestinationSerializer(serializers.ModelSerializer):
    packages_count = serializers.SerializerMethodField()

    class Meta:
        model = Destination
        fields = ('id', 'name', 'slug', 'subtitle', 'image_url', 'description', 'is_popular', 'packages_count')

    def get_packages_count(self, obj):
        if hasattr(obj, 'packages'):
            return obj.packages.count()
        return 0
