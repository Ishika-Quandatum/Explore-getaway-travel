from django.urls import path, include

urlpatterns = [
    path('', include('api.users.urls')),
    path('', include('api.destinations.urls')),
    path('', include('api.categories.urls')),
    path('', include('api.coupons.urls')),
    path('', include('api.packages.urls')),
    path('', include('api.bookings.urls')),
    path('', include('api.blogs.urls')),
]
