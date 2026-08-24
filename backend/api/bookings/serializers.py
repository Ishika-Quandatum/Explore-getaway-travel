from rest_framework import serializers
from .models import Booking, Wishlist
from api.packages.serializers import TourPackageSerializer
from api.users.serializers import UserSerializer

class BookingSerializer(serializers.ModelSerializer):
    package_details = TourPackageSerializer(source='package', read_only=True)
    user_details = UserSerializer(source='user', read_only=True)

    class Meta:
        model = Booking
        fields = (
            'id', 'booking_code', 'user', 'user_details', 'package', 'package_details',
            'travel_date', 'guests_count', 'customer_name', 'customer_email', 'customer_phone',
            'total_price', 'special_requests', 'status', 'created_at'
        )
        read_only_fields = ('id', 'booking_code', 'created_at')


class WishlistSerializer(serializers.ModelSerializer):
    package_details = TourPackageSerializer(source='package', read_only=True)

    class Meta:
        model = Wishlist
        fields = ('id', 'user', 'package', 'package_details', 'created_at')
