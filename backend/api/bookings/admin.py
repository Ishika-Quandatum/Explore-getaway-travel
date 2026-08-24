from django.contrib import admin
from .models import Booking, Wishlist

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('booking_code', 'customer_name', 'package', 'travel_date', 'total_price', 'status')
    list_filter = ('status', 'created_at')

@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ('user', 'package', 'created_at')
