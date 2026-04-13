"""
GPS Simulator for bus tracking.
Moves buses along their predefined route points to simulate real-time movement.
"""
import math
import time
import json
import asyncio
from channels.db import database_sync_to_async
from channels.layers import get_channel_layer


class GPSSimulator:
    """Simulates GPS movement for all active buses along their routes."""

    _instance = None
    _running = False

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._bus_positions = {}
            cls._instance._bus_routes = {}
        return cls._instance

    @database_sync_to_async
    def load_bus_routes(self):
        """Load all active bus routes from database."""
        from apps.buses.models import Bus, RoutePoint

        buses = Bus.objects.filter(is_active=True, status='running')
        routes = {}
        for bus in buses:
            points = list(
                RoutePoint.objects.filter(bus=bus).order_by('order').values('latitude', 'longitude')
            )
            if points:
                routes[bus.id] = {
                    'bus_number': bus.bus_number,
                    'route_name': bus.route_name,
                    'points': points,
                    'current_index': self._bus_positions.get(bus.id, {}).get('current_index', 0),
                    'direction': self._bus_positions.get(bus.id, {}).get('direction', 1),
                    'status': bus.status,
                }
        return routes

    @database_sync_to_async
    def update_bus_position(self, bus_id, lat, lng):
        """Update bus position in the database."""
        from apps.buses.models import Bus
        try:
            Bus.objects.filter(id=bus_id).update(current_lat=lat, current_lng=lng)
        except Exception:
            pass

    def interpolate(self, p1, p2, fraction):
        """Linear interpolation between two points."""
        lat = p1['latitude'] + (p2['latitude'] - p1['latitude']) * fraction
        lng = p1['longitude'] + (p2['longitude'] - p1['longitude']) * fraction
        return lat, lng

    def calculate_bearing(self, p1, p2):
        """Calculate bearing between two points for marker rotation."""
        lat1 = math.radians(p1['latitude'])
        lat2 = math.radians(p2['latitude'])
        diff_lng = math.radians(p2['longitude'] - p1['longitude'])

        x = math.sin(diff_lng) * math.cos(lat2)
        y = math.cos(lat1) * math.sin(lat2) - math.sin(lat1) * math.cos(lat2) * math.cos(diff_lng)
        bearing = math.degrees(math.atan2(x, y))
        return (bearing + 360) % 360

    async def simulate_step(self):
        """Advance all buses one step along their routes."""
        routes = await self.load_bus_routes()
        channel_layer = get_channel_layer()
        locations = {}

        for bus_id, route_data in routes.items():
            points = route_data['points']
            if len(points) < 2:
                continue

            current_index = route_data.get('current_index', 0)
            direction = route_data.get('direction', 1)

            # Get current and next point
            next_index = current_index + direction
            if next_index >= len(points):
                direction = -1
                next_index = current_index - 1
            elif next_index < 0:
                direction = 1
                next_index = 1

            current_point = points[current_index]
            next_point = points[next_index]

            # Interpolate position (smooth movement)
            lat, lng = self.interpolate(current_point, next_point, 0.5)
            bearing = self.calculate_bearing(current_point, next_point)

            # Update stored position
            self._bus_positions[bus_id] = {
                'current_index': next_index,
                'direction': direction,
            }

            # Update database
            await self.update_bus_position(bus_id, lat, lng)

            locations[str(bus_id)] = {
                'bus_id': bus_id,
                'bus_number': route_data['bus_number'],
                'route_name': route_data['route_name'],
                'latitude': round(lat, 6),
                'longitude': round(lng, 6),
                'bearing': round(bearing, 1),
                'status': route_data['status'],
                'timestamp': time.time(),
            }

        # Broadcast to all connected clients
        if locations and channel_layer:
            await channel_layer.group_send(
                "bus_tracking",
                {
                    "type": "bus.locations",
                    "locations": locations
                }
            )

        return locations

    async def run(self, interval=3):
        """Run the simulation loop."""
        if GPSSimulator._running:
            return
        GPSSimulator._running = True

        try:
            while GPSSimulator._running:
                await self.simulate_step()
                await asyncio.sleep(interval)
        except asyncio.CancelledError:
            GPSSimulator._running = False
        except Exception as e:
            GPSSimulator._running = False
            print(f"GPS Simulator error: {e}")

    @classmethod
    def stop(cls):
        cls._running = False
