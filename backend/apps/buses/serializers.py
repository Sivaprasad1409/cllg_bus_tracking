from rest_framework import serializers
from .models import Bus, BusStop, RoutePoint


class BusStopSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusStop
        fields = ['id', 'stop_name', 'latitude', 'longitude', 'order', 'estimated_time']


class RoutePointSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoutePoint
        fields = ['id', 'latitude', 'longitude', 'order']


class BusListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for bus listings."""
    assigned_user_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Bus
        fields = [
            'id', 'bus_number', 'route_name', 'driver_name', 'driver_phone',
            'status', 'current_lat', 'current_lng', 'departure_time',
            'arrival_time', 'capacity', 'assigned_user_count', 'is_active', 'updated_at'
        ]


class BusDetailSerializer(serializers.ModelSerializer):
    """Full serializer with stops and route points."""
    stops = BusStopSerializer(many=True, read_only=True)
    route_points = RoutePointSerializer(many=True, read_only=True)
    assigned_user_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Bus
        fields = [
            'id', 'bus_number', 'route_name', 'driver_name', 'driver_phone',
            'status', 'current_lat', 'current_lng', 'departure_time',
            'arrival_time', 'capacity', 'route_description', 'assigned_user_count',
            'is_active', 'stops', 'route_points', 'created_at', 'updated_at'
        ]


class BusCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating buses."""

    class Meta:
        model = Bus
        fields = [
            'id', 'bus_number', 'route_name', 'driver_name', 'driver_phone',
            'status', 'departure_time', 'arrival_time', 'capacity',
            'route_description', 'is_active'
        ]
        read_only_fields = ['id']
