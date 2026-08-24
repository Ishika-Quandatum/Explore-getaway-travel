from rest_framework import serializers
from .models import Coupon

class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = ('id', 'heading', 'description', 'offer_code', 'image_url', 'is_active', 'created_at')
        read_only_fields = ('id', 'created_at')
