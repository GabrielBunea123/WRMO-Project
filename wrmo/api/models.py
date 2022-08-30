from django.db import models
from django.contrib.auth.models import User
from jsonfield import JSONField
import string
import random


def generate_unique_code():
    length = 18

    while True:
        code = ''.join(random.choices(string.ascii_uppercase, k=length))
        if ProjectRoom.objects.filter(code=code).count() == 0:
            break

    return code


class ProjectRoom(models.Model):
    code = models.CharField(
        max_length=20, default=generate_unique_code, unique=True)
    host = host = models.ForeignKey(User, on_delete=models.CASCADE)
    project_name = models.CharField(max_length=200)
    project_description = models.CharField(
        max_length=500000, blank=True, null=True)
    qualifications = JSONField()
    enrollment_method = models.CharField(max_length=200000)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.project_name
