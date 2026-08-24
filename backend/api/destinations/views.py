from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import Destination
from .serializers import DestinationSerializer

def is_admin(request):
    return bool(
        request.user and 
        request.user.is_authenticated and 
        (getattr(request.user, 'role', '') == 'admin' or request.user.is_superuser)
    )

@api_view(['GET', 'POST'])
@permission_classes([permissions.AllowAny])
def destinations_list_create(request):
    if request.method == 'GET':
        destinations = Destination.objects.all()
        serializer = DestinationSerializer(destinations, many=True)
        return Response(serializer.data)
    
    if not is_admin(request):
        return Response({'error': 'Admin permissions required.'}, status=status.HTTP_403_FORBIDDEN)
        
    serializer = DestinationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([permissions.AllowAny])
def destination_detail(request, pk):
    destination = get_object_or_404(Destination, pk=pk)
    if request.method == 'GET':
        return Response(DestinationSerializer(destination).data)
    
    if not is_admin(request):
        return Response({'error': 'Admin permissions required.'}, status=status.HTTP_403_FORBIDDEN)
        
    if request.method in ['PUT', 'PATCH']:
        partial = (request.method == 'PATCH')
        serializer = DestinationSerializer(destination, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        destination.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
