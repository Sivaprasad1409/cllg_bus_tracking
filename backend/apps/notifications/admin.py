from django.contrib import admin
from .models import Notification, NotificationRead


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['title', 'type', 'bus', 'created_by', 'created_at', 'is_active']
    list_filter = ['type', 'is_active']
    search_fields = ['title', 'message']
