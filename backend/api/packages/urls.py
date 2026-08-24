from django.urls import path
from .views import packages_list_create, package_detail, image_upload_view, wishlist_list, wishlist_toggle

urlpatterns = [
    path('packages/', packages_list_create, name='packages_list'),
    path('packages/<int:pk>/', package_detail, name='package_detail'),
    path('admin/upload/', image_upload_view, name='admin_upload'),
    path('wishlist/', wishlist_list, name='wishlist_list'),
    path('wishlist/toggle/', wishlist_toggle, name='wishlist_toggle'),
]

