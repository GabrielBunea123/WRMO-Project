import json
from channels.generic.websocket import WebsocketConsumer, AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from asgiref.sync import async_to_sync, sync_to_async
from channels.layers import get_channel_layer
from .models import *
from django.contrib.auth.models import AnonymousUser
from .serializers import *


@database_sync_to_async
def get_user(user_id):
    try:
        return User.objects.get(id=user_id)
    except:
        return AnonymousUser


@database_sync_to_async
def create_notification(sender, receiver, typeof, message, project_id, status="unread"):
    notification_to_create = Notification.objects.create(
        user_sender=sender, user_revoker=receiver, type_of_notification=typeof, message=message, project_id=project_id)
    return (NotificationSerializer(notification_to_create).data)


@database_sync_to_async
def update_notifications(project_id):
    existing_notifications = Notification.objects.filter(project_id=project_id)
    if existing_notifications.exists():
        for i in existing_notifications:
            i.status = "read"
            i.save()
        return (NotificationSerializer(existing_notifications, many=True).data)


class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):

        self.room_group_name = 'notification'
        self.user = self.scope['user']

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):

        text_data_json = json.loads(text_data)
        if text_data_json['type_of_notification'] == "Project application":
            message = text_data_json['message']

            # the user who needs to receive the notification
            user_to_get = await get_user(int(text_data_json['user']))
            user_who_sends = await get_user(int(self.scope['user'].pk))
            notification = await create_notification(user_who_sends, user_to_get, text_data_json['type_of_notification'], text_data_json['message'], text_data_json['project_id'])

            # Send message to room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'send_notification',
                    'notification': notification,
                    'user': user_to_get
                }
            )
        elif text_data_json['type_of_notification'] == "Status update":
            await update_notifications(text_data_json['project_id'])

    # Receive message from room group

    async def send_notification(self, event):
        message = event['notification']

        if (event['user'].pk == self.user.pk):
            # Send message to WebSocket
            await self.send(text_data=json.dumps({
                'notification': message
            }))
