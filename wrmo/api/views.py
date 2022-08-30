from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from datetime import datetime
from api.models import ProjectRoom
from .serializers import *
from .utils import *

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

            project_room = ProjectRoom(
                host=host, project_name=project_name, project_description=project_description, qualifications=qualifications, enrollment_method=enrollment_method)
            project_room.save()

            return Response(ProjectRoomSerializer(project_room).data, status=status.HTTP_201_CREATED)
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)
