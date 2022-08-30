from django.contrib import admin
from django.urls import path
from .views import *

urlpatterns = [
    path('', index, name='home'),
    path('login', index, name='login'),
    path('register', index, name='register'),
    path('create-project-room', index, name='create-project-room')

]
