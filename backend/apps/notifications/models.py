from django.db import models
from django.conf import settings


class Notification(models.Model):
    """Notifications for route changes, delays, and announcements."""

    TYPE_CHOICES = [
        ('route_change', 'Route Change'),
        ('delay', 'Delay'),
        ('timing', 'Timing Update'),
        ('general', 'General'),
    ]

    bus = models.ForeignKey(
        'buses.Bus',
        on_delete=models.CASCADE,
        related_name='notifications',
        null=True,
        blank=True
    )
    title = models.CharField(max_length=200)
    message = models.TextField()
    type = models.CharField(max_length=15, choices=TYPE_CHOICES, default='general')
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_notifications'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} ({self.get_type_display()})"


class NotificationRead(models.Model):
    """Tracks which users have read which notifications."""

    notification = models.ForeignKey(
        Notification,
        on_delete=models.CASCADE,
        related_name='reads'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notification_reads'
    )
    read_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['notification', 'user']

    def __str__(self):
        return f"{self.user.username} read {self.notification.title}"
