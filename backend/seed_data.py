"""
Seed data management command.
Creates demo buses, users, stops, route points, and notifications.
Uses Hyderabad, India campus area for realistic routes.
"""
import os
import sys
import django
from datetime import time

# Setup Django
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.accounts.models import User
from apps.buses.models import Bus, BusStop, RoutePoint
from apps.notifications.models import Notification


def seed():
    print("🌱 Seeding database...")

    # ─── BUSES ───────────────────────────────────────────
    buses_data = [
        {
            'bus_number': 'CB-101',
            'route_name': 'Kukatpally → Campus',
            'driver_name': 'Rajesh Kumar',
            'driver_phone': '+91 9876543210',
            'status': 'running',
            'departure_time': time(7, 30),
            'arrival_time': time(8, 30),
            'capacity': 50,
            'route_description': 'Via KPHB, Miyapur, Chandanagar to Main Campus',
            'current_lat': 17.4947,
            'current_lng': 78.3996,
        },
        {
            'bus_number': 'CB-202',
            'route_name': 'Secunderabad → Campus',
            'driver_name': 'Suresh Reddy',
            'driver_phone': '+91 9876543211',
            'status': 'running',
            'departure_time': time(7, 15),
            'arrival_time': time(8, 15),
            'capacity': 45,
            'route_description': 'Via Begumpet, Ameerpet, SR Nagar to Main Campus',
            'current_lat': 17.4344,
            'current_lng': 78.5013,
        },
        {
            'bus_number': 'CB-303',
            'route_name': 'Dilsukhnagar → Campus',
            'driver_name': 'Venkat Rao',
            'driver_phone': '+91 9876543212',
            'status': 'delayed',
            'departure_time': time(7, 0),
            'arrival_time': time(8, 0),
            'capacity': 55,
            'route_description': 'Via Chaitanyapuri, Malakpet, Nampally to Main Campus',
            'current_lat': 17.3688,
            'current_lng': 78.5247,
        },
        {
            'bus_number': 'CB-404',
            'route_name': 'Gachibowli → Campus',
            'driver_name': 'Mahesh Babu',
            'driver_phone': '+91 9876543213',
            'status': 'running',
            'departure_time': time(7, 45),
            'arrival_time': time(8, 45),
            'capacity': 40,
            'route_description': 'Via Nanakramguda, HITEC City, Madhapur to Main Campus',
            'current_lat': 17.4400,
            'current_lng': 78.3489,
        },
        {
            'bus_number': 'CB-505',
            'route_name': 'LB Nagar → Campus',
            'driver_name': 'Ravi Teja',
            'driver_phone': '+91 9876543214',
            'status': 'stopped',
            'departure_time': time(7, 30),
            'arrival_time': time(8, 30),
            'capacity': 48,
            'route_description': 'Via Kothapet, Chaderghat, Abids to Main Campus',
            'current_lat': 17.3457,
            'current_lng': 78.5522,
        },
    ]

    buses = []
    for data in buses_data:
        bus, created = Bus.objects.update_or_create(
            bus_number=data['bus_number'],
            defaults=data
        )
        buses.append(bus)
        status = "✅ Created" if created else "♻️ Updated"
        print(f"  {status} Bus: {bus.bus_number} — {bus.route_name}")

    # ─── ROUTE POINTS (for GPS simulation) ─────────────
    route_points_data = {
        'CB-101': [
            (17.4947, 78.3996), (17.4920, 78.3950), (17.4890, 78.3900),
            (17.4855, 78.3860), (17.4820, 78.3820), (17.4785, 78.3780),
            (17.4750, 78.3740), (17.4720, 78.3700), (17.4690, 78.3660),
            (17.4660, 78.3620), (17.4630, 78.3580), (17.4600, 78.3540),
            (17.4575, 78.3510), (17.4550, 78.3480), (17.4520, 78.3450),
        ],
        'CB-202': [
            (17.4344, 78.5013), (17.4370, 78.4960), (17.4400, 78.4910),
            (17.4425, 78.4860), (17.4450, 78.4810), (17.4470, 78.4760),
            (17.4490, 78.4710), (17.4510, 78.4660), (17.4530, 78.4600),
            (17.4545, 78.4550), (17.4560, 78.4500), (17.4575, 78.4450),
            (17.4590, 78.4400), (17.4600, 78.4350), (17.4610, 78.4300),
        ],
        'CB-303': [
            (17.3688, 78.5247), (17.3720, 78.5200), (17.3755, 78.5150),
            (17.3790, 78.5100), (17.3825, 78.5050), (17.3860, 78.5000),
            (17.3900, 78.4950), (17.3940, 78.4900), (17.3980, 78.4850),
            (17.4020, 78.4800), (17.4060, 78.4750), (17.4100, 78.4700),
            (17.4140, 78.4650), (17.4180, 78.4600), (17.4220, 78.4550),
        ],
        'CB-404': [
            (17.4400, 78.3489), (17.4425, 78.3530), (17.4450, 78.3570),
            (17.4470, 78.3610), (17.4490, 78.3650), (17.4510, 78.3690),
            (17.4530, 78.3730), (17.4550, 78.3770), (17.4570, 78.3810),
            (17.4585, 78.3850), (17.4600, 78.3890), (17.4610, 78.3930),
            (17.4620, 78.3970), (17.4630, 78.4010), (17.4640, 78.4050),
        ],
        'CB-505': [
            (17.3457, 78.5522), (17.3490, 78.5480), (17.3525, 78.5430),
            (17.3560, 78.5380), (17.3600, 78.5330), (17.3640, 78.5280),
            (17.3680, 78.5230), (17.3720, 78.5180), (17.3760, 78.5130),
            (17.3800, 78.5080), (17.3840, 78.5030), (17.3880, 78.4980),
            (17.3920, 78.4930), (17.3960, 78.4880), (17.4000, 78.4830),
        ],
    }

    for bus in buses:
        RoutePoint.objects.filter(bus=bus).delete()
        points = route_points_data.get(bus.bus_number, [])
        for i, (lat, lng) in enumerate(points):
            RoutePoint.objects.create(bus=bus, latitude=lat, longitude=lng, order=i)
        print(f"  📍 Added {len(points)} route points for Bus {bus.bus_number}")

    # ─── BUS STOPS ──────────────────────────────────────
    stops_data = {
        'CB-101': [
            ('KPHB Colony', 17.4947, 78.3996, time(7, 30)),
            ('Miyapur', 17.4855, 78.3860, time(7, 45)),
            ('Chandanagar', 17.4750, 78.3740, time(8, 0)),
            ('BHEL', 17.4660, 78.3620, time(8, 15)),
            ('Main Campus', 17.4520, 78.3450, time(8, 30)),
        ],
        'CB-202': [
            ('Secunderabad Station', 17.4344, 78.5013, time(7, 15)),
            ('Begumpet', 17.4400, 78.4910, time(7, 30)),
            ('Ameerpet', 17.4470, 78.4760, time(7, 45)),
            ('SR Nagar', 17.4545, 78.4550, time(8, 0)),
            ('Main Campus', 17.4610, 78.4300, time(8, 15)),
        ],
        'CB-303': [
            ('Dilsukhnagar', 17.3688, 78.5247, time(7, 0)),
            ('Malakpet', 17.3825, 78.5050, time(7, 15)),
            ('Nampally', 17.3940, 78.4900, time(7, 30)),
            ('Abids', 17.4060, 78.4750, time(7, 45)),
            ('Main Campus', 17.4220, 78.4550, time(8, 0)),
        ],
        'CB-404': [
            ('Gachibowli', 17.4400, 78.3489, time(7, 45)),
            ('Nanakramguda', 17.4470, 78.3610, time(7, 55)),
            ('HITEC City', 17.4530, 78.3730, time(8, 10)),
            ('Madhapur', 17.4600, 78.3890, time(8, 25)),
            ('Main Campus', 17.4640, 78.4050, time(8, 45)),
        ],
        'CB-505': [
            ('LB Nagar', 17.3457, 78.5522, time(7, 30)),
            ('Kothapet', 17.3560, 78.5380, time(7, 45)),
            ('Chaderghat', 17.3680, 78.5230, time(8, 0)),
            ('Abids', 17.3840, 78.5030, time(8, 15)),
            ('Main Campus', 17.4000, 78.4830, time(8, 30)),
        ],
    }

    for bus in buses:
        BusStop.objects.filter(bus=bus).delete()
        stops = stops_data.get(bus.bus_number, [])
        for i, (name, lat, lng, est_time) in enumerate(stops):
            BusStop.objects.create(
                bus=bus, stop_name=name, latitude=lat, longitude=lng,
                order=i, estimated_time=est_time
            )
        print(f"  🚏 Added {len(stops)} stops for Bus {bus.bus_number}")

    # ─── USERS ──────────────────────────────────────────
    # Admin
    admin_user, created = User.objects.update_or_create(
        username='admin',
        defaults={
            'email': 'admin@college.edu',
            'first_name': 'System',
            'last_name': 'Admin',
            'role': 'admin',
            'phone': '+91 9000000001',
            'is_staff': True,
            'is_superuser': True,
        }
    )
    if created:
        admin_user.set_password('admin123')
        admin_user.save()
    print(f"  {'✅ Created' if created else '♻️ Updated'} Admin: admin / admin123")

    # Students
    students_data = [
        ('student1', 'Arjun', 'Sharma', 'student1@college.edu', buses[0]),
        ('student2', 'Priya', 'Patel', 'student2@college.edu', buses[0]),
        ('student3', 'Rahul', 'Verma', 'student3@college.edu', buses[1]),
        ('student4', 'Ananya', 'Reddy', 'student4@college.edu', buses[2]),
        ('student5', 'Karthik', 'Nair', 'student5@college.edu', buses[3]),
    ]

    for username, first, last, email, bus in students_data:
        user, created = User.objects.update_or_create(
            username=username,
            defaults={
                'email': email,
                'first_name': first,
                'last_name': last,
                'role': 'student',
                'phone': f'+91 98765{hash(username) % 100000:05d}',
                'assigned_bus': bus,
            }
        )
        if created:
            user.set_password('student123')
            user.save()
        print(f"  {'✅ Created' if created else '♻️ Updated'} Student: {username} → Bus {bus.bus_number}")

    # Faculty
    faculty_data = [
        ('faculty1', 'Dr. Srinivas', 'Rao', 'faculty1@college.edu', buses[1]),
        ('faculty2', 'Prof. Lakshmi', 'Devi', 'faculty2@college.edu', buses[2]),
    ]

    for username, first, last, email, bus in faculty_data:
        user, created = User.objects.update_or_create(
            username=username,
            defaults={
                'email': email,
                'first_name': first,
                'last_name': last,
                'role': 'faculty',
                'phone': f'+91 98765{hash(username) % 100000:05d}',
                'assigned_bus': bus,
            }
        )
        if created:
            user.set_password('faculty123')
            user.save()
        print(f"  {'✅ Created' if created else '♻️ Updated'} Faculty: {username} → Bus {bus.bus_number}")

    # ─── NOTIFICATIONS ──────────────────────────────────
    notifications_data = [
        {
            'bus': buses[2],
            'title': 'Route Delay — CB-303',
            'message': 'Bus CB-303 (Dilsukhnagar → Campus) is running approximately 15 minutes behind schedule due to heavy traffic at Malakpet junction. Expected arrival at campus by 8:15 AM.',
            'type': 'delay',
        },
        {
            'bus': buses[0],
            'title': 'Route Change — CB-101',
            'message': 'Due to road construction near Chandanagar, Bus CB-101 will take an alternate route via Lingampally. Estimated delay: 5 minutes.',
            'type': 'route_change',
        },
        {
            'bus': None,
            'title': 'Campus Day Celebration',
            'message': 'All buses will operate on an extended schedule for the Annual Campus Day event on Friday. Evening departure shifted to 6:00 PM.',
            'type': 'general',
        },
        {
            'bus': buses[1],
            'title': 'Timing Update — CB-202',
            'message': 'Starting next week, Bus CB-202 departure from Secunderabad Station will be at 7:00 AM instead of 7:15 AM.',
            'type': 'timing',
        },
        {
            'bus': buses[3],
            'title': 'New Stop Added — CB-404',
            'message': 'A new pickup point has been added at DLF Cyber City (Gachibowli). Bus CB-404 will now stop there at 7:50 AM.',
            'type': 'route_change',
        },
    ]

    for data in notifications_data:
        notif, created = Notification.objects.update_or_create(
            title=data['title'],
            defaults={**data, 'created_by': admin_user}
        )
        print(f"  {'✅ Created' if created else '♻️ Updated'} Notification: {notif.title}")

    print("\n🎉 Seed data complete!")
    print("━" * 50)
    print("  Admin:   admin / admin123")
    print("  Student: student1 / student123")
    print("  Faculty: faculty1 / faculty123")
    print("━" * 50)


if __name__ == '__main__':
    seed()
