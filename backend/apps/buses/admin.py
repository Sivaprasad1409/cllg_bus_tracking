from django.contrib import admin
from .models import Bus, BusStop, RoutePoint


class BusStopInline(admin.TabularInline):
    model = BusStop
    extra = 0


class RoutePointInline(admin.TabularInline):
    model = RoutePoint
    extra = 0


@admin.register(Bus)
class BusAdmin(admin.ModelAdmin):
    list_display = ['bus_number', 'route_name', 'status', 'driver_name', 'capacity', 'is_active']
    list_filter = ['status', 'is_active']
    search_fields = ['bus_number', 'route_name']
    inlines = [BusStopInline, RoutePointInline]
