from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Sum, Count
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model

from .models import Booking, Wishlist
from .serializers import BookingSerializer, WishlistSerializer
from api.destinations.models import Destination
from api.destinations.serializers import DestinationSerializer
from api.packages.models import TourPackage

User = get_user_model()

def is_admin(request):
    return bool(
        request.user and 
        request.user.is_authenticated and 
        (getattr(request.user, 'role', '') == 'admin' or request.user.is_superuser)
    )

# --- Booking Views ---

@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticated])
def bookings_list_create(request):
    user = request.user
    if request.method == 'GET':
        if is_admin(request):
            bookings = Booking.objects.all().order_by('-created_at')
        else:
            bookings = Booking.objects.filter(user=user).order_by('-created_at')
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data)
    
    serializer = BookingSerializer(data=request.data)
    if serializer.is_valid():
        package = serializer.validated_data['package']
        guests = serializer.validated_data.get('guests_count', 1)
        sharing_type = request.data.get('sharing_type', 'single')

        # Validate sharing type price configuration
        if sharing_type == 'triple' and (package.triple_sharing is None or package.triple_sharing <= 0):
            return Response({'error': 'Triple sharing amount is not allocated for this package. Please select another sharing type'}, status=status.HTTP_400_BAD_REQUEST)
        if sharing_type == 'double' and (package.double_sharing is None or package.double_sharing <= 0):
            return Response({'error': 'Double sharing amount is not allocated for this package. Please select another sharing type'}, status=status.HTTP_400_BAD_REQUEST)
        if sharing_type == 'single' and (package.price_per_person is None or package.price_per_person <= 0):
            return Response({'error': 'Single sharing amount is not allocated for this package. Please select another sharing type'}, status=status.HTTP_400_BAD_REQUEST)

        req_price = request.data.get('total_price')
        if req_price is not None and float(req_price) > 0:
            total_price = req_price
        else:
            unit_price = package.price_per_person
            if sharing_type == 'double' and package.double_sharing:
                unit_price = package.double_sharing
            elif sharing_type == 'triple' and package.triple_sharing:
                unit_price = package.triple_sharing
            total_price = unit_price * guests

        booking = serializer.save(
            user=user,
            total_price=total_price,
            customer_name=request.data.get('customer_name', f"{user.first_name} {user.last_name}".strip() or user.username),
            customer_email=request.data.get('customer_email', user.email),
            customer_phone=request.data.get('customer_phone', getattr(user, 'phone', '') or '')
        )
        return Response(BookingSerializer(booking).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
def booking_detail(request, pk):
    booking = get_object_or_404(Booking, pk=pk)
    
    if not is_admin(request) and booking.user != request.user:
        return Response({'error': 'You do not have permission to view/modify this booking.'}, status=status.HTTP_403_FORBIDDEN)
        
    if request.method == 'GET':
        return Response(BookingSerializer(booking).data)
    elif request.method in ['PUT', 'PATCH']:
        partial = (request.method == 'PATCH')
        serializer = BookingSerializer(booking, data=request.data, partial=partial)
        if serializer.is_valid():
            updated_booking = serializer.save()
            return Response(BookingSerializer(updated_booking).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        booking.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def cancel_booking_view(request, pk):
    booking = get_object_or_404(Booking, pk=pk)
    if not is_admin(request) and booking.user != request.user:
        return Response({'error': 'You do not have permission to cancel this booking.'}, status=status.HTTP_403_FORBIDDEN)
    
    booking.status = 'cancelled'
    booking.save()
    return Response({'message': 'Booking cancelled successfully.', 'booking': BookingSerializer(booking).data})


# --- Wishlist Views ---

@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticated])
def wishlist_list_create(request):
    if request.method == 'GET':
        wishlist_items = Wishlist.objects.filter(user=request.user).order_by('-created_at')
        serializer = WishlistSerializer(wishlist_items, many=True)
        return Response(serializer.data)
    
    serializer = WishlistSerializer(data=request.data)
    if serializer.is_valid():
        wishlist_item = serializer.save(user=request.user)
        return Response(WishlistSerializer(wishlist_item).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
def wishlist_detail(request, pk):
    wishlist_item = get_object_or_404(Wishlist, pk=pk)
    if not is_admin(request) and wishlist_item.user != request.user:
        return Response({'error': 'You do not have permission to access this wishlist item.'}, status=status.HTTP_403_FORBIDDEN)
        
    if request.method == 'GET':
        return Response(WishlistSerializer(wishlist_item).data)
    elif request.method == 'DELETE':
        wishlist_item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# --- Admin Dashboard Stats ---

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def admin_stats_view(request):
    if not is_admin(request):
        return Response({'error': 'Admin permissions required.'}, status=status.HTTP_403_FORBIDDEN)

    total_bookings = Booking.objects.count()
    confirmed_bookings = Booking.objects.filter(status='confirmed').count()
    pending_bookings = Booking.objects.filter(status='pending').count()
    cancelled_bookings = Booking.objects.filter(status='cancelled').count()
    total_packages = TourPackage.objects.count()
    total_users = User.objects.count()
    
    total_revenue_result = Booking.objects.filter(status__in=['confirmed', 'completed']).aggregate(Sum('total_price'))
    total_revenue = total_revenue_result['total_price__sum'] or 0.0

    popular_destinations = Destination.objects.annotate(pkg_count=Count('packages')).order_by('-pkg_count')[:5]

    return Response({
        'total_revenue': float(total_revenue),
        'total_bookings': total_bookings,
        'confirmed_bookings': confirmed_bookings,
        'pending_bookings': pending_bookings,
        'cancelled_bookings': cancelled_bookings,
        'total_packages': total_packages,
        'total_users': total_users,
        'popular_destinations': DestinationSerializer(popular_destinations, many=True).data,
    })
