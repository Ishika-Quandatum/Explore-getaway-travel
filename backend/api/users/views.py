from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404

from .serializers import CustomTokenObtainPairSerializer, UserRegisterSerializer, UserSerializer
from api.permissions import IsAdminUserRole

User = get_user_model()


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_view(request):
    """
    Function-based view for user login returning JWT tokens and user metadata.
    """
    serializer = CustomTokenObtainPairSerializer(data=request.data)
    if serializer.is_valid():
        return Response(serializer.validated_data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def refresh_token_view(request):
    """
    Function-based view for refreshing JWT access tokens.
    """
    serializer = TokenRefreshSerializer(data=request.data)
    if serializer.is_valid():
        return Response(serializer.validated_data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_view(request):
    """
    Function-based view for registering new users.
    """
    serializer = UserRegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'PATCH'])
@permission_classes([permissions.IsAuthenticated])
def user_profile_view(request):
    """
    Function-based view for retrieving and updating authenticated user profile.
    """
    user = request.user
    if request.method == 'GET':
        serializer = UserSerializer(user)
        return Response(serializer.data)
    
    partial = (request.method == 'PATCH')
    serializer = UserSerializer(user, data=request.data, partial=partial)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
@permission_classes([IsAdminUserRole])
def admin_users_list_create(request):
    """
    Function-based view for listing all users or creating a new user (Admin access).
    """
    if request.method == 'GET':
        users = User.objects.all().order_by('-date_joined')
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
    
    serializer = UserRegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([IsAdminUserRole])
def admin_users_detail(request, pk):
    """
    Function-based view for retrieving, updating, or deleting a specific user (Admin access).
    """
    user = get_object_or_404(User, pk=pk)
    if request.method == 'GET':
        return Response(UserSerializer(user).data)
    elif request.method in ['PUT', 'PATCH']:
        partial = (request.method == 'PATCH')
        serializer = UserSerializer(user, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def contact_form_view(request):
    """
    Function-based view for handling contact form submission and sending an email.
    """
    from django.core.mail import send_mail
    from django.conf import settings

    full_name = request.data.get('full_name')
    email = request.data.get('email')
    phone_number = request.data.get('phone_number')
    subject = request.data.get('subject')
    message = request.data.get('message')

    if not all([full_name, email, subject, message]):
        return Response(
            {"error": "Please fill in all required fields (Full Name, Email, Subject, Message)."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Construct email details
    email_subject = f"Contact Form Submission: {subject}"
    email_body = f"""You have received a new contact form submission:

Full Name: {full_name}
Email Address: {email}
Phone Number: {phone_number or 'Not provided'}
Subject: {subject}

Message:
{message}"""

    recipient_list = [getattr(settings, 'COMPANY_EMAIL', 'info@example.com')]
    from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@example.com')

    try:
        send_mail(
            subject=email_subject,
            message=email_body,
            from_email=from_email,
            recipient_list=recipient_list,
            fail_silently=False,
        )
        return Response({"success": "Your message has been sent successfully."}, status=status.HTTP_200_OK)
    except Exception as e:
        print(f"Error sending email: {e}")
        return Response(
            {"error": "Failed to send email. Please try again later."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
