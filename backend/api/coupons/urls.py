from django.urls import path
from .views import coupons_list_create, coupon_detail

urlpatterns = [
    path('coupons/', coupons_list_create, name='coupons_list'),
    path('coupons/<int:pk>/', coupon_detail, name='coupon_detail'),
]
