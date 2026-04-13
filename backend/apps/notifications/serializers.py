from rest_framework import serializers
from .models import Notification, NotificationRead


class NotificationSerializer(serializers.ModelSerializer):
    """Serializer for notifications with read status."""
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True, default='System')
    bus_number = serializers.CharField(source='bus.bus_number', read_only=True, default=None)
    is_read = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = [
            'id', 'bus', 'bus_number', 'title', 'message', 'type',
            'created_by', 'created_by_name', 'created_at', 'is_active', 'is_read'
        ]
        read_only_fields = ['id', 'created_by', 'created_at']

    def get_is_read(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return NotificationRead.objects.filter(
                notification=obj, user=request.user
            ).exists()
        return False


class NotificationCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating notifications (admin only)."""

    class Meta:
        model = Notification
        fields = ['id', 'bus', 'title', 'message', 'type']
        read_only_fields = ['id']
