from django.db import models


class Bus(models.Model):
    """Bus model with route and driver information."""

    STATUS_CHOICES = [
        ('running', 'Running'),
        ('delayed', 'Delayed'),
        ('stopped', 'Stopped'),
        ('maintenance', 'Maintenance'),
    ]

    bus_number = models.CharField(max_length=20, unique=True)
    route_name = models.CharField(max_length=200)
    driver_name = models.CharField(max_length=100, blank=True)
    driver_phone = models.CharField(max_length=15, blank=True)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='stopped')
    current_lat = models.FloatField(default=0.0)
    current_lng = models.FloatField(default=0.0)
    departure_time = models.TimeField(null=True, blank=True)
    arrival_time = models.TimeField(null=True, blank=True)
    capacity = models.IntegerField(default=50)
    route_description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['bus_number']
        verbose_name_plural = 'Buses'

    def __str__(self):
        return f"Bus {self.bus_number} - {self.route_name}"

    @property
    def assigned_user_count(self):
        return self.assigned_users.filter(is_active=True).count()


class BusStop(models.Model):
    """Individual stops along a bus route."""

    bus = models.ForeignKey(Bus, on_delete=models.CASCADE, related_name='stops')
    stop_name = models.CharField(max_length=200)
    latitude = models.FloatField()
    longitude = models.FloatField()
    order = models.IntegerField()
    estimated_time = models.TimeField(null=True, blank=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.stop_name} (Bus {self.bus.bus_number})"


class RoutePoint(models.Model):
    """GPS coordinates defining the route path for map visualization."""

    bus = models.ForeignKey(Bus, on_delete=models.CASCADE, related_name='route_points')
    latitude = models.FloatField()
    longitude = models.FloatField()
    order = models.IntegerField()

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"Point {self.order} (Bus {self.bus.bus_number})"
