from django.contrib import admin
from django.urls import path
from .views import *
from django.conf.urls.static import static
from django.conf import settings


urlpatterns = [
    path('all-projects', AllProjectRooms.as_view()),
    path('create-project-room', CreateProjectRoom.as_view()),
    path('get-project-info', GetProjectInfo.as_view()),
    path('create-join-project-request', CreateJoinProjectRequest.as_view()),
    path('get-user-notifications', GetUserNotifications.as_view()),
    path('get-project-applications', GetProjectApplications.as_view()),
    path('set-application-notification-read', SetApplicationNotificationRead.as_view()),
    path('get-user-projects', GetUserProjects.as_view()),
    path('accept-project-application',AcceptProjectApplicationRequest.as_view()),
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
