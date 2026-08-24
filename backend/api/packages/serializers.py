from rest_framework import serializers
from .models import TourPackage, ItineraryItem
from api.destinations.serializers import DestinationSerializer
from api.categories.serializers import CategorySerializer

class ItineraryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItineraryItem
        fields = ('id', 'day_number', 'title', 'description')


class TourPackageSerializer(serializers.ModelSerializer):
    destination_details = DestinationSerializer(source='destination', read_only=True)
    category_details = CategorySerializer(source='category', read_only=True)
    itinerary = ItineraryItemSerializer(many=True, read_only=True)

    class Meta:
        model = TourPackage
        fields = (
            'id', 'title', 'slug', 'destination', 'destination_details',
            'category', 'category_details', 'duration_nights', 'duration_days',
            'location_summary', 'price_per_person', 'double_sharing', 'triple_sharing', 'original_price', 'old_price', 'rating',
            'reviews_count', 'badge_text', 'image_url', 'gallery',
            'tour_overview', 'cancellation_policy', 'upcoming_departures', 'day_wise_itinerary',
            'highlights', 'inclusions', 'exclusions', 'is_bestseller', 'is_trending',
            'is_active', 'itinerary', 'created_at'
        )


class TourPackageWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = TourPackage
        fields = '__all__'
