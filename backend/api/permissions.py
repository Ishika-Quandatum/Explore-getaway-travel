from rest_framework import permissions

class IsAdminUserRole(permissions.BasePermission):
    """
    Custom permission to only allow users with 'admin' role or superuser access.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            (getattr(request.user, 'role', '') == 'admin' or request.user.is_superuser)
        )


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Object-level permission to allow owners of an object or admins to access/modify it.
    """
    def has_object_permission(self, request, view, obj):
        if not request.user or not request.user.is_authenticated:
            return False
        if getattr(request.user, 'role', '') == 'admin' or request.user.is_superuser:
            return True
        return hasattr(obj, 'user') and obj.user == request.user
