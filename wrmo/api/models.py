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
    host =  models.ForeignKey(User, on_delete=models.CASCADE)
    project_name = models.CharField(max_length=200)
    project_description = models.CharField(
        max_length=500000, blank=True, null=True)
    qualifications = JSONField()
    enrollment_method = models.CharField(max_length=200000)
    members_needed = models.IntegerField(blank=True, null=True)
    work_field = models.CharField(max_length=200, blank=True, null=True)
    work_experience = models.CharField(max_length=200, blank=True, null=True)
    project_location = models.CharField(max_length=200, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.project_name


class JoinProjectRequest(models.Model):  # send the request to join a projects
    user = models.CharField(max_length=100, default='')
    name = models.CharField(max_length=500, blank=True, null=True)
    project_id = models.IntegerField(blank=True, null=True) # the project the user applies for
    email = models.CharField(max_length=200)
    contact_number = models.CharField(max_length=200)
    cv = models.FileField(upload_to='cvs')
    accepted = models.BooleanField(default=False)


class Notification(models.Model):
    user_sender = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='user_sender')
    user_revoker = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='user_revoker')
    type_of_notification = models.CharField(max_length=264, null=True, blank=True)
    project_id = models.IntegerField(null=True, blank=True)
    message = models.CharField(max_length=500, null=True, blank=True)
    status = models.CharField(max_length=264, null=True, blank=True, default="unread")
    created_at = models.DateTimeField(auto_now_add=True)
