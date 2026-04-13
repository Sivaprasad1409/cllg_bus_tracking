"""
URL configuration for College Bus Tracking System.
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.accounts.urls')),
    path('api/buses/', include('apps.buses.urls')),
    path('api/notifications/', include('apps.notifications.urls')),
]
