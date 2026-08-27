from django.urls import path
from .views import (
    login_view, refresh_token_view, register_view, user_profile_view,
    admin_users_list_create, admin_users_detail, contact_form_view
)

urlpatterns = [
    path('auth/login/', login_view, name='token_obtain_pair'),
    path('auth/refresh/', refresh_token_view, name='token_refresh'),
    path('auth/register/', register_view, name='auth_register'),
    path('auth/me/', user_profile_view, name='auth_me'),
    path('admin/users/', admin_users_list_create, name='admin_users_list'),
    path('admin/users/<int:pk>/', admin_users_detail, name='admin_users_detail'),
    path('contact/', contact_form_view, name='contact_form'),
]
