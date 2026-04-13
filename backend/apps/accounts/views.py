from rest_framework import generics, status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User
from .serializers import (
    LoginSerializer, RegisterSerializer, UserSerializer, UserCreateUpdateSerializer
)
from .permissions import IsAdmin


class LoginView(generics.GenericAPIView):
    """JWT login endpoint."""
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserSerializer(user).data
        })


class RegisterView(generics.CreateAPIView):
    """User registration endpoint."""
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    """Get current user profile."""
    return Response(UserSerializer(request.user).data)


class UserViewSet(viewsets.ModelViewSet):
    """Admin user management CRUD."""
    permission_classes = [IsAdmin]
    queryset = User.objects.all()
    serializer_class = UserCreateUpdateSerializer

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return UserSerializer
        return UserCreateUpdateSerializer

    def get_queryset(self):
        queryset = User.objects.select_related('assigned_bus').all()
        role = self.request.query_params.get('role')
        if role:
            queryset = queryset.filter(role=role)
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                models.Q(username__icontains=search) |
                models.Q(first_name__icontains=search) |
                models.Q(last_name__icontains=search) |
                models.Q(email__icontains=search)
            )
        return queryset


@api_view(['GET'])
@permission_classes([IsAdmin])
def analytics_view(request):
    """System analytics for admin dashboard."""
    from apps.buses.models import Bus
    from apps.notifications.models import Notification

    total_users = User.objects.filter(is_active=True).count()
    total_students = User.objects.filter(role='student', is_active=True).count()
    total_faculty = User.objects.filter(role='faculty', is_active=True).count()
    total_buses = Bus.objects.filter(is_active=True).count()
    running_buses = Bus.objects.filter(status='running', is_active=True).count()
    delayed_buses = Bus.objects.filter(status='delayed', is_active=True).count()
    total_notifications = Notification.objects.filter(is_active=True).count()

    return Response({
        'total_users': total_users,
        'total_students': total_students,
        'total_faculty': total_faculty,
        'total_buses': total_buses,
        'running_buses': running_buses,
        'delayed_buses': delayed_buses,
        'stopped_buses': Bus.objects.filter(status='stopped', is_active=True).count(),
        'total_notifications': total_notifications,
        'users_with_bus': User.objects.filter(assigned_bus__isnull=False, is_active=True).count(),
        'users_without_bus': User.objects.filter(assigned_bus__isnull=True, is_active=True).exclude(role='admin').count(),
    })
