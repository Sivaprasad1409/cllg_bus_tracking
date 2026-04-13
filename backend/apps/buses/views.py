from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Bus, BusStop, RoutePoint
from .serializers import (
    BusListSerializer, BusDetailSerializer, BusCreateUpdateSerializer,
    BusStopSerializer, RoutePointSerializer
)
from apps.accounts.permissions import IsAdmin, IsAdminOrReadOnly


class BusViewSet(viewsets.ModelViewSet):
    """Bus CRUD operations with role-based access."""
    permission_classes = [IsAdminOrReadOnly]
    queryset = Bus.objects.filter(is_active=True)

    def get_serializer_class(self):
        if self.action == 'list':
            return BusListSerializer
        if self.action in ['create', 'update', 'partial_update']:
            return BusCreateUpdateSerializer
        return BusDetailSerializer

    def get_queryset(self):
        queryset = Bus.objects.filter(is_active=True)
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(bus_number__icontains=search)
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        return queryset

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_bus(self, request):
        """Get the bus assigned to the current user."""
        user = request.user
        if not user.assigned_bus:
            return Response(
                {'detail': 'No bus assigned to your account.'},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = BusDetailSerializer(user.assigned_bus)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def search(self, request):
        """Search buses by bus number."""
        query = request.query_params.get('q', '')
        if not query:
            return Response([])
        buses = Bus.objects.filter(
            bus_number__icontains=query,
            is_active=True
        )[:10]
        serializer = BusListSerializer(buses, many=True)
        return Response(serializer.data)

    def perform_destroy(self, instance):
        """Soft delete — mark as inactive."""
        instance.is_active = False
        instance.save()
