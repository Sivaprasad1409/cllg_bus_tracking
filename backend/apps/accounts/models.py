from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    """Custom user model with role-based access."""

    ROLE_CHOICES = [
        ('student', 'Student'),
        ('faculty', 'Faculty'),
        ('admin', 'Admin'),
    ]

    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='student')
    phone = models.CharField(max_length=15, blank=True, null=True)
    assigned_bus = models.ForeignKey(
        'buses.Bus',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_users'
    )

    class Meta:
        ordering = ['-date_joined']

    def __str__(self):
        return f"{self.get_full_name() or self.username} ({self.role})"

    @property
    def is_admin_user(self):
        return self.role == 'admin'

    @property
    def is_student_or_faculty(self):
        return self.role in ('student', 'faculty')
