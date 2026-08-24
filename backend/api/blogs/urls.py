from django.urls import path
from .views import blogs_list_create, blog_detail

urlpatterns = [
    path('blogs/', blogs_list_create, name='blogs_list'),
    path('blogs/<int:pk>/', blog_detail, name='blog_detail'),
]
