import os, uuid
from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.conf import settings

from .models import TourPackage
from api.bookings.models import Wishlist
from .serializers import TourPackageSerializer, TourPackageWriteSerializer

def is_admin(request):
    return bool(
        request.user and 
        request.user.is_authenticated and 
        (getattr(request.user, 'role', '') == 'admin' or request.user.is_superuser)
    )

@api_view(['GET', 'POST'])
@permission_classes([permissions.AllowAny])
def packages_list_create(request):
    """
    Function-based view for listing and searching tour packages or creating a new package (Admin only).
    """
    if request.method == 'GET':
        queryset = TourPackage.objects.all().order_by('-created_at')
        
        if not is_admin(request):
            queryset = queryset.filter(is_active=True)

        destination_slug = request.query_params.get('destination')
        category_name = request.query_params.get('category')
        search_query = request.query_params.get('search')
        is_bestseller = request.query_params.get('bestseller')
        is_trending = request.query_params.get('trending')
        max_price = request.query_params.get('max_price')

        if destination_slug:
            queryset = queryset.filter(destination__name__iexact=destination_slug) | queryset.filter(destination__slug__iexact=destination_slug)
        if category_name:
            queryset = queryset.filter(category__name__iexact=category_name) | queryset.filter(category__slug__iexact=category_name)
        if search_query:
            queryset = queryset.filter(
                Q(title__icontains=search_query) |
                Q(location_summary__icontains=search_query) |
                Q(destination__name__icontains=search_query) |
                Q(description__icontains=search_query)
            )
        if is_bestseller == 'true':
            queryset = queryset.filter(is_bestseller=True)
        if is_trending == 'true':
            queryset = queryset.filter(is_trending=True)
        if max_price:
            try:
                queryset = queryset.filter(price_per_person__lte=float(max_price))
            except ValueError:
                pass

        serializer = TourPackageSerializer(queryset, many=True)
        return Response(serializer.data)

    if not is_admin(request):
        return Response({'error': 'Admin permissions required.'}, status=status.HTTP_403_FORBIDDEN)
        
    serializer = TourPackageWriteSerializer(data=request.data)
    if serializer.is_valid():
        package = serializer.save()
        return Response(TourPackageSerializer(package).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([permissions.AllowAny])
def package_detail(request, pk):
    """
    Function-based view for retrieving, updating, or deleting a specific tour package.
    """
    package = get_object_or_404(TourPackage, pk=pk)
    
    if request.method == 'GET':
        return Response(TourPackageSerializer(package).data)
        
    if not is_admin(request):
        return Response({'error': 'Admin permissions required.'}, status=status.HTTP_403_FORBIDDEN)
        
    if request.method in ['PUT', 'PATCH']:
        partial = (request.method == 'PATCH')
        serializer = TourPackageWriteSerializer(package, data=request.data, partial=partial)
        if serializer.is_valid():
            updated_package = serializer.save()
            return Response(TourPackageSerializer(updated_package).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        package.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def image_upload_view(request):
    """
    Function-based view for uploading images (Admin only).
    """
    if not is_admin(request):
        return Response({'error': 'Admin permissions required.'}, status=status.HTTP_403_FORBIDDEN)

    file = request.FILES.get('image')
    if not file:
        return Response({'error': 'No image file provided.'}, status=status.HTTP_400_BAD_REQUEST)

    allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
    if file.content_type not in allowed_types:
        return Response({'error': 'Invalid file type. Only JPEG, PNG, GIF, WebP, SVG allowed.'}, status=status.HTTP_400_BAD_REQUEST)

    ext = os.path.splitext(file.name)[1]
    filename = f"{uuid.uuid4().hex}{ext}"
    upload_dir = os.path.join(settings.MEDIA_ROOT, 'uploads')
    os.makedirs(upload_dir, exist_ok=True)

    filepath = os.path.join(upload_dir, filename)
    with open(filepath, 'wb+') as dest:
        for chunk in file.chunks():
            dest.write(chunk)

    image_url = f"{settings.MEDIA_URL}uploads/{filename}"
    return Response({'image_url': image_url}, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def wishlist_list(request):
    """
    List all tour packages in the logged-in user's wishlist.
    """
    wishlisted = Wishlist.objects.filter(user=request.user)
    packages = [item.package for item in wishlisted]
    serializer = TourPackageSerializer(packages, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def wishlist_toggle(request):
    """
    Toggle a tour package in the logged-in user's wishlist.
    """
    package_id = request.data.get('package_id')
    if not package_id:
        return Response({'error': 'package_id is required.'}, status=status.HTTP_400_BAD_REQUEST)
    
    package = get_object_or_404(TourPackage, pk=package_id)
    
    wishlist_item = Wishlist.objects.filter(user=request.user, package=package).first()
    if wishlist_item:
        wishlist_item.delete()
        return Response({'status': 'removed', 'package_id': package_id})
    else:
        Wishlist.objects.create(user=request.user, package=package)
        return Response({'status': 'added', 'package_id': package_id})
