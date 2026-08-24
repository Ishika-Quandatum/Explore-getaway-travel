from django.urls import path
from .views import categories_list_create, category_detail

urlpatterns = [
    path('categories/', categories_list_create, name='categories_list'),
    path('categories/<int:pk>/', category_detail, name='category_detail'),
]
