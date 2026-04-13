from django.db import models
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Notification, NotificationRead
from .serializers import NotificationSerializer, NotificationCreateSerializer
from apps.accounts.permissions import IsAdmin, IsAdminOrReadOnly


class NotificationViewSet(viewsets.ModelViewSet):
    """Notification CRUD and read tracking."""
    queryset = Notification.objects.filter(is_active=True)

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdmin()]
        return [IsAuthenticated()]

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return NotificationCreateSerializer
        return NotificationSerializer

    def get_queryset(self):
        queryset = Notification.objects.filter(is_active=True).select_related('bus', 'created_by')
        user = self.request.user

        # Students/faculty see notifications for their assigned bus + general ones
        if user.role in ('student', 'faculty'):
            if user.assigned_bus:
                queryset = queryset.filter(
                    models.Q(bus=user.assigned_bus) | models.Q(bus__isnull=True)
                )
            else:
                queryset = queryset.filter(bus__isnull=True)

        return queryset

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def read(self, request, pk=None):
        """Mark a notification as read."""
        notification = self.get_object()
        NotificationRead.objects.get_or_create(
            notification=notification,
            user=request.user
        )
        return Response({'status': 'marked as read'})

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def unread_count(self, request):
        """Get count of unread notifications."""
        queryset = self.get_queryset()
        read_ids = NotificationRead.objects.filter(
            user=request.user
        ).values_list('notification_id', flat=True)
        unread = queryset.exclude(id__in=read_ids).count()
        return Response({'unread_count': unread})
