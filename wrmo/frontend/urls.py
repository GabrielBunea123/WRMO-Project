from django.contrib import admin
from django.urls import path
from .views import *

urlpatterns = [
    path('', index, name='home'),
    path('login', index, name='login'),
    path('register', index, name='register'),
    path('create-project-room', index, name='create-project-room'),
    path('project-application/<int:id>', index, name="project-application"),
    path('applications/<int:id>', index, name="applications"),
    path('projects/<int:user_id>',index, name="projects"),
    path('<str:project_name>/<int:project_id>', index, name='project')

]
