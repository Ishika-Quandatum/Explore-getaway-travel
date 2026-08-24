from django.urls import path
from .views import destinations_list_create, destination_detail

urlpatterns = [
    path('destinations/', destinations_list_create, name='destinations_list'),
    path('destinations/<int:pk>/', destination_detail, name='destination_detail'),
]
