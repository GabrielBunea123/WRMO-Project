from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from datetime import datetime
from api.models import ProjectRoom
from .serializers import *
from .utils import *
from itertools import chain
import json
from django.http import JsonResponse
from django.forms.models import model_to_dict

# Create your views here.


class AllProjectRooms(generics.ListAPIView):
    queryset = ProjectRoom.objects.all()
    serializer_class = ProjectRoomSerializer


class CreateProjectRoom(APIView):
    serializer_class = CreateProjectRoomSerializer

    def post(self, request, format=None):

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            # get the host
            tokenKey = request.headers['Authorization']
            host = User.objects.filter(auth_token=tokenKey)

            if host.exists():
                host = host[0]
            else:
                return Response({"404": "Not found"}, status=status.HTTP_404_NOT_FOUND)
            # end of host getting
            project_name = serializer.data.get('project_name')
            project_description = serializer.data.get('project_description')
            qualifications = serializer.data.get('qualifications')
            enrollment_method = serializer.data.get('enrollment_method')
            work_field = serializer.data.get('work_field')
            project_location = serializer.data.get('project_location')
            project_members = serializer.data.get('members_needed')
            work_experience = serializer.data.get('work_experience')

            project_room = ProjectRoom(
                host=host, project_name=project_name, project_description=project_description, qualifications=qualifications, enrollment_method=enrollment_method, work_field=work_field, project_location=project_location, members_needed=project_members, work_experience=work_experience)
            project_room.save()

            return Response(ProjectRoomSerializer(project_room).data, status=status.HTTP_201_CREATED)
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)


class GetProjectInfo(APIView):
    lookup_url_kwarg = 'id'

    def get(self, request, format=None):

        project_id = request.GET.get(self.lookup_url_kwarg)
        project_info = ProjectRoom.objects.filter(id=project_id)
        if project_info.exists():
            return Response(ProjectRoomSerializer(project_info[0]).data, status=status.HTTP_200_OK)
        return Response({"404": "Not found"}, status=status.HTTP_404_NOT_FOUND)


class GetUserProjects(APIView):
    lookup_url_kwarg = "user_id"

    def get(self, request, format=None):
        user_id = request.GET.get(self.lookup_url_kwarg)

        projects_room = ProjectRoom.objects.filter(
            host=user_id)  # where user is host
        requested_projects = JoinProjectRequest.objects.filter(
            user=user_id, accepted=True)  # where the user applied
        projects = list()

        for i in requested_projects:  # get the room the user applied for from every JoinProjectRequest queryset
            project = ProjectRoom.objects.get(id=i.project_id)
            projects.append(project)  # append the room to the project list

        user_projects = list(chain(projects, projects_room))

        return Response(ProjectRoomSerializer(user_projects, many=True).data, status=status.HTTP_200_OK)


class CreateJoinProjectRequest(APIView):
    serializer_class = JoinProjectRequestSerializer

    def post(self, request, format=None):

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = serializer.data.get('user')
            email = serializer.data.get('email')
            contact_number = serializer.data.get('contact_number')
            project_id = serializer.data.get('project_id')
            cv = request.FILES.get('cv')
            accepted = serializer.data.get('accepted')
            name = serializer.data.get('name')

            if JoinProjectRequest.objects.filter(user=user, project_id=project_id).exists():
                return Response({"Application": "Already applied"}, status=status.HTTP_409_CONFLICT)

            join_project_request = JoinProjectRequest(
                user=user, name=name, accepted=accepted, email=email, contact_number=contact_number, cv=cv, project_id=project_id)
            join_project_request.save()

            return Response(JoinProjectRequestSerializer(join_project_request).data, status=status.HTTP_201_CREATED)
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)


class AcceptProjectApplicationRequest(APIView):
    lookup_url_kwarg = 'id'

    def get(self, request, format=None):
        application_id = request.GET.get('id')
        join_project_request = JoinProjectRequest.objects.get(id=application_id)
        join_project_request.accepted = True
        join_project_request.save()
        return Response(JoinProjectRequestSerializer(join_project_request).data, status=status.HTTP_200_OK)


class GetProjectApplications(APIView):
    lookup_url_kwarg = 'id'

    def get(self, request, format=None):
        project_id = request.GET.get(self.lookup_url_kwarg)
        applications = JoinProjectRequest.objects.filter(project_id=project_id)
        if applications.exists():
            return Response(JoinProjectRequestSerializer(applications, many=True).data, status=status.HTTP_201_CREATED)
        return Response({"404": "Not found"}, status=status.HTTP_404_NOT_FOUND)


class GetUserNotifications(APIView):
    lookup_url_kwarg = "user_id"

    def get(self, request, format=None):
        user_id = request.GET.get(self.lookup_url_kwarg)
        notifications = Notification.objects.filter(user_revoker=user_id)
        if notifications.exists():
            return Response(NotificationSerializer(notifications, many=True).data, status=status.HTTP_200_OK)
        return Response({"404": "Not found"}, status=status.HTTP_404_NOT_FOUND)


class SetApplicationNotificationRead(APIView):
    lookup_url_kwarg = "project_id"

    def get(self, request, *args, **kwargs):
        project_id = request.GET.get(self.lookup_url_kwarg)
        notifications = Notification.objects.filter(project_id=project_id)
        if notifications.exists():
            for i in notifications:
                i.status = "read"
                i.save()

            return Response(NotificationSerializer(notifications, many=True).data, status=status.HTTP_200_OK)
        return Response({"404": "Not found"}, status=status.HTTP_404_NOT_FOUND)
