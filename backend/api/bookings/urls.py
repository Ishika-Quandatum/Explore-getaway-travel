from django.urls import path
from .views import (
    bookings_list_create, booking_detail, cancel_booking_view,
    wishlist_list_create, wishlist_detail, admin_stats_view
)

urlpatterns = [
    path('bookings/', bookings_list_create, name='bookings_list'),
    path('bookings/<int:pk>/', booking_detail, name='booking_detail'),
    path('bookings/<int:pk>/cancel/', cancel_booking_view, name='cancel_booking'),
    path('wishlist/', wishlist_list_create, name='wishlist_list'),
    path('wishlist/<int:pk>/', wishlist_detail, name='wishlist_detail'),
    path('admin/stats/', admin_stats_view, name='admin_stats'),
]
