from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import Coupon
from .serializers import CouponSerializer

def is_admin(request):
    return bool(
        request.user and 
        request.user.is_authenticated and 
        (getattr(request.user, 'role', '') == 'admin' or request.user.is_superuser)
    )

@api_view(['GET', 'POST'])
@permission_classes([permissions.AllowAny])
def coupons_list_create(request):
    if request.method == 'GET':
        coupons = Coupon.objects.all().order_by('-created_at')
        serializer = CouponSerializer(coupons, many=True)
        return Response(serializer.data)
    
    if not is_admin(request):
        return Response({'error': 'Admin permissions required.'}, status=status.HTTP_403_FORBIDDEN)
        
    serializer = CouponSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([permissions.AllowAny])
def coupon_detail(request, pk):
    coupon = get_object_or_404(Coupon, pk=pk)
    if request.method == 'GET':
        return Response(CouponSerializer(coupon).data)
    
    if not is_admin(request):
        return Response({'error': 'Admin permissions required.'}, status=status.HTTP_403_FORBIDDEN)
        
    if request.method in ['PUT', 'PATCH']:
        partial = (request.method == 'PATCH')
        serializer = CouponSerializer(coupon, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        coupon.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
