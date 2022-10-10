from rest_framework import serializers
from .models import *


class ProjectRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectRoom
        fields = "__all__"


class CreateProjectRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectRoom
        fields = ["project_name", "project_description","qualifications", "enrollment_method", "work_field", "project_location", "members_needed", "work_experience"]

class JoinProjectRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = JoinProjectRequest
        fields="__all__"

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = "__all__"
        depth = 1