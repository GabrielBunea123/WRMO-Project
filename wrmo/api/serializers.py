from rest_framework import serializers
from .models import *


class ProjectRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectRoom
        fields = "__all__"


class CreateProjectRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectRoom
        fields = ["project_name", "project_description","qualifications", "enrollment_method"]
