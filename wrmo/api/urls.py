from django.contrib import admin
from django.urls import path
from .views import *


urlpatterns = [
    path('project-room', AllProjectRooms.as_view()),
    path('create-project-room', CreateProjectRoom.as_view()),
]
